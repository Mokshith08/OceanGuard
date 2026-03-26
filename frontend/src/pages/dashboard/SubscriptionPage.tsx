import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const plans = [
  { name: "Free", price: "₹0", period: "/month", current: true, features: ["Basic risk prediction", "5 calculations/day", "1 user", "Email support"] },
  { name: "Pro", price: "₹49", period: "/month", current: false, highlighted: true, features: ["Advanced AI models", "Unlimited calculations", "5 users", "Priority support", "Analytics dashboard", "Export reports"] },
  { name: "Enterprise", price: "₹199", period: "/month", current: false, features: ["Custom ML models", "Unlimited everything", "Unlimited users", "Dedicated support", "Organization panel", "API access", "Custom integrations"] },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display text-2xl font-bold text-foreground">Subscription Plans</h3>
        <p className="mt-2 text-muted-foreground">Manage your plan and billing.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-7 ${
              plan.highlighted ? "border-primary ring-1 ring-primary/20 bg-card" : "border-border/50 bg-card"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Crown className="h-3 w-3" /> Recommended
              </span>
            )}
            <h4 className="font-display text-xl font-bold text-foreground">{plan.name}</h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-accent" /> {f}
                </li>
              ))}
            </ul>
            <button className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
              plan.current ? "border border-border text-muted-foreground cursor-default" : "ocean-button"
            }`}>
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
        <h3 className="font-display text-base font-semibold text-foreground mb-4">Billing Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Current Plan</label>
            <p className="font-medium text-foreground">Free</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Billing Cycle</label>
            <p className="font-medium text-foreground">Monthly</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Next Billing Date</label>
            <p className="font-medium text-foreground">March 17, 2026</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Payment Method</label>
            <p className="font-medium text-foreground">•••• 4242</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
