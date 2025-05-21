import React, { useState, useEffect } from 'react';
import InsuranceCompanyDetails from './InsuranceCompanyDetails';

interface InsuranceCompany {
  name: string;
  logo: string;
  whatsapp?: string;
  phone: string[];
  phoneLabels?: string[];
}

const PartnersSection = () => {
  const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<boolean>(false);
  
  const partners: InsuranceCompany[] = [
    { 
      name: 'Allianz', 
      logo: 'logos/Allianz.png',
      whatsapp: 'wa.me/551140901444',
      phone: ['08000130700']
    },
    { 
      name: 'Amil', 
      logo: 'logos/Amil.png',
      phone: ['08007262237']
    },
    { 
      name: 'Azul', 
      logo: 'logos/Azul.png',
      whatsapp: 'wa.me/55213906-2985',
      phone: ['40043700', '08007030203'],
      phoneLabels: ['R. Metropolitana', 'Demais Regiões']
    },
    { 
      name: 'Bradesco', 
      logo: 'logos/Bradesco.png',
      whatsapp: 'wa.me/552140042702',
      phone: ['40042370', '08002370237'],
      phoneLabels: ['R. Metropolitana', 'Demais Regiões']
    },
    { 
      name: 'Chubb', 
      logo: 'logos/Chubb.png',
      phone: ['08007715289']
    },
    { 
      name: 'HDI', 
      logo: 'logos/HDI.png',
      whatsapp: 'wa.me/551155020700',
      phone: ['30035390', '08004344340'],
      phoneLabels: ['R. Metropolitana', 'Demais Regiões']
    },
    { 
      name: 'Mapfre', 
      logo: 'logos/Mapfre.png',
      whatsapp: 'wa.me/5540040101',
      phone: ['08007754545']
    },
    { 
      name: 'Porto Seguro', 
      logo: 'logos/Porto_Seguro.png',
      whatsapp: 'wa.me/551130039303',
      phone: ['03003376786']
    },
    { 
      name: 'Suhai', 
      logo: 'logos/Suhai.png',
      whatsapp: 'wa.me/5508003278424',
      phone: ['30030335', '08007842410'],
      phoneLabels: ['R. Metropolitana', 'Demais Regiões']
    },
    { 
      name: 'Sulamerica', 
      logo: 'logos/Sulamerica.png',
      phone: ['40044400']
    },
    { 
      name: 'Tokio Marine', 
      logo: 'logos/Tokio_Marine.png',
      whatsapp: 'wa.me/5511995786546',
      phone: ['08003186546']
    },
    { 
      name: 'Yelum',
      logo: 'logos/Yelum.png',
      whatsapp: 'wa.me/551132061414',
      phone: ['40045423', '08007014120'],
      phoneLabels: ['R. Metropolitana', 'Demais Regiões']
    },
  ];

  useEffect(() => {
    // Preload all insurance company logos
    const preloadImages = async () => {
      try {
        // Preload the WhatsApp icon
        const whatsappIcon = new Image();
        whatsappIcon.src = '/whatsapp.png';
        
        // Preload all company logos
        const promises = partners.map(partner => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if image fails to load
            img.src = partner.logo;
          });
        });
        
        await Promise.all(promises);
        setPreloadedImages(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        // Set preloaded to true even if there was an error to avoid blocking UI
        setPreloadedImages(true);
      }
    };
    
    preloadImages();
  }, []);

  const handleCompanyClick = (company: InsuranceCompany) => {
    setSelectedCompany(company);
  };

  const handleCloseDialog = () => {
    setSelectedCompany(null);
  };
  
  return (
    <section id="seguradoras-parceiras" className="pt-24 pb-16 bg-[#DADADB]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-[#FA0108]">
          Seguradoras Pareceiras<br></br><span className="text-base md:text-xl">Consulte aqui os Canais de Atendimento</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-16"
              onClick={() => handleCompanyClick(partner)}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-h-16 w-auto object-contain transition-all duration-300"
                onError={(e) => {
                  console.log(`Error loading logo for ${partner.name}: ${partner.logo}`);
                  // Fallback if the image fails to load
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedCompany && (
        <InsuranceCompanyDetails
          name={selectedCompany.name}
          logo={selectedCompany.logo}
          whatsapp={selectedCompany.whatsapp}
          phone={selectedCompany.phone}
          phoneLabels={selectedCompany.phoneLabels}
          isOpen={!!selectedCompany}
          onClose={handleCloseDialog}
        />
      )}
    </section>
  );
};

export default PartnersSection;
