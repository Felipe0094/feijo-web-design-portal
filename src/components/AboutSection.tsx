
import React from 'react';
import { Check } from 'lucide-react'; const AboutSection = () => {

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-feijo-darkgray">Sobre a Corretora</h2>
            <p className="text-feijo-gray mb-6">
              A FEIJÓ SEGUROS nasceu com a proposta de oferecer todo tipo de assistência, no que se refere à consultoria em seguros e investimento de capitais. Nosso objetivo é de sempre garantir a sua tranquilidade, atuando como seu consultor na oferta de produtos adequados ao seu perfil e necessidade. É possível garantir esse tipo de serviço devido o alto grau de capacitação de nossa equipe, e o comprometimento pelo desempenho da empresa, por meio de um trabalho de qualificação e de estrutura organizacional estabelecida.​
            </p>
            <p className="text-feijo-gray mb-8">
             Nossa MissãoPromover a tranquilidade e satisfação de nossos clientes nos serviços de consultoria em seguros, e assegurar serviços de alta qualidade e valor agregado.
            </p>
              <p className="text-feijo-gray mb-8">
                Nossa VisãoSer referência de qualidade nos serviços de consultoria em seguros em todo território nacional.
              </p>
          </div>
            <div className="bg-[#FA0108] p-1 rounded-lg">
            <div className="bg-white p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-feijo-red">15+</h3>
                  <p className="text-feijo-gray">Anos de experiência</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-feijo-red">2k+</h3>
                  <p className="text-feijo-gray">Clientes satisfeitos</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-feijo-red">20+</h3>
                  <p className="text-feijo-gray">Seguradoras parceiras</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-feijo-red">3k+</h3>
                  <p className="text-feijo-gray">Apólices gerenciadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default AboutSection;
