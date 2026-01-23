import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Symptoms from "./pages/Symptoms";
import AiDoctor from "./pages/AiDoctor";
import AiAnalysis from "./pages/AiAnalysis";
import Medicines from "./pages/Medicines";
import Hospitals from "./pages/Hospitals";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/ai-doctor" element={<AiDoctor />} />
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
