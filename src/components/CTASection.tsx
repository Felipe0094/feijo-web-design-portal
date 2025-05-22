
import React, { useEffect } from "react";
import { Button } from './ui/button';

const WHATSAPP_ICON = "/whatsapp.png";

const CTASection = () => {
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
              <a 
                href="https://wa.me/5522988521503" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto px-6 py-4 bg-white text-[#242424] gap-2 transition duration-300 ease-in-out hover:bg-[#242424] hover:text-white">
                  <img
                    src={WHATSAPP_ICON}
                    width="20"
                    height="20"
                    className="mr-2"
                    loading="eager"
                  />
                  Contato via Whatsapp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTASection;
