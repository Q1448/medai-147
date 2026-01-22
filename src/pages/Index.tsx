import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MedicalCard } from "@/components/ui/medical-card";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bot,
  Camera,
  Pill,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Symptoms Checker",
    description: "Select your symptoms and get AI-powered analysis of possible conditions",
    href: "/symptoms",
    color: "text-medical-teal",
  },
  {
    icon: Bot,
    title: "AI Doctor",
    description: "Chat with our AI medical assistant for health information and guidance",
    href: "/ai-doctor",
    color: "text-medical-blue",
  },
  {
    icon: Camera,
    title: "AI Image Analysis",
    description: "Upload photos of skin conditions for preliminary visual analysis",
    href: "/ai-analysis",
    color: "text-medical-purple",
  },
  {
    icon: Pill,
    title: "Medicine Guide",
    description: "Find medication information with dosage recommendations",
    href: "/medicines",
    color: "text-medical-green",
  },
  {
    icon: Building2,
    title: "Hospital Contacts",
    description: "Find hospitals, pharmacies, and emergency contacts in Astana",
    href: "/hospitals",
    color: "text-medical-coral",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Get health information anytime, anywhere",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data stays private and secure",
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Advanced AI for accurate health insights",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI-Powered Health Assistant
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Personal{" "}
              <span className="text-gradient">Medical AI</span>{" "}
              Assistant
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get preliminary health information, analyze symptoms, and find medical resources. 
              Powered by advanced AI to help you make informed health decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 rounded-xl px-8">
                <Link to="/symptoms">
                  Check Symptoms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8">
                <Link to="/ai-doctor">
                  Talk to AI Doctor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6">
        <div className="container">
          <DisclaimerBanner dismissible={false} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Can We Help You?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our AI-powered tools to get health information and guidance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.href}
                to={feature.href}
                className="block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MedicalCard
                  icon={feature.icon}
                  iconColor={feature.color}
                  title={feature.title}
                  description={feature.description}
                  className="h-full"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-3xl gradient-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              If you're experiencing a medical emergency, please contact emergency services immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90 rounded-xl px-8"
              >
                <a href="tel:103">
                  Call Emergency: 103
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl px-8"
              >
                <Link to="/hospitals">Find Hospitals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
