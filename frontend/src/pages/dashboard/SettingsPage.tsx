import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, CreditCard, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({ name: "John Doe", email: "john@example.com" });
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });

  const handleSave = () => toast({ title: "Settings saved", description: "Your preferences have been updated." });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
          <h3 className="font-display text-base font-semibold text-foreground">Profile</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button onClick={handleSave} className="ocean-button text-sm">Save Changes</button>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div>
          <h3 className="font-display text-base font-semibold text-foreground">Change Password</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
            <input type="password" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
            <input type="password" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button onClick={handleSave} className="ocean-button text-sm">Update Password</button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Bell className="h-5 w-5 text-primary" /></div>
          <h3 className="font-display text-base font-semibold text-foreground">Notifications</h3>
        </div>
        {[
          { key: "email" as const, label: "Email Notifications" },
          { key: "push" as const, label: "Push Notifications" },
          { key: "weekly" as const, label: "Weekly Reports" },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between">
            <span className="text-sm text-foreground">{n.label}</span>
            <button
              onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
              className={`relative h-6 w-11 rounded-full transition-colors ${notifications[n.key] ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${notifications[n.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Subscription Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
          <h3 className="font-display text-base font-semibold text-foreground">Subscription Status</h3>
        </div>
        <p className="text-sm text-muted-foreground">Current Plan: <span className="font-medium text-foreground">Free</span></p>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-destructive/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10"><Trash2 className="h-5 w-5 text-destructive" /></div>
          <h3 className="font-display text-base font-semibold text-destructive">Delete Account</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data. This action cannot be undone.</p>
        <button className="rounded-xl border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
