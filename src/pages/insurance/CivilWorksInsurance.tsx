import React, { useState } from 'react';
import { MessageSquare, Building, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CivilWorksInsuranceQuoteForm from '@/components/civil-works-insurance/CivilWorksInsuranceQuoteForm';
import { CivilWorksInsuranceFormSchemaType } from '@/components/civil-works-insurance/schema';

const CivilWorksInsurance = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: CivilWorksInsuranceFormSchemaType) => {
    if (isSubmitting) return;
    
    console.log("Parent component: Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      setShowSuccessDialog(true);
      toast.success("Cotação enviada com sucesso!");
    } catch (error) {
      console.error("Error in parent component:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao enviar cotação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsapp = () => {
    if (!quoteData?.seller) return;

    const phoneNumbers = {
      "Carlos Henrique": "5511999999999",
      "Felipe": "5511999999999",
      "Gabriel": "5511999999999",
      "Renan": "5511999999999",
      "Renata": "5511999999999"
    };

    const phone = phoneNumbers[quoteData.seller as keyof typeof phoneNumbers] || "5511999999999";
    const message = `Olá! Gostaria de falar sobre a cotação de seguro de obra civil que acabei de solicitar.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Building className="text-[#fa0008]" size={24} />
            <h1 className="text-2xl font-bold text-feijo-darkgray">Seguro de Obras Civis</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Por que contratar um seguro de Obras Civis?</h2>
              <p className="text-feijo-gray mb-4">
                Proteja sua obra contra diversos riscos, garantindo segurança financeira para você, 
                seus trabalhadores e terceiros que possam ser afetados durante a execução da construção.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios inclusos</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Responsabilidade Civil</li>
                <li className="flex items-center gap-2">✓ Proteção contra danos a terceiros</li>
                <li className="flex items-center gap-2">✓ Cobertura para acidentes</li>
                <li className="flex items-center gap-2">✓ Assistência jurídica especializada</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text-center flex items-center justify-left gap-2">
              <FileText className="text-feijo-red" size={24} />
              Formulário para Cotação
            </h2>
            <CivilWorksInsuranceQuoteForm 
              onSuccess={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cotacao Enviada com Sucesso!</DialogTitle>
            <DialogDescription>
              Sua cotacao foi enviada com sucesso. Em breve entraremos em contato.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowSuccessDialog(false)}
            >
              Fechar
            </Button>
            <Button
              type="button"
              onClick={() => {
                window.open(
                  "https://wa.me/5511999999999?text=Olá, gostaria de mais informações sobre a cotação de seguro de obras civis.",
                  "_blank"
                );
              }}
            >
              Enviar WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default CivilWorksInsurance;