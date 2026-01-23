import { Link } from "react-router-dom";
import { Stethoscope, Heart, AlertTriangle, Github, Mail } from "lucide-react";

interface FooterProps {
  showDisclaimer?: boolean;
}

export function Footer({ showDisclaimer = true }: FooterProps) {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        {/* Disclaimer Banner - Only at footer */}
        {showDisclaimer && (
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-medical-warning/10 to-medical-coral/10 border border-medical-warning/20 p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medical-warning/20">
              <AlertTriangle className="h-5 w-5 text-medical-warning" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This website provides general health information for educational purposes only. 
                It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare 
                provider for medical concerns. <strong className="text-foreground">If your condition worsens, seek immediate medical attention.</strong>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-lg">
                <Stethoscope className="h-6 w-6" />
                <Heart className="absolute -right-1 -top-1 h-4 w-4 text-accent" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                MedAI<span className="text-gradient">+</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
              AI-powered health information assistant. Get preliminary insights about symptoms, 
              conditions, and medications. Always consult a doctor for proper medical advice.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:contact@medai.kz"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/symptoms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Symptoms Checker</Link></li>
              <li><Link to="/ai-doctor" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Doctor</Link></li>
              <li><Link to="/ai-analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors">Image Analysis</Link></li>
              <li><Link to="/medicines" className="text-sm text-muted-foreground hover:text-primary transition-colors">Medicine Shop</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Emergency</h4>
            <ul className="space-y-2.5">
              <li><Link to="/hospitals" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pharmacies & Hospitals</Link></li>
              <li><a href="tel:103" className="text-sm text-accent font-semibold hover:underline">Emergency: 103</a></li>
              <li><a href="tel:112" className="text-sm text-accent font-semibold hover:underline">General: 112</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedAI+. For informational purposes only.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ by NIS IB Team
          </p>
        </div>
      </div>
    </footer>
  );
}
