import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Building2,FileText} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusinessInsuranceQuoteForm from '@/components/business-insurance/BusinessInsuranceQuoteForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const BusinessInsurance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      // Upload policy file if it exists
      let policyFilePath = null;
      if (policyFile) {
        const fileExt = policyFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `policies/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-insurance')
          .upload(filePath, policyFile);

        if (uploadError) {
          throw uploadError;
        }

        policyFilePath = filePath;
      }

      // Prepare data for database
      const quoteData = {
        ...formData,
        policy_file_path: policyFilePath,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // Insert into database
      const { error: insertError } = await supabase
        .from('business_insurance_quotes')
        .insert([quoteData]);

      if (insertError) {
        throw insertError;
      }

      toast.success('Cotação enviada com sucesso!');
      navigate('/seguros/empresarial/success');

    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Erro ao enviar cotação. Tente novamente.');
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
            <Building2 className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro Empresarial</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Proteja seu negócio</h2>
              <p className="text-feijo-gray mb-4">
                O seguro empresarial oferece proteção abrangente para o seu negócio,
                incluindo instalações, equipamentos, estoque e responsabilidade civil.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Cobertura contra incêndio e explosão</li>
                <li>Proteção contra roubo e furto</li>
                <li>Danos elétricos</li>
                <li>Quebra de vidros</li>
                <li>Responsabilidade civil</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Planos personalizados</li>
                <li className="flex items-center gap-2">✓ Assistência 24 horas</li>
                <li className="flex items-center gap-2">✓ Atendimento rápido</li>
                <li className="flex items-center gap-2">✓ Tranquilidade para seu negócio</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text-center flex items-center justify-left gap-2">
              <FileText className="text-[#FA0108]" size={24} />
              Formulário para Cotação
            </h2>
            <BusinessInsuranceQuoteForm 
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

export default BusinessInsurance;