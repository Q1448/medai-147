import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Brain, Shield, Infinity, Star, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";

export default function Premium() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [authOpen, setAuthOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const features = [
    { icon: Infinity, text: t('premiumFeature1') },
    { icon: Brain, text: t('premiumFeature2') },
    { icon: Zap, text: t('premiumFeature3') },
    { icon: Shield, text: t('premiumFeature4') },
    { icon: Star, text: t('premiumFeature5') },
  ];

  const handlePurchase = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setProcessing(true);
    // For now show coming soon - Stripe integration needed
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: t('premiumComingSoon'),
        description: t('premiumComingSoonDesc'),
      });
    }, 1500);
  };

  return (
    <Layout>
      <SEOHead title="Premium" description="Upgrade to MedAI+ Premium for unlimited access" path="/premium" />
      <div className="container py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-sm font-semibold mb-6">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">MedAI+ Premium</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('premiumTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">{t('premiumDesc')}</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 p-8 md:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 px-4 py-2 rounded-bl-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold">
              PREMIUM
            </div>

            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-display text-5xl font-bold text-foreground">5 000</span>
                <span className="text-xl text-muted-foreground">₸</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('perMonth')}</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <f.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handlePurchase}
              disabled={processing}
              className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all"
            >
              {processing ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  {user ? t('purchasePremium') : t('loginToPurchase')}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              {t('securePayment')}
            </p>
          </div>

          {/* Free vs Premium comparison */}
          <div className="mt-10 glass-card p-6 rounded-3xl">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">{t('freeVsPremium')}</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-muted-foreground">{t('feature')}</div>
              <div className="text-center font-semibold text-muted-foreground">Free</div>
              <div className="text-center font-semibold text-amber-600 dark:text-amber-400">Premium</div>

              <div className="text-foreground">{t('symptoms')}</div>
              <div className="text-center text-muted-foreground">3/{t('dayUnit')}</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center"><Infinity className="h-4 w-4" /></div>

              <div className="text-foreground">{t('aiDoctor')}</div>
              <div className="text-center text-muted-foreground">5/{t('dayUnit')}</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center"><Infinity className="h-4 w-4" /></div>

              <div className="text-foreground">{t('aiAnalysis')}</div>
              <div className="text-center text-muted-foreground">3/{t('dayUnit')}</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center"><Infinity className="h-4 w-4" /></div>

              <div className="text-foreground">{t('aiModel')}</div>
              <div className="text-center text-muted-foreground">Standard</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1"><Star className="h-3 w-3" /> Pro</div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </Layout>
  );
}
