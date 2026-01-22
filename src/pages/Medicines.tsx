import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Pill, Loader2, AlertCircle, Search } from "lucide-react";

interface Medicine {
  name: string;
  purpose: string;
  dosage: string;
  instructions: string;
  warnings: string[];
}

interface MedicineResult {
  condition: string;
  medicines: Medicine[];
  generalAdvice: string;
}

const commonConditions = [
  "Headache",
  "Cold & Flu",
  "Fever",
  "Allergies",
  "Stomach Pain",
  "Sore Throat",
  "Back Pain",
  "Skin Rash",
  "Insomnia",
  "Anxiety",
];

export default function Medicines() {
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchMedicines = async () => {
    if (!condition.trim()) {
      setError("Please enter or select a condition.");
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke("find-medicines", {
        body: {
          condition: condition.trim(),
          age: age ? parseInt(age) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
        },
      });

      if (funcError) throw funcError;
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to find medicines. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-green/10 text-medical-green text-sm font-medium mb-4">
            <Pill className="h-4 w-4" />
            Medicine Guide
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Medication Information
          </h1>
          <p className="text-muted-foreground">
            Search for medicine recommendations based on your condition, age, and weight.
          </p>
        </div>

        <DisclaimerBanner className="max-w-3xl mx-auto mb-8" />

        <div className="max-w-3xl mx-auto">
          {/* Search Form */}
          <div className="medical-card mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Search Medicines
            </h2>

            <div className="space-y-4">
              {/* Condition */}
              <div>
                <Label htmlFor="condition" className="text-foreground mb-2 block">
                  Condition or Symptom
                </Label>
                <Input
                  id="condition"
                  placeholder="e.g., Headache, Cold, Fever..."
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="rounded-xl"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {commonConditions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        condition === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-foreground mb-2 block">
                    Age (optional)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="rounded-xl"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-foreground mb-2 block">
                    Weight in kg (optional)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-xl"
                    min="0"
                    max="300"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={searchMedicines}
            disabled={isSearching}
            size="lg"
            className="w-full gradient-primary text-primary-foreground border-0 rounded-xl"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching Medicines...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find Medicines
              </>
            )}
          </Button>

          {/* Results */}
          {results && (
            <div className="mt-8 space-y-6 animate-fade-up">
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Medicines for {results.condition}
                </h2>
              </div>

              {/* Medicine Cards */}
              {results.medicines && results.medicines.length > 0 && (
                <div className="space-y-4">
                  {results.medicines.map((medicine, index) => (
                    <div key={index} className="medical-card">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-medical-green/10 text-medical-green">
                          <Pill className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {medicine.purpose}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 rounded-xl bg-muted/50">
                              <span className="font-medium text-foreground block mb-1">
                                Dosage
                              </span>
                              <span className="text-muted-foreground">
                                {medicine.dosage}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/50">
                              <span className="font-medium text-foreground block mb-1">
                                Instructions
                              </span>
                              <span className="text-muted-foreground">
                                {medicine.instructions}
                              </span>
                            </div>
                          </div>

                          {medicine.warnings && medicine.warnings.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-medical-warning/10 border border-medical-warning/20">
                              <span className="font-medium text-medical-warning block mb-1 text-sm">
                                ⚠️ Warnings
                              </span>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {medicine.warnings.map((warning, wIndex) => (
                                  <li key={wIndex}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* General Advice */}
              {results.generalAdvice && (
                <div className="medical-card bg-primary/5 border border-primary/20">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    General Advice
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {results.generalAdvice}
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
