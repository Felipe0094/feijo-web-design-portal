import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';

// Logo URL
const LOGO_URL = "/LogoSVG.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Preload logo image
    const preloadLogo = () => {
      const img = new Image();
      img.onload = () => setLogoLoaded(true);
      img.src = LOGO_URL;
    };
    
    preloadLogo();
  }, []);

  const insuranceTypes = [
    { title: 'Automóvel', path: '/seguros/auto' },
    { title: 'Viagem', path: '/seguros/viagem' },
    { title: 'Residencial', path: '/seguros/residencial' },
    { title: 'Vida', path: '/seguros/vida' },
    { title: 'RC Obras Civis', path: '/seguros/obras-civis' },
    { title: 'Garantia', path: '/seguros/garantia' },
    { title: 'Empresarial', path: '/seguros/empresarial' },
    { title: 'Plano de Saúde', path: '/seguros/saude' },
  ];

  return (
    <nav className="bg-feijo-darkgray sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src={LOGO_URL}
              alt="Feijó Seguros" 
              className="h-10 md:h-12"
              loading="eager"
              // Removed the invalid 'priority' attribute
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-white">
          <a href="/#" className="hover:text-feijo-red transition-colors font-medium text-sm">
            Início
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-feijo-red hover:bg-transparent focus:bg-transparent text-sm">
                  Seguros                  
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[200px] gap-1 p-4 bg-white">
                    {insuranceTypes.map((insurance) => (
                      <Link
                        key={insurance.path}
                        to={insurance.path}                      
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-feijo-red hover:text-white text-sm"
                      >
                        {insurance.title}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <a href="/#seguradoras-parceiras" className="hover:text-feijo-red transition-colors font-medium text-sm">
            Seguradoras
          </a>
          <a href="/#contact" className="hover:text-feijo-red transition-colors font-medium text-sm">
            Contato
          </a>          
        </div>
        
        {/* Mobile Navigation Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-feijo-red focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (    
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="/#" className="text-feijo-darkgray hover:text-feijo-red transition-colors font-medium py-2 text-sm">
              Início
            </a>
            <div className="space-y-2">
              <p className="text-feijo-red font-medium text-sm">Seguros</p>
              {insuranceTypes.map((insurance) => (
                <Link
                  key={insurance.path}
                  to={insurance.path}
                  className="block pl-4 py-1 text-feijo-darkgray hover:text-feijo-red transition-colors text-sm"
                >
                  {insurance.title}
                </Link>                
              ))}
            </div>
            <a href="/#seguradoras-parceiras" className="text-feijo-darkgray hover:text-feijo-red transition-colors font-medium py-2 text-sm">
              Seguradoras
            </a>
            <a href="/#contact" className="text-feijo-darkgray hover:text-feijo-red transition-colors font-medium py-2 text-sm">
              Contato
            </a>            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
