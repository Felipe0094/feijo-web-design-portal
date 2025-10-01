import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, FileText, CheckCircle2, Building2, ClipboardCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const BondInsurance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8" id="top">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="text-feijo-red" size={48} />
            <h1 className="text-3xl font-bold text-feijo-darkgray">Seguro Garantia de Licitação</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-feijo-darkgray">Garantia para suas Licitações</h2>
              <p className="text-feijo-gray mb-4">
                O seguro garantia de licitação é uma solução estratégica que permite sua empresa participar de licitações públicas
                e privadas, substituindo a caução em dinheiro e garantindo o cumprimento das obrigações assumidas.
              </p>
              <ul className="list-disc list-inside text-feijo-gray space-y-2 mb-6">
                <li>Garantia do licitante</li>
                <li>Garantia do executante</li>
                <li>Garantia de adiantamento</li>
                <li>Garantia de retenção</li>
                <li>Garantia de fiel cumprimento</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-feijo-darkgray">Tipos de Garantia</h3>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Garantia de proposta</li>
                <li className="flex items-center gap-2">✓ Garantia de execução</li>
                <li className="flex items-center gap-2">✓ Garantia de adiantamento</li>
                <li className="flex items-center gap-2">✓ Garantia de retenção</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-feijo-red" size={24} />
              <h3 className="text-xl font-semibold text-feijo-darkgray">Por que escolher nosso Seguro Garantia?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-3 text-feijo-gray">
                  <li className="flex items-center gap-2">✓ Processo ágil e simplificado</li>
                  <li className="flex items-center gap-2">✓ Coberturas personalizadas</li>
                  <li className="flex items-center gap-2">✓ Suporte especializado</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 text-feijo-gray">
                  <li className="flex items-center gap-2">✓ Análise rápida de propostas</li>
                  <li className="flex items-center gap-2">✓ Condições competitivas</li>
                  <li className="flex items-center gap-2">✓ Atendimento dedicado</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-feijo-red" size={24} />
                <h3 className="text-xl font-semibold text-feijo-darkgray">Vantagens</h3>
              </div>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Dispensa de caução em dinheiro</li>
                <li className="flex items-center gap-2">✓ Liberação de capital de giro</li>
                <li className="flex items-center gap-2">✓ Agilidade na contratação</li>
                <li className="flex items-center gap-2">✓ Redução de custos operacionais</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="text-feijo-red" size={24} />
                <h3 className="text-xl font-semibold text-feijo-darkgray">Documentação Necessária</h3>
              </div>
              <ul className="space-y-3 text-feijo-gray">
                <li className="flex items-center gap-2">✓ Documentos da empresa</li>
                <li className="flex items-center gap-2">✓ Balanço patrimonial</li>
                <li className="flex items-center gap-2">✓ DRE dos últimos exercícios</li>
                <li className="flex items-center gap-2">✓ Edital da licitação</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link to="/cadastro">
              <Button className="bg-feijo-red text-white hover:bg-red-600">
                Solicitar cotação
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BondInsurance;
