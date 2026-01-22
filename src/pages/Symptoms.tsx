import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-medical-green/10 text-medical-green border-medical-green/20";
      case "medium":
        return "bg-medical-warning/10 text-medical-warning border-medical-warning/20";
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Activity className="h-4 w-4" />
            Symptoms Checker
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analyze Your Symptoms
          </h1>
          <p className="text-muted-foreground">
            Select your symptoms or describe them in detail. Our AI will analyze
            them and suggest possible conditions.
          </p>
        </div>

        <DisclaimerBanner className="max-w-3xl mx-auto mb-8" />

        {/* Symptoms Selection */}
        <div className="max-w-3xl mx-auto">
          <div className="medical-card mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Common Symptoms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonSymptoms.map((symptom) => {
                const Icon = symptom.icon;
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-background hover:border-primary/50 text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{symptom.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="medical-card mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Additional Symptoms
            </h2>
            <Textarea
              placeholder="Describe any other symptoms you're experiencing in detail..."
              value={additionalSymptoms}
              onChange={(e) => setAdditionalSymptoms(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={analyzeSymptoms}
            disabled={isAnalyzing}
            size="lg"
            className="w-full gradient-primary text-primary-foreground border-0 rounded-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-5 w-5" />
                Analyze Symptoms
              </>
            )}
          </Button>

          {/* Results */}
          {results && results.conditions && (
            <div className="mt-8 space-y-4 animate-fade-up">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Possible Conditions
              </h2>
              {results.conditions.map((condition, index) => (
                <div key={index} className="medical-card">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {condition.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                        condition.severity
                      )}`}
                    >
                      {condition.severity.charAt(0).toUpperCase() +
                        condition.severity.slice(1)}{" "}
                      Severity
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {condition.description}
                  </p>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">
                      Possible Cause:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {condition.possibleCause}
                    </span>
                  </div>
                </div>
              ))}
              <DisclaimerBanner className="mt-6" dismissible={false} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
