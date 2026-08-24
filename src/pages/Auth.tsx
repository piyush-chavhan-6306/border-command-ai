import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX, Shield, Eye, ChevronDown } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

/* ── Animated starfield for auth page ── */
function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const stars: { x: number; y: number; r: number; a: number; d: number; vx: number; vy: number }[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        d: Math.random() * 0.005 + 0.002,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.a += s.d;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        const alpha = (Math.sin(s.a) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 180, 255, ${alpha * 0.6})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "radial-gradient(ellipse at 50% 0%, rgba(20,40,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,78,59,0.15) 0%, transparent 40%), #030712",
    }}>
      <StarfieldCanvas />

      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none rounded-full"
        style={{
          left: mousePos.x - 150,
          top: mousePos.y - 150,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
          zIndex: 1,
        }}
      />

      {/* Floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "float-slow 20s ease-in-out infinite",
      }} />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "float-slow 25s ease-in-out infinite reverse",
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top nav bar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">SENTINEL</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5 text-sm"
              onClick={() => navigate("/")}
            >
              Back to Home
              <ChevronDown className="ml-1 w-4 h-4 -rotate-90" />
            </Button>
          </motion.div>
        </nav>

        {/* Main auth area */}
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            {/* Glass card */}
            <div className="relative rounded-2xl overflow-hidden" style={{
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 0 80px rgba(56,189,248,0.06), 0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
              {/* Top glow line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{
                background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)",
              }} />

              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {step === "signIn" ? (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center relative"
                          style={{
                            background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(59,130,246,0.1))",
                            border: "1px solid rgba(56,189,248,0.2)",
                            boxShadow: "0 0 30px rgba(56,189,248,0.1)",
                          }}
                        >
                          <Eye className="w-8 h-8 text-cyan-400" />
                          <div className="absolute inset-0 rounded-2xl" style={{
                            background: "linear-gradient(135deg, rgba(56,189,248,0.1), transparent)",
                          }} />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                          Welcome Back
                        </h1>
                        <p className="text-sm text-white/40">
                          Sign in to access your surveillance command center
                        </p>
                      </div>

                      {/* Email form */}
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                          <Input
                            name="email"
                            placeholder="operator@sentinel.ai"
                            type="email"
                            className="pl-11 h-12 rounded-xl text-white placeholder:text-white/25 border-white/8 focus:border-cyan-500/40 focus:ring-cyan-500/20 transition-all"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                            }}
                            disabled={isLoading}
                            required
                          />
                        </div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-400 text-center"
                          >
                            {error}
                          </motion.p>
                        )}

                        <Button
                          type="submit"
                          className="w-full h-12 rounded-xl font-semibold text-white transition-all"
                          style={{
                            background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
                            boxShadow: "0 4px 20px rgba(56,189,248,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              Continue with Email
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="px-3 text-white/25 tracking-wider" style={{ background: "rgba(15, 23, 42, 0.6)" }}>
                            or
                          </span>
                        </div>
                      </div>

                      {/* Guest login */}
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all border border-white/6 hover:border-white/12"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <UserX className="mr-2 h-4 w-4" />
                        )}
                        Continue as Guest Operator
                      </Button>

                      {/* Footer info */}
                      <p className="text-center text-[11px] text-white/20 mt-6">
                        By continuing, you agree to SENTINEL&apos;s{" "}
                        <span className="underline cursor-pointer hover:text-white/40 transition-colors">Terms</span>
                        {" "}and{" "}
                        <span className="underline cursor-pointer hover:text-white/40 transition-colors">Privacy Policy</span>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* OTP Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))",
                            border: "1px solid rgba(16,185,129,0.2)",
                            boxShadow: "0 0 30px rgba(16,185,129,0.1)",
                          }}
                        >
                          <Mail className="w-8 h-8 text-emerald-400" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                          Check Your Email
                        </h1>
                        <p className="text-sm text-white/40">
                          We&apos;ve sent a 6-digit code to
                        </p>
                        <p className="text-sm text-cyan-400 font-medium mt-1">
                          {step.email}
                        </p>
                      </div>

                      {/* OTP form */}
                      <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <input type="hidden" name="email" value={step.email} />
                        <input type="hidden" name="code" value={otp} />

                        <div className="flex justify-center">
                          <InputOTP
                            value={otp}
                            onChange={setOtp}
                            maxLength={6}
                            disabled={isLoading}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                                const form = (e.target as HTMLElement).closest("form");
                                if (form) form.requestSubmit();
                              }
                            }}
                          >
                            <InputOTPGroup>
                              {Array.from({ length: 6 }).map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="w-11 h-12 rounded-lg text-white text-lg"
                                  style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-400 text-center"
                          >
                            {error}
                          </motion.p>
                        )}

                        <Button
                          type="submit"
                          className="w-full h-12 rounded-xl font-semibold text-white transition-all"
                          style={{
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            boxShadow: "0 4px 20px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                          }}
                          disabled={isLoading || otp.length !== 6}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify & Enter Command Center
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        <div className="flex flex-col items-center gap-3">
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-cyan-400/70 hover:text-cyan-400 text-sm"
                            onClick={() => setStep("signIn")}
                          >
                            ← Use a different email
                          </Button>
                          <p className="text-xs text-white/25">
                            Didn&apos;t receive a code?{" "}
                            <button
                              type="button"
                              className="text-cyan-400/60 hover:text-cyan-400 underline transition-colors"
                              onClick={() => setStep("signIn")}
                            >
                              Try again
                            </button>
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-4 text-center text-[11px] text-white/20 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                Secured by{" "}
                <a
                  href="https://freebuff.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400/40 hover:text-cyan-400 transition-colors underline"
                >
                  freebuff.com
                </a>
              </div>
            </div>

            {/* Bottom text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-white/15 mt-6"
            >
              SENTINEL AI Surveillance Command Center v1.0
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#030712" }}>
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400/50" />
        </div>
      }
    >
      <Auth {...props} />
    </Suspense>
  );
}
