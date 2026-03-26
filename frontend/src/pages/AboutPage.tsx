import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Waves, Target, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-16">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
              <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                About <span className="ocean-gradient-text">OceanGuard</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg leading-relaxed text-muted-foreground">
                We're on a mission to make the world's oceans safer and fisheries more profitable through the power of artificial intelligence.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" className="mt-20 grid gap-8 md:grid-cols-3">
              {[
                { icon: Waves, title: "Our Mission", desc: "To revolutionize marine operations with AI-driven insights that protect lives and optimize revenue for fishing communities worldwide." },
                { icon: Target, title: "Our Vision", desc: "A world where every fishing operation is guided by intelligent analytics, reducing risk and maximizing sustainable outcomes." },
                { icon: Users, title: "Our Team", desc: "A diverse team of marine scientists, AI engineers, and fisheries experts working together to build the future of ocean intelligence." },
              ].map((item, i) => (
                <motion.div key={item.title} variants={fadeUp} custom={i + 2} className="glass-card p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
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
