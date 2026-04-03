import { motion } from "framer-motion";
import { Waves, Fish, IndianRupee, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

import { Calendar } from "lucide-react";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [profitHistory, setProfitHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, profitRes] = await Promise.all([
          fetchApi("/dashboard/analytics"),
          fetchApi("/dashboard/profit-history"),
        ]);
        setData(analyticsRes.data);
        setProfitHistory(profitRes.data?.records || []);
      } catch (err: any) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Map backend stats
  const p = data?.profit || {};
  const stats = [
    { label: "Total Safe Assessments", value: data?.riskDistribution?.safe?.toString() || "0", change: "", up: true, icon: Waves, color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Catch Recorded", value: `${p.totalCatch || 0} kg`, change: "", up: true, icon: Fish, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Margin", value: `${p.avgProfitMargin || 0}%`, change: "", up: true, icon: IndianRupee, color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Profit", value: `₹${p.totalProfit || 0}`, change: "", up: true, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
  ];

  // Map revenue data
  // Build from profitHistory
  // Aggregate by day (last 7 items roughly, or just map the records if there are few)
  const revenueData = profitHistory.slice(0, 7).reverse().map((r: any, i: number) => ({
    name: new Date(r.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: r.result?.revenue || 0,
    profit: r.result?.profit || 0,
  }));
  // Provide fallback if empty
  if (revenueData.length === 0) {
     revenueData.push({ name: "Mon", revenue: 0, profit: 0 });
  }

  // Map risk data
  const riskData = (data?.recentActivity || []).map((r: any) => ({
    name: new Date(r._id).toLocaleDateString('en-US', { weekday: 'short' }),
    safe: r.safe,
    highRisk: r.highRisk,
  }));
  if (riskData.length === 0) {
     riskData.push({ name: "Mon", safe: 0, highRisk: 0 });
  }
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
              {stat.change && (
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-accent" : "text-destructive"}`}>
                  {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              )}
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
              <Bar dataKey="highRisk" fill="hsl(var(--destructive))" stackId="a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="safe" fill="hsl(var(--primary))" stackId="a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
