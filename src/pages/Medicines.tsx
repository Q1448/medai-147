import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useMedicalProfile } from "@/contexts/MedicalProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MedicineCardSkeleton, AnalyzingAnimation } from "@/components/ui/loading-skeleton";
import { EvidenceModal } from "@/components/ui/evidence-modal";
import { 
  ShoppingBag, 
  AlertCircle, 
  Search, 
  Pill, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Package,
  Info,
  Sparkles,
  Filter,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  BookOpen,
  Car,
  Footprints,
  Store
} from "lucide-react";

interface Medicine {
  name: string;
  purpose: string;
  dosage: string;
  instructions: string;
  warnings: string[];
  estimatedPrice: string;
  duration: string;
  brand?: string;
  isGeneric?: boolean;
  analogues?: string[];
  inStock?: boolean;
  incompatibleWith?: string[];
}

interface MedicineResult {
  condition: string;
  medicines: Medicine[];
  generalAdvice: string;
}

interface NearbyPharmacy {
  name: string;
  address: string;
  phone: string;
  distance: string;
  walkTime: string;
  driveTime: string;
  coords: string;
  inStock: boolean;
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

const nearbyPharmacies: NearbyPharmacy[] = [
  {
    name: "Darigar Pharmacy",
    address: "Kabanbay Batyr Ave 53, Astana",
    phone: "+7 (7172) 57-72-72",
    distance: "0.8 km",
    walkTime: "10 min",
    driveTime: "3 min",
    coords: "51.1280,71.4306",
    inStock: true,
  },
  {
    name: "Apteka Plus",
    address: "Turan Ave 24, Astana",
    phone: "+7 (7172) 44-55-66",
    distance: "1.2 km",
    walkTime: "15 min",
    driveTime: "5 min",
    coords: "51.1350,71.4200",
    inStock: true,
  },
  {
    name: "Pharmaline 24/7",
    address: "Syganak St 29, Astana",
    phone: "+7 (7172) 33-44-55",
    distance: "2.1 km",
    walkTime: "26 min",
    driveTime: "7 min",
    coords: "51.1420,71.4150",
    inStock: false,
  },
  {
    name: "Euroaptek",
    address: "Dostyk St 5, Astana",
    phone: "+7 (7172) 22-33-44",
    distance: "3.5 km",
    walkTime: "44 min",
    driveTime: "12 min",
    coords: "51.1500,71.4400",
    inStock: true,
  },
];

type PriceFilter = "all" | "cheap" | "medium" | "expensive";
type AvailabilityFilter = "all" | "inStock" | "outOfStock";

export default function Medicines() {
  const { profile, getProfileContext } = useMedicalProfile();
  const { t, language } = useLanguage();
  const [condition, setCondition] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [showGenerics, setShowGenerics] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<NearbyPharmacy | null>(null);

  const searchMedicines = async () => {
    if (!condition.trim()) {
      setError(t('errorEnterCondition'));
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      const profileContext = getProfileContext();
      const { data, error: funcError } = await supabase.functions.invoke("find-medicines", {
        body: {
          condition: condition.trim(),
          age: profile.age || undefined,
          weight: profile.weight || undefined,
          allergies: profile.allergies,
          currentMedications: profile.currentMedications,
          profileContext,
          language,
        },
      });

      if (funcError) throw funcError;
      
      // Add mock data for demo purposes
      if (data?.medicines) {
        data.medicines = data.medicines.map((m: Medicine, i: number) => ({
          ...m,
          isGeneric: i % 2 === 0,
          inStock: Math.random() > 0.3,
          analogues: i === 0 ? [t('generic') + " Alternative", "Brand B"] : undefined,
          incompatibleWith: profile.currentMedications.length > 0 ? 
            (Math.random() > 0.7 ? [profile.currentMedications[0]] : undefined) : undefined,
        }));
      }
      
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError(t('errorFindMedicines'));
    } finally {
      setIsSearching(false);
    }
  };

  const openPharmacyDirections = (pharmacy: NearbyPharmacy) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coords}&travelmode=driving`,
      "_blank"
    );
  };

  const callPharmacy = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const getPriceCategory = (price: string): PriceFilter => {
    const numMatch = price.match(/\d+/);
    if (!numMatch) return "medium";
    const num = parseInt(numMatch[0]);
    if (num < 500) return "cheap";
    if (num < 1500) return "medium";
    return "expensive";
  };

  const filteredMedicines = results?.medicines?.filter((m) => {
    if (priceFilter !== "all" && getPriceCategory(m.estimatedPrice) !== priceFilter) return false;
    if (showGenerics && !m.isGeneric) return false;
    return true;
  });

  return (
    <Layout showFooterDisclaimer>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <ShoppingBag className="h-4 w-4 text-medical-green" />
            <span className="text-gradient">Health Market</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find <span className="text-gradient">Medicines</span> for Your Condition
          </h1>
          <p className="text-lg text-muted-foreground">
            Get personalized medicine recommendations based on your profile with prices, availability, and nearby pharmacies.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
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
                    onKeyPress={(e) => e.key === "Enter" && searchMedicines()}
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

              {/* Profile Context Notice */}
              {(profile.age || profile.allergies.length > 0 || profile.currentMedications.length > 0) && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Recommendations will be personalized based on your profile
                      {profile.age && ` (Age: ${profile.age})`}
                      {profile.allergies.length > 0 && `, excluding ${profile.allergies.length} known allergies`}
                      {profile.currentMedications.length > 0 && `, checking ${profile.currentMedications.length} medication interactions`}
                    </span>
                  </p>
                </div>
              )}
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
                <div className="h-5 w-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finding Medicines...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Find Medicines
              </>
            )}
          </Button>

          {/* Loading State */}
          {isSearching && (
            <div className="mt-12">
              <AnalyzingAnimation />
            </div>
          )}

          {/* Results */}
          {results && !isSearching && (
            <div className="mt-12 space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Medicines for <span className="text-gradient">{results.condition}</span>
                </h2>
                <p className="text-muted-foreground">
                  Found {results.medicines?.length || 0} recommended medicines
                </p>
              </div>

              {/* Filters */}
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Filters:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={priceFilter === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setPriceFilter("all")}
                    >
                      All Prices
                    </Badge>
                    <Badge
                      variant={priceFilter === "cheap" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setPriceFilter("cheap")}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Budget (&lt;500 KZT)
                    </Badge>
                    <Badge
                      variant={priceFilter === "medium" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setPriceFilter("medium")}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      <DollarSign className="h-3 w-3 -ml-2" />
                      Medium
                    </Badge>
                    <Badge
                      variant={priceFilter === "expensive" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setPriceFilter("expensive")}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      <DollarSign className="h-3 w-3 -ml-2" />
                      <DollarSign className="h-3 w-3 -ml-2" />
                      Premium
                    </Badge>
                  </div>

                  <Badge
                    variant={showGenerics ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setShowGenerics(!showGenerics)}
                  >
                    <RefreshCcw className="h-3 w-3 mr-1" />
                    Generics Only
                  </Badge>
                </div>
              </div>

              {/* Medicine Cards */}
              {filteredMedicines && filteredMedicines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMedicines.map((medicine, index) => (
                    <div key={index} className="medicine-shop-card">
                      {/* Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-green to-medical-mint">
                            <Pill className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                                  {medicine.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {medicine.purpose}
                                </p>
                              </div>
                              {medicine.isGeneric && (
                                <Badge variant="secondary" className="text-xs">
                                  Generic
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock & Price */}
                      <div className="px-6 pb-4 flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-green/10 border border-medical-green/20">
                          <DollarSign className="h-4 w-4 text-medical-green" />
                          <span className="font-display font-bold text-medical-green">
                            {medicine.estimatedPrice || "Price varies"}
                          </span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          medicine.inStock 
                            ? "bg-medical-green/10 text-medical-green" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {medicine.inStock ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Out of Stock
                            </>
                          )}
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

                        {/* Analogues */}
                        {medicine.analogues && medicine.analogues.length > 0 && (
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-medical-blue/10 border border-medical-blue/20">
                            <RefreshCcw className="h-4 w-4 text-medical-blue shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-medical-blue text-sm block mb-1">
                                Alternatives
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {medicine.analogues.map((a, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {a}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Incompatibility Warning */}
                        {medicine.incompatibleWith && medicine.incompatibleWith.length > 0 && (
                          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <span className="font-medium text-destructive text-sm">
                                Interaction Warning
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              May interact with: {medicine.incompatibleWith.join(", ")}
                            </p>
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
                              {medicine.warnings.slice(0, 3).map((warning, wIndex) => (
                                <li key={wIndex} className="flex items-start gap-1.5">
                                  <span className="text-medical-warning">•</span>
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Evidence Button */}
                        <EvidenceModal condition={medicine.name}>
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            <BookOpen className="h-4 w-4 mr-2" />
                            What is this based on?
                          </Button>
                        </EvidenceModal>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No medicines match your filters.</p>
                </div>
              )}

              {/* Nearby Pharmacies */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Nearby Pharmacies in Astana
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyPharmacies.map((pharmacy, index) => (
                    <div
                      key={index}
                      className={`pharmacy-card ${selectedPharmacy === pharmacy ? "border-primary" : ""}`}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          pharmacy.inStock ? "bg-medical-green/10" : "bg-muted"
                        }`}>
                          <Store className={`h-6 w-6 ${pharmacy.inStock ? "text-medical-green" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground">{pharmacy.name}</h4>
                            <Badge variant={pharmacy.inStock ? "default" : "secondary"} className="text-xs shrink-0">
                              {pharmacy.inStock ? "In Stock" : "Check"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {pharmacy.address}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              {pharmacy.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Footprints className="h-3 w-3" />
                              {pharmacy.walkTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {pharmacy.driveTime}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                callPharmacy(pharmacy.phone);
                              }}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-8 gradient-primary text-primary-foreground border-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPharmacyDirections(pharmacy);
                              }}
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Directions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
