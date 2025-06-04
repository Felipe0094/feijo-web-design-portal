
import React, { useState } from 'react';
import { Home, FileText, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HomeInsuranceQuoteForm from '@/components/home-insurance/HomeInsuranceQuoteForm';
import { submitHomeInsuranceQuote } from '@/components/home-insurance/submitQuote';
import { HomeInsuranceFormData } from '@/components/home-insurance/types';

const HomeInsurance = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [quoteData, setQuoteData] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (data: HomeInsuranceFormData) => {
    try {
      setIsSubmitting(true);
      
      // Log the data being sent to help with debugging
      console.log("Submitting quote data:", data);
      console.log("Policy file:", policyFile);
      
      const result = await submitHomeInsuranceQuote(data, policyFile);
      
      if (result.success) {
        setQuoteData(data);
        setShowDialog(true);
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

  const handleSendWhatsapp = async () => {
    if (!quoteData) return;

    let phoneNumber = "";
    
    switch (quoteData.seller) {
      case "Felipe":
        phoneNumber = "5521972110705"; // Phone number for Felipe
        break;
      case "Renan":
        phoneNumber = "5522988521503";
        break;
      case "Renata":
        phoneNumber = "5511994150565";
        break;
      case "Gabriel":
        phoneNumber = "5522999210343"; // Gabriel's phone number
        break;
      default:
        phoneNumber = "5521972110705"; // Default number
    }
    
    let message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro residencial no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.full_name}\n` +
      `CPF/CNPJ: ${quoteData.document_number}\n` +
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Home className="text-[#FA0108]" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro Residencial</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Por que contratar um seguro residencial?</h2>
              <p className="text-feijo-gray mb-4">
                Proteja sua residência contra diversos tipos de sinistros, incluindo incêndio, roubo e danos elétricos.
                Com o seguro residencial da Feijó Seguros, você garante a tranquilidade para você e sua família.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios inclusos</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Cobertura contra incêndio, raio e explosão</li>
                <li className="flex items-center gap-2">✓ Proteção contra roubo e furto qualificado</li>
                <li className="flex items-center gap-2">✓ Danos elétricos</li>
                <li className="flex items-center gap-2">✓ Assistência 24 horas</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeInsurance;
