import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

const COLORS = ["hsl(199, 89%, 48%)", "hsl(168, 76%, 42%)", "hsl(222, 47%, 20%)", "hsl(0, 84%, 60%)", "hsl(280, 65%, 60%)"];
const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" };

export default function AnalyticsPage() {
  const [data, setData] = useState<{ risk: any[], profit: any[] }>({ risk: [], profit: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, profitRes] = await Promise.all([
          fetchApi("/risk/history?limit=100"),
          fetchApi("/dashboard/profit-history")
        ]);
        setData({
          risk: riskRes.data?.records || [],
          profit: profitRes.data?.records || []
        });
      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthlyRevenue = useMemo(() => {
    const months: Record<string, number> = {};
    data.profit.forEach(r => {
      const m = new Date(r.createdAt).toLocaleString('default', { month: 'short' });
      months[m] = (months[m] || 0) + (r.result?.revenue || 0);
    });
    return Object.keys(months).map(name => ({ name, revenue: months[name] }));
  }, [data.profit]);

  const riskTrend = useMemo(() => {
    const months: Record<string, { high: number, medium: number, low: number }> = {};
    data.risk.forEach(r => {
      const m = new Date(r.createdAt).toLocaleString('default', { month: 'short' });
      if (!months[m]) months[m] = { high: 0, medium: 0, low: 0 };
      if (r.risk === "High Risk") months[m].high += 1;
      else if (r.risk === "Safe") months[m].low += 1;
      else months[m].medium += 1;
    });
    return Object.keys(months).map(name => ({ name, ...months[name] }));
  }, [data.risk]);

  const regionData = useMemo(() => {
    const regions: Record<string, number> = {};
    data.risk.forEach(r => {
      const loc = r.city || "Unknown";
      regions[loc] = (regions[loc] || 0) + 1;
    });
    return Object.keys(regions).map(name => ({ name, value: regions[name] })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [data.risk]);

  const topRegions = useMemo(() => {
    const regions: Record<string, { count: number, highRisk: number }> = {};
    data.risk.forEach(r => {
      const loc = r.city || "Unknown";
      if (!regions[loc]) regions[loc] = { count: 0, highRisk: 0 };
      regions[loc].count += 1;
      if (r.risk === "High Risk") regions[loc].highRisk += 1;
    });
    return Object.keys(regions).map(region => ({
      region,
      revenue: "N/A", // We don't track revenue by location right now
      risk: regions[region].highRisk > 0 ? "High" : "Low",
      vessels: regions[region].count
    })).sort((a,b) => b.vessels - a.vessels).slice(0, 5);
  }, [data.risk]);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Risk Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="low" stackId="a" fill="hsl(var(--accent))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="hsl(45, 93%, 47%)" />
              <Bar dataKey="high" stackId="a" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Region-wise Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {regionData.map((r, i) => (
              <div key={r.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {r.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Top Performing Regions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-medium">Region</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Risk</th>
                  <th className="pb-3 font-medium">Vessels</th>
                </tr>
              </thead>
              <tbody>
                {topRegions.map((r) => (
                  <tr key={r.region} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{r.region}</td>
                    <td className="py-3 text-foreground">{r.revenue}</td>
                    <td className="py-3">
                      <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                        r.risk === "Low" ? "text-accent bg-accent/10" : r.risk === "Medium" ? "text-yellow-500 bg-yellow-500/10" : "text-destructive bg-destructive/10"
                      }`}>{r.risk}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{r.vessels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
