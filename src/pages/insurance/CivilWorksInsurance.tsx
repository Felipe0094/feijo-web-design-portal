
import React, { useState } from 'react';
import { MessageSquare, Building, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CivilWorksInsuranceQuoteForm from '@/components/civil-works-insurance/CivilWorksInsuranceQuoteForm';
import { submitCivilWorksInsuranceQuote } from '@/components/civil-works-insurance/submitQuote';
import { CivilWorksInsuranceFormData } from '@/components/civil-works-insurance/types';

const CivilWorksInsurance = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: CivilWorksInsuranceFormData) => {
    try {
      setIsSubmitting(true);
      
      console.log("Submitting quote data:", data);
      
      const result = await submitCivilWorksInsuranceQuote(data);
      
      if (result.success) {
        setQuoteData(data);
        setShowDialog(true);
        toast.success("Cotação enviada com sucesso!", {
          description: "Nossa equipe entrará em contato em breve."
        });
      } else {
        console.error("Error result:", result.error);
        toast.error(`Erro ao enviar cotação: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Erro ao enviar cotação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsapp = () => {
    if (!quoteData?.seller) return;

    const consultantPhones = {
      "Carlos Henrique": "5522988156269",
      "Felipe": "5521972110705",
      "Gabriel": "5522999210343",
      "Renan": "5522988521503",
      "Renata": "5511994150565"
    };

    const phoneNumber = consultantPhones[quoteData.seller as keyof typeof consultantPhones];
    if (!phoneNumber) {
      console.error('Número do WhatsApp não encontrado para o consultor:', quoteData.seller);
      return;
    }

    const message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro de obras civis no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.full_name}\n` +
      `CPF/CNPJ: ${quoteData.document_number}\n` +
      `Email: ${quoteData.email}\n`
    );

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowDialog(false);
    toast.success("Obrigado pelo contato!");
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

export default CivilWorksInsurance;
