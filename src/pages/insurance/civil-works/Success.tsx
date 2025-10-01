import React from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CivilWorksInsuranceSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    const phoneNumber = '5511999999999'; // Substitua pelo número correto
    const message = 'Olá! Gostaria de falar sobre minha cotação de seguro de obras civis.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cotação Enviada com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua cotação de seguro de obras civis foi recebida. Nossa equipe entrará em contato em breve para discutir as melhores opções para seu projeto.
          </p>
          <div className="mt-8 space-y-4">
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar com um consultor via WhatsApp
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CivilWorksInsuranceSuccess; 