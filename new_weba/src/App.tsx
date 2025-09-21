
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { apiService } from "@/utils/api";
import Home from "./pages/Home";
import Metrics from "./pages/Metrics";
import Links from "./pages/Links";
import LinkDetails from "./pages/LinkDetails";
import Premium from "./pages/Premium";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

type AuthState = "loading" | "landing" | "login" | "register" | "authenticated";

const App = () => {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    // Verificar se o usuário já está autenticado ao carregar a aplicação
    const checkAuth = () => {
      if (apiService.isAuthenticated()) {
        setAuthState("authenticated");
      } else {
        setAuthState("landing");
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (email: string, password: string) => {
    console.log("Login realizado:", { email });
    setAuthState("authenticated");
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log("Registro realizado:", { name, email });
    setAuthState("authenticated");
  };

  const handleLogout = () => {
    apiService.logout();
    setAuthState("landing");
  };

  // Mostrar loading enquanto verifica autenticação
  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  // Renderizar landing page, login ou register
  if (authState === "landing") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex w-full bg-gray-900">
              <main className="flex-1">
                <LandingPage
                  onLogin={() => setAuthState("login")}
                  onRegister={() => setAuthState("register")}
                />
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (authState === "login") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login
            onLogin={handleLogin}
            onBack={() => setAuthState("landing")}
            onGoToRegister={() => setAuthState("register")}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (authState === "register") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Register
            onRegister={handleRegister}
            onBack={() => setAuthState("landing")}
            onGoToLogin={() => setAuthState("login")}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // App autenticado
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-900">
              <AppSidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/metrics" element={<Metrics />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/link/:id" element={<LinkDetails />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/config" element={<Config />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
