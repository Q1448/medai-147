import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  Pill,
  Ambulance,
  Navigation,
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
    coords: "51.1605,71.4704",
  },
  {
    name: "City Hospital №1",
    address: "1 Imanov Street, Astana",
    phone: "+7 (7172) 53-94-33",
    hours: "24/7",
    type: "Emergency Hospital",
    coords: "51.1280,71.4304",
  },
  {
    name: "City Hospital №2",
    address: "33 Bogenbai Batyr Street, Astana",
    phone: "+7 (7172) 32-67-70",
    hours: "24/7",
    type: "General Hospital",
    coords: "51.1450,71.4100",
  },
  {
    name: "Regional Children's Hospital",
    address: "64 Imanov Street, Astana",
    phone: "+7 (7172) 29-60-00",
    hours: "24/7",
    type: "Pediatric Hospital",
    coords: "51.1320,71.4350",
  },
];

const pharmacies = [
  {
    name: "Darigar Pharmacy",
    address: "15 Kabanbay Batyr Avenue, Astana",
    phone: "+7 (7172) 55-22-33",
    hours: "24/7",
    coords: "51.0906,71.4189",
  },
  {
    name: "Apteka Plus",
    address: "28 Turan Avenue, Astana",
    phone: "+7 (7172) 44-11-22",
    hours: "08:00 - 23:00",
    coords: "51.0878,71.4156",
  },
  {
    name: "Dostyk Pharmacy",
    address: "45 Dostyk Street, Astana",
    phone: "+7 (7172) 33-44-55",
    hours: "24/7",
    coords: "51.1280,71.4520",
  },
  {
    name: "Senim Pharmacy",
    address: "12 Saryarka Avenue, Astana",
    phone: "+7 (7172) 66-77-88",
    hours: "09:00 - 22:00",
    coords: "51.1423,71.4689",
  },
];

const openDirections = (coords: string, name: string) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coords}&travelmode=driving`;
  window.open(url, '_blank');
};

export default function Hospitals() {
  return (
    <Layout showFooterDisclaimer>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <Building2 className="h-4 w-4 text-medical-coral" />
            <span className="text-gradient-accent">Healthcare Locations</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Pharmacies & Hospitals in <span className="text-gradient">Astana</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Click on any location to get directions automatically via Google Maps
          </p>
        </div>

        {/* Emergency Numbers */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyNumbers.map((emergency) => (
              <a
                key={emergency.number}
                href={`tel:${emergency.number}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 p-6 transition-all hover:border-destructive/40 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive group-hover:scale-110 transition-transform">
                    <emergency.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{emergency.name}</p>
                    <p className="font-display text-3xl font-bold text-destructive">
                      {emergency.number}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Pharmacies */}
          <div className="mb-14">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-medical-green to-medical-mint">
                <Pill className="h-5 w-5 text-white" />
              </div>
              Pharmacies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmacies.map((pharmacy, index) => (
                <button
                  key={index}
                  onClick={() => openDirections(pharmacy.coords, pharmacy.name)}
                  className="pharmacy-card text-left w-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {pharmacy.name}
                    </h3>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{pharmacy.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{pharmacy.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{pharmacy.phone}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-primary font-medium">
                    <Navigation className="h-3.5 w-3.5" />
                    Click to get directions
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hospitals */}
          <div className="mb-14">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-medical-sky">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              Hospitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hospital, index) => (
                <button
                  key={index}
                  onClick={() => openDirections(hospital.coords, hospital.name)}
                  className="pharmacy-card text-left w-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-1">
                        {hospital.name}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {hospital.type}
                      </span>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mt-3">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{hospital.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{hospital.phone}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-primary font-medium">
                    <Navigation className="h-3.5 w-3.5" />
                    Click to get directions
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Astana Healthcare Map
              </h2>
            </div>
            <div className="aspect-video">
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
            <div className="p-4 flex justify-center bg-muted/30">
              <Button
                asChild
                variant="outline"
                className="rounded-xl"
              >
                <a
                  href="https://www.google.com/maps/search/pharmacies+and+hospitals+in+Astana+Kazakhstan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Full Map
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
