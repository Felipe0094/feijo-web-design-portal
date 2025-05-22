
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HealthInsuranceQuoteForm from '@/components/health-insurance/HealthInsuranceQuoteForm';

const HealthInsuranceQuote = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-feijo-darkgray mb-6">Cotação de Seguro Saúde</h1>
          <HealthInsuranceQuoteForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthInsuranceQuote;
