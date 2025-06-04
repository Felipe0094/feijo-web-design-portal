import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Building2, FileText, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusinessInsuranceQuoteForm from '@/components/business-insurance/BusinessInsuranceQuoteForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const BusinessInsurance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleSendWhatsapp = () => {
    if (!quoteData?.seller) return;

    let phoneNumber = "";
    
    switch (quoteData.seller) {
      case "Carlos Henrique":
        phoneNumber = "5522988156269";
        break;
      case "Felipe":
        phoneNumber = "5521972110705";
        break;
      case "Gabriel":
        phoneNumber = "5522999210343";
        break;
      case "Renan":
        phoneNumber = "5522988521503";
        break;
      case "Renata":
        phoneNumber = "5511994150565";
        break;
    }

    if (!phoneNumber) {
      toast.error("Consultor não encontrado. Por favor, entre em contato com a Feijó Corretora.");
      setShowDialog(false);
      return;
    }

    const message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro empresarial no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.full_name}\n` +
      `CNPJ: ${quoteData.cnpj}\n` +
      `Email: ${quoteData.email}\n`
    );

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowDialog(false);
    toast.success("Obrigado pelo contato!");
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
        document_number: formData.cnpj,
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

      setQuoteData(formData);
      setShowDialog(true);
      toast.success("Cotação enviada com sucesso!", {
        description: "Nossa equipe entrará em contato em breve."
      });

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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar mensagem para o consultor</DialogTitle>
            <DialogDescription>
              Deseja enviar uma mensagem para {quoteData?.seller} e informar que já enviou os dados para a cotação?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Não enviar
            </Button>
            <Button 
              className="bg-[#FA0108] hover:bg-red-700"
              onClick={handleSendWhatsapp}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default BusinessInsurance;