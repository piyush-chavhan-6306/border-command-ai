import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Animated Grid Background ───────────────────────────────────────────────
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 60;
      const scrollY = window.scrollY;
      ctx.strokeStyle = "oklch(0.78 0.02 250 / 12%)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -scrollY * 0.3; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating dots
      for (let i = 0; i < 30; i++) {
        const px = ((i * 137.5 + t * 0.01) % canvas.width);
        const py = ((i * 97.3 + t * 0.005 + scrollY * 0.1) % canvas.height);
        const size = 1.5 + Math.sin(t * 0.002 + i) * 1;
        ctx.fillStyle = `oklch(0.55 0.1 250 / ${15 + Math.sin(t * 0.003 + i) * 10}%)`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── 3D Shield Hero ─────────────────────────────────────────────────────────
function HeroShield({ scrollProgress }: { scrollProgress: number }) {
  const rotateX = useSpring(scrollProgress * 45, { stiffness: 50, damping: 20 });
  const rotateY = useSpring(scrollProgress * -30, { stiffness: 50, damping: 20 });
  const scale = useSpring(1 - scrollProgress * 0.15, { stiffness: 80, damping: 20 });
  const glowIntensity = useSpring(scrollProgress * 50, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="relative"
      style={{
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-8 rounded-full"
          style={{
            background: `radial-gradient(circle, oklch(0.5 0.15 250 / ${20 + scrollProgress * 30}%) 0%, transparent 70%)`,
            filter: `blur(${20 + scrollProgress * 20}px)`,
          }}
        />

        {/* Shield container */}
        <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto">
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-primary/60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-blue-400/60" />
          </motion.div>

          {/* Second ring */}
          <motion.div
            className="absolute inset-3 rounded-full border border-primary/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner shield */}
          <div
            className="absolute inset-6 sm:inset-8 glass-card rounded-2xl flex items-center justify-center"
            style={{
              transform: `translateZ(${30 - scrollProgress * 20}px)`,
              boxShadow: `0 0 ${40 + scrollProgress * 30}px oklch(0.5 0.15 250 / 15%), inset 0 1px 0 oklch(1 0 0 / 50%)`,
            }}
          >
            <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [
                  Math.cos((i * Math.PI) / 3) * 90,
                  Math.cos((i * Math.PI) / 3 + Math.PI * 2) * 90,
                ],
                y: [
                  Math.sin((i * Math.PI) / 3) * 90,
                  Math.sin((i * Math.PI) / 3 + Math.PI * 2) * 90,
                ],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 3D Feature Card ────────────────────────────────────────────────────────
function FeatureCard3D({
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : {}
      }
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: -3,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      style={{ perspective: 600, transformStyle: "preserve-3d" }}
      className="glass-card rounded-2xl p-6 sm:p-7 cursor-default group"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at 30% 20%, oklch(0.5 0.12 250 / 8%) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors"
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3
        className="relative text-base font-bold text-foreground/85 mb-2"
        style={{ transform: "translateZ(15px)" }}
      >
        {title}
      </h3>
      <p
        className="relative text-sm text-muted-foreground leading-relaxed"
        style={{ transform: "translateZ(10px)" }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── 3D Parallax Section ────────────────────────────────────────────────────
function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Floating Orb ────────────────────────────────────────────────────────────
function FloatingOrb({
  size,
  color,
  x,
  y,
  delay = 0,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── Scan Line Effect ────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{
        background: "linear-gradient(90deg, transparent, oklch(0.5 0.15 250 / 40%), transparent)",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Stats Counter ───────────────────────────────────────────────────────────
function AnimatedStat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="glass-card rounded-xl p-5 text-center relative overflow-hidden"
    >
      <ScanLine />
      <motion.p
        className="text-2xl sm:text-3xl font-bold text-primary relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
      >
        {value}
      </motion.p>
      <p className="text-xs text-muted-foreground mt-1.5 relative z-10 font-medium">
        {label}
      </p>
    </motion.div>
  );
}

// ─── Preview Window ──────────────────────────────────────────────────────────
function PreviewWindow({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto max-w-4xl"
      initial={{ opacity: 0, y: 80, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
        whileHover={{ rotateX: -2, rotateY: 3, scale: 1.01 }}
        transition={{ duration: 0.4 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/30 bg-white/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="glass-inset rounded-lg px-3 py-1 text-[10px] text-muted-foreground font-mono text-center">
              sentinel.command-center/dashboard
            </div>
          </div>
        </div>

        {/* Preview content — mini dashboard mockup */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-white/40 to-white/20">
          <div className="flex gap-4">
            {/* Mini camera feed */}
            <div className="flex-[7] rounded-xl bg-neutral-100/80 h-48 sm:h-64 relative overflow-hidden border border-white/40">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-emerald-50/30 to-neutral-100/50" />
              {/* Fake horizon line */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-emerald-300/30" />
              {/* Fake detection boxes */}
              <motion.div
                className="absolute border-2 border-red-400/70 rounded-sm"
                style={{ top: "45%", left: "35%", width: 30, height: 50 }}
                animate={{ x: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute border-2 border-blue-400/70 rounded-sm"
                style={{ top: "50%", left: "60%", width: 50, height: 30 }}
                animate={{ x: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              {/* REC badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] text-white font-mono">REC</span>
              </div>
              {/* Camera label */}
              <div className="absolute bottom-2 right-2 bg-black/40 rounded px-2 py-0.5">
                <span className="text-[8px] text-white font-mono">MAIN GATE · LIVE</span>
              </div>
            </div>

            {/* Mini alerts */}
            <div className="flex-[3] space-y-2">
              {[
                { sev: "critical", label: "Person #4", time: "10:55:12 PM" },
                { sev: "warning", label: "Vehicle #12", time: "10:42:30 AM" },
                { sev: "warning", label: "Car #7", time: "03:12:45 PM" },
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="glass-card rounded-lg p-2.5 border border-white/30"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        a.sev === "critical" ? "bg-red-500" : "bg-amber-500"
                      }`}
                    />
                    <span className="text-[9px] font-bold text-foreground/70">{a.label}</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground">{a.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const shieldRotateProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Smooth spring for the shield rotation
  const springProgress = useSpring(shieldRotateProgress, {
    stiffness: 50,
    damping: 20,
  });

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      <GridBackground />

      {/* Floating orbs */}
      <FloatingOrb size={300} color="oklch(0.55 0.12 250 / 12%)" x="10%" y="15%" delay={0} />
      <FloatingOrb size={200} color="oklch(0.55 0.1 200 / 10%)" x="75%" y="25%" delay={2} />
      <FloatingOrb size={250} color="oklch(0.6 0.12 170 / 8%)" x="60%" y="65%" delay={4} />
      <FloatingOrb size={180} color="oklch(0.55 0.1 280 / 10%)" x="15%" y="80%" delay={3} />

      {/* ─── NAVIGATION ────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 gap-1 font-mono hidden sm:flex"
            >
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

      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-28 sm:pt-36 pb-24 sm:pb-32 px-6"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Badge
              variant="secondary"
              className="mb-8 text-[11px] px-4 py-1.5 gap-1.5 font-medium"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              AI-Powered Border Security
            </Badge>
          </motion.div>

          {/* 3D Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="mb-10"
          >
            <HeroShield scrollProgress={0} />
          </motion.div>

          {/* 3D Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ perspective: 800 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground/90 leading-[1.05]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                className="block"
                initial={{ rotateX: 20, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Surveillance
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent"
                initial={{ rotateX: 20, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                Command Center
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-7 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Monitor perimeters, detect intrusions, and respond to threats in
            real-time. Powered by AI object detection with intelligent
            boundary management and instant alerting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="h-13 px-8 text-sm gap-2 shadow-lg shadow-primary/20"
                onClick={() => navigate("/auth?returnTo=/dashboard")}
              >
                <Lock className="w-4 h-4" />
                Enter Command Center
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 text-sm gap-2 glass-panel border-white/30"
                onClick={() => navigate("/dashboard")}
              >
                <Eye className="w-4 h-4" />
                Quick Preview
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero glow */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      </motion.section>

      {/* ─── STATS ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pb-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </section>

      {/* ─── 3D PREVIEW ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85">
              See It In Action
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              A live preview of the command center interface
            </p>
          </motion.div>
          <PreviewWindow scrollProgress={0} />
        </div>
      </section>

      {/* ─── 3D FEATURE CARDS ──────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <ParallaxSection speed={0.2}>
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
                respond to perimeter threats.
              </p>
            </motion.div>
          </ParallaxSection>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ perspective: 1000 }}
          >
            {FEATURES.map((feature, i) => (
              <FeatureCard3D
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

      {/* ─── SCROLL-REVEAL CTA ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <ParallaxSection speed={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto glass-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{ perspective: 800 }}
          >
            <ScanLine />

            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-3xl" />

            <div className="relative z-10">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-7 h-7 text-primary" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85">
                Start Monitoring Now
              </h2>
              <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Deploy your AI surveillance command center in minutes. One camera,
                real-time detection, instant alerts — version 1 gets you operational
                fast.
              </p>

              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="h-13 px-8 text-sm gap-2 shadow-lg shadow-primary/20"
                  onClick={() => navigate("/auth?returnTo=/dashboard")}
                >
                  <Lock className="w-4 h-4" />
                  Access Command Center
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </ParallaxSection>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 glass-panel px-6 py-6 mt-10 glow-line">
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
