import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from "sonner";
import LoadingScreen from './components/LoadingScreen';

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
import CivilWorksInsuranceSuccess from '@/pages/insurance/civil-works/Success';
import Consortium from './pages/insurance/Consortium';
import NotFound from '@/pages/NotFound';

// Quote pages
import HealthInsuranceQuote from '@/pages/insurance/HealthInsuranceQuote';

// Vite env
const SITE_BASE = import.meta.env.BASE_URL || '/';

function App() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // Função para verificar se todas as imagens foram carregadas
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve mesmo em caso de erro para não travar o carregamento
        });
      });

      Promise.all(imagePromises).then(() => {
        // Adiciona um pequeno delay para garantir uma transição suave
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    };

    // Verifica se as imagens foram carregadas quando o componente montar
    checkImagesLoaded();

    // Adiciona um timeout de segurança para garantir que a tela de loading não fique presa
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="App">
      <BrowserRouter basename={SITE_BASE}>
        {isLoading && <LoadingScreen />}
        <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
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
            <Route path="/seguros/obras-civis/success" element={<CivilWorksInsuranceSuccess />} />
            <Route path="/seguros/garantia" element={<BondInsurance />} />
            <Route path="/consorcio" element={<Consortium />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
