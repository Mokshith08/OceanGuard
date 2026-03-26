import { motion } from "framer-motion";
import { History, AlertTriangle, CheckCircle, Info } from "lucide-react";

const historyData = [
  { date: "2026-02-16", location: "Bay of Bengal", risk: "High", probability: 82, windSpeed: 45, waveHeight: 4.2 },
  { date: "2026-02-15", location: "Arabian Sea", risk: "Low", probability: 18, windSpeed: 12, waveHeight: 1.1 },
  { date: "2026-02-14", location: "Pacific Coast", risk: "Medium", probability: 55, windSpeed: 28, waveHeight: 2.8 },
  { date: "2026-02-13", location: "Bay of Bengal", risk: "Low", probability: 22, windSpeed: 15, waveHeight: 1.3 },
  { date: "2026-02-12", location: "Indian Ocean", risk: "High", probability: 78, windSpeed: 42, waveHeight: 3.9 },
  { date: "2026-02-11", location: "Arabian Sea", risk: "Medium", probability: 48, windSpeed: 25, waveHeight: 2.5 },
];

const riskIcon = { Low: CheckCircle, Medium: Info, High: AlertTriangle };
const riskStyle = { Low: "text-accent bg-accent/10", Medium: "text-yellow-500 bg-yellow-500/10", High: "text-destructive bg-destructive/10" };

export default function RiskHistoryPage() {
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
                const Icon = riskIcon[row.risk as keyof typeof riskIcon];
                const style = riskStyle[row.risk as keyof typeof riskStyle];
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
