import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [isDesktopImageLoaded, setIsDesktopImageLoaded] = useState(false);
    const [isMobileImageLoaded, setIsMobileImageLoaded] = useState(false);

    useEffect(() => {
        // Preload hero images
        const preloadImages = () => {
            const imgDesktop = new Image();
            imgDesktop.onload = () => setIsDesktopImageLoaded(true);
            imgDesktop.src = '/topo.png';
            
            const imgMobile = new Image();
            imgMobile.onload = () => setIsMobileImageLoaded(true);
            imgMobile.src = '/topo-mobile.png';
        };
        
        // Iniciar o preload imediatamente
        preloadImages();

        // Adicionar um fallback para garantir que as imagens sejam exibidas mesmo se o preload falhar
        const timeoutId = setTimeout(() => {
            setIsDesktopImageLoaded(true);
            setIsMobileImageLoaded(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="bg-[#DADADB] bg-cover bg-center relative h-[320px] flex items-center justify-center">
            <div className="container mx-auto px-4 h-full flex items-center relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center h-full w-full">
                    <div className='md:block hidden'>
                        {!isDesktopImageLoaded && (
                            <div className="animate-pulse bg-gray-200 h-[320px] w-full rounded-md" />
                        )}
                        <img 
                            src="/topo.png" 
                            alt="Hero image desktop" 
                            className={`object-cover h-[320px] mx-auto transition-opacity duration-300 ${isDesktopImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading="eager"
                            width={800}
                            height={320}
                            decoding="async"
                        />
                    </div>
                    <div className='block md:hidden'>
                        {!isMobileImageLoaded && (
                            <div className="animate-pulse bg-gray-200 h-[131px] w-full rounded-md" />
                        )}
                        <img 
                            src="/topo-mobile.png" 
                            alt="Hero image mobile" 
                            className={`object-cover h-[120px] mx-auto transition-opacity duration-300 ${isMobileImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading="eager"
                            width={400}
                            height={131}
                            decoding="async"
                        />
                    </div>
                    <div className="text-left flex flex-col justify-center z-10">
                        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-[#FA0108] ">
                            FEIJÓ SEGUROS
                        </h1>
                        <h1 className="text-xl md:text-3xl font-bold mb-4 text-[#45484A] ">
                            Proteção e segurança para o que importa
                        </h1>
                        <p className="text-base md:text-lg mb-6 text-[#45484A]">
                            Na Feijó Seguros, oferecemos as melhores soluções em seguros para você, sua família e seu patrimônio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
