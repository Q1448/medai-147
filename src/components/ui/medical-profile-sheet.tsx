import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMedicalProfile } from "@/contexts/MedicalProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, X, Plus, Trash2, History, AlertTriangle } from "lucide-react";
import { ScrollArea } from "./scroll-area";

export function MedicalProfileSheet() {
  const { profile, updateProfile, clearHistory } = useMedicalProfile();
  const { t } = useLanguage();
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const addItem = (
    field: "chronicConditions" | "allergies" | "currentMedications",
    value: string,
    setter: (v: string) => void
  ) => {
    if (value.trim()) {
      updateProfile({ [field]: [...profile[field], value.trim()] });
      setter("");
    }
  };

  const removeItem = (field: "chronicConditions" | "allergies" | "currentMedications", index: number) => {
    updateProfile({ [field]: profile[field].filter((_, i) => i !== index) });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t('medicalProfile')}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">{t('basicInformation')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-xs">{t('age')}</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age || ""}
                    onChange={(e) => updateProfile({ age: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-xs">{t('weight')}</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={profile.weight || ""}
                    onChange={(e) => updateProfile({ weight: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 h-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">{t('gender')}</Label>
                <div className="flex gap-2 mt-1">
                  {([
                    { key: "male", label: t('male') },
                    { key: "female", label: t('female') },
                    { key: "other", label: t('other') },
                  ] as const).map((g) => (
                    <Button
                      key={g.key}
                      variant={profile.gender === g.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProfile({ gender: g.key })}
                      className="flex-1"
                    >
                      {g.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">{t('chronicConditions')}</h3>
              <div className="flex gap-2">
                <Input
                  placeholder={t('chronicConditions')}
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem("chronicConditions", newCondition, setNewCondition)}
                  className="h-10"
                />
                <Button size="icon" onClick={() => addItem("chronicConditions", newCondition, setNewCondition)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.chronicConditions.map((c, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 pr-1">
                    {c}
                    <button onClick={() => removeItem("chronicConditions", i)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-medical-warning" />
                {t('allergies')}
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder={t('allergies')}
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem("allergies", newAllergy, setNewAllergy)}
                  className="h-10"
                />
                <Button size="icon" onClick={() => addItem("allergies", newAllergy, setNewAllergy)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((a, i) => (
                  <Badge key={i} variant="destructive" className="gap-1 pr-1 bg-medical-warning/20 text-medical-warning border-medical-warning/30">
                    {a}
                    <button onClick={() => removeItem("allergies", i)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">{t('medications')}</h3>
              <div className="flex gap-2">
                <Input
                  placeholder={t('medications')}
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem("currentMedications", newMedication, setNewMedication)}
                  className="h-10"
                />
                <Button size="icon" onClick={() => addItem("currentMedications", newMedication, setNewMedication)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.currentMedications.map((m, i) => (
                  <Badge key={i} variant="outline" className="gap-1 pr-1">
                    {m}
                    <button onClick={() => removeItem("currentMedications", i)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* History */}
            {profile.symptomHistory.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <History className="h-4 w-4" />
                    {t('recentHistory')}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive h-8">
                    <Trash2 className="h-3 w-3 mr-1" />
                    {t('clear')}
                  </Button>
                </div>
                <div className="space-y-2">
                  {profile.symptomHistory.slice(0, 5).map((entry, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/50 text-sm">
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="text-foreground line-clamp-2">{entry.symptoms}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                {t('profileStoredLocally')}
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}