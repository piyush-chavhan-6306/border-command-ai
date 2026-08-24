import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Shield,
  Radio,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { CameraFeed } from "@/components/CameraFeed";
import { AlertPanel } from "@/components/AlertPanel";
import { AlertInspector } from "@/components/AlertInspector";
import { AddCameraModal } from "@/components/AddCameraModal";
import { AIAssistantBar } from "@/components/AIAssistantBar";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import type { SimulatedAlert, BoundaryShape } from "@/types/surveillance";

const SAMPLE_REASONS = [
  "Entered Restricted Corridor Alpha",
  "Perimeter breach at Sector 7",
  "Unauthorized approach to Main Gate",
  "Excessive dwell time in No-Go Zone",
  "Tripwire triggered at North Boundary",
  "Detected near sensitive facility",
];

const HEADINGS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

function generateAlert(
  targetLabel: string,
  targetType: string,
  trackId: number,
  confidence: number,
  speed: number
): SimulatedAlert {
  const severity = confidence > 0.92 ? "critical" : "warning";
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cameraId: "local",
    severity,
    targetLabel,
    targetTrackId: trackId,
    targetType,
    reason: SAMPLE_REASONS[Math.floor(Math.random() * SAMPLE_REASONS.length)],
    timestamp: Date.now(),
    status: "new",
    confidence,
    speed,
    heading: HEADINGS[Math.floor(Math.random() * HEADINGS.length)],
    summary: `A ${targetType.toLowerCase()} (Track #${trackId}) was detected ${
      severity === "critical"
        ? "violating a restricted boundary"
        : "approaching a monitored zone"
    }. ${targetType} was moving at ${speed.toFixed(1)} m/s heading ${HEADINGS[Math.floor(Math.random() * HEADINGS.length)]}. AI confidence: ${Math.round(confidence * 100)}%.`,
  };
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0.95, 1]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.05], [16, 24]);

  const [cameraId] = useState("cam-default-1");
  const [cameraName] = useState("Main Gate Camera");
  const [targetFilters, setTargetFilters] = useState<string[]>(["Person", "Vehicle", "Car"]);
  const [boundaries, setBoundaries] = useState<BoundaryShape[]>([]);
  const [alerts, setAlerts] = useState<SimulatedAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SimulatedAlert | null>(null);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [selectedAlertTime, setSelectedAlertTime] = useState<number | null>(null);
  const alertGenRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alertGenRef.current >= 20) return;
      const types = ["Person", "Vehicle", "Car"];
      const type = types[Math.floor(Math.random() * types.length)];
      const trackId = Math.floor(Math.random() * 20) + 1;
      const confidence = 0.75 + Math.random() * 0.24;
      const speed = 0.5 + Math.random() * 3;
      const alert = generateAlert(`${type} #${trackId}`, type, trackId, confidence, speed);
      setAlerts((prev) => [alert, ...prev].slice(0, 30));
      alertGenRef.current++;
    }, 8000 + Math.random() * 12000);

    const firstTimeout = setTimeout(() => {
      const alert = generateAlert("Person #4", "Person", 4, 0.94, 1.8);
      setAlerts([alert]);
      alertGenRef.current = 1;
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, []);

  const handleAcknowledge = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "acknowledged" } : a))
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert((prev) =>
        prev ? { ...prev, status: "acknowledged" } : prev
      );
    }
  }, [selectedAlert]);

  const handleClearAll = useCallback(() => {
    setAlerts([]);
    setSelectedAlert(null);
    alertGenRef.current = 0;
  }, []);

  const handleBoundaryAdd = useCallback((boundary: BoundaryShape) => {
    setBoundaries((prev) => [...prev, boundary]);
  }, []);

  const handleBoundaryRemove = useCallback((id: string) => {
    setBoundaries((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleSelectAlert = useCallback((alert: SimulatedAlert) => {
    setSelectedAlert(alert);
  }, []);

  const handleSeekTime = useCallback((timestamp: number) => {
    setSelectedAlertTime(timestamp);
    setSelectedAlert(null);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const newAlertCount = alerts.filter((a) => a.status === "new").length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status === "new").length;

  return (
    <main className="min-h-screen pb-24">
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="glass-panel sticky top-0 z-20 px-4 sm:px-6 py-3 glow-line"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg glass-card flex items-center justify-center border border-white/5"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary drop-shadow-[0_0_8px_oklch(0.6_0.18_250/40%)]" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">
                  SENTINEL
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">
                  AI Border Surveillance
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 ml-4">
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 gap-1 font-mono border-white/5">
                <Radio className="w-3 h-3 text-emerald-400" />
                1 Camera
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-mono border-white/5">
                30 FPS
              </Badge>
              {newAlertCount > 0 && (
                <Badge
                  variant="destructive"
                  className="text-[10px] px-2 py-0.5 gap-1"
                >
                  {criticalCount > 0 && `${criticalCount} Critical`}
                  {criticalCount > 0 && newAlertCount - criticalCount > 0 && " · "}
                  {newAlertCount - criticalCount > 0 && `${newAlertCount - criticalCount} Warning`}
                  {criticalCount === 0 && `${newAlertCount} Alerts`}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 glass-panel border-white/5"
                onClick={() => setShowAddCamera(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Camera</span>
              </Button>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-red-400"
              onClick={handleClearAll}
              disabled={alerts.length === 0}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Alerts</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 pt-4">
        <div className="flex gap-4" style={{ minHeight: "calc(100vh - 160px)" }}>
          {/* Left: Camera Feed (70%) */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-[7] min-w-0"
            style={{ perspective: 1200 }}
          >
            <CameraFeed
              cameraId={cameraId}
              cameraName={cameraName}
              targetFilters={targetFilters}
              onFiltersChange={setTargetFilters}
              boundaries={boundaries}
              onBoundaryAdd={handleBoundaryAdd}
              onBoundaryRemove={handleBoundaryRemove}
              selectedAlertTime={selectedAlertTime}
            />
          </motion.div>

          {/* Right: Alert Panel (30%) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-[3] min-w-[300px]"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            <AlertPanel
              alerts={alerts}
              onAcknowledge={handleAcknowledge}
              onClearAll={handleClearAll}
              onSelectAlert={handleSelectAlert}
              selectedAlertId={selectedAlert?.id || null}
            />
          </motion.div>
        </div>
      </div>

      {/* ─── AI ASSISTANT ────────────────────────────────────────────────── */}
      <AIAssistantBar alerts={alerts} />

      {/* ─── ALERT INSPECTOR ─────────────────────────────────────────────── */}
      <AlertInspector
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={handleAcknowledge}
        onSeekTime={handleSeekTime}
      />

      {/* ─── ADD CAMERA MODAL ────────────────────────────────────────────── */}
      <AddCameraModal
        open={showAddCamera}
        onClose={() => setShowAddCamera(false)}
        onAdd={() => setShowAddCamera(false)}
      />
    </main>
  );
}
