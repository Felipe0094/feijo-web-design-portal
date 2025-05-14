import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Home, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import HomeInsuranceQuoteForm from '@/components/home-insurance/HomeInsuranceQuoteForm';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const HomeInsurance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      let policyFilePath = null;
      
      // Upload policy file if exists
      if (policyFile) {
        const fileExt = policyFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `home_insurance/${fileName}`;
        
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
      
      // Submit the form data to Supabase
      const { error } = await supabase
        .from('home_insurance_quotes')
        .insert({
          ...formData,
          policy_file_path: policyFilePath
        });
        
      if (error) throw new Error(error.message);
      
      toast.success("Cotação enviada com sucesso! Nossa equipe entrará em contato em breve.");
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente.");
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
            <Home className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro Residencial</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Proteja seu Lar</h2>
              <p className="text-feijo-gray mb-4">
                O seguro residencial oferece proteção completa para sua casa, seus bens e sua família,
                garantindo tranquilidade e segurança em qualquer situação.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Proteção contra incêndio</li>
                <li>Cobertura para roubo e furto</li>
                <li>Danos elétricos</li>
                <li>Desastres naturais</li>
                <li>Responsabilidade civil</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Assistência 24 horas</li>
                <li className="flex items-center gap-2">✓ Coberturas personalizadas</li>
                <li className="flex items-center gap-2">✓ Atendimento rápido</li>
                <li className="flex items-center gap-2">✓ Preços competitivos</li>
              </ul>
            </div>
          </div>

          <div className="my-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text-center flex items-center justify-left gap-2">
              <FileText className="text-feijo-red" size={24} />
              Formulário para Cotação
            </h2>
            <HomeInsuranceQuoteForm 
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

export default HomeInsurance;
