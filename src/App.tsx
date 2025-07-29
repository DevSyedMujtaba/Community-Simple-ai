import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setUser(null);
        return;
      }
      setUser(user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, verified")
        .eq("id", user.id)
        .single();
      setProfile(profile);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;
  if (!user || !profile || !profile.verified || (allowedRole && profile.role !== allowedRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setUser(null);
        return;
      }
      setUser(user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, verified")
        .eq("id", user.id)
        .single();
      setProfile(profile);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;
  if (user && profile && profile.verified) {
    // Redirect to dashboard based on role
    if (profile.role === 'homeowner') return <Navigate to="/homeowner" replace />;
    if (profile.role === 'board') return <Navigate to="/board" replace />;
    if (profile.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/signup" element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          } />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          <Route path="/onboarding/hoa-connection" element={<HOAConnection />} />
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/test-flow" element={<TestFlow />} />
          <Route path="/homeowner" element={
            <ProtectedRoute allowedRole="homeowner">
              <HomeownerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/board" element={
            <ProtectedRoute allowedRole="board">
              <BoardDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
