import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MedicalCard } from "@/components/ui/medical-card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bot,
  Camera,
  ShoppingBag,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  Brain,
  Sparkles,
  Users,
  Zap,
  HeartPulse,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Symptoms Checker",
    description: "Advanced AI analysis of your symptoms for accurate condition identification",
    href: "/symptoms",
    gradient: "from-primary to-medical-sky",
  },
  {
    icon: Bot,
    title: "AI Doctor",
    description: "Powerful AI medical assistant with comprehensive health knowledge",
    href: "/ai-doctor",
    gradient: "from-medical-blue to-medical-purple",
  },
  {
    icon: Camera,
    title: "AI Image Analysis",
    description: "Precise visual analysis of skin conditions with detailed insights",
    href: "/ai-analysis",
    gradient: "from-medical-purple to-medical-coral",
  },
  {
    icon: ShoppingBag,
    title: "Medicine Shop",
    description: "Find medicines for your condition with prices and instructions",
    href: "/medicines",
    gradient: "from-medical-green to-medical-mint",
  },
  {
    icon: Building2,
    title: "Pharmacies & Hospitals",
    description: "Navigate directly to pharmacies and hospitals in Astana",
    href: "/hospitals",
    gradient: "from-medical-coral to-medical-peach",
  },
  {
    icon: Users,
    title: "About Us",
    description: "Meet our team and learn about our mission",
    href: "/about",
    gradient: "from-medical-navy to-primary",
  },
];

const stats = [
  { value: "24/7", label: "Available", icon: Clock },
  { value: "AI", label: "Powered", icon: Brain },
  { value: "100%", label: "Private", icon: Shield },
  { value: "Fast", label: "Results", icon: Zap },
];

export default function Index() {
  return (
    <Layout showFooterDisclaimer>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-gradient">Next-Gen Health Assistant</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your AI-Powered{" "}
              <span className="text-gradient">Medical</span>{" "}
              <span className="text-gradient-accent">Companion</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Get instant health insights, accurate symptom analysis, medicine recommendations, 
              and find nearby healthcare facilities—all powered by advanced AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 rounded-2xl px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link to="/symptoms">
                  <HeartPulse className="mr-2 h-5 w-5" />
                  Check Symptoms
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 h-14 text-base font-semibold border-2 hover:bg-primary/5">
                <Link to="/ai-doctor">
                  <Bot className="mr-2 h-5 w-5" />
                  Talk to AI Doctor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="font-display text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our <span className="text-gradient">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Comprehensive AI-powered tools designed to help you make informed health decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.href}
                to={feature.href}
                className="block animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <MedicalCard
                  icon={feature.icon}
                  gradient={feature.gradient}
                  title={feature.title}
                  description={feature.description}
                  className="h-full"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 text-center text-primary-foreground">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Need Immediate Help?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
                If you're experiencing a medical emergency, please contact emergency services immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-14 text-base font-bold shadow-xl"
                >
                  <a href="tel:103">
                    Call Emergency: 103
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 h-14 text-base font-semibold"
                >
                  <Link to="/hospitals">Find Hospitals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
