import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Shield,
  Check,
  Trash2,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { SimulatedAlert } from "@/types/surveillance";

interface AlertPanelProps {
  alerts: SimulatedAlert[];
  onAcknowledge: (alertId: string) => void;
  onClearAll: () => void;
  onSelectAlert: (alert: SimulatedAlert) => void;
  selectedAlertId: string | null;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function AlertCard({
  alert,
  onAcknowledge,
  onSelect,
  isSelected,
}: {
  alert: SimulatedAlert;
  onAcknowledge: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const isCritical = alert.severity === "critical";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card rounded-xl p-3.5 cursor-pointer transition-all group ${
        isSelected ? "ring-1 ring-primary/40 neon-border" : ""
      } ${alert.status === "acknowledged" ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          {isCritical ? (
            <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 drop-shadow-[0_0_6px_oklch(0.7_0.25_25/50%)]" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_oklch(0.8_0.18_75/50%)]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={isCritical ? "destructive" : "secondary"}
                className="text-[9px] px-1.5 py-0 font-semibold uppercase"
              >
                {alert.severity}
              </Badge>
              <span className="text-[11px] font-semibold text-foreground">
                {alert.targetLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {alert.status === "new" ? (
            <Badge className="text-[9px] px-1.5 py-0 bg-blue-500/15 text-blue-400 border-blue-500/20 font-semibold">
              NEW
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold border-white/5">
              ACK
            </Badge>
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5">
        {alert.reason}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{formatTime(alert.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {alert.status === "new" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] gap-1 glass-panel border-white/5"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge();
                }}
              >
                <Check className="w-3 h-3" />
                Ack
              </Button>
            </motion.div>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

export function AlertPanel({
  alerts,
  onAcknowledge,
  onClearAll,
  onSelectAlert,
  selectedAlertId,
}: AlertPanelProps) {
  const newCount = alerts.filter((a) => a.status === "new").length;
  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status === "new"
  ).length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full neon-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">Alerts</h2>
            {newCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0 min-w-[20px] justify-center"
                >
                  {newCount}
                </Badge>
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              </motion.div>
            )}
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-red-400"
              onClick={onClearAll}
              disabled={alerts.length === 0}
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </Button>
          </motion.div>
        </div>
        <div className="flex gap-3 text-[10px] text-muted-foreground/70">
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_oklch(0.7_0.25_25/60%)]" />
            {criticalCount} Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_oklch(0.8_0.18_75/60%)]" />
            {newCount - criticalCount} Warning
          </span>
        </div>
      </div>

      {/* Alert List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_oklch(0.7_0.18_155/40%)]" />
              </div>
              <p className="text-sm font-semibold text-foreground/70">All Clear</p>
              <p className="text-xs text-muted-foreground/60 mt-1.5">
                No active alerts. Monitoring perimeter...
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => onAcknowledge(alert.id)}
                  onSelect={() => onSelectAlert(alert)}
                  isSelected={selectedAlertId === alert.id}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
