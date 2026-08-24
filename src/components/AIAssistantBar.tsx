import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown, Bot, Send, Loader2 } from "lucide-react";
import type { SimulatedAlert } from "@/types/surveillance";

interface AIAssistantBarProps {
  alerts: SimulatedAlert[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  perimeter: `Based on the current alert log, 3 targets have crossed the perimeter boundaries in the last 24 hours. Track #7 (Person) crossed "Main Gate Zone" at 10:55:12 PM, Track #12 (Vehicle) crossed "Perimeter Alpha" at 10:42:30 AM, and Track #15 (Car) crossed "North Tripwire" at 03:12:45 PM. All critical alerts were acknowledged by the operator.`,
  dwell: `Track #4 is a Person who has been within "Restricted Corridor Alpha" for 4 minutes 32 seconds. Current speed: 1.2 m/s (walking pace). Heading: North-East. Detection confidence: 91%. This track entered the zone at 10:51:20 PM and has remained stationary for the past 2 minutes.`,
  alert: `There are currently ${0} active alerts. ${0} are critical severity, ${0} are warning severity. Average response time to acknowledgment is 45 seconds. All alerts in the last hour were related to unauthorized perimeter entry.`,
  default: `I can help you analyze surveillance data. Try asking about:
• "What targets crossed the perimeter?"
• "Show dwell time for Track 4"
• "How many critical alerts today?"
• "What's the detection confidence for recent tracks?"`,
};

function getResponse(query: string, alerts: SimulatedAlert[]): string {
  const lower = query.toLowerCase();

  if (lower.includes("perimeter") || lower.includes("cross")) {
    return SAMPLE_RESPONSES.perimeter;
  }
  if (lower.includes("dwell") || lower.includes("track 4") || lower.includes("track4")) {
    return SAMPLE_RESPONSES.dwell;
  }
  if (lower.includes("alert") || lower.includes("critical")) {
    const critical = alerts.filter((a) => a.severity === "critical").length;
    const warning = alerts.filter((a) => a.severity === "warning").length;
    const total = alerts.length;
    return `There are currently ${total} alerts in the system. ${critical} are critical severity, ${warning} are warning severity. ${
      total === 0
        ? "All zones are clear — no active intrusions detected."
        : `Most recent alert: ${alerts[0]?.targetLabel} — ${alerts[0]?.reason}`
    }`;
  }
  if (lower.includes("confidence") || lower.includes("detection")) {
    const avg = alerts.length
      ? (alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length * 100).toFixed(1)
      : "0";
    return `Average detection confidence across all recent alerts is ${avg}%. Individual track confidences range from 75% to 99%. Higher confidence detections (above 90%) are flagged as high-priority for operator review.`;
  }

  return SAMPLE_RESPONSES.default;
}

export function AIAssistantBar({ alerts }: AIAssistantBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: SAMPLE_RESPONSES.default },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    const query = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsThinking(true);

    setTimeout(() => {
      const response = getResponse(query, alerts);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsThinking(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 320, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mx-4 mb-2 glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/40 neon-border"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
              <Bot className="w-4 h-4 text-primary drop-shadow-[0_0_6px_oklch(0.6_0.18_250/40%)]" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                AI Surveillance Assistant
              </span>
              <span className="text-[10px] text-emerald-400 font-medium ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <ScrollArea className="h-[230px] px-4">
              <div ref={scrollRef} className="py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary/20 text-foreground border border-primary/15"
                          : "glass-inset text-foreground/80 border border-white/5"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="glass-inset rounded-xl px-3.5 py-2.5 flex items-center gap-2 border border-white/5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Analyzing surveillance data...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle + Input Bar */}
      <div className="mx-4 mb-4">
        <div className="glass-card rounded-2xl border border-white/5 shadow-xl shadow-black/30 flex items-center gap-2 px-4 py-2.5 neon-border">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
          <Bot className="w-4 h-4 text-primary shrink-0 drop-shadow-[0_0_6px_oklch(0.6_0.18_250/40%)]" />
          <Input
            placeholder="Ask about surveillance data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8 text-foreground placeholder:text-muted-foreground/50"
            disabled={isThinking}
          />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
