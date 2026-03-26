import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Brain, Calculator, LayoutDashboard, Shield, Ship, Radar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as const;

const services = [
  { icon: Brain, title: "AI Risk Prediction", desc: "Advanced machine learning models analyze weather, sea conditions, and historical data to predict marine risks before they happen." },
  { icon: Calculator, title: "Revenue Optimization", desc: "Dynamic profit calculators factor in catch rates, fuel, labor, and market prices for real-time financial insights." },
  { icon: LayoutDashboard, title: "Organization Analytics", desc: "Comprehensive dashboards for fleet managers with region-wise performance, risk trends, and revenue analytics." },
  { icon: Shield, title: "Secure Platform", desc: "Enterprise-grade security with 2FA authentication, encrypted data, and role-based access controls." },
  { icon: Ship, title: "Fleet Management", desc: "Track and manage multiple boats, assign resources, and optimize fleet utilization across regions." },
  { icon: Radar, title: "Real-time Monitoring", desc: "Live monitoring of marine conditions with instant alerts for dangerous weather patterns." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-16">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" className="text-center">
              <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Our <span className="ocean-gradient-text">Services</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-muted-foreground">
                Comprehensive marine intelligence tools for modern fisheries.
              </motion.p>
            </motion.div>
            <motion.div initial="hidden" animate="visible" className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div key={s.title} variants={fadeUp} custom={i + 2} className="glass-card p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <s.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
