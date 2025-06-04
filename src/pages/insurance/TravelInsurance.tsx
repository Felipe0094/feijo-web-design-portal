import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plane, MessageSquare, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import TravelInsuranceQuoteForm from '@/components/travel-insurance/TravelInsuranceQuoteForm';
import { toast } from "sonner";
import { submitTravelQuote } from '@/components/travel-insurance/submitQuote';
import { useNavigate } from 'react-router-dom';
import { TravelInsuranceFormData } from '@/components/travel-insurance/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const TravelInsurance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const navigate = useNavigate();

  const handleFileChange = (file: File | null) => {
    setPolicyFile(file);
  };

  const handleFormSubmit = async (formData: TravelInsuranceFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitTravelQuote(formData);
      
      if (result.success) {
        // Save quote data for the dialog
        setQuoteData(formData);
        setShowDialog(true);
        
        toast.success("Cotação enviada com sucesso!", {
          description: "Nossa equipe entrará em contato em breve."
        });
      } else {
        throw new Error((result.error as Error).message);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao enviar cotação", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsapp = async () => {
    if (!quoteData) return;
    
    const consultantPhones = {
      "Carlos Henrique": "5522988156269",
      "Felipe": "5521972110705",
      "Gabriel": "5522999210343",
      "Renan": "5522988521503",
      "Renata": "5511994150565"
    };
    
    const phoneNumber = consultantPhones[quoteData.seller];
    if (!phoneNumber) {
      console.error('Número do WhatsApp não encontrado para o consultor:', quoteData.seller);
      return;
    }
    
    let message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de seguro viagem no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.fullName}\n` +
      `CPF: ${quoteData.cpf}\n` +
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
  );
};

export default TravelInsurance;
