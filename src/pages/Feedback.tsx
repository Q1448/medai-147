import { useState } from "react";
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
} from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    suggestion: '',
  });

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
        title: "Error",
        description: "Please enter your suggestion",
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
      toast({
        title: t('thankYou'),
        description: "Your suggestion has been recorded.",
      });

      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', category: 'general', suggestion: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
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
                Your feedback helps us improve MedAI+
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
