import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Code, Search, Building2, Award, Sparkles } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const team = [
    {
      name: "Yerzhanuly Yerassyl",
      role: t('developer'),
      icon: Code,
      gradient: "from-primary to-medical-sky",
    },
    {
      name: "Kadyr Altair",
      role: t('researcher'),
      icon: Search,
      gradient: "from-medical-purple to-medical-coral",
    },
    {
      name: "Жумабай Айдар",
      role: t('assistantResearcher'),
      icon: Search,
      gradient: "from-medical-green to-primary",
    },
  ];

  return (
    <Layout showFooterDisclaimer>
      <div className="container py-12 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-gradient">{t('about')}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('ourTeam')}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br from-primary to-medical-sky" />
                <div className="relative">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} mb-6 transition-transform group-hover:scale-110`}>
                    <member.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card to-primary/5 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-medical-sky">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">NIS IB</h2>
                <p className="text-muted-foreground">{t('nisDescription')}</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('projectDescription')}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Innovation
              </span>
              <span className="px-4 py-2 rounded-full bg-medical-green/10 text-medical-green text-sm font-medium">
                Healthcare
              </span>
              <span className="px-4 py-2 rounded-full bg-medical-purple/10 text-medical-purple text-sm font-medium">
                AI Technology
              </span>
            </div>
          </div>
        </div>

        {/* Sponsorship Section */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border-2 border-dashed border-border/60 bg-muted/30 p-8 md:p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-6">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">{t('sponsorship')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('sponsorshipDescription')}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
              <Sparkles className="h-4 w-4" />
              {t('comingSoon')}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
