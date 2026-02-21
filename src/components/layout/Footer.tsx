import { Link } from "react-router-dom";
import { Stethoscope, Heart, AlertTriangle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterProps {
  showDisclaimer?: boolean;
}

export function Footer({ showDisclaimer = true }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        {showDisclaimer && (
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-medical-warning/10 to-medical-coral/10 border border-medical-warning/20 p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medical-warning/20">
              <AlertTriangle className="h-5 w-5 text-medical-warning" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">{t('disclaimer')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('disclaimerFooterText')}{' '}
                <strong className="text-foreground">{t('disclaimerFooterBold')}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
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
              {t('footerDescription')}
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

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/symptoms" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('symptomsChecker')}</Link></li>
              <li><Link to="/ai-doctor" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('aiDoctor')}</Link></li>
              <li><Link to="/ai-analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('imageAnalysis')}</Link></li>
              <li><Link to="/medicines" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('medicines')}</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('aboutUs')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t('emergency')}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/hospitals" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('pharmaciesHospitals')}</Link></li>
              <li><a href="tel:103" className="text-sm text-accent font-semibold hover:underline">{t('callEmergency')}</a></li>
              <li><a href="tel:112" className="text-sm text-accent font-semibold hover:underline">{t('generalEmergency')}: 112</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedAI+. {t('forInfoOnly')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('madeWithLove')}
          </p>
        </div>
      </div>
    </footer>
  );
}