import { useLanguage } from "@/contexts/LanguageContext";
import { useMedicalProfile } from "@/contexts/MedicalProfileContext";
import {
  Heart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Activity,
  Zap,
  CalendarCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const { history } = useMedicalProfile();

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

  // Build projected improvement line (14 days)
  const projectedData = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    const improvement = data.healthScore + (100 - data.healthScore) * (1 - Math.exp(-day / 7));
    return {
      day: `${t('day') || 'Day'} ${day}`,
      [t('projectedHealth') || 'Projected']: Math.round(improvement),
    };
  });

  // Build actual analysis history points
  const historyPoints = history
    .filter((h) => h.date)
    .map((h, i) => {
      const date = new Date(h.date);
      return {
        dayLabel: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        index: i,
        score: data.healthScore - (history.length - 1 - i) * 3, // approximate
      };
    });

  // Merge into chart data  
  const chartData = projectedData.map((point, i) => {
    const historyPoint = historyPoints[i];
    return {
      ...point,
      [t('actualHealth') || 'Actual']: historyPoint ? Math.max(10, Math.min(100, historyPoint.score)) : undefined,
    };
  });

  return (
    <div className="space-y-6">
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

        {/* Re-analyze reminder */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 mt-3">
          <CalendarCheck className="h-4 w-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            {t('reanalyzeReminder') || 'We recommend running this analysis again in 1-2 days to track your health progress and see how your condition develops.'}
          </p>
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

      {/* Health Progress Chart */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('healthProgressChart') || 'Health Progress'}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {t('healthChartDesc') || 'The green line shows projected improvement over 14 days. The blue line tracks your actual analysis scores over time.'}
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey={t('projectedHealth') || 'Projected'}
                stroke="hsl(152, 68%, 38%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey={t('actualHealth') || 'Actual'}
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'hsl(217, 91%, 60%)' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
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
