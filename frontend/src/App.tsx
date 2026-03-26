import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import RiskPredictionPage from "./pages/dashboard/RiskPredictionPage";
import ProfitCalculatorPage from "./pages/dashboard/ProfitCalculatorPage";
import RiskHistoryPage from "./pages/dashboard/RiskHistoryPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="risk" element={<RiskPredictionPage />} />
            <Route path="profit" element={<ProfitCalculatorPage />} />
            <Route path="history" element={<RiskHistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
