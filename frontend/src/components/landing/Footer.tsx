import { Link } from "react-router-dom";
import { OceanGuardLogo } from "../OceanGuardLogo";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Dashboard", "API"],
  Company: ["About", "Contact", "Careers", "Blog"],
  Legal: ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <OceanGuardLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Predict Marine Risk. Optimize Revenue. Empower Fisheries.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary hover:bg-muted">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OceanGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
