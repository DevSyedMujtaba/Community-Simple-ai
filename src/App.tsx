import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailVerification from "./pages/EmailVerification";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import HOAConnection from "./pages/onboarding/HOAConnection";
import Welcome from "./pages/onboarding/Welcome";
import TestFlow from "./pages/TestFlow";
import HomeownerDashboard from "./pages/HomeownerDashboard";
import BoardDashboard from "./pages/BoardDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Contact from './pages/Contact';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          <Route path="/onboarding/hoa-connection" element={<HOAConnection />} />
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/test-flow" element={<TestFlow />} />
          <Route path="/homeowner" element={<HomeownerDashboard />} />
          <Route path="/board" element={<BoardDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
