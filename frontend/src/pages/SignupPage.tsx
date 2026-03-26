import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { OceanGuardLogo } from "@/components/OceanGuardLogo";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const { toast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "fisherman" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Account created!", description: "Please check your email to verify." });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6"><OceanGuardLogo /></div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start predicting marine risks today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="fisherman">Fisherman</option>
              <option value="org_admin">Organization Admin</option>
            </select>
          </div>
          <button type="submit" className="ocean-button w-full !mt-6">Create Account</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
