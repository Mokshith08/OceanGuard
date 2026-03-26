import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyRevenue = [
  { name: "Jan", revenue: 42000 }, { name: "Feb", revenue: 58000 }, { name: "Mar", revenue: 45000 },
  { name: "Apr", revenue: 62000 }, { name: "May", revenue: 73000 }, { name: "Jun", revenue: 68000 },
];

const riskTrend = [
  { name: "Jan", high: 12, medium: 18, low: 30 },
  { name: "Feb", high: 8, medium: 22, low: 35 },
  { name: "Mar", high: 15, medium: 20, low: 25 },
  { name: "Apr", high: 6, medium: 15, low: 40 },
  { name: "May", high: 4, medium: 12, low: 45 },
  { name: "Jun", high: 10, medium: 18, low: 32 },
];

const regionData = [
  { name: "Bay of Bengal", value: 35 },
  { name: "Arabian Sea", value: 25 },
  { name: "Pacific Coast", value: 20 },
  { name: "Indian Ocean", value: 20 },
];

const COLORS = ["hsl(199, 89%, 48%)", "hsl(168, 76%, 42%)", "hsl(222, 47%, 20%)", "hsl(0, 84%, 60%)"];

const topRegions = [
  { region: "Bay of Bengal", revenue: "₹125,000", risk: "Medium", vessels: 45 },
  { region: "Arabian Sea", revenue: "₹98,000", risk: "Low", vessels: 32 },
  { region: "Pacific Coast", revenue: "₹87,000", risk: "Low", vessels: 28 },
  { region: "Indian Ocean", revenue: "₹72,000", risk: "High", vessels: 18 },
];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" };

export default function AnalyticsPage() {
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
