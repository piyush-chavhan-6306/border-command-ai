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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={`glass-card rounded-xl p-3 cursor-pointer transition-all group ${
        isSelected ? "ring-2 ring-primary/40" : ""
      } ${alert.status === "acknowledged" ? "opacity-60" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
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
              <span className="text-[11px] font-semibold text-foreground/80">
                {alert.targetLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {alert.status === "new" ? (
            <Badge className="text-[9px] px-1.5 py-0 bg-blue-500/10 text-blue-600 border-blue-200 font-semibold">
              NEW
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold">
              ACK
            </Badge>
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
        {alert.reason}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{formatTime(alert.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {alert.status === "new" && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] gap-1 glass-panel"
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge();
              }}
            >
              <Check className="w-3 h-3" />
              Ack
            </Button>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground/80">Alerts</h2>
            {newCount > 0 && (
              <Badge
                variant="destructive"
                className="text-[10px] px-1.5 py-0 min-w-[20px] justify-center"
              >
                {newCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-red-500"
            onClick={onClearAll}
            disabled={alerts.length === 0}
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </Button>
        </div>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
            {criticalCount} Critical
          </span>
          <span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />
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
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-foreground/60">All Clear</p>
              <p className="text-xs text-muted-foreground mt-1">
                No active alerts. Monitoring...
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
