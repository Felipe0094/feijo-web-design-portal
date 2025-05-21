
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#45484A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/lovable-uploads/8b7fe028-0dc1-4e27-9566-1cc2f01c47dc.png" 
              alt="Feijó Seguros" 
              className="h-12 mb-4"
            />
            <p className="text-gray-300 mb-4">
              Oferecendo as melhores soluções em seguros para sua tranquilidade e segurança.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Seguros</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro de Automóveis</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro Viagem</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro Residencial</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro de Vida</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro Condomínio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seguro Garantia</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Consórcio</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Início</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white">Seguros</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white">Sobre Nós</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white">Contato</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Termos de Uso</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Praça Getúlio Vargas, nº 17 - Sala 102 - Ed. Clóvis Bastos - Centro - Miracema / RJ</li>
              <li className="text-gray-300">E-mail: feijocorretora@gmail.com</li>
              <li className="text-gray-300">Fone: (22) 3852 - 0872</li>
              <li className="text-gray-300">Celular: (22)98852-1503</li>
              
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Feijó Seguros. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
