import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import { Plus, Trash2, Ship, ArrowLeft, TrendingUp, TrendingDown, IndianRupee, ChevronRight, Fish, Fuel, Wrench, Users, Download, FileText } from "lucide-react";

interface BoatEntry {
  id: string;
  name: string;
  fishCaught: string;
  fuelCost: string;
  laborCost: string;
  maintenanceCost: string;
}

interface BoatResult {
  id: string;
  name: string;
  fishCaught: number;
  revenue: number;
  fuelCost: number;
  laborCost: number;
  maintenanceCost: number;
  totalCost: number;
  profit: number;
}

const createBoat = (): BoatEntry => ({
  id: crypto.randomUUID(),
  name: "",
  fishCaught: "",
  fuelCost: "",
  laborCost: "",
  maintenanceCost: "",
});

export default function ProfitCalculatorPage() {
  const [marketPrice, setMarketPrice] = useState("");
  const [boats, setBoats] = useState<BoatEntry[]>([createBoat()]);
  const [results, setResults] = useState<BoatResult[] | null>(null);
  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);

  const addBoat = () => setBoats((prev) => [...prev, createBoat()]);

  const removeBoat = (id: string) => {
    if (boats.length <= 1) return;
    setBoats((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBoat = (id: string, field: keyof BoatEntry, value: string) => {
    setBoats((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(marketPrice) || 0;
    const boatResults: BoatResult[] = boats.map((b, i) => {
      const fishCaught = parseFloat(b.fishCaught) || 0;
      const fuelCost = parseFloat(b.fuelCost) || 0;
      const laborCost = parseFloat(b.laborCost) || 0;
      const maintenanceCost = parseFloat(b.maintenanceCost) || 0;
      const revenue = Math.round(fishCaught * price);
      const totalCost = Math.round(fuelCost + laborCost + maintenanceCost);
      const profit = revenue - totalCost;
      return {
        id: b.id,
        name: b.name || `Boat ${i + 1}`,
        fishCaught,
        revenue,
        fuelCost,
        laborCost,
        maintenanceCost,
        totalCost,
        profit,
      };
    });
    setResults(boatResults);
    // Save to localStorage so dashboard profile menu can offer download
    localStorage.setItem("og_fleet_results", JSON.stringify({ marketPrice, results: boatResults }));
  };

  const selectedBoat = useMemo(
    () => results?.find((r) => r.id === selectedBoatId) ?? null,
    [results, selectedBoatId]
  );

  const totalProfit = useMemo(() => results?.reduce((s, r) => s + r.profit, 0) ?? 0, [results]);
  const totalRevenue = useMemo(() => results?.reduce((s, r) => s + r.revenue, 0) ?? 0, [results]);
  const totalCatch = useMemo(() => results?.reduce((s, r) => s + r.fishCaught, 0) ?? 0, [results]);

  const chartData = useMemo(
    () => results?.map((r) => ({ name: r.name, Revenue: r.revenue, Cost: r.totalCost, Profit: Math.max(r.profit, 0) })) ?? [],
    [results]
  );

  const downloadFleetStatement = () => {
    if (!results) return;
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const totalFuel = results.reduce((s, r) => s + r.fuelCost, 0);
    const totalLabor = results.reduce((s, r) => s + r.laborCost, 0);
    const totalMaint = results.reduce((s, r) => s + r.maintenanceCost, 0);
    const totalCostAll = results.reduce((s, r) => s + r.totalCost, 0);
    const netProfit = results.reduce((s, r) => s + r.profit, 0);
    const totalRev = results.reduce((s, r) => s + r.revenue, 0);
    const totalCatchAll = results.reduce((s, r) => s + r.fishCaught, 0);
    const profitMargin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : "0";

    const boatRows = results.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.fishCaught.toLocaleString()} kg</td>
        <td>₹${r.revenue.toLocaleString()}</td>
        <td>₹${r.totalCost.toLocaleString()}</td>
        <td style="color:${r.profit < 0 ? '#ef4444' : '#10b981'};font-weight:600">${r.profit >= 0 ? '+' : ''}₹${r.profit.toLocaleString()}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>OceanGuard Fleet Profit Statement</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 32px; color: #1a2340; }
  .card { background: #fff; border-radius: 16px; padding: 32px 36px; max-width: 760px; margin: 0 auto 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e8edf5; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 800; color: #0ea5e9; }
  .brand span { color: #0d1b2e; }
  .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
  .date { font-size: 12px; color: #94a3b8; text-align: right; }
  h2 { font-size: 16px; font-weight: 700; color: #0d1b2e; margin: 0 0 16px; border-left: 4px solid #0ea5e9; padding-left: 12px; }
  .grid4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .kpi { background: #f8fafc; border-radius: 10px; padding: 14px 16px; }
  .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-value { font-size: 20px; font-weight: 700; color: #0d1b2e; margin-top: 4px; }
  .kpi.green .kpi-value { color: #10b981; }
  .kpi.red .kpi-value { color: #ef4444; }
  .kpi.blue .kpi-value { color: #0ea5e9; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 13px; }
  th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 11px 12px; border-bottom: 1px solid #f1f5f9; }
  .total-row td { font-weight: 700; color: #10b981; background: #f0fdf4; border-top: 2px solid #e8edf5; }
  .footer { font-size: 11px; color: #94a3b8; text-align: center; padding-top: 16px; border-top: 1px solid #e8edf5; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #e0f2fe; color: #0284c7; margin-bottom: 16px; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div>
      <div class="brand"><span>Ocean</span>Guard</div>
      <div class="sub">Fleet Profit Statement &mdash; All Boats</div>
    </div>
    <div class="date">Generated on<br/><strong>${date}</strong><br/><br/>Market Price: <strong>₹${marketPrice}/kg</strong></div>
  </div>

  <div class="badge">${results.length} Boat${results.length > 1 ? 's' : ''} &nbsp;·&nbsp; Current Period</div>
  <h2>Fleet Summary (Current Period)</h2>
  <div class="grid4">
    <div class="kpi"><div class="kpi-label">Total Catch</div><div class="kpi-value">${totalCatchAll.toLocaleString()} kg</div></div>
    <div class="kpi blue"><div class="kpi-label">Total Revenue</div><div class="kpi-value">₹${totalRev.toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Total Costs</div><div class="kpi-value">₹${totalCostAll.toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? 'red' : 'green'}"><div class="kpi-label">Net Profit</div><div class="kpi-value">${netProfit >= 0 ? '+' : ''}₹${netProfit.toLocaleString()}</div></div>
  </div>

  <h2>Cost Breakdown</h2>
  <div class="grid3">
    <div class="kpi red"><div class="kpi-label">Fuel</div><div class="kpi-value">₹${totalFuel.toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Labor</div><div class="kpi-value">₹${totalLabor.toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Maintenance</div><div class="kpi-value">₹${totalMaint.toLocaleString()}</div></div>
  </div>

  <h2>Per-Boat Breakdown</h2>
  <table>
    <thead><tr><th>Boat</th><th>Fish Caught</th><th>Revenue</th><th>Costs</th><th>Net Profit</th></tr></thead>
    <tbody>${boatRows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td>TOTAL FLEET</td>
        <td>${totalCatchAll.toLocaleString()} kg</td>
        <td>₹${totalRev.toLocaleString()}</td>
        <td>₹${totalCostAll.toLocaleString()}</td>
        <td>${netProfit >= 0 ? '+' : ''}₹${netProfit.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>
</div>

<div class="card">
  <h2>Monthly Projection (× 1 Month)</h2>
  <div class="grid3">
    <div class="kpi blue"><div class="kpi-label">Monthly Revenue</div><div class="kpi-value">₹${(totalRev).toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Monthly Costs</div><div class="kpi-value">₹${(totalCostAll).toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? 'red' : 'green'}"><div class="kpi-label">Monthly Profit</div><div class="kpi-value">${netProfit >= 0 ? '+' : ''}₹${(netProfit).toLocaleString()}</div></div>
  </div>

  <h2>Yearly Projection (× 12 Months)</h2>
  <div class="grid3">
    <div class="kpi blue"><div class="kpi-label">Yearly Revenue</div><div class="kpi-value">₹${(totalRev * 12).toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Yearly Costs</div><div class="kpi-value">₹${(totalCostAll * 12).toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? 'red' : 'green'}"><div class="kpi-label">Yearly Profit</div><div class="kpi-value">${netProfit >= 0 ? '+' : ''}₹${(netProfit * 12).toLocaleString()}</div></div>
  </div>

  <h2>Key Metrics</h2>
  <div class="grid3">
    <div class="kpi"><div class="kpi-label">Profit Margin</div><div class="kpi-value blue" style="color:#0ea5e9">${profitMargin}%</div></div>
    <div class="kpi"><div class="kpi-label">Avg Cost per kg</div><div class="kpi-value">${totalCatchAll > 0 ? (totalCostAll / totalCatchAll).toFixed(2) : '0'} ₹</div></div>
    <div class="kpi"><div class="kpi-label">Revenue per kg</div><div class="kpi-value">₹${marketPrice}</div></div>
  </div>
  <div class="footer">Generated by OceanGuard &middot; Projections are based on the current period data &middot; For records and reporting purposes only</div>
</div>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OceanGuard_Fleet_Profit_Statement.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  // ── BOAT ANALYTICS DETAIL VIEW ──────────────────────────────────
  if (selectedBoat) {
    const pieData = [
      { name: "Fuel", value: selectedBoat.fuelCost, color: "hsl(var(--destructive))" },
      { name: "Labor", value: selectedBoat.laborCost, color: "hsl(var(--accent))" },
      { name: "Maintenance", value: selectedBoat.maintenanceCost, color: "hsl(var(--primary))" },
    ].filter((d) => d.value > 0);

    const breakdownData = [
      { label: "Revenue", value: selectedBoat.revenue },
      { label: "Fuel", value: -selectedBoat.fuelCost },
      { label: "Labor", value: -selectedBoat.laborCost },
      { label: "Maintenance", value: -selectedBoat.maintenanceCost },
      { label: "Net Profit", value: selectedBoat.profit },
    ];

    const profitMargin = selectedBoat.revenue > 0
      ? ((selectedBoat.profit / selectedBoat.revenue) * 100).toFixed(1)
      : "0";
    const costPerKg = selectedBoat.fishCaught > 0
      ? (selectedBoat.totalCost / selectedBoat.fishCaught).toFixed(2)
      : "0";
    const revenuePerKg = selectedBoat.fishCaught > 0
      ? (selectedBoat.revenue / selectedBoat.fishCaught).toFixed(2)
      : "0";

    const downloadStatement = (
      boat: BoatResult,
      price: string,
      margin: string,
      cpk: string,
      rpk: string
    ) => {
      const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${boat.name} — Profit Statement</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 32px; color: #1a2340; }
  .card { background: #fff; border-radius: 16px; padding: 32px 36px; max-width: 680px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e8edf5; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 800; color: #0ea5e9; letter-spacing: -0.5px; }
  .brand span { color: #0d1b2e; }
  .title { font-size: 13px; color: #64748b; margin-top: 4px; }
  .date { font-size: 12px; color: #94a3b8; text-align: right; }
  h2 { font-size: 18px; font-weight: 700; margin: 0 0 20px; color: #0d1b2e; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .kpi { background: #f8fafc; border-radius: 10px; padding: 14px 16px; border-left: 4px solid #0ea5e9; }
  .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-value { font-size: 22px; font-weight: 700; color: #0d1b2e; margin-top: 4px; }
  .kpi.accent .kpi-value { color: #10b981; }
  .kpi.danger .kpi-value { color: #ef4444; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .total-row td { font-weight: 700; background: #f0fdf4; color: #10b981; border-top: 2px solid #e8edf5; }
  .total-row.loss td { background: #fef2f2; color: #ef4444; }
  .metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .metric { background: #f8fafc; border-radius: 10px; padding: 12px 14px; text-align: center; }
  .metric-label { font-size: 11px; color: #64748b; }
  .metric-value { font-size: 18px; font-weight: 700; color: #0ea5e9; margin-top: 4px; }
  .footer { font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e8edf5; padding-top: 16px; margin-top: 8px; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div>
      <div class="brand"><span>Ocean</span>Guard</div>
      <div class="title">Profit Statement — ${boat.name}</div>
    </div>
    <div class="date">Generated on<br/><strong>${date}</strong></div>
  </div>
  <h2>Financial Summary</h2>
  <div class="grid">
    <div class="kpi"><div class="kpi-label">Fish Caught</div><div class="kpi-value">${boat.fishCaught.toLocaleString()} kg</div></div>
    <div class="kpi"><div class="kpi-label">Market Price</div><div class="kpi-value">₹${price}/kg</div></div>
    <div class="kpi accent"><div class="kpi-label">Total Revenue</div><div class="kpi-value">₹${boat.revenue.toLocaleString()}</div></div>
    <div class="kpi ${boat.profit < 0 ? "danger" : "accent"}"><div class="kpi-label">Net Profit</div><div class="kpi-value">${boat.profit >= 0 ? "+" : ""}₹${boat.profit.toLocaleString()}</div></div>
  </div>
  <h2>Cost Breakdown</h2>
  <table>
    <thead><tr><th>Item</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>Fish Revenue</td><td style="color:#10b981;font-weight:600">+₹${boat.revenue.toLocaleString()}</td></tr>
      <tr><td>Fuel Cost</td><td style="color:#ef4444">−₹${boat.fuelCost.toLocaleString()}</td></tr>
      <tr><td>Labor Cost</td><td style="color:#ef4444">−₹${boat.laborCost.toLocaleString()}</td></tr>
      <tr><td>Maintenance</td><td style="color:#ef4444">−₹${boat.maintenanceCost.toLocaleString()}</td></tr>
      <tr><td>Total Costs</td><td style="color:#ef4444;font-weight:600">−₹${boat.totalCost.toLocaleString()}</td></tr>
    </tbody>
    <tfoot>
      <tr class="total-row ${boat.profit < 0 ? "loss" : ""}"><td>Net Profit</td><td>${boat.profit >= 0 ? "+" : ""}₹${boat.profit.toLocaleString()}</td></tr>
    </tfoot>
  </table>
  <h2>Profitability Metrics</h2>
  <div class="metrics">
    <div class="metric"><div class="metric-label">Profit Margin</div><div class="metric-value">${margin}%</div></div>
    <div class="metric"><div class="metric-label">Cost per kg</div><div class="metric-value">₹${cpk}</div></div>
    <div class="metric"><div class="metric-label">Revenue per kg</div><div class="metric-value">₹${rpk}</div></div>
  </div>
  <div class="footer">This statement was generated by OceanGuard · For records and reporting purposes only</div>
</div>
</body>
</html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${boat.name.replace(/\s+/g, "_")}_Profit_Statement.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <motion.div
        key="analytics"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        className="mx-auto max-w-5xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedBoatId(null)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Ship className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">{selectedBoat.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Individual Boat Analytics — Market Price ₹{marketPrice}/kg</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Fish Caught", value: `${selectedBoat.fishCaught.toLocaleString()} kg`, icon: Fish, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Revenue", value: `₹${selectedBoat.revenue.toLocaleString()}`, icon: IndianRupee, color: "text-accent", bg: "bg-accent/10" },
            { label: "Total Costs", value: `₹${selectedBoat.totalCost.toLocaleString()}`, icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
            { label: "Net Profit", value: `₹${selectedBoat.profit.toLocaleString()}`, icon: TrendingUp, color: selectedBoat.profit < 0 ? "text-destructive" : "text-accent", bg: selectedBoat.profit < 0 ? "bg-destructive/10" : "bg-accent/10" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="stat-card flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`mt-1 font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cost Breakdown Pie */}
          <div className="stat-card">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Cost Breakdown</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}: ₹{entry.value.toLocaleString()}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">No cost data entered.</div>
            )}
          </div>

          {/* Revenue vs Cost Bar */}
          <div className="stat-card">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Revenue vs Cost vs Profit</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[{ name: selectedBoat.name, Revenue: selectedBoat.revenue, Cost: selectedBoat.totalCost, Profit: Math.max(selectedBoat.profit, 0) }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip
                  formatter={(v: number) => `₹${v.toLocaleString()}`}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Cost" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Profit" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Analysis */}
        <div className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Profitability Analysis</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Profit Margin", value: `${profitMargin}%`, desc: "Net profit as % of revenue", color: "text-accent" },
              { label: "Cost per kg", value: `₹${costPerKg}`, desc: "Avg cost to catch 1 kg", color: "text-destructive" },
              { label: "Revenue per kg", value: `₹${revenuePerKg}`, desc: `Based on ₹${marketPrice}/kg market price`, color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-5">
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className={`mt-2 font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Details Table */}
        <div className="stat-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Full Cost Details</h3>
          <div className="space-y-3">
            {[
              { icon: IndianRupee, label: "Fish Revenue", value: `+₹${selectedBoat.revenue.toLocaleString()}`, color: "text-accent" },
              { icon: Fuel, label: "Fuel Cost", value: `-₹${selectedBoat.fuelCost.toLocaleString()}`, color: "text-destructive" },
              { icon: Users, label: "Labor Cost", value: `-₹${selectedBoat.laborCost.toLocaleString()}`, color: "text-destructive" },
              { icon: Wrench, label: "Maintenance", value: `-₹${selectedBoat.maintenanceCost.toLocaleString()}`, color: "text-destructive" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <row.icon className="h-4 w-4 text-muted-foreground" />
                  {row.label}
                </div>
                <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
              <span className="text-sm font-bold text-foreground">Net Profit</span>
              <span className={`text-sm font-bold ${selectedBoat.profit < 0 ? "text-destructive" : "text-accent"}`}>
                {selectedBoat.profit >= 0 ? "+" : ""}₹{selectedBoat.profit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Download Profit Statement */}
        <div className="stat-card border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Download Your Profit Statement</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get a complete profit statement for <span className="font-medium text-foreground">{selectedBoat.name}</span> as a downloadable report — handy for records, sharing, or printing.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Fish Revenue", "Cost Breakdown", "Profit Margin", "Cost per kg"].map((tag) => (
                    <span key={tag} className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => downloadStatement(selectedBoat, marketPrice, profitMargin, costPerKg, revenuePerKg)}
              className="ocean-button shrink-0 gap-2"
            >
              <Download className="h-4 w-4" />
              Download Statement
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── CALCULATOR + RESULTS VIEW ────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="stat-card space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Multi-Boat Profit Calculator</h3>

        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Current Fish Market Price (₹/kg)</label>
          <input
            type="number" step="any" required value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
            className={inputClass} placeholder="e.g. 5.50"
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Boats ({boats.length})</p>
            <button type="button" onClick={addBoat} className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              <Plus className="h-3.5 w-3.5" /> Add Boat
            </button>
          </div>

          <AnimatePresence initial={false}>
            {boats.map((boat, i) => {
              const boatResult = results?.find((r) => r.id === boat.id);
              return (
                <motion.div
                  key={boat.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`rounded-2xl border p-4 transition-colors ${boatResult ? "border-primary/30 bg-primary/5 hover:border-primary/50" : "border-border bg-muted/30"}`}>
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => { if (boatResult) setSelectedBoatId(boat.id); }}
                        className={`flex items-center gap-2 text-sm font-semibold transition-colors ${boatResult ? "cursor-pointer text-primary hover:text-primary/80" : "cursor-default text-foreground"}`}
                      >
                        <Ship className="h-4 w-4 text-primary" />
                        {boat.name || `Boat ${i + 1}`}
                        {boatResult && (
                          <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            View Analytics <ChevronRight className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                      {boats.length > 1 && (
                        <button type="button" onClick={() => removeBoat(boat.id)} className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {boatResult && (
                      <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
                        <span className="text-accent font-medium">Revenue: ₹{boatResult.revenue.toLocaleString()}</span>
                        <span className="text-destructive font-medium">Cost: ₹{boatResult.totalCost.toLocaleString()}</span>
                        <span className={boatResult.profit < 0 ? "text-destructive font-bold" : "text-accent font-bold"}>
                          Profit: ₹{boatResult.profit.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Boat Name</label>
                        <input type="text" value={boat.name} onChange={(e) => updateBoat(boat.id, "name", e.target.value)} className={inputClass} placeholder={`Boat ${i + 1}`} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Fish Caught (kg)</label>
                        <input type="number" step="any" required value={boat.fishCaught} onChange={(e) => updateBoat(boat.id, "fishCaught", e.target.value)} className={inputClass} placeholder="0" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Fuel Cost (₹)</label>
                        <input type="number" step="any" required value={boat.fuelCost} onChange={(e) => updateBoat(boat.id, "fuelCost", e.target.value)} className={inputClass} placeholder="0" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Labor Cost (₹)</label>
                        <input type="number" step="any" required value={boat.laborCost} onChange={(e) => updateBoat(boat.id, "laborCost", e.target.value)} className={inputClass} placeholder="0" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Maintenance (₹)</label>
                        <input type="number" step="any" required value={boat.maintenanceCost} onChange={(e) => updateBoat(boat.id, "maintenanceCost", e.target.value)} className={inputClass} placeholder="0" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button type="submit" className="ocean-button">Calculate All Profits</button>
      </motion.form>

      {/* Overview Results */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Catch", value: `${totalCatch.toLocaleString()} kg` },
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
              { label: "Total Net Profit", value: `₹${totalProfit.toLocaleString()}`, highlight: totalProfit < 0 },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card text-center">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`mt-1 font-display text-2xl font-bold ${s.highlight ? "text-destructive" : "text-foreground"}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="stat-card">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Profit Comparison by Boat</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip
                  formatter={(v: number) => `₹${v.toLocaleString()}`}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Cost" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Profit" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
