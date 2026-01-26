import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface MedicalProfile {
  age: number | null;
  gender: "male" | "female" | "other" | null;
  weight: number | null;
  chronicConditions: string[];
  allergies: string[];
  currentMedications: string[];
  symptomHistory: { date: string; symptoms: string; result: string }[];
}

interface MedicalProfileContextType {
  profile: MedicalProfile;
  updateProfile: (updates: Partial<MedicalProfile>) => void;
  addToHistory: (entry: { symptoms: string; result: string }) => void;
  clearHistory: () => void;
  getProfileContext: () => string;
}

const defaultProfile: MedicalProfile = {
  age: null,
  gender: null,
  weight: null,
  chronicConditions: [],
  allergies: [],
  currentMedications: [],
  symptomHistory: [],
};

const MedicalProfileContext = createContext<MedicalProfileContextType | undefined>(undefined);

export function MedicalProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<MedicalProfile>(() => {
    const saved = localStorage.getItem("medai-profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("medai-profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<MedicalProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addToHistory = (entry: { symptoms: string; result: string }) => {
    setProfile((prev) => ({
      ...prev,
      symptomHistory: [
        { ...entry, date: new Date().toISOString() },
        ...prev.symptomHistory.slice(0, 19), // Keep last 20
      ],
    }));
  };

  const clearHistory = () => {
    setProfile((prev) => ({ ...prev, symptomHistory: [] }));
  };

  const getProfileContext = () => {
    const parts: string[] = [];
    if (profile.age) parts.push(`Patient age: ${profile.age} years`);
    if (profile.gender) parts.push(`Gender: ${profile.gender}`);
    if (profile.weight) parts.push(`Weight: ${profile.weight} kg`);
    if (profile.chronicConditions.length > 0) {
      parts.push(`Chronic conditions: ${profile.chronicConditions.join(", ")}`);
    }
    if (profile.allergies.length > 0) {
      parts.push(`Known allergies: ${profile.allergies.join(", ")}`);
    }
    if (profile.currentMedications.length > 0) {
      parts.push(`Current medications: ${profile.currentMedications.join(", ")}`);
    }
    return parts.length > 0 ? `\n\nPatient Context:\n${parts.join("\n")}` : "";
  };

  return (
    <MedicalProfileContext.Provider
      value={{ profile, updateProfile, addToHistory, clearHistory, getProfileContext }}
    >
      {children}
    </MedicalProfileContext.Provider>
  );
}

export function useMedicalProfile() {
  const context = useContext(MedicalProfileContext);
  if (context === undefined) {
    throw new Error("useMedicalProfile must be used within a MedicalProfileProvider");
  }
  return context;
}
