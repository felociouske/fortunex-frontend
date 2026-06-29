import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./store/authStore";

// Pages
import IndexPage   from "./pages/index/index.jsx";
import LoginPage   from "./pages/auth/login.jsx";
import RegisterPage from "./pages/auth/register.jsx";
import Dashboard   from "./pages/dashboard/dashboard.jsx";
import LandingPage from "./pages/landing/landing.jsx";
import Profile     from "./pages/profile/Profile.jsx";
import Cashier     from "./pages/cashier/Cashier.jsx";
import TradePage   from "./pages/trade/Trade.jsx";
import Marketplace from "./pages/marketplace/Marketplace.jsx";
import Affiliate   from "./pages/affiliate/Affiliate.jsx";

import AutoTrade from "./pages/index/AutoTrade.jsx";
import BeginnersGuide from "./pages/index/BeginnersGuide.jsx";
import CFDs from "./pages/index/CFDs.jsx";
import Commodities from "./pages/index/Commodities.jsx";
import Crypto from "./pages/index/Crypto.jsx";
import DerivedIndices from "./pages/index/DerivedIndices.jsx";
import EconomicCalendar from "./pages/index/EconomicCalender.jsx";
import Forex from "./pages/index/Forex.jsx";
import Glossary from "./pages/index/Glossary.jsx";
import Multipliers from "./pages/index/Multipliers.jsx";
import Options from "./pages/index/Options.jsx";
import OurPrinciples from "./pages/index/OurPrinciples.jsx";
import RegulatoryInfo from "./pages/index/RegulatoryInfo.jsx";
import SmartTrader from "./pages/index/SmartTrader.jsx";
import Stocks from "./pages/index/Stocks.jsx";
import TermsConditions from "./pages/index/TermsConditions.jsx";
import TradingStrategies from "./pages/index/TradingStrategies.jsx";
import WhoWeAre from "./pages/index/WhoWeAre.jsx";
import WhyChooseUs from "./pages/index/WhyChooseUs.jsx";
import KycPage     from "./pages/kyc/kyc.jsx";
import Bots        from "./pages/bots/Bots.jsx";
import NotificationsPage from "./pages/notifications/NotificationsPage.jsx";
import KYCPromptModal from "./components/KYCPromptModal.jsx";

const queryClient = new QueryClient();

// Protects routes that need a logged-in user
function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <KYCPromptModal />
      {children}
    </>
  );
}

// Redirects logged-in users away from auth pages
function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/landing" replace /> : children;
}

export default function App() {
  // Bootstrap auth from stored tokens on app start
  useEffect(() => {
    const init = async () => {
      try {
        const initAuth = useAuthStore.getState().initAuth;
        if (initAuth) await initAuth();
      } catch (e) {
        // ignore
      }
    };
    init();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/forex" element={<Forex />} />
          <Route path="/derived-indices" element={<DerivedIndices />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/cfds" element={<CFDs />} />
          <Route path="/options" element={<Options />} />
          <Route path="/multipliers" element={<Multipliers />} />
          <Route path="/smarttrader" element={<SmartTrader />} />
          <Route path="/autotrade" element={<AutoTrade />} />
          <Route path="/economic-calendar" element={<EconomicCalendar />} />
          <Route path="/beginners-guide" element={<BeginnersGuide />} />
          <Route path="/trading-strategies" element={<TradingStrategies />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/our-principles" element={<OurPrinciples />} />
          <Route path="/regulatory-info" element={<RegulatoryInfo />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected */}
          <Route path="/landing"    element={<PrivateRoute><LandingPage /></PrivateRoute>} />
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/trade"      element={<PrivateRoute><TradePage /></PrivateRoute>} />
          <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
          <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/affiliate"  element={<PrivateRoute><Affiliate /></PrivateRoute>} />
          <Route path="/cashier"    element={<PrivateRoute><Cashier /></PrivateRoute>} />
          <Route path="/kyc"        element={<PrivateRoute><KycPage /></PrivateRoute>} />
          <Route path="/bots"       element={<PrivateRoute><Bots /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
