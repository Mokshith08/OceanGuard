import { motion } from "framer-motion";
import { History, AlertTriangle, CheckCircle, Info } from "lucide-react";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function RiskHistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchApi("/risk/history");
        const records = res.data?.records || [];
        setHistoryData(records.map((r: any) => ({
          date: new Date(r.createdAt).toLocaleDateString(),
          location: r.city,
          risk: r.risk === "Safe" ? "Low" : (r.risk === "High Risk" ? "High" : r.risk),
          probability: r.risk === "Safe" ? 85 : 95,
          windSpeed: r.mlInput?.[0] || 0,
          waveHeight: +(r.mlInput?.[1] || 0).toFixed(1)
        })));
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const riskIcon: Record<string, any> = { Low: CheckCircle, Medium: Info, High: AlertTriangle };
  const riskStyle: Record<string, string> = { Low: "text-accent bg-accent/10", Medium: "text-yellow-500 bg-yellow-500/10", High: "text-destructive bg-destructive/10" };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Risk Assessment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Risk Level</th>
                <th className="pb-3 font-medium">Probability</th>
                <th className="pb-3 font-medium">Wind Speed</th>
                <th className="pb-3 font-medium">Wave Height</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, i) => {
                const Icon = riskIcon[row.risk] || Info;
                const style = riskStyle[row.risk] || riskStyle.Medium;
                return (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50">
                    <td className="py-3.5 text-foreground">{row.date}</td>
                    <td className="py-3.5 text-foreground">{row.location}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${style}`}>
                        <Icon className="h-3 w-3" /> {row.risk}
                      </span>
                    </td>
                    <td className="py-3.5 text-foreground">{row.probability}%</td>
                    <td className="py-3.5 text-muted-foreground">{row.windSpeed} km/h</td>
                    <td className="py-3.5 text-muted-foreground">{row.waveHeight} m</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
