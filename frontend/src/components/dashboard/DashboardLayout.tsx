import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Brain, Calculator, History, BarChart3,
  CreditCard, Settings, ChevronLeft, ChevronRight, LogOut,
  Bell, User, Download, FileText, X, Menu,
} from "lucide-react";
import { OceanGuardLogo } from "@/components/OceanGuardLogo";
import { ThemeToggle } from "@/hooks/useTheme";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Brain, label: "Risk Prediction", href: "/dashboard/risk" },
  { icon: Calculator, label: "Profit Calculator", href: "/dashboard/profit" },
  { icon: History, label: "Risk History", href: "/dashboard/history" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/subscription" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function downloadFleetStatement() {
  const raw = localStorage.getItem("og_fleet_results");
  if (!raw) return alert("No statement available. Please calculate profits first in the Profit Calculator.");
  const { marketPrice, results } = JSON.parse(raw);
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const totalFuel = results.reduce((s: number, r: any) => s + r.fuelCost, 0);
  const totalLabor = results.reduce((s: number, r: any) => s + r.laborCost, 0);
  const totalMaint = results.reduce((s: number, r: any) => s + r.maintenanceCost, 0);
  const totalCostAll = results.reduce((s: number, r: any) => s + r.totalCost, 0);
  const netProfit = results.reduce((s: number, r: any) => s + r.profit, 0);
  const totalRev = results.reduce((s: number, r: any) => s + r.revenue, 0);
  const totalCatchAll = results.reduce((s: number, r: any) => s + r.fishCaught, 0);
  const profitMargin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : "0";
  const boatRows = results.map((r: any) => `
    <tr>
      <td>${r.name}</td><td>${r.fishCaught.toLocaleString()} kg</td>
      <td>₹${r.revenue.toLocaleString()}</td><td>₹${r.totalCost.toLocaleString()}</td>
      <td style="color:${r.profit < 0 ? "#ef4444" : "#10b981"};font-weight:600">${r.profit >= 0 ? "+" : ""}₹${r.profit.toLocaleString()}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>OceanGuard Fleet Profit Statement</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f6fb;margin:0;padding:32px;color:#1a2340}
  .card{background:#fff;border-radius:16px;padding:32px 36px;max-width:760px;margin:0 auto 24px;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e8edf5;padding-bottom:20px;margin-bottom:24px}
  .brand{font-size:22px;font-weight:800;color:#0ea5e9}.brand span{color:#0d1b2e}
  .sub{font-size:12px;color:#64748b;margin-top:4px}.date{font-size:12px;color:#94a3b8;text-align:right}
  h2{font-size:16px;font-weight:700;color:#0d1b2e;margin:0 0 16px;border-left:4px solid #0ea5e9;padding-left:12px}
  .grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:24px}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px}
  .kpi{background:#f8fafc;border-radius:10px;padding:14px 16px}
  .kpi-label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px}
  .kpi-value{font-size:20px;font-weight:700;color:#0d1b2e;margin-top:4px}
  .kpi.green .kpi-value{color:#10b981}.kpi.red .kpi-value{color:#ef4444}.kpi.blue .kpi-value{color:#0ea5e9}
  table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:13px}
  th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px}
  td{padding:11px 12px;border-bottom:1px solid #f1f5f9}
  .tr td{font-weight:700;color:#10b981;background:#f0fdf4;border-top:2px solid #e8edf5}
  .footer{font-size:11px;color:#94a3b8;text-align:center;padding-top:16px;border-top:1px solid #e8edf5}
</style></head><body>
<div class="card">
  <div class="header">
    <div><div class="brand"><span>Ocean</span>Guard</div><div class="sub">Fleet Profit Statement — All Boats</div></div>
    <div class="date">Generated on<br/><strong>${date}</strong><br/><br/>Market Price: <strong>₹${marketPrice}/kg</strong></div>
  </div>
  <h2>Fleet Summary (Current Period)</h2>
  <div class="grid4">
    <div class="kpi"><div class="kpi-label">Total Catch</div><div class="kpi-value">${totalCatchAll.toLocaleString()} kg</div></div>
    <div class="kpi blue"><div class="kpi-label">Total Revenue</div><div class="kpi-value">₹${totalRev.toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Total Costs</div><div class="kpi-value">₹${totalCostAll.toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? "red" : "green"}"><div class="kpi-label">Net Profit</div><div class="kpi-value">${netProfit >= 0 ? "+" : ""}₹${netProfit.toLocaleString()}</div></div>
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
    <tfoot><tr class="tr"><td>TOTAL FLEET</td><td>${totalCatchAll.toLocaleString()} kg</td><td>₹${totalRev.toLocaleString()}</td><td>₹${totalCostAll.toLocaleString()}</td><td>${netProfit >= 0 ? "+" : ""}₹${netProfit.toLocaleString()}</td></tr></tfoot>
  </table>
</div>
<div class="card">
  <h2>Monthly Projection</h2>
  <div class="grid3">
    <div class="kpi blue"><div class="kpi-label">Monthly Revenue</div><div class="kpi-value">₹${totalRev.toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Monthly Costs</div><div class="kpi-value">₹${totalCostAll.toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? "red" : "green"}"><div class="kpi-label">Monthly Profit</div><div class="kpi-value">${netProfit >= 0 ? "+" : ""}₹${netProfit.toLocaleString()}</div></div>
  </div>
  <h2>Yearly Projection (×12 Months)</h2>
  <div class="grid3">
    <div class="kpi blue"><div class="kpi-label">Yearly Revenue</div><div class="kpi-value">₹${(totalRev * 12).toLocaleString()}</div></div>
    <div class="kpi red"><div class="kpi-label">Yearly Costs</div><div class="kpi-value">₹${(totalCostAll * 12).toLocaleString()}</div></div>
    <div class="kpi ${netProfit < 0 ? "red" : "green"}"><div class="kpi-label">Yearly Profit</div><div class="kpi-value">${netProfit >= 0 ? "+" : ""}₹${(netProfit * 12).toLocaleString()}</div></div>
  </div>
  <h2>Key Metrics</h2>
  <div class="grid3">
    <div class="kpi"><div class="kpi-label">Profit Margin</div><div class="kpi-value" style="color:#0ea5e9">${profitMargin}%</div></div>
    <div class="kpi"><div class="kpi-label">Avg Cost per kg</div><div class="kpi-value">₹${totalCatchAll > 0 ? (totalCostAll / totalCatchAll).toFixed(2) : "0"}</div></div>
    <div class="kpi"><div class="kpi-label">Revenue per kg</div><div class="kpi-value">₹${marketPrice}</div></div>
  </div>
  <div class="footer">Generated by OceanGuard · Projections based on current period data · For records and reporting purposes only</div>
</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "OceanGuard_Fleet_Profit_Statement.html";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasStatement = !!localStorage.getItem("og_fleet_results");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Mobile */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/50 bg-card transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:w-auto"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <OceanGuardLogo collapsed={collapsed} />
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 lg:ml-0 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {menuItems.find((m) => m.href === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile button + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl p-2 hover:bg-muted transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
                  >
                    {/* Profile header */}
                    <div className="border-b border-border/50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Fisherman</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                          </div>
                        </div>
                        <button onClick={() => setProfileOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Download Statement */}
                    <div className="p-2">
                      <button
                        onClick={() => { downloadFleetStatement(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Download Statement</p>
                          <p className="text-xs text-muted-foreground">
                            {hasStatement ? "Monthly & yearly profit report" : "Calculate profits first"}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </button>

                      <div className="my-1 border-t border-border/50" />

                      <Link
                        to="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">Settings</span>
                      </Link>

                      <Link
                        to="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-destructive/10 group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-destructive">Logout</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
