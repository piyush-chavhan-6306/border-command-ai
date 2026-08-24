import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { CursorReactiveBackground } from "@/components/CursorReactiveBackground";
import { MagneticButton } from "@/components/MagneticButton";
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
  Radar,
  Scan,
  Fingerprint,
  Crosshair,
  ArrowDown,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



// ─── Floating Orbs ───────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[
        { size: 500, color: "oklch(0.35 0.15 250 / 12%)", x: "10%", y: "5%", dur: 20 },
        { size: 400, color: "oklch(0.3 0.12 200 / 10%)", x: "70%", y: "15%", dur: 25 },
        { size: 350, color: "oklch(0.35 0.1 170 / 8%)", x: "55%", y: "60%", dur: 22 },
        { size: 300, color: "oklch(0.3 0.1 280 / 6%)", x: "20%", y: "75%", dur: 18 },
        { size: 250, color: "oklch(0.4 0.15 250 / 5%)", x: "80%", y: "50%", dur: 30 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── 3D Hero Shield ──────────────────────────────────────────────────────────
function HeroShield() {
  return (
    <div className="relative" style={{ perspective: 800 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotateY: -60 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Outer glow */}
        <div className="absolute -inset-16 rounded-full bg-primary/10 blur-[80px] animate-pulse" />

        {/* Orbiting rings */}
        <motion.div
          className="absolute inset-[-20px] rounded-full border border-primary/15"
          animate={{ rotateX: 70, rotateZ: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="absolute inset-[-8px] rounded-full border border-blue-400/10"
          animate={{ rotateX: 60, rotateZ: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Main shield */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl flex items-center justify-center" style={{ background: "oklch(0.14 0.02 260 / 50%)", border: "1px solid oklch(0.25 0.03 260 / 12%)", backdropFilter: "blur(20px)", boxShadow: "0 0 40px oklch(0.5 0.15 250 / 5%)", inset: "0 1px 0 oklch(0.3 0.03 260 / 10%)" as never }}>
          <motion.div
            animate={{ rotateY: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="w-14 h-14 sm:w-18 sm:h-18 text-primary drop-shadow-[0_0_20px_oklch(0.6_0.18_250/50%)]" />
          </motion.div>
        </div>

        {/* Orbiting dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
            style={{ top: "50%", left: "50%" }}
            animate={{
              x: [Math.cos((i * Math.PI) / 4) * 100, Math.cos((i * Math.PI) / 4 + Math.PI * 2) * 100],
              y: [Math.sin((i * Math.PI) / 4) * 100, Math.sin((i * Math.PI) / 4 + Math.PI * 2) * 100],
            }}
            transition={{ duration: 12 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Floating Glass Feature Card ─────────────────────────────────────────────
function FloatingCard({
  Icon,
  title,
  description,
  index,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: -20, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0, scale: 1 }
          : {}
      }
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -12,
        rotateX: 8,
        rotateY: -4,
        scale: 1.03,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ perspective: 800, transformStyle: "preserve-3d" as const, background: "oklch(0.14 0.02 260 / 40%)", border: "1px solid oklch(0.25 0.03 260 / 15%)", backdropFilter: "blur(16px)" }}
      className="rounded-2xl p-6 sm:p-7 cursor-default group relative overflow-hidden"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/5 rounded-2xl" />
      </div>

      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:border-primary/25 transition-all duration-300"
        style={{ transform: "translateZ(25px)" }}
      >
        <Icon className="w-6 h-6 text-primary drop-shadow-[0_0_8px_oklch(0.6_0.18_250/40%)]" />
      </div>
      <h3
        className="relative text-base font-bold text-foreground mb-2"
        style={{ transform: "translateZ(20px)" }}
      >
        {title}
      </h3>
      <p
        className="relative text-sm text-muted-foreground leading-relaxed"
        style={{ transform: "translateZ(15px)" }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── Scroll-Scrubbed Preview Window ──────────────────────────────────────────
function PreviewWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useSpring(useTransform(scrollYProgress, [0.2, 0.5], [25, 0]), {
    stiffness: 80,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(scrollYProgress, [0.2, 0.5], [-10, 0]), {
    stiffness: 80,
    damping: 25,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0.2, 0.5], [0.85, 1]), {
    stiffness: 80,
    damping: 25,
  });
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto max-w-5xl px-4"
      style={{
        perspective: 1200,
        rotateX,
        rotateY,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow behind */}
      <div className="absolute -inset-20 bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass-card rounded-2xl overflow-hidden neon-border relative">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex-1 mx-4">
            <div className="glass-inset rounded-lg px-3 py-1.5 text-[10px] text-muted-foreground font-mono text-center">
              sentinel.command-center/dashboard
            </div>
          </div>
        </div>

        {/* Mini dashboard */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex gap-4">
            {/* Camera feed mockup */}
            <div className="flex-[7] rounded-xl h-52 sm:h-72 relative overflow-hidden border border-white/5 bg-neutral-900/50">
              {/* Scene gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-emerald-900/20 to-neutral-800/40" />

              {/* Horizon */}
              <div className="absolute top-[35%] left-0 right-0 h-px bg-emerald-500/20" />

              {/* Fake detections */}
              <motion.div
                className="absolute border-2 border-red-400/60 rounded-sm"
                style={{ top: "42%", left: "30%", width: 35, height: 55 }}
                animate={{ x: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute border-2 border-blue-400/60 rounded-sm"
                style={{ top: "48%", left: "55%", width: 55, height: 35 }}
                animate={{ x: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
              />
              <motion.div
                className="absolute border-2 border-emerald-400/50 rounded-sm"
                style={{ top: "38%", left: "72%", width: 30, height: 45 }}
                animate={{ x: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
              />

              {/* REC */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] text-white font-mono tracking-wider">LIVE</span>
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-3 right-3 bg-black/50 rounded px-2 py-1 backdrop-blur-sm">
                <span className="text-[8px] text-white/70 font-mono">MAIN GATE · 30 FPS</span>
              </div>

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: "linear-gradient(oklch(0.8 0.1 250 / 50%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 250 / 50%) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Alert sidebar mockup */}
            <div className="flex-[3] space-y-2.5">
              {[
                { sev: "critical", label: "Person #4", reason: "Restricted zone breach", time: "10:55:12 PM" },
                { sev: "warning", label: "Vehicle #12", reason: "Perimeter approach", time: "10:42:30 AM" },
                { sev: "warning", label: "Car #7", reason: "Dwell time exceeded", time: "03:12:45 PM" },
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  className="glass-card rounded-xl p-3 border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        a.sev === "critical"
                          ? "bg-red-500 shadow-[0_0_6px_oklch(0.7_0.25_25/80%)]"
                          : "bg-amber-500 shadow-[0_0_6px_oklch(0.8_0.18_75/80%)]"
                      }`}
                    />
                    <span className="text-[10px] font-bold text-foreground/80">{a.label}</span>
                    <Badge variant="secondary" className="text-[7px] px-1 py-0 ml-auto font-mono">
                      {a.sev === "critical" ? "CRIT" : "WARN"}
                    </Badge>
                  </div>
                  <p className="text-[8px] text-muted-foreground leading-relaxed">{a.reason}</p>
                  <p className="text-[7px] text-muted-foreground/60 mt-1 font-mono">{a.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated Stat ────────────────────────────────────────────────────────────
function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.05 }}
      className="glass-card rounded-xl p-5 text-center relative overflow-hidden neon-border group"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <p className="text-2xl sm:text-3xl font-bold text-primary glow-text relative z-10">
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 relative z-10 font-medium tracking-wide uppercase">
        {label}
      </p>
    </motion.div>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="relative py-8">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN LANDING PAGE ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: Eye,
    title: "AI-Powered Detection",
    description:
      "Real-time object detection with persistent track IDs. Identify persons, vehicles, and anomalies instantly across your entire perimeter.",
  },
  {
    icon: Zap,
    title: "Live Alert System",
    description:
      "Severity-classified alerts with one-click acknowledgment. Critical and warning-level notifications delivered in real-time.",
  },
  {
    icon: Brain,
    title: "Intelligent Boundaries",
    description:
      "Draw polygon zones and tripwire lines directly on the live feed. AI monitors every boundary crossing and triggers instant alerts.",
  },
  {
    icon: MonitorDot,
    title: "Natural Language AI",
    description:
      "Ask questions about surveillance data in plain English. Get instant, database-verified answers about targets, dwell times, and incidents.",
  },
  {
    icon: Radar,
    title: "Multi-Track Monitoring",
    description:
      "Track dozens of simultaneous targets with unique IDs. View movement kinematics, speed, heading, and confidence in real-time.",
  },
  {
    icon: Fingerprint,
    title: "Incident Forensics",
    description:
      "High-resolution snapshots at detection time. Full event telemetry for post-incident review and forensic analysis.",
  },
];

const STATS = [
  { value: "30 FPS", label: "Live Processing" },
  { value: "<50ms", label: "Detection Latency" },
  { value: "94%+", label: "AI Confidence" },
  { value: "24/7", label: "Monitoring" },
];

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden bg-background">
      <CursorReactiveBackground />
      <FloatingOrbs />

      {/* ─── NAV ──────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel fixed top-0 left-0 right-0 z-50 px-6 py-3 glow-line"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
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
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 gap-1 font-mono hidden sm:flex border-white/5"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              System Online
            </Badge>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => navigate("/dashboard")}
              >
                Launch Command Center
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
        className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-6"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-8 text-[11px] px-4 py-1.5 gap-1.5 font-medium border-white/5"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              AI-Powered Border Security
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mb-12"
          >
            <HeroShield />
          </motion.div>

          {/* Cinematic title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ perspective: 1000 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.02]">
              <motion.span
                className="block"
                initial={{ rotateX: 30, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              >
                Surveillance
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent glow-text"
                initial={{ rotateX: 30, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.7 }}
              >
                Command Center
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Monitor perimeters, detect intrusions, and respond to threats in
            real-time. Powered by AI object detection with intelligent
            boundary management and instant alerting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <MagneticButton strength={0.35}>
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 40px oklch(0.6 0.18 250 / 30%)" }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="h-14 px-10 text-sm gap-2.5 shadow-lg shadow-primary/20 font-semibold"
                  onClick={() => navigate("/auth?returnTo=/dashboard")}
                >
                  <Lock className="w-4 h-4" />
                  Enter Command Center
                </Button>
              </motion.div>
            </MagneticButton>
            <MagneticButton strength={0.35}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-sm gap-2.5 glass-panel border-white/10 font-semibold"
                  onClick={() => navigate("/dashboard")}
                >
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </motion.div>
            </MagneticButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
                Scroll to explore
              </span>
              <ArrowDown className="w-4 h-4 text-primary/50" />
            </motion.div>
          </motion.div>
        </div>

        {/* Hero glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      </motion.section>

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pb-8 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ─── PREVIEW ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground glow-text">
              See It In Action
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
              A live preview of the command center interface
            </p>
          </motion.div>
          <PreviewWindow />
        </div>
      </section>

      <SectionDivider />

      {/* ─── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground glow-text">
              Mission-Critical Features
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
              Everything a security operator needs to monitor, detect, and
              respond to perimeter threats.
            </p>
          </motion.div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ perspective: 1200 }}
          >
            {FEATURES.map((feature, i) => (
              <FloatingCard
                key={feature.title}
                Icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1000 }}
          >
            <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden" style={{ background: "oklch(0.12 0.02 260 / 40%)", border: "1px solid oklch(0.25 0.03 260 / 12%)", backdropFilter: "blur(20px)" }}>
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-3xl" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Orbiting ring */}
              <motion.div
                className="absolute inset-8 rounded-full border border-primary/10 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-8"
                  whileHover={{ rotateY: 180, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_12px_oklch(0.6_0.18_250/40%)]" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground glow-text">
                  Start Monitoring Now
                </h2>
                <p className="mt-5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Deploy your AI surveillance command center in minutes. One camera,
                  real-time detection, instant alerts — version 1 gets you operational
                  fast.
                </p>

                <div className="mt-10">
                  <MagneticButton strength={0.4}>
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px oklch(0.6 0.18 250 / 30%)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        size="lg"
                        className="h-14 px-10 text-sm gap-2.5 shadow-lg shadow-primary/25 font-semibold"
                        onClick={() => navigate("/auth?returnTo=/dashboard")}
                      >
                        <Lock className="w-4 h-4" />
                        Access Command Center
                      </Button>
                    </motion.div>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 glass-panel px-6 py-6 glow-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">
              SENTINEL
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            AI Border Surveillance & Incident Command Center
          </p>
        </div>
      </footer>
    </div>
  );
}
