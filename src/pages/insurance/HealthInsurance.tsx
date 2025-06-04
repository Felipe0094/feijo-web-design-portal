import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Activity, Users, Heart, MessageSquare, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import HealthInsuranceQuoteForm from '@/components/health-insurance/HealthInsuranceQuoteForm';
import { HealthInsuranceFormData } from '@/components/health-insurance/types';
import { submitQuote } from '@/components/health-insurance/submitQuote';

const HealthInsurance = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [quoteData, setQuoteData] = useState<HealthInsuranceFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlanFile, setCurrentPlanFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setCurrentPlanFile(file);
  };

  const handleFormSubmit = async (data: HealthInsuranceFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean the data before submission
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => {
          if (v === undefined) return false;
          if (v !== null && typeof v === 'object' && '_type' in v) return false;
          return true;
        })
      );
      
      console.log("Submitting health insurance quote data:", cleanData);
      console.log("Current plan file:", currentPlanFile);
      
      const result = await submitQuote(cleanData as HealthInsuranceFormData, currentPlanFile || undefined);
      
      if (result.success) {
        setQuoteData(cleanData as HealthInsuranceFormData);
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
      case "Felipe":
        phoneNumber = "5521972110705"; // Phone number for Felipe
        break;
      case "Renan":
        phoneNumber = "5522988521503"; // Phone number for Renan
        break;
      case "Renata":
        phoneNumber = "5511994150565"; // Phone number for Renata
        break;
      case "Gabriel":
        phoneNumber = "5522999210343"; // Phone number for Gabriel
        break;
      default:
        phoneNumber = "5522988521503"; // Default to Renan
    }
    
    const dependentsCount = quoteData.dependents?.length || 0;
    
    let message = encodeURIComponent(
      `Olá ${quoteData.seller}, acabei de enviar meus dados para cotação de plano de saúde no site da Feijó Corretora.\n\n` +
      `Nome: ${quoteData.responsible_name}\n` +
      `CNPJ: ${quoteData.document_number}\n` +
      `Email: ${quoteData.email}\n` +
      `Titular: ${quoteData.insured_name}\n` +
      `Dependentes: ${dependentsCount}\n`
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
            <Activity className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Plano de Saúde</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Cuide da sua saúde</h2>
              <p className="text-feijo-gray mb-4">
                Tenha acesso aos melhores hospitais e profissionais de saúde com um plano
                que atende às necessidades de você e sua família.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Ampla rede credenciada</li>
                <li>Cobertura nacional</li>
                <li>Atendimento 24 horas</li>
                <li>Exames e consultas</li>
                <li>Internação hospitalar</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Benefícios inclusos</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Consultas com especialistas</li>
                <li className="flex items-center gap-2">✓ Exames laboratoriais</li>
                <li className="flex items-center gap-2">✓ Cirurgias</li>
                <li className="flex items-center gap-2">✓ Pronto atendimento</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-feijo-darkgray text-center flex items-center justify-left gap-2">
 <FileText className="text-feijo-red" size={24} />
 Formulário para Cotação</h2>
            <HealthInsuranceQuoteForm 
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

export default HealthInsurance;
