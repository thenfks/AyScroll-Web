import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Feed from "./pages/Feed";
import Landing from "./pages/Landing";

import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Saved from "./pages/Saved";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
                <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/check-email" element={<CheckEmail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
