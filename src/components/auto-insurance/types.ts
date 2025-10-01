import { Database } from '@/integrations/supabase/types';

export type Gender = Database['public']['Enums']['gender'];
export type MaritalStatus = Database['public']['Enums']['marital_status'];
export type ResidenceType = Database['public']['Enums']['residence_type'];
export type InsuranceType = Database['public']['Enums']['insurance_type'];
export type VehicleUsage = Database['public']['Enums']['vehicle_usage'];

export interface AutoInsuranceFormData {
  full_name: string;
  document_number: string;
  email: string;
  phone: string;
  birth_date?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;
  
  // Address information
  zip_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement?: string;
  
  // Vehicle information
  model?: string;
  license_plate?: string;
  chassis_number?: string;
  manufacture_year?: number;
  model_year?: number;
  fuel_type?: string;
  is_new_vehicle?: boolean;
  is_financed?: boolean;
  is_armored?: boolean;
  armoring_value?: number;
  has_natural_gas?: boolean;
  gas_kit_value?: number;
  has_sunroof?: boolean;
  insurance_type?: InsuranceType;
  
  // Driver information
  is_driver_insured?: boolean;
  driver_full_name?: string;
  driver_document_number?: string;
  driver_birth_date?: string;
  driver_gender?: Gender;
  driver_marital_status?: MaritalStatus;
  driver_residence_type?: ResidenceType;
  driver_relationship?: string;
  driver_license_number?: string;
  driver_license_category?: string;
  driver_license_expiration?: string;
  driver_profession?: string;
  driver_income?: number;
  covers_young_drivers?: boolean;
  youngest_driver_age?: number;
  condutor_menor?: string;

  // Garage information
  residence_type?: ResidenceType;
  vehicles_at_residence?: number;
  has_home_garage?: boolean;
  has_automatic_gate?: boolean;
  has_work_garage?: "true" | "false" | "not_applicable";
  has_school_garage?: "true" | "false" | "not_applicable";
  vehicle_usage?: VehicleUsage;
  parking_zip_code?: string;
  
  // Seller information
  seller: 'Carlos Henrique' | 'Felipe' | 'Gabriel' | 'Renan' | 'Renata';
}
