import { Link } from "react-router-dom";
import { Stethoscope, Heart, AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        {/* Disclaimer Banner */}
        <div className="mb-8 rounded-2xl bg-medical-warning/10 border border-medical-warning/20 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-medical-warning shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">
            <strong>Medical Disclaimer:</strong> This website provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare 
            provider for medical concerns. In case of emergency, call emergency services immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Stethoscope className="h-5 w-5" />
                <Heart className="absolute -right-1 -top-1 h-3.5 w-3.5 text-accent" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                MedAI<span className="text-primary">+</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI-powered health information assistant. Get preliminary insights about symptoms, 
              conditions, and medications. Always consult a doctor for proper medical advice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/symptoms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Symptoms Checker</Link></li>
              <li><Link to="/ai-doctor" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Doctor</Link></li>
              <li><Link to="/ai-analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors">Image Analysis</Link></li>
              <li><Link to="/medicines" className="text-sm text-muted-foreground hover:text-primary transition-colors">Medicine Guide</Link></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Emergency</h4>
            <ul className="space-y-2">
              <li><Link to="/hospitals" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hospital Contacts</Link></li>
              <li><a href="tel:103" className="text-sm text-accent font-medium hover:underline">Emergency: 103</a></li>
              <li><a href="tel:112" className="text-sm text-accent font-medium hover:underline">General: 112</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedAI+. For informational purposes only. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
