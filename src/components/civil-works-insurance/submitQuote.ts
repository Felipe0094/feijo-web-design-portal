import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const submitCivilWorksInsuranceQuote = async (values: any) => {
  try {
    // Clean up values before sending
    const cleanValues = {
      ...values,
      // Remove any undefined or null values
      coverage_options: Object.fromEntries(
        Object.entries(values.coverage_options).filter(([_, v]) => v != null)
      ),
      structure_types: Object.fromEntries(
        Object.entries(values.structure_types).filter(([_, v]) => v != null)
      )
    };

    // Submit to Supabase
    const { data, error } = await supabase
      .from('civil_works_insurance_quotes')
      .insert([cleanValues])
      .select();

    if (error) {
      console.error('Error submitting quote:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar cotação. Por favor, tente novamente."
      });
      throw error;
    }

    // Send email notification using Edge Function
    const { data: emailData, error: emailError } = await supabase.functions.invoke(
      'send-civil-works-insurance-quote',
      {
        body: {
          quoteData: cleanValues,
          quoteType: 'civil-works-insurance'
        }
      }
    );

    if (emailError) {
      console.error('Error sending email:', emailError);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar email de notificação. Por favor, tente novamente."
      });
      throw emailError;
    }

    toast({
      title: "Sucesso",
      description: "Cotação enviada com sucesso!"
    });
    return { success: true, data };

  } catch (error) {
    console.error('Error in submitCivilWorksInsuranceQuote:', error);
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao processar sua solicitação. Por favor, tente novamente."
    });
    throw error;
  }
};
