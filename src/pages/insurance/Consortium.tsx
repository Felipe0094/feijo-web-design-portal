
import React from 'react';
import { Button } from "@/components/ui/button";
import { Coins } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Consortium = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Coins className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Consórcio</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Planeje suas conquistas</h2>
              <p className="text-feijo-gray mb-4">
                O consórcio é uma forma inteligente e econômica de realizar seus sonhos,
                seja na aquisição de um imóvel, veículo ou outros bens.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Parcelas acessíveis</li>
                <li>Sem juros</li>
                <li>Diversos prazos</li>
                <li>Contemplação por lance ou sorteio</li>
                <li>Flexibilidade na escolha do bem</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Modalidades</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Consórcio de imóveis</li>
                <li className="flex items-center gap-2">✓ Consórcio de veículos</li>
                <li className="flex items-center gap-2">✓ Consórcio de motos</li>
                <li className="flex items-center gap-2">✓ Consórcio de serviços</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link to="/cadastro">
              <Button className="bg-feijo-red text-white hover:bg-red-600">
                Solicitar informações
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consortium;
