import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  Loader2,
  AlertCircle,
  Thermometer,
  HeartPulse,
  Brain,
  Bone,
  Eye,
  Ear,
  Wind,
  Sparkles,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const commonSymptoms = [
  { id: "headache", label: "Headache", icon: Brain },
  { id: "fever", label: "Fever", icon: Thermometer },
  { id: "cough", label: "Cough", icon: Wind },
  { id: "fatigue", label: "Fatigue", icon: HeartPulse },
  { id: "sore_throat", label: "Sore Throat", icon: Ear },
  { id: "body_aches", label: "Body Aches", icon: Bone },
  { id: "nausea", label: "Nausea", icon: Activity },
  { id: "dizziness", label: "Dizziness", icon: Brain },
  { id: "shortness_of_breath", label: "Shortness of Breath", icon: Wind },
  { id: "chest_pain", label: "Chest Pain", icon: HeartPulse },
  { id: "runny_nose", label: "Runny Nose", icon: Eye },
  { id: "loss_of_appetite", label: "Loss of Appetite", icon: Activity },
];

interface AnalysisResult {
  conditions: {
    name: string;
    description: string;
    possibleCause: string;
    severity: "low" | "medium" | "high";
    matchScore?: number;
  }[];
}

export default function Symptoms() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0 && !additionalSymptoms.trim()) {
      setError("Please select at least one symptom or describe your symptoms.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    const selectedLabels = selectedSymptoms.map(
      (id) => commonSymptoms.find((s) => s.id === id)?.label || id
    );

    const allSymptoms = [
      ...selectedLabels,
      additionalSymptoms.trim(),
    ].filter(Boolean).join(", ");

    try {
      const { data, error: funcError } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms: allSymptoms },
      });

      if (funcError) throw funcError;
      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "low":
        return {
          bg: "bg-medical-green/10",
          border: "border-medical-green/20",
          text: "text-medical-green",
          icon: CheckCircle2,
        };
      case "medium":
        return {
          bg: "bg-medical-warning/10",
          border: "border-medical-warning/20",
          text: "text-medical-warning",
          icon: AlertTriangle,
        };
      case "high":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/20",
          text: "text-destructive",
          icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-muted",
          border: "border-border",
          text: "text-muted-foreground",
          icon: Activity,
        };
    }
  };

  return (
    <Layout showFooterDisclaimer>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-gradient">Advanced Symptom Analysis</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Analyze Your <span className="text-gradient">Symptoms</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your symptoms and describe them in detail for more accurate condition identification.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Symptoms Selection */}
          <div className="glass-card p-8 rounded-3xl mb-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Select Your Symptoms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonSymptoms.map((symptom) => {
                const Icon = symptom.icon;
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border bg-background hover:border-primary/50 text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isSelected ? "bg-primary text-white" : "bg-muted"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{symptom.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl mb-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Describe in Detail
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              The more details you provide, the more accurate the analysis will be.
            </p>
            <Textarea
              placeholder="Describe your symptoms in detail: When did they start? How severe are they? Are there any triggers? Include any other relevant information..."
              value={additionalSymptoms}
              onChange={(e) => setAdditionalSymptoms(e.target.value)}
              className="min-h-[140px] resize-none rounded-2xl text-base"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <Button
            onClick={analyzeSymptoms}
            disabled={isAnalyzing}
            size="lg"
            className="w-full gradient-primary text-primary-foreground border-0 rounded-2xl h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Symptoms
              </>
            )}
          </Button>

          {/* Results */}
          {results && results.conditions && (
            <div className="mt-12 space-y-6 animate-fade-up">
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Possible <span className="text-gradient">Conditions</span>
                </h2>
                <p className="text-muted-foreground">
                  Based on your symptoms, here are the most likely conditions
                </p>
              </div>

              <div className="space-y-4">
                {results.conditions.map((condition, index) => {
                  const styles = getSeverityStyles(condition.severity);
                  const SeverityIcon = styles.icon;
                  
                  return (
                    <div 
                      key={index} 
                      className={`glass-card p-6 rounded-2xl border-2 ${styles.border}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.bg}`}>
                            <SeverityIcon className={`h-6 w-6 ${styles.text}`} />
                          </div>
                          <div>
                            <h3 className="font-display text-xl font-bold text-foreground mb-1">
                              {condition.name}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
                              <SeverityIcon className="h-3 w-3" />
                              {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)} Severity
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {condition.description}
                      </p>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <span className="font-semibold text-foreground text-sm">
                          Possible Cause:
                        </span>
                        <p className="text-muted-foreground text-sm mt-1">
                          {condition.possibleCause}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
