import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { fetchApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-4"
          >
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h2 className="text-xl font-semibold text-foreground">Check your inbox!</h2>
            <p className="text-muted-foreground text-sm">
              If <span className="text-primary font-medium">{email}</span> is registered,
              you'll receive a password reset link shortly.
            </p>
            <p className="text-xs text-muted-foreground">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="oceanguard.team@gmail.com"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="ocean-button w-full flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </motion.form>
        )}
      </div>
    </div>
  );
}
