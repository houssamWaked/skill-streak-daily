import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserPreferences } from "@/lib/storage";
import Welcome from "./pages/Welcome";
import InterestSelection from "./pages/InterestSelection";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => {
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  useEffect(() => {
    const preferences = getUserPreferences();
    setIsNewUser(preferences.isNewUser);
  }, []);

  if (isNewUser === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isNewUser ? <Welcome /> : <Navigate to="/home" replace />} />
      <Route path="/interests" element={<InterestSelection />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
