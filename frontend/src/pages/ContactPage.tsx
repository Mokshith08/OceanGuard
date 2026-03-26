import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as const;

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-16">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" className="text-center">
              <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Get in <span className="ocean-gradient-text">Touch</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-muted-foreground">
                We'd love to hear from you. Reach out anytime.
              </motion.p>
            </motion.div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <motion.form initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: "Name", key: "name" as const, type: "text" },
                  { label: "Email", key: "email" as const, type: "email" },
                ].map((field, i) => (
                  <motion.div key={field.key} variants={fadeUp} custom={i + 2}>
                    <label className="mb-2 block text-sm font-medium text-foreground">{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} custom={4}>
                  <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </motion.div>
                <motion.div variants={fadeUp} custom={5}>
                  <button type="submit" className="ocean-button w-full">Send Message</button>
                </motion.div>
              </motion.form>

              <motion.div initial="hidden" animate="visible" className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "contact@oceanguard.in" },
                  { icon: Phone, label: "Phone", value: "+91 9876543210" },
                  { icon: MapPin, label: "Address", value: "Bangaalore, Karnataka, India" },
                ].map((item, i) => (
                  <motion.div key={item.label} variants={fadeUp} custom={i + 2} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground">{item.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
