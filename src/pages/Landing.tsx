import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Shield,
  Eye,
  Zap,
  Lock,
  ChevronRight,
  Radio,
  AlertTriangle,
  Brain,
  MonitorDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Eye,
    title: "AI-Powered Detection",
    description:
      "Real-time object detection with persistent track IDs. Identify persons, vehicles, and anomalies instantly.",
  },
  {
    icon: Zap,
    title: "Live Alert System",
    description:
      "Severity-classified alerts with one-click acknowledgment. Never miss a critical incident.",
  },
  {
    icon: Brain,
    title: "Intelligent Boundaries",
    description:
      "Draw polygon zones and tripwire lines directly on the live feed. AI monitors every breach.",
  },
  {
    icon: MonitorDot,
    title: "Natural Language AI",
    description:
      "Ask questions about surveillance data in plain English. Get instant, data-verified answers.",
  },
];

const stats = [
  { value: "30 FPS", label: "Live Processing" },
  { value: "<50ms", label: "Detection Latency" },
  { value: "94%+", label: "AI Confidence" },
  { value: "24/7", label: "Monitoring" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel fixed top-0 left-0 right-0 z-50 px-6 py-3 glow-line"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground/80 tracking-tight">
                SENTINEL
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                AI Border Surveillance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 gap-1 font-mono hidden sm:flex">
              <Radio className="w-3 h-3 text-emerald-500" />
              System Online
            </Badge>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate("/dashboard")}
            >
              Launch Command Center
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 text-[11px] px-3 py-1 gap-1.5 font-medium"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              AI-Powered Border Security
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground/90 leading-[1.1]">
              Surveillance Command
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Monitor perimeters, detect intrusions, and respond to threats in
              real-time. Powered by AI object detection with intelligent
              boundary management and instant alerting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-sm gap-2 shadow-lg shadow-primary/20"
              onClick={() => navigate("/auth?returnTo=/dashboard")}
            >
              <Lock className="w-4 h-4" />
              Enter Command Center
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm gap-2 glass-panel border-white/30"
              onClick={() => navigate("/dashboard")}
            >
              <Eye className="w-4 h-4" />
              Quick Preview
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85">
              Mission-Critical Features
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Everything a security operator needs to monitor, detect, and
              respond to perimeter threats — all from a single command center.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground/85 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-3xl p-10 sm:p-14 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85">
            Start Monitoring Now
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Deploy your AI surveillance command center in minutes. One camera,
            real-time detection, instant alerts — version 1 gets you operational
            fast.
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 px-8 text-sm gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate("/auth?returnTo=/dashboard")}
          >
            <Lock className="w-4 h-4" />
            Access Command Center
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="glass-panel px-6 py-6 mt-10 glow-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground/60">
              SENTINEL
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            AI Border Surveillance & Incident Command Center
          </p>
        </div>
      </footer>
    </div>
  );
}
