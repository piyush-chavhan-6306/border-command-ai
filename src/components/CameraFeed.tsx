import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  Play,
  Pencil,
  Zap,
  X,
  Car,
  PersonStanding,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { drawScene, drawDetection, drawBoundaryOverlay } from "@/lib/camera-engine";
import { updateDetections, getSnapshotUrl } from "@/lib/detection-simulator";
import type { Detection, DrawingPoint, BoundaryShape } from "@/types/surveillance";

interface CameraFeedProps {
  cameraId: string;
  cameraName: string;
  targetFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  boundaries: BoundaryShape[];
  onBoundaryAdd: (boundary: BoundaryShape) => void;
  onBoundaryRemove: (id: string) => void;
  onDetectionSnapshot?: (dataUrl: string) => void;
  selectedAlertTime?: number | null;
}

const TARGET_OPTIONS = [
  { id: "Person", label: "Person", icon: PersonStanding },
  { id: "Vehicle", label: "Vehicle", icon: Car },
  { id: "Car", label: "Car", icon: Truck },
] as const;

const DETECTION_COLORS: Record<string, string> = {
  Person: "rgba(220, 50, 50, 0.9)",
  Vehicle: "rgba(50, 150, 220, 0.9)",
  Car: "rgba(50, 200, 120, 0.9)",
  Animal: "rgba(200, 150, 50, 0.9)",
};

export function CameraFeed({
  cameraId,
  cameraName,
  targetFilters,
  onFiltersChange,
  boundaries,
  onBoundaryAdd,
  onBoundaryRemove,
  onDetectionSnapshot,
  selectedAlertTime,
}: CameraFeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [drawingMode, setDrawingMode] = useState<"zone" | "tripwire" | null>(null);
  const [drawingVertices, setDrawingVertices] = useState<DrawingPoint[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 450 });
  const [frameCount, setFrameCount] = useState(0);
  const animRef = useRef<number>(0);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Canvas resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const h = Math.round(width * 0.5625);
        setCanvasSize({ w: Math.round(width), h });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const animate = (time: number) => {
      if (!isPausedRef.current) {
        drawScene(ctx, canvasSize.w, canvasSize.h, time);
        const dets = updateDetections(canvasSize.w, canvasSize.h);
        setDetections(dets);

        // Draw filtered detections
        for (const d of dets) {
          if (targetFilters.includes(d.type)) {
            const color = DETECTION_COLORS[d.type] || "rgba(255,255,255,0.8)";
            drawDetection(ctx, d.x, d.y, d.width, d.height, d.type, d.trackId, d.confidence, color);
          }
        }

        // Draw existing boundaries
        for (const b of boundaries) {
          const color = b.type === "zone" ? "rgb(50, 150, 220)" : "rgb(220, 100, 50)";
          drawBoundaryOverlay(ctx, b.vertices, b.type, color, true);
        }

        // Draw in-progress vertices
        if (drawingVertices.length > 0) {
          const color = drawingMode === "zone" ? "rgb(50, 150, 220)" : "rgb(220, 100, 50)";
          drawBoundaryOverlay(ctx, drawingVertices, drawingMode || "zone", color, false);
        }

        // Timestamp overlay
        const now = new Date();
        const ts = now.toLocaleTimeString("en-US", { hour12: true });
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(canvasSize.w - 180, 8, 172, 24);
        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.fillText(`CAM: ${cameraName}  ${ts}`, canvasSize.w - 174, 24);

        // FPS counter
        setFrameCount((c) => c + 1);
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [canvasSize, targetFilters, boundaries, drawingVertices, drawingMode, cameraName]);

  // Handle canvas clicks for drawing
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!drawingMode) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      setDrawingVertices((prev) => [...prev, { x, y }]);
    },
    [drawingMode]
  );

  const startDrawing = (mode: "zone" | "tripwire") => {
    setDrawingMode(mode);
    setDrawingVertices([]);
    setIsPaused(true);
  };

  const finishDrawing = () => {
    if (drawingVertices.length >= 2) {
      const boundary: BoundaryShape = {
        id: `boundary-${Date.now()}`,
        name: drawingMode === "zone"
          ? `Zone ${boundaries.filter((b) => b.type === "zone").length + 1}`
          : `Tripwire ${boundaries.filter((b) => b.type === "tripwire").length + 1}`,
        type: drawingMode!,
        vertices: [...drawingVertices],
      };
      onBoundaryAdd(boundary);
    }
    setDrawingMode(null);
    setDrawingVertices([]);
    setIsPaused(false);
  };

  const cancelDrawing = () => {
    setDrawingMode(null);
    setDrawingVertices([]);
    setIsPaused(false);
  };

  const handleToggleFilter = (filterId: string) => {
    if (targetFilters.includes(filterId)) {
      onFiltersChange(targetFilters.filter((f) => f !== filterId));
    } else {
      onFiltersChange([...targetFilters, filterId]);
    }
  };

  const captureSnapshot = () => {
    if (canvasRef.current && onDetectionSnapshot) {
      onDetectionSnapshot(getSnapshotUrl(canvasRef.current));
    }
  };

  const fps = Math.round(frameCount / (Date.now() / 1000)) || 30;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Camera Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-sm text-foreground/80">{cameraName}</span>
          </div>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-mono">
            {canvasSize.w}×{canvasSize.h}
          </Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-mono bg-primary/10 text-primary">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Drawing Tools */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 glass-panel border-white/30"
            onClick={() => startDrawing("zone")}
            disabled={!!drawingMode}
          >
            <Pencil className="w-3 h-3" />
            Draw Zone
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 glass-panel border-white/30"
            onClick={() => startDrawing("tripwire")}
            disabled={!!drawingMode}
          >
            <Zap className="w-3 h-3" />
            Draw Tripwire
          </Button>
          {drawingMode && (
            <>
              <Button
                size="sm"
                className="h-7 text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={finishDrawing}
              >
                Save
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={cancelDrawing}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Drawing mode indicator */}
      <AnimatePresence>
        {drawingMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5"
          >
            <p className="text-xs text-amber-700 font-medium">
              {drawingMode === "zone" ? "🔷 Polygon" : "⚡ Tripwire"} mode — Click to place vertices.
              {drawingMode === "zone" && " Close the polygon by clicking near the first point."}
              {" "}Click <strong>Save</strong> when done.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div ref={containerRef} className="relative bg-neutral-100">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          className="w-full block"
          style={{ cursor: drawingMode ? "crosshair" : "default" }}
          onClick={handleCanvasClick}
        />
        {!isPaused && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-white font-mono">REC</span>
            </div>
          </div>
        )}
        {isPaused && !drawingMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="bg-black/50 rounded-full px-4 py-2 flex items-center gap-2">
              <Pause className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">PAUSED</span>
            </div>
          </div>
        )}
        <button
          className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play className="w-4 h-4 text-white" /> : <Pause className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Active Boundaries Tags */}
      {boundaries.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/30 flex flex-wrap gap-2">
          {boundaries.map((b) => (
            <motion.button
              key={b.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium glass-panel hover:bg-red-50 transition-colors group"
            >
              {b.type === "zone" ? "🔷" : "⚡"}
              <span>{b.name}</span>
              <X
                className="w-3 h-3 text-muted-foreground group-hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onBoundaryRemove(b.id);
                }}
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Target Filters */}
      <div className="px-4 py-2.5 border-t border-white/30 flex items-center gap-4">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Alert Filters
        </span>
        {TARGET_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <Checkbox
              checked={targetFilters.includes(opt.id)}
              onCheckedChange={() => handleToggleFilter(opt.id)}
              className="w-3.5 h-3.5"
            />
            <opt.icon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
