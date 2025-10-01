import React, { useState } from 'react';
import { MessageSquare, Car, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AutoInsuranceQuoteForm from '@/components/auto-insurance/AutoInsuranceQuoteForm';
import { submitQuote } from '@/components/auto-insurance/submitQuote';
import { AutoInsuranceFormData } from '@/components/auto-insurance/types';

const AutoInsurance = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [quoteData, setQuoteData] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (data: AutoInsuranceFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean the data before submission (remove undefined values and objects with _type)
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, v]) => {
          if (key === 'seller') return true; // Sempre manter o campo seller
          if (v === undefined) return false;
          if (v !== null && typeof v === 'object' && '_type' in v) return false;
          return true;
        })
      );
      
      // Log the data being sent to help with debugging
      console.log("Submitting quote data:", cleanData);
      console.log("Policy file:", policyFile);
      
      const result = await submitQuote(cleanData as AutoInsuranceFormData, policyFile || undefined);
      
      if (result.success) {
        setQuoteData(cleanData);
        setShowDialog(true);
        toast.success("Cotação enviada com sucesso!");
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
      case "Carlos Henrique":
        phoneNumber = "5522988156269"; // Phone number for Carlos Henrique
        break;
      case "Felipe":
        phoneNumber = "5521972110705"; // Phone number for Felipe
        break;
      case "Gabriel":
        phoneNumber = "5522999210343"; // Phone number for Gabriel
        break;
      case "Renan":
        phoneNumber = "5522988521503"; // Phone number for Renan
        break;
      case "Renata":
        phoneNumber = "5511994150565"; // Phone number for Renata
        break;
      default:
        phoneNumber = "5521972110705"; // Default to Felipe's number
    }
    
    let message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro auto no site da Feijó Corretora.\n\n` +
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
        <div className="container mx-auto px-4 py-8" id="top">
          <div className="flex items-center gap-4 mb-8">
            <Car className="text-[#FA0108]" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro de Automóveis</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Por que contratar um seguro auto?</h2>
              <p className="text-feijo-gray mb-4">
                Proteja seu veículo contra diversos tipos de sinistros, incluindo roubo, furto, colisão e danos a terceiros.
                Com o seguro auto da Feijó Seguros, você dirige com tranquilidade sabendo que está protegido.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios inclusos</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Cobertura contra roubo e furto</li>
                <li className="flex items-center gap-2">✓ Proteção em caso de acidentes</li>
                <li className="flex items-center gap-2">✓ Assistência 24 horas</li>
                <li className="flex items-center gap-2">✓ Cobertura para terceiros</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text- flex items-center justify-left gap-2">
 <FileText className="text-feijo-red" size={24} />
 Formulário para Cotação
 </h2>
            <AutoInsuranceQuoteForm 
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

export default AutoInsurance;
