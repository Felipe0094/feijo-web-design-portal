import React, { useState } from "react";
import { Car, Plane, Home, Heart, Building, FileText, Building2, Activity, MessageSquareMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from "./ui/card";

interface InsuranceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ title, description, icon, path }) => {
  return (
    <Link to={path} className="block h-full">
      <Card className="h-full border-none bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 group shadow-md">
        <CardContent className="p-6 flex flex-col items-center h-full">
          <div className="text-[#D72009] mb-4">
            {icon}
          </div>
          
          <div className="flex-grow flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2 text-center text-feijo-darkgray group-hover:text-[#FA0108] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-center text-sm text-feijo-darkgray/80 group-hover:text-[#FA0108] transition-colors duration-300 line-clamp-3">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const consultants = [
  { name: "Carlos Henrique", phone: "5522988156269" },
  { name: "Felipe", phone: "5521972110705" },
  { name: "Gabriel", phone: "5522999210343" },
  { name: "Renan", phone: "5522988521503" },
  { name: "Renata", phone: "5511994150565" },
];

const InsuranceSection = () => {
  const [showModal, setShowModal] = useState(false);
  const insuranceTypes = [
    {
      title: "Seguro de Automóveis",
      description: "Proteção completa para seu veículo contra danos, roubo e acidentes.",
      icon: <Car size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/auto"
    },
    {
      title: "Seguro Viagem",
      description: "Viaje com tranquilidade, com cobertura médica e assistência 24h.",
      icon: <Plane size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/viagem"
    },
    {
      title: "Seguro Residencial",
      description: "Proteja sua casa contra incêndio, roubo e danos estruturais.",
      icon: <Home size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/residencial"
    },
    {
      title: "Seguro de Vida",
      description: "Garanta o futuro financeiro de quem você ama em qualquer situação.",
      icon: <Heart size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/vida"
    },
    {
      title: "RC Obras Civis",
      description: "Proteção contra danos causados a terceiros durante obras civis.",
      icon: <Building size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/obras-civis"
    },
    {
      title: "Seguro Garantia",
      description: "Seguro garantia para processos de licitação e contratos públicos.",
      icon: <FileText size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/garantia"
    },
    {
      title: "Seguro Empresarial",
      description: "Proteção completa para o seu negócio, equipamentos e instalações.",
      icon: <Building2 size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/empresarial"
    },
    {
      title: "Plano de Saúde",
      description: "Planos de saúde completos para você e sua família.",
      icon: <Activity size={40} strokeWidth={1.5} color="#FA0108" />,
      path: "/seguros/saude"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-b from-feijo-darkgray via-black to-feijo-darkgray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-white">Faça sua cotação aqui!</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {insuranceTypes.map((insurance, index) => (
            <InsuranceCard
              key={index}
              title={insurance.title}
              description={insurance.description}
              icon={insurance.icon}
              path={insurance.path}
            />
          ))}
        </div>
        <div className="w-full flex justify-center mt-8">
          <Button
            className="w-full sm:w-auto px-6 py-4 bg-white text-[#242424] gap-2 transition duration-300 ease-in-out hover:bg-[#808080] hover:text-[#f80108]"
            onClick={() => setShowModal(true)}
          >
            <img
              src="/whatsapp.png"
              width="20"
              height="20"
              className="mr-2"
              alt="WhatsApp"
            />
            Para outros seguros, entre em contato.
          </Button>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h3 className="text-lg font-semibold mb-4 text-center text-feijo-darkgray">Selecione o seu Consultor / Corretor:</h3>
              <div className="flex flex-col gap-2">
                {consultants.map((c) => (
                  <a
                    key={c.phone}
                    href={`https://wa.me/${c.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-[#dadadb] text-[#f0251a] rounded hover:bg-gray-400 text-center transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageSquareMore size={16} />
                    {c.name}
                  </a>
                ))}
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-[#f0261b] text-white rounded hover:bg-gray-400 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InsuranceSection;
