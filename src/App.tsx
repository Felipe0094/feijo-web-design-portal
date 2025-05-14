import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from "sonner";

// Pages
import Index from '@/pages/Index';
import Register from '@/pages/Register';
import AutoInsurance from '@/pages/insurance/AutoInsurance';
import TravelInsurance from '@/pages/insurance/TravelInsurance';
import HomeInsurance from '@/pages/insurance/HomeInsurance';
import LifeInsurance from '@/pages/insurance/LifeInsurance';
import BusinessInsurance from '@/pages/insurance/BusinessInsurance';
import BondInsurance from '@/pages/insurance/BondInsurance';
import HealthInsurance from '@/pages/insurance/HealthInsurance';
import CivilWorksInsurance from '@/pages/insurance/CivilWorksInsurance';
import Consortium from './pages/insurance/Consortium';
import NotFound from '@/pages/NotFound';

// Quote pages
import HealthInsuranceQuote from '@/pages/insurance/HealthInsuranceQuote';

// Vite env
const SITE_BASE = import.meta.env.BASE_URL || '/';

function App() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes or when user resizes window
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="App">
      <BrowserRouter basename={SITE_BASE}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/seguros/auto" element={<AutoInsurance />} />
          <Route path="/seguros/viagem" element={<TravelInsurance />} />
          <Route path="/seguros/residencial" element={<HomeInsurance />} />
          <Route path="/seguros/vida" element={<LifeInsurance />} />
          <Route path="/seguros/empresarial" element={<BusinessInsurance />} />
          <Route path="/seguros/fianca" element={<BondInsurance />} />
          <Route path="/seguros/saude" element={<HealthInsurance />} />
          <Route path="/seguros/saude/cotacao" element={<HealthInsuranceQuote />} />
          <Route path="/seguros/obras-civis" element={<CivilWorksInsurance />} />
          <Route path="/seguros/garantia" element={<BondInsurance />} />
          <Route path="/consorcio" element={<Consortium />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
