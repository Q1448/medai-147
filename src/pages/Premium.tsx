import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Brain, Shield, Infinity, Star, CheckCircle2, Loader2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

type PlanKey = "monthly" | "semiannual" | "annual";

export default function Premium() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [authOpen, setAuthOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("monthly");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "🎉 " + t('premiumActivated'), description: t('premiumActivatedDesc') });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    const checkSub = async () => {
      try {
        const { data } = await supabase.functions.invoke("check-subscription");
        if (data?.subscribed) {
          setSubscribed(true);
          setSubscriptionEnd(data.subscription_end);
        }
      } catch {}
    };
    checkSub();
    const interval = setInterval(checkSub, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const features = [
    { icon: Infinity, text: t('premiumFeature1') },
    { icon: Brain, text: t('premiumFeature2') },
    { icon: Zap, text: t('premiumFeature3') },
    { icon: Shield, text: t('premiumFeature4') },
    { icon: Star, text: t('premiumFeature5') },
    { icon: Users, text: t('premiumFeature6') },
  ];

  const plans: { key: PlanKey; price: string; priceNum: number; period: string; originalPrice?: string; badge?: string }[] = [
    { key: "monthly", price: "5 000", priceNum: 5000, period: t('perMonth') },
    { key: "semiannual", price: "25 000", priceNum: 25000, period: t('per6Months'), originalPrice: "30 000", badge: t('save17') },
    { key: "annual", price: "50 000", priceNum: 50000, period: t('perYear'), originalPrice: "60 000", badge: t('save17') },
  ];

  const handlePurchase = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: selectedPlan },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleManage = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
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

        {/* Plan Selector */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-muted/50">
            {plans.map((plan) => (
              <button
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative px-3 py-3 rounded-xl text-center transition-all ${
                  selectedPlan === plan.key
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedPlan === plan.key ? "bg-white text-amber-600" : "bg-amber-500 text-white"
                  }`}>
                    {plan.badge}
                  </span>
                )}
                <div className="text-xs font-medium">{t(`plan_${plan.key}`)}</div>
                <div className="text-sm font-bold mt-0.5">{plan.price} ₸</div>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 p-8 md:p-10 shadow-2xl">
            {subscribed && (
              <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t('premiumActive')} {subscriptionEnd && `— ${new Date(subscriptionEnd).toLocaleDateString()}`}
              </div>
            )}
            <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold ${subscribed ? 'hidden' : ''}`}>
              PREMIUM
            </div>

            <div className={`text-center mb-8 ${subscribed ? 'mt-6' : ''}`}>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-display text-5xl font-bold text-foreground">
                  {plans.find(p => p.key === selectedPlan)?.price}
                </span>
                <span className="text-xl text-muted-foreground">₸</span>
              </div>
              {plans.find(p => p.key === selectedPlan)?.originalPrice && (
                <p className="text-sm text-muted-foreground line-through mb-1">
                  {plans.find(p => p.key === selectedPlan)?.originalPrice} ₸
                </p>
              )}
              <p className="text-sm text-muted-foreground">{plans.find(p => p.key === selectedPlan)?.period}</p>
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

            {subscribed ? (
              <Button
                onClick={handleManage}
                disabled={processing}
                className="w-full h-14 rounded-2xl text-base font-bold bg-muted text-foreground hover:bg-muted/80 border-0 transition-all"
              >
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : t('manageSubscription')}
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={processing}
                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all"
              >
                {processing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Crown className="mr-2 h-5 w-5" />
                    {user ? t('purchasePremium') : t('loginToPurchase')}
                  </>
                )}
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              {t('securePayment')} — Stripe
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

              <div className="text-foreground">{t('sharing')}</div>
              <div className="text-center text-muted-foreground">—</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1"><Users className="h-3 w-3" /> +1</div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </Layout>
  );
}
