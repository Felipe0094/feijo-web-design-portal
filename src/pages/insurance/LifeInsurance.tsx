
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, FileText, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import LifeInsuranceQuoteForm from '@/components/life-insurance/LifeInsuranceQuoteForm';
import { LifeInsuranceFormData } from '@/components/life-insurance/types';
import { submitQuote } from '@/components/life-insurance/submitQuote';

const LifeInsurance = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [quoteData, setQuoteData] = useState<LifeInsuranceFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: LifeInsuranceFormData, policyFile?: File) => {
    try {
      setIsSubmitting(true);
      
      console.log("Submitting life insurance quote data:", data);
      
      const result = await submitQuote(data, policyFile);
      
      if (result.success) {
        setQuoteData(data);
        // Show dialog after successful submission with a small delay to ensure state updates
        setTimeout(() => {
          setShowDialog(true);
          console.log("Dialog should be shown now");
        }, 300);
        toast.success("Cotação enviada com sucesso!");
      } else {
        toast.error(result.error || "Erro ao enviar cotação. Tente novamente.");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Erro ao enviar cotação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsapp = () => {
    if (!quoteData) return;

    let phoneNumber = "";
    
    switch (quoteData.seller) {
      case "Felipe":
        phoneNumber = "5521972110705";
        break;
      case "Renan":
        phoneNumber = "5522988521503";
        break;
      case "Renata":
        phoneNumber = "5511994150565";
        break;
      case "Gabriel":
        phoneNumber = "5522999210343";
        break;
      default:
        phoneNumber = "5521972110705";
    }
    
    let message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro de vida no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.full_name}\n` +
      `CPF: ${quoteData.document_number}\n` +
      `Email: ${quoteData.email}\n`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowDialog(false);
    toast.success("Obrigado pelo contato!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8" id="top">
          <div className="flex items-center gap-4 mb-8">
            <Heart className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro de Vida</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Garanta o futuro de quem você ama</h2>
              <p className="text-feijo-gray mb-4">
                O seguro de vida é um investimento no futuro da sua família, proporcionando proteção financeira
                e tranquilidade em momentos difíceis.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Morte natural ou acidental</li>
                <li>Invalidez permanente</li>
                <li>Doenças graves</li>
                <li>Assistência funeral</li>
                <li>Auxílio alimentação</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Coberturas adicionais</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Diária de internação hospitalar</li>
                <li className="flex items-center gap-2">✓ Doenças graves</li>
                <li className="flex items-center gap-2">✓ Invalidez funcional</li>
                <li className="flex items-center gap-2">✓ Morte acidental</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text-center flex items-center justify-center gap-2">
              <FileText className="text-feijo-red" size={24} />
              Formulário para Cotação
            </h2>
            <LifeInsuranceQuoteForm 
              onSuccess={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

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
                  className="bg-feijo-red hover:bg-red-700"
                  onClick={handleSendWhatsapp}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar via WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LifeInsurance;
