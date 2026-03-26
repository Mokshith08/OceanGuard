import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, AlertTriangle, TrendingDown, BarChart3, Database, Brain, Calculator, LayoutDashboard, Shield, CreditCard, Check } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const problems = [
  { icon: AlertTriangle, title: "Marine Risk Uncertainty", desc: "Unpredictable weather and sea conditions lead to dangerous and costly fishing trips." },
  { icon: TrendingDown, title: "Financial Instability", desc: "Volatile market prices and unoptimized operations erode profit margins." },
  { icon: BarChart3, title: "Lack of Analytics", desc: "Decisions are made on intuition instead of data-driven insights." },
];

const steps = [
  { step: "01", title: "Enter Marine Data", desc: "Input weather, sea conditions, and operational parameters into the platform.", icon: Database },
  { step: "02", title: "AI Predicts Risk", desc: "Our ML models analyze patterns to predict risk levels with high accuracy.", icon: Brain },
  { step: "03", title: "Analyze & Optimize", desc: "Calculate profits, view trends, and make data-driven decisions.", icon: Calculator },
];

const features = [
  { icon: Brain, title: "AI Risk Prediction", desc: "Machine learning models trained on marine data for accurate risk assessment." },
  { icon: Calculator, title: "Revenue Calculator", desc: "Estimate catch, revenue, and net profit with dynamic market variables." },
  { icon: LayoutDashboard, title: "Analytics Dashboard", desc: "Rich charts and KPIs for organizations to monitor fleet performance." },
  { icon: Shield, title: "Secure 2FA Login", desc: "Two-factor OTP verification ensures your data stays protected." },
  { icon: CreditCard, title: "Subscription SaaS", desc: "Flexible plans from Free to Enterprise to fit any operation size." },
  { icon: BarChart3, title: "Trend Analysis", desc: "Historical risk and profit trends to plan for seasonal variations." },
];

const pricing = [
  { name: "Free", price: "₹0", period: "/month", features: ["Basic risk prediction", "5 calculations/day", "1 user", "Email support"], highlighted: false },
  { name: "Pro", price: "₹49", period: "/month", features: ["Advanced AI models", "Unlimited calculations", "5 users", "Priority support", "Analytics dashboard", "Export reports"], highlighted: true },
  { name: "Enterprise", price: "₹199", period: "/month", features: ["Custom ML models", "Unlimited everything", "Unlimited users", "Dedicated support", "Organization panel", "API access", "Custom integrations"], highlighted: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-background/50 dark:bg-transparent">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-15 dark:opacity-50 grayscale-[0.2] dark:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background dark:from-background/30 dark:via-background/60 dark:to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Marine Intelligence
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Smarter Decisions for{" "}
              <span className="ocean-gradient-text">Safer Seas</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              OceanGuard uses advanced AI to predict marine risks, optimize fishing revenue, and empower fisheries with actionable analytics.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/signup" className="ocean-button text-base">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="ocean-button-outline text-base">
                <Play className="h-4 w-4" /> View Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              The Challenge
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-muted-foreground">
              Fisheries face critical operational challenges every day.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 grid gap-8 md:grid-cols-3">
            {problems.map((p, i) => (
              <motion.div key={p.title} variants={fadeUp} custom={i + 2} className="glass-card p-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <p.icon className="h-7 w-7 text-destructive" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How OceanGuard Works
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} custom={i + 1} className="relative glass-card p-8 text-center">
                <span className="font-display text-5xl font-bold text-primary/10">{s.step}</span>
                <div className="mx-auto my-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Powerful Features
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-muted-foreground">
              Everything you need to manage marine operations intelligently.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i + 2} className="glass-card p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Simple Pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-muted-foreground">
              Start free, scale as you grow.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 grid gap-8 md:grid-cols-3">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                custom={i + 2}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "ocean-button"
                      : "ocean-button-outline"
                  }`}
                >
                  {plan.highlighted ? "Start Free Trial" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
