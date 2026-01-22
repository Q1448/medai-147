import { Layout } from "@/components/layout/Layout";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  Pill,
  Ambulance,
  ExternalLink,
} from "lucide-react";

const emergencyNumbers = [
  { name: "Emergency (Ambulance)", number: "103", icon: Ambulance },
  { name: "General Emergency", number: "112", icon: Phone },
];

const hospitals = [
  {
    name: "National Scientific Medical Center",
    address: "42 Abylai Khan Avenue, Astana",
    phone: "+7 (7172) 70-29-00",
    hours: "24/7",
    type: "Main Hospital",
  },
  {
    name: "City Hospital №1",
    address: "1 Imanov Street, Astana",
    phone: "+7 (7172) 53-94-33",
    hours: "24/7",
    type: "Emergency Hospital",
  },
  {
    name: "City Hospital №2",
    address: "33 Bogenbai Batyr Street, Astana",
    phone: "+7 (7172) 32-67-70",
    hours: "24/7",
    type: "General Hospital",
  },
  {
    name: "Regional Children's Hospital",
    address: "64 Imanov Street, Astana",
    phone: "+7 (7172) 29-60-00",
    hours: "24/7",
    type: "Pediatric Hospital",
  },
  {
    name: "Presidential Hospital",
    address: "4 Mangilik El Avenue, Astana",
    phone: "+7 (7172) 70-88-88",
    hours: "24/7",
    type: "Specialized Hospital",
  },
];

const pharmacies = [
  {
    name: "Europharma",
    address: "Multiple locations in Astana",
    phone: "+7 (7172) 27-88-88",
    hours: "08:00 - 22:00",
  },
  {
    name: "Sadyhan Pharmacy",
    address: "10 Turan Avenue, Astana",
    phone: "+7 (7172) 23-12-34",
    hours: "24/7",
  },
  {
    name: "Pharmamir",
    address: "55 Kabanbay Batyr Avenue, Astana",
    phone: "+7 (7172) 44-55-66",
    hours: "09:00 - 21:00",
  },
];

export default function Hospitals() {
  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-coral/10 text-medical-coral text-sm font-medium mb-4">
            <Building2 className="h-4 w-4" />
            Hospital Contacts
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hospitals & Pharmacies in Astana
          </h1>
          <p className="text-muted-foreground">
            Find hospitals, pharmacies, and emergency contacts in Astana, Kazakhstan.
          </p>
        </div>

        {/* Emergency Numbers */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyNumbers.map((emergency) => (
              <a
                key={emergency.number}
                href={`tel:${emergency.number}`}
                className="medical-card flex items-center gap-4 bg-destructive/5 border-2 border-destructive/20 hover:border-destructive/40 transition-colors"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <emergency.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{emergency.name}</p>
                  <p className="font-display text-2xl font-bold text-destructive">
                    {emergency.number}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <DisclaimerBanner className="max-w-4xl mx-auto mb-8" />

        <div className="max-w-4xl mx-auto">
          {/* Hospitals */}
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              Hospitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hospital, index) => (
                <div key={index} className="medical-card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {hospital.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                      {hospital.type}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{hospital.hours}</span>
                    </div>
                    <a
                      href={`tel:${hospital.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{hospital.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacies */}
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Pill className="h-6 w-6 text-medical-green" />
              Pharmacies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pharmacies.map((pharmacy, index) => (
                <div key={index} className="medical-card">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    {pharmacy.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{pharmacy.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{pharmacy.hours}</span>
                    </div>
                    <a
                      href={`tel:${pharmacy.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{pharmacy.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="medical-card">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Map
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158177.25203815447!2d71.34776369453124!3d51.16052229999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580c47db54609%3A0x97f9148dddb19228!2sAstana%2C%20Kazakhstan!5e0!3m2!1sen!2sus!4v1705933285000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Astana Map"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="rounded-xl"
              >
                <a
                  href="https://www.google.com/maps/search/hospitals+in+Astana+Kazakhstan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
