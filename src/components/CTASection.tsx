
import React, { useEffect, useState } from "react";
import { Button } from './ui/button';
import { MessageSquareMore } from 'lucide-react';

const WHATSAPP_ICON = "/whatsapp.png";

const consultants = [
  { name: "Carlos Henrique", phone: "5522988156269" },
  { name: "Felipe", phone: "5521972110705" },
  { name: "Gabriel", phone: "5522999210343" },
  { name: "Renan", phone: "5522988521503" },
  { name: "Renata", phone: "5511994150565" },
];

const CTASection = () => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Preload WhatsApp icon
    const preloadIcon = () => {
      const img = new Image();
      img.src = WHATSAPP_ICON;
    };
    preloadIcon();
  }, []);

  return (
    <div>
      <section className="py-8" id="contact">
        <div className="container mx-auto px-4">
          <div className="bg-feijo-red rounded-lg p-6 md:p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-3xl font-bold mb-3">Pronto para garantir sua proteção?</h2>
              <p className="text-base mb-8">
                Entre em contato conosco agora mesmo e descubra como nossos serviços de seguro podem proporcionar a tranquilidade que você merece.
              </p>
              <Button
                className="w-full sm:w-auto px-6 py-4 bg-white text-[#242424] gap-2 transition duration-300 ease-in-out hover:bg-[#242424] hover:text-white"
                onClick={() => setShowModal(true)}
              >
                <img
                  src={WHATSAPP_ICON}
                  width="20"
                  height="20"
                  className="mr-2"
                  loading="eager"
                />
                Contato via Whatsapp
              </Button>
            </div>
          </div>
        </div>
      </section>
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
  );
};

export default CTASection;
