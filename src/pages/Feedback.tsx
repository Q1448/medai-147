import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MessageSquarePlus,
  Send,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Palette,
  Zap,
  Brain,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react";

interface FeedbackStats {
  total: number;
  byCategory: Record<string, number>;
}

const categories = [
  { id: 'general', icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
  { id: 'ui', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { id: 'features', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { id: 'ai', icon: Brain, color: 'from-purple-500 to-violet-500' },
  { id: 'other', icon: HelpCircle, color: 'from-gray-500 to-slate-500' },
];

export default function Feedback() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stats, setStats] = useState<FeedbackStats>({ total: 0, byCategory: {} });
  const [recentFeedback, setRecentFeedback] = useState<Array<{ category: string; created_at: string }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    suggestion: '',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('category, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const byCategory: Record<string, number> = {};
      categories.forEach(cat => byCategory[cat.id] = 0);
      
      data?.forEach(item => {
        const cat = item.category || 'general';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });

      setStats({
        total: data?.length || 0,
        byCategory,
      });
      
      setRecentFeedback(data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getCategoryLabel = (id: string) => {
    const labels: Record<string, string> = {
      general: t('catGeneral'),
      ui: t('catUI'),
      features: t('catFeatures'),
      ai: t('catAI'),
      other: t('catOther'),
    };
    return labels[id] || id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.suggestion.trim()) {
      toast({
        title: t('errorEnterSuggestion'),
        description: t('errorEnterSuggestion'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({
          name: formData.name || null,
          email: formData.email || null,
          category: formData.category,
          suggestion: formData.suggestion,
        });

      if (error) throw error;

      setIsSubmitted(true);
      fetchStats(); // Refresh stats
      toast({
        title: t('thankYou'),
        description: t('yourFeedbackHelps'),
      });

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', category: 'general', suggestion: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: t('errorSubmitFailed'),
        description: t('errorSubmitFailed'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            <span className="text-gradient">{t('feedback')}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('feedbackTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('feedbackDescription')}
          </p>
        </div>

        {/* Statistics Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-medical-sky flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {t('feedbackStats')}
                </h2>
                <p className="text-sm text-muted-foreground">{t('feedbackStatsDescription')}</p>
              </div>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{t('totalSuggestions')}</span>
                </div>
                <p className="font-display text-3xl font-bold text-gradient">{stats.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-medical-green/10 border border-medical-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-medical-green" />
                  <span className="text-sm font-medium text-muted-foreground">{t('thisWeek')}</span>
                </div>
                <p className="font-display text-3xl font-bold text-medical-green">
                  {recentFeedback.filter(f => {
                    const date = new Date(f.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date > weekAgo;
                  }).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-medical-purple/10 border border-medical-purple/20 col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-medical-purple" />
                  <span className="text-sm font-medium text-muted-foreground">{t('mostPopular')}</span>
                </div>
                <p className="font-display text-lg font-bold text-medical-purple">
                  {getCategoryLabel(Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general')}
                </p>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">{t('byCategory')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const count = stats.byCategory[cat.id] || 0;
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={cat.id} className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{getCategoryLabel(cat.id)}</p>
                      <p className="font-display text-lg font-bold text-foreground">{count}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="glass-card rounded-3xl p-12 text-center animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {t('thankYou')}
              </h2>
              <p className="text-muted-foreground">
                {t('yourFeedbackHelps')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('yourName')}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="rounded-xl border-border/50 bg-background/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('yourEmail')}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="rounded-xl border-border/50 bg-background/50"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t('category')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {getCategoryLabel(cat.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggestion */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('suggestion')} *
                </label>
                <Textarea
                  value={formData.suggestion}
                  onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                  placeholder={t('suggestionPlaceholder')}
                  rows={6}
                  className="rounded-xl border-border/50 bg-background/50 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {t('submitSuggestion')}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
