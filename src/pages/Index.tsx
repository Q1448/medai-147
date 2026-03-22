import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MedicalCard } from "@/components/ui/medical-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { TextRotate } from "@/components/ui/text-rotate";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Activity,
  Bot,
  Camera,
  ShoppingBag,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  Brain,
  Sparkles,
  Users,
  Zap,
  HeartPulse,
} from "lucide-react";

export default function Index() {
  const { t, language } = useLanguage();

  const rotatingTexts = language === 'ru' 
    ? ['Здоровью', 'Диагностике', 'Лечению', 'Профилактике']
    : language === 'kk'
    ? ['Денсаулыққа', 'Диагностикаға', 'Емдеуге', 'Алдын алуға']
    : ['Health', 'Diagnostics', 'Treatment', 'Prevention'];

  const features = [
    { icon: Activity, title: t('featureSymptomTitle'), description: t('featureSymptomDesc'), href: "/symptoms", gradient: "from-primary to-[hsl(var(--primary-glow))]" },
    { icon: Bot, title: t('featureAIDoctorTitle'), description: t('featureAIDoctorDesc'), href: "/ai-doctor", gradient: "from-[hsl(var(--medical-blue))] to-[hsl(var(--medical-purple))]" },
    { icon: Camera, title: t('featureImageTitle'), description: t('featureImageDesc'), href: "/ai-analysis", gradient: "from-[hsl(var(--medical-purple))] to-[hsl(var(--primary))]" },
    { icon: ShoppingBag, title: t('featureMedicineTitle'), description: t('featureMedicineDesc'), href: "/medicines", gradient: "from-[hsl(var(--medical-green))] to-[hsl(var(--medical-mint))]" },
    { icon: Building2, title: t('featureHospitalTitle'), description: t('featureHospitalDesc'), href: "/hospitals", gradient: "from-[hsl(var(--medical-coral))] to-[hsl(var(--medical-peach))]" },
    { icon: Users, title: t('featureAboutTitle'), description: t('featureAboutDesc'), href: "/about", gradient: "from-[hsl(var(--medical-navy))] to-primary" },
  ];

  const stats = [
    { value: "24/7", label: t('available247'), icon: Clock },
    { value: "AI", label: t('aiPowered'), icon: Brain },
    { value: "100%", label: t('privateSecure'), icon: Shield },
    { value: "Fast", label: t('fastResults'), icon: Zap },
  ];

  return (
    <Layout showFooterDisclaimer>
      <SEOHead
        title="AI-Powered Health Assistant"
        description="Get instant health insights, accurate symptom analysis, medicine recommendations, and find nearby healthcare facilities—all powered by advanced AI."
        path="/"
      />
      <div>
        {/* Hero Section — Liquid Glass */}
        <section className="relative overflow-hidden gradient-hero">
          <div className="absolute inset-0 gradient-mesh opacity-60" />
          <div className="container relative py-12 md:py-20">
            <Card className="w-full liquid-glass-heavy overflow-hidden rounded-3xl border-0">
              <Spotlight className="from-primary/20 via-primary/5 to-transparent" size={400} />
              <div className="flex flex-col min-h-[420px]">
                <div className="flex-1 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center items-center text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-subtle text-sm font-semibold mb-6 w-fit">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-gradient">{t('heroTagline')}</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
                    {t('heroTitle1')}{" "}
                    <span className="text-gradient">
                      <TextRotate texts={rotatingTexts} interval={2500} />
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                    {t('heroDescription')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 rounded-2xl px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all duration-300">
                      <Link to="/symptoms">
                        <HeartPulse className="mr-2 h-5 w-5" />
                        {t('checkSymptoms')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 h-14 text-base font-semibold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 active:scale-[0.97] transition-all duration-300">
                      <Link to="/ai-doctor">
                        <Bot className="mr-2 h-5 w-5" />
                        {t('talkToAI')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 border-y border-primary/10">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl gradient-primary text-primary-foreground mb-3 shadow-lg">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="font-display text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 relative">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="container relative">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('exploreFeatures').split(' ')[0]} <span className="text-gradient">{t('exploreFeatures').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t('featuresDescription')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Link key={feature.href} to={feature.href} className="block">
                  <MedicalCard icon={feature.icon} gradient={feature.gradient} title={feature.title} description={feature.description} className="h-full" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 text-center text-primary-foreground shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
              <div className="relative">
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t('needHelp')}</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">{t('emergencyDescription')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-14 text-base font-bold shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all duration-300">
                    <a href="tel:103">{t('callEmergency')}</a>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-14 text-base font-bold shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all duration-300">
                    <Link to="/hospitals">{t('findHospitals')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
