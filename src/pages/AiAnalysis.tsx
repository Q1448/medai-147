import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Camera,
  Upload,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface AnalysisResult {
  conditions: {
    name: string;
    description: string;
    likelihood: "low" | "medium" | "high";
  }[];
  observations: string[];
  recommendation: string;
}

export default function AiAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    setFileName(file.name);
    setError(null);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setFileName("");
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke("analyze-image", {
        body: { image },
      });

      if (funcError) throw funcError;
      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-purple/10 text-medical-purple text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            AI Image Analysis
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analyze Skin Conditions
          </h1>
          <p className="text-muted-foreground">
            Upload a photo of skin rashes, inflammation, or other visible conditions
            for AI-powered visual analysis.
          </p>
        </div>

        <DisclaimerBanner className="max-w-3xl mx-auto mb-8" />

        <div className="max-w-3xl mx-auto">
          {/* Upload Area */}
          <div className="medical-card mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Upload Image
            </h2>

            {!image ? (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="mb-2 text-sm text-foreground font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
                <input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={image}
                  alt="Uploaded image"
                  className="w-full max-h-96 object-contain rounded-2xl"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 rounded-xl bg-background/90 text-foreground hover:bg-background transition-colors shadow-md"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  {fileName}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={analyzeImage}
            disabled={!image || isAnalyzing}
            size="lg"
            className="w-full gradient-primary text-primary-foreground border-0 rounded-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" />
                Analyze Image
              </>
            )}
          </Button>

          {/* Results */}
          {results && (
            <div className="mt-8 space-y-6 animate-fade-up">
              {/* Observations */}
              {results.observations && results.observations.length > 0 && (
                <div className="medical-card">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                    Observations
                  </h2>
                  <ul className="space-y-2">
                    {results.observations.map((observation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {observation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Possible Conditions */}
              {results.conditions && results.conditions.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Possible Conditions
                  </h2>
                  <div className="space-y-4">
                    {results.conditions.map((condition, index) => (
                      <div key={index} className="medical-card">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {condition.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${getLikelihoodColor(
                              condition.likelihood
                            )}`}
                          >
                            {condition.likelihood.charAt(0).toUpperCase() +
                              condition.likelihood.slice(1)}{" "}
                            Likelihood
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {condition.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {results.recommendation && (
                <div className="medical-card bg-primary/5 border border-primary/20">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                    Recommendation
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {results.recommendation}
                  </p>
                </div>
              )}

              <DisclaimerBanner dismissible={false} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
