import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { OceanGuardLogo } from "@/components/OceanGuardLogo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setCountdown(300);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6"><OceanGuardLogo /></div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {step === 1 ? "Welcome back" : "Verify your identity"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1 ? "Log in to your OceanGuard account" : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleLogin} className="glass-card p-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="john@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="ocean-button w-full !mt-6">Continue</button>
            </motion.form>
          ) : (
            <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerify} className="glass-card p-8 space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-14 w-12 rounded-xl border border-input bg-background text-center text-lg font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ))}
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {countdown > 0 ? (
                  <span>Code expires in <span className="font-medium text-primary">{formatTime(countdown)}</span></span>
                ) : (
                  <button type="button" onClick={() => setCountdown(300)} className="font-medium text-primary hover:underline">
                    Resend Code
                  </button>
                )}
              </div>
              <button type="submit" className="ocean-button w-full">Verify & Login</button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
