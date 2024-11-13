import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import AccessCodePrompt from "./components/AccessCodePrompt";

const queryClient = new QueryClient();

// Protected Route component to check for access code
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hasValidCode = sessionStorage.getItem('accessCodeValidated');

  if (!hasValidCode) {
    return <Navigate to="/access-code" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/access-code" element={<AccessCodePrompt />} />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;