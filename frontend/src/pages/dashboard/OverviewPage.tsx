import { motion } from "framer-motion";
import { Waves, Fish, IndianRupee, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

import { Calendar } from "lucide-react";

const stats = [
  { label: "Today's Risk Level", value: "Medium", change: "+5%", up: true, icon: Waves, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Estimated Catch", value: "1,240 kg", change: "+12%", up: true, icon: Fish, color: "text-primary", bg: "bg-primary/10" },
  { label: "Monthly Profit", value: "₹86,200", change: "+8%", up: true, icon: IndianRupee, color: "text-accent", bg: "bg-accent/10" },
  { label: "Yearly Profit", value: "₹742,800", change: "+14%", up: true, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
];

const revenueData = [
  { name: "Mon", revenue: 4200, profit: 2800 },
  { name: "Tue", revenue: 5800, profit: 3900 },
  { name: "Wed", revenue: 3100, profit: 1800 },
  { name: "Thu", revenue: 6200, profit: 4100 },
  { name: "Fri", revenue: 7500, profit: 5200 },
  { name: "Sat", revenue: 5400, profit: 3600 },
  { name: "Sun", revenue: 4800, profit: 3200 },
];

const riskData = [
  { name: "Mon", risk: 35 },
  { name: "Tue", risk: 45 },
  { name: "Wed", risk: 72 },
  { name: "Thu", risk: 28 },
  { name: "Fri", risk: 15 },
  { name: "Sat", risk: 40 },
  { name: "Sun", risk: 55 },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-accent" : "text-destructive"}`}>
                {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Revenue & Profit</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Risk Levels This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
