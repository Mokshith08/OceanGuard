import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle, Info, Wind, Waves, Thermometer, CloudRain, ShieldCheck } from "lucide-react";

// Predefined risk logic
const riskColors: Record<string, { bg: string; text: string; icon: typeof AlertTriangle; suggestion: string }> = {
  Low: { bg: "bg-accent/10", text: "text-accent", icon: CheckCircle, suggestion: "Optimal conditions for all marine operations." },
  Medium: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: Info, suggestion: "Proceed with caution. Monitor weather updates closely." },
  High: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle, suggestion: "Critical conditions. Suspend operations immediately." },
};

export default function RiskPredictionPage() {
  const [analyzing, setAnalyzing] = useState(true);
  const [telemetry, setTelemetry] = useState<{
    windSpeed: number;
    waveHeight: number;
    seaTemp: number;
    rainfall: number;
  }>({
    windSpeed: 0,
    waveHeight: 0,
    seaTemp: 0,
    rainfall: 0,
  });

  const [result, setResult] = useState<{ category: string; probability: number } | null>(null);
  const [scanSteps, setScanSteps] = useState(0);

  useEffect(() => {
    // Simulate real-time data streaming
    const interval = setInterval(() => {
      if (analyzing) {
        setTelemetry({
          windSpeed: Math.floor(Math.random() * 40) + 10,
          waveHeight: +(Math.random() * 4 + 0.5).toFixed(1),
          seaTemp: +(Math.random() * 15 + 10).toFixed(1),
          rainfall: +(Math.random() * 50).toFixed(1),
        });
      }
    }, 800);

    // Simulate step-by-step AI connection processing
    const stepInterval = setInterval(() => {
      setScanSteps(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    // Simulate final ML resolution after 6 seconds
    const timeout = setTimeout(() => {
      setAnalyzing(false);
      clearInterval(interval);
      clearInterval(stepInterval);
      
      // Calculate a pseudo-realistic risk based on the final telemetry values
      let riskLevel = "Low";
      let baseProb = Math.floor(Math.random() * 20) + 10; // 10-30%

      if (telemetry.windSpeed > 35 || telemetry.waveHeight > 3.0) {
        riskLevel = "High";
        baseProb = Math.floor(Math.random() * 20) + 75; // 75-95%
      } else if (telemetry.windSpeed > 20 || telemetry.waveHeight > 1.8 || telemetry.rainfall > 20) {
        riskLevel = "Medium";
        baseProb = Math.floor(Math.random() * 30) + 40; // 40-70%
      }

      setResult({ category: riskLevel, probability: baseProb });
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, []);

  const rc = result ? riskColors[result.category] : null;

  const telemetryItems = [
    { label: "Wind Speed", value: `${telemetry.windSpeed} km/h`, icon: Wind },
    { label: "Wave Height", value: `${telemetry.waveHeight} m`, icon: Waves },
    { label: "Sea Temp", value: `${telemetry.seaTemp} °C`, icon: Thermometer },
    { label: "Loc. Precipitation", value: `${telemetry.rainfall} mm`, icon: CloudRain },
  ];

  const analysisSteps = [
    "Establishing connection to oceanic buoys...",
    "Synchronizing satellite weather telemetry...",
    "Running multi-variate ML threat analysis...",
    "Finalizing regional risk probability...",
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Automated Telemetry Dashboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> 
            Live Environmental Intelligence
          </h3>
          {analyzing ? (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Acquiring Uplink Data
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              Snapshot Captured
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {telemetryItems.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <div className="mt-0.5 font-display text-lg font-bold text-foreground overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={item.value}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      {item.value}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Processing Status */}
      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-sm"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h4 className="mt-6 font-display text-xl font-semibold text-foreground">OceanGuard AI Active</h4>
            
            <div className="mt-4 h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={scanSteps}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {analysisSteps[scanSteps]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            {/* Fake progress bar */}
            <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-muted">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${(scanSteps + 1) * 25}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>
        ) : (
          result && rc && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="stat-card"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${rc.bg}`}>
                    <rc.icon className={`h-8 w-8 ${rc.text}`} />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">Automated Risk Assessment</h2>
                    <p className={`mt-1 font-display text-3xl font-bold ${rc.text}`}>{result.category} Risk</p>
                    <p className="mt-1 text-sm text-foreground">{rc.suggestion}</p>
                  </div>
                </div>
                
                <div className="min-w-[200px] rounded-xl bg-muted/50 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Probability Confidence</span>
                    <span className="font-bold text-foreground">{result.probability}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-background border border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probability}%` }}
                      transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`h-full rounded-full ${result.category === "High" ? "bg-destructive" : result.category === "Medium" ? "bg-yellow-500" : "bg-accent"}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-accent" />
                  Model validated against recent oceanic patterns.
                </p>
                <button onClick={() => { setAnalyzing(true); setScanSteps(0); setResult(null); }} className="text-xs font-semibold text-primary hover:underline">
                  Re-run Analysis
                </button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
