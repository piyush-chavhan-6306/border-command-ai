import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  AlertTriangle,
  Shield,
  Gauge,
  Navigation,
  Target,
  Clock,
  Camera,
  Check,
} from "lucide-react";
import type { SimulatedAlert } from "@/types/surveillance";

interface AlertInspectorProps {
  alert: SimulatedAlert | null;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onSeekTime: (timestamp: number) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AlertInspector({
  alert,
  onClose,
  onAcknowledge,
  onSeekTime,
}: AlertInspectorProps) {
  return (
    <AnimatePresence>
      {alert && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[90vw] z-50 flex flex-col"
          >
            <div className="glass-card h-full border-l border-white/40 flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {alert.severity === "critical" ? (
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-foreground/80">
                      Incident Inspector
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {alert.targetLabel} — {alert.targetType}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-5 space-y-5">
                  {/* Status & Severity */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={alert.severity === "critical" ? "destructive" : "secondary"}
                      className="text-[10px] uppercase font-semibold"
                    >
                      {alert.severity}
                    </Badge>
                    {alert.status === "new" ? (
                      <Badge className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-200 font-semibold">
                        NEW
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        ACKNOWLEDGED
                      </Badge>
                    )}
                  </div>

                  {/* What Happened */}
                  <div className="glass-inset rounded-xl p-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      What Happened
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {alert.summary}
                    </p>
                  </div>

                  {/* Target Movement */}
                  <div className="glass-inset rounded-xl p-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Target Kinematics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Target className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Track ID</span>
                        </div>
                        <span className="text-lg font-bold text-foreground/80">
                          #{alert.targetTrackId}
                        </span>
                      </div>
                      <div className="glass-card rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Gauge className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Speed</span>
                        </div>
                        <span className="text-lg font-bold text-foreground/80">
                          {alert.speed.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">m/s</span>
                        </span>
                      </div>
                      <div className="glass-card rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Navigation className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Heading</span>
                        </div>
                        <span className="text-lg font-bold text-foreground/80">
                          {alert.heading}
                        </span>
                      </div>
                      <div className="glass-card rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Confidence</span>
                        </div>
                        <span className="text-lg font-bold text-foreground/80">
                          {Math.round(alert.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="glass-inset rounded-xl p-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Timestamp
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-mono font-semibold text-foreground/80">
                          {formatTime(alert.timestamp)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(alert.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 glass-panel"
                        onClick={() => onSeekTime(alert.timestamp)}
                      >
                        <Clock className="w-3 h-3" />
                        Seek Video
                      </Button>
                    </div>
                  </div>

                  {/* Snapshot placeholder */}
                  <div className="glass-inset rounded-xl p-4">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Incident Snapshot
                    </h4>
                    {alert.snapshotDataUrl ? (
                      <img
                        src={alert.snapshotDataUrl}
                        alt="Incident snapshot"
                        className="w-full rounded-lg border border-white/40"
                      />
                    ) : (
                      <div className="w-full h-40 rounded-lg bg-neutral-100 border border-white/40 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground/60">
                            Snapshot captured at detection
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/40">
                {alert.status === "new" ? (
                  <Button
                    className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    <Check className="w-4 h-4" />
                    Acknowledge Alert
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600 font-medium">
                    <Check className="w-4 h-4" />
                    Alert Acknowledged
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
