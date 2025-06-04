import { AutoInsuranceFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail, getRecipients } from '@/lib/email-templates';

export const submitQuote = async (values: AutoInsuranceFormData, policyFile?: File) => {
  try {
    console.log("Submitting quote data:", values);
    console.log("Policy file:", policyFile);
    
    // Convert the manufacture_year to number if it exists
    const manufacture_year = values.manufacture_year !== undefined ? 
      values.manufacture_year : undefined;

    // Campos obrigatórios
    const requiredFields = ['document_number', 'full_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !values[field]);
    
    if (missingFields.length > 0) {
      return { 
        success: false, 
        error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` 
      };
    }

    // Lista de campos que existem na tabela
    const validFields = [
      'id',
      'created_at',
      'insurance_type',
      'is_financed',
      'is_armored',
      'has_natural_gas',
      'has_sunroof',
      'has_home_garage',
      'has_automatic_gate',
      'has_work_garage',
      'has_school_garage',
      'vehicle_usage',
      'vehicles_at_residence',
      'covers_young_drivers',
      'is_driver_insured',
      'driver_birth_date',
      'driver_marital_status',
      'driver_gender',
      'driver_residence_type',
      'armoring_value',
      'gas_kit_value',
      'birth_date',
      'marital_status',
      'gender',
      'residence_type',
      'is_new_vehicle',
      'manufacture_year',
      'model_year',
      'document_number',
      'full_name',
      'street',
      'neighborhood',
      'city',
      'state',
      'number',
      'complement',
      'zip_code',
      'phone',
      'email',
      'condutor_menor',
      'driver_relationship',
      'parking_zip_code',
      'policy_file_path',
      'license_plate',
      'chassis_number',
      'driver_document_number',
      'driver_full_name',
      'model',
      'fuel_type',
      'seller',
      'driver_license_number',
      'driver_license_category',
      'driver_license_expiration',
      'driver_profession',
      'driver_income',
      'youngest_driver_age'
    ];

    // Garantir que os campos de endereço estejam presentes
    const addressFields = {
      street: values.street || '',
      neighborhood: values.neighborhood || '',
      city: values.city || '',
      state: values.state || '',
      number: values.number || '',
      complement: values.complement || '',
      zip_code: values.zip_code || ''
    };

    // Filtra apenas os campos válidos e garante que os campos obrigatórios estejam presentes
    const filteredValues = {
      document_number: values.document_number,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      ...addressFields,
      ...Object.entries(values)
        .filter(([key]) => validFields.includes(key) && !requiredFields.includes(key))
        .reduce((obj, [key, value]) => ({
          ...obj,
          [key]: value
        }), {})
    };

    console.log("Filtered values to be saved:", filteredValues);

    // Insert quote data into database
    const quoteData = {
      ...filteredValues,
      manufacture_year: manufacture_year,
      seller: values.seller
    };

    const recipients = getRecipients(values.seller);

    const { data, error: quoteError } = await supabase
      .from('auto_insurance_quotes')
      .insert([
        quoteData
      ])
      .select()
      .single();
    
    if (quoteError) {
      console.error("Error inserting auto insurance quote:", quoteError);
      return { success: false, error: quoteError.message };
    }

    // Prepare policy file if exists
    let policyFileData = null;
    if (policyFile) {
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Content = base64String.split(',')[1];
          resolve(base64Content);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(policyFile);
      });

      policyFileData = {
        content: base64File,
        filename: policyFile.name,
        type: policyFile.type
      };
    }

    // Send email using the Edge Function
    const { success, error: emailError } = await sendEmail({
      to: recipients,
      subject: `Nova Cotação de Seguro Auto - ${values.full_name}`,
      content: JSON.stringify(filteredValues), // Enviando todos os dados para o template do Edge Function
      replyTo: values.email,
      attachments: policyFileData ? [policyFileData] : undefined
    });

    if (!success) {
      console.error("Error sending email notification:", emailError);
      return { success: true, error: "Cotação salva, mas houve erro no envio do email." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting auto insurance quote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
