import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  Loader2, 
  AlertCircle, 
  Search, 
  Pill, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Package,
  Info,
  Sparkles
} from "lucide-react";

interface Medicine {
  name: string;
  purpose: string;
  dosage: string;
  instructions: string;
  warnings: string[];
  estimatedPrice: string;
  duration: string;
}

interface MedicineResult {
  condition: string;
  medicines: Medicine[];
  generalAdvice: string;
}

const popularConditions = [
  "Headache",
  "Cold & Flu",
  "Fever",
  "Allergies",
  "Stomach Pain",
  "Sore Throat",
  "Back Pain",
  "Cough",
  "Insomnia",
  "Muscle Pain",
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
      setError("Please enter a condition or disease.");
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
    <Layout showFooterDisclaimer>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <ShoppingBag className="h-4 w-4 text-medical-green" />
            <span className="text-gradient">Medicine Shop</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find <span className="text-gradient">Medicines</span> for Your Condition
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your disease or condition to get medicine recommendations with prices and usage instructions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            <div className="space-y-6">
              {/* Condition Input */}
              <div>
                <Label htmlFor="condition" className="text-foreground text-base font-semibold mb-3 block">
                  What's your condition or disease?
                </Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="condition"
                    placeholder="e.g., Headache, Flu, Allergies, Back Pain..."
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="pl-12 h-14 rounded-2xl text-base border-2 focus:border-primary"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {popularConditions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        condition === c
                          ? "bg-primary text-primary-foreground shadow-md"
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
                  <Label htmlFor="age" className="text-foreground font-medium mb-2 block">
                    Age (optional)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-12 rounded-xl"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-foreground font-medium mb-2 block">
                    Weight in kg (optional)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12 rounded-xl"
                    min="0"
                    max="300"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <Button
            onClick={searchMedicines}
            disabled={isSearching}
            size="lg"
            className="w-full gradient-primary text-primary-foreground border-0 rounded-2xl h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Finding Medicines...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Find Medicines
              </>
            )}
          </Button>

          {/* Results */}
          {results && (
            <div className="mt-12 space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Medicines for <span className="text-gradient">{results.condition}</span>
                </h2>
                <p className="text-muted-foreground">
                  Found {results.medicines?.length || 0} recommended medicines
                </p>
              </div>

              {/* Medicine Cards - Shop Style */}
              {results.medicines && results.medicines.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.medicines.map((medicine, index) => (
                    <div key={index} className="medicine-shop-card">
                      {/* Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-green to-medical-mint">
                            <Pill className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl font-bold text-foreground mb-1">
                              {medicine.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {medicine.purpose}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="px-6 pb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-green/10 border border-medical-green/20">
                          <DollarSign className="h-4 w-4 text-medical-green" />
                          <span className="font-display font-bold text-medical-green">
                            {medicine.estimatedPrice || "Price varies"}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="px-6 pb-6 space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                          <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-foreground text-sm block mb-0.5">
                              Dosage
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {medicine.dosage}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                          <Info className="h-5 w-5 text-medical-blue shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-foreground text-sm block mb-0.5">
                              Instructions
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {medicine.instructions}
                            </span>
                          </div>
                        </div>

                        {medicine.duration && (
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                            <Clock className="h-5 w-5 text-medical-purple shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground text-sm block mb-0.5">
                                Duration
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {medicine.duration}
                              </span>
                            </div>
                          </div>
                        )}

                        {medicine.warnings && medicine.warnings.length > 0 && (
                          <div className="p-3 rounded-xl bg-medical-warning/10 border border-medical-warning/20">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-medical-warning" />
                              <span className="font-medium text-medical-warning text-sm">
                                Warnings
                              </span>
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {medicine.warnings.map((warning, wIndex) => (
                                <li key={wIndex} className="flex items-start gap-1.5">
                                  <span className="text-medical-warning">•</span>
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* General Advice */}
              {results.generalAdvice && (
                <div className="glass-card p-6 rounded-2xl border-2 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2">
                        General Advice
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {results.generalAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
