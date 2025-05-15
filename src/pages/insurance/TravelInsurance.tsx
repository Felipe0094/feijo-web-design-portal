
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plane } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import TravelInsuranceQuoteForm from '@/components/travel-insurance/TravelInsuranceQuoteForm';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { TravelInsuranceFormData } from '@/components/travel-insurance/types';

const TravelInsurance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (formData: TravelInsuranceFormData) => {
    setIsSubmitting(true);
    try {
      let policyFilePath = null;
      
      // Upload policy file if exists
      if (policyFile) {
        const fileExt = policyFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `travel_insurance/${fileName}`;
        
        // Create storage bucket if it doesn't exist
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('insurance_documents');
        if (!bucketData) {
          await supabase.storage.createBucket('insurance_documents', {
            public: false,
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            fileSizeLimit: 10485760, // 10MB
          });
        }
        
        const { error: uploadError } = await supabase.storage
          .from('insurance_documents')
          .upload(filePath, policyFile);
          
        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }
        
        policyFilePath = filePath;
      }
      
      // Submit the form data to Supabase - using correct column names
      const { error } = await supabase
        .from('travel_insurance_quotes')
        .insert({
          full_name: formData.fullName,
          cpf: formData.cpf,
          phone: formData.phone,
          email: formData.email,
          trip_type: formData.tripType,
          destination: formData.destination,
          purpose: formData.purpose,
          departure_date: formData.departureDate,
          return_date: formData.returnDate,
          motorcycle_use: formData.motorcycleUse,
          passengers_0_to_64: formData.passengers0to64,
          passengers_65_to_70: formData.passengers65to70,
          passengers_71_to_85: formData.passengers71to85,
          seller: formData.seller,
          policy_file_path: policyFilePath
        });
        
      if (error) throw new Error(error.message);
      
      // Show success toast and ask if they want to contact a consultant
      toast.success("Cotação enviada com sucesso!", {
        description: "Nossa equipe entrará em contato em breve.",
        action: {
          label: "Falar com consultor",
          onClick: () => {
            const message = `Olá! Acabei de solicitar uma cotação de seguro viagem e gostaria de mais informações.`;
            const phone = "+5511999999999"; // Replace with actual consultant phone
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
          }
        }
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao enviar cotação", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8" id="top">
          <div className="flex items-center gap-4 mb-8">
            <Plane className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro Viagem</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Viaje com tranquilidade</h2>
              <p className="text-feijo-gray mb-4">
                O seguro viagem é essencial para garantir sua segurança e conforto durante suas viagens nacionais e internacionais.
                Conte com cobertura médica, assistência 24h e diversos outros benefícios.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Assistência médica internacional</li>
                <li>Cobertura de bagagem</li>
                <li>Cancelamento de viagem</li>
                <li>Atendimento em português 24h</li>
                <li>Cobertura COVID-19</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Coberturas principais</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Despesas médicas e hospitalares</li>
                <li className="flex items-center gap-2">✓ Traslado médico</li>
                <li className="flex items-center gap-2">✓ Extravio de bagagem</li>
                <li className="flex items-center gap-2">✓ Invalidez por acidente</li>
              </ul>
            </div>
          </div>

          <div className="my-8">
            <TravelInsuranceQuoteForm 
              onSuccess={handleFormSubmit} 
              onFileChange={handleFileChange}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelInsurance;
