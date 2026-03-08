import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Activity,
  Zap,
} from "lucide-react";

interface DashboardData {
  healthScore: number;
  riskScore: number;
  shortTermMeasures: string[];
  longTermMeasures: string[];
  verdict: string;
}

interface HealthDashboardProps {
  data: DashboardData;
}

export function HealthDashboard({ data }: HealthDashboardProps) {
  const { t } = useLanguage();

  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-medical-green";
    if (score >= 40) return "text-medical-warning";
    return "text-destructive";
  };

  const getHealthBg = (score: number) => {
    if (score >= 70) return "from-medical-green/20 to-medical-mint/10";
    if (score >= 40) return "from-medical-warning/20 to-medical-peach/10";
    return "from-destructive/20 to-destructive/5";
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-medical-green";
    if (score <= 60) return "text-medical-warning";
    return "text-destructive";
  };

  const getRiskBg = (score: number) => {
    if (score <= 30) return "bg-medical-green";
    if (score <= 60) return "bg-medical-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Verdict */}
      <div className="glass-card p-6 rounded-3xl border border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">{t('generalVerdict')}</h3>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{data.verdict}</p>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Health Score */}
        <div className={`glass-card p-6 rounded-3xl bg-gradient-to-br ${getHealthBg(data.healthScore)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className={`h-5 w-5 ${getHealthColor(data.healthScore)}`} />
              <span className="font-display font-bold text-foreground">{t('healthScore')}</span>
            </div>
            <span className={`font-display text-3xl font-bold ${getHealthColor(data.healthScore)}`}>
              {data.healthScore}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('critical')} (0)</span>
              <span>{t('healthy')} (100)</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getRiskBg(100 - data.healthScore)}`}
                style={{ width: `${data.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className={`glass-card p-6 rounded-3xl bg-gradient-to-br ${getHealthBg(100 - data.riskScore)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${getRiskColor(data.riskScore)}`} />
              <span className="font-display font-bold text-foreground">{t('riskScore')}</span>
            </div>
            <span className={`font-display text-3xl font-bold ${getRiskColor(data.riskScore)}`}>
              {data.riskScore}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('lowRisk')} (0%)</span>
              <span>{t('highRisk')} (100%)</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getRiskBg(data.riskScore)}`}
                style={{ width: `${data.riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short-term */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-medical-warning/10">
              <Zap className="h-4 w-4 text-medical-warning" />
            </div>
            <h3 className="font-display font-bold text-foreground">{t('shortTermMeasures')}</h3>
          </div>
          <ul className="space-y-2.5">
            {data.shortTermMeasures.map((measure, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-medical-warning shrink-0 mt-0.5" />
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Long-term */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-medical-green/10">
              <Clock className="h-4 w-4 text-medical-green" />
            </div>
            <h3 className="font-display font-bold text-foreground">{t('longTermMeasures')}</h3>
          </div>
          <ul className="space-y-2.5">
            {data.longTermMeasures.map((measure, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4 text-medical-green shrink-0 mt-0.5" />
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
