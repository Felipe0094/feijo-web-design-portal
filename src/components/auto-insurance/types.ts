
export interface AutoInsuranceFormData {
  document_number: string;
  full_name: string;
  phone: string;
  email: string;
  insurance_type: "new" | "renewal";
  
  // Optional fields
  address?: string;
  zip_code?: string;
  birth_date?: string;
  marital_status?: "single" | "married" | "divorced" | "widowed" | "other";
  gender?: "male" | "female" | "other";
  residence_type?: "house" | "apartment" | "condominium";
  
  is_new_vehicle?: boolean;
  license_plate?: string;
  chassis_number?: string;
  manufacture_year?: number;
  model_year?: number;
  model?: string;
  fuel_type?: string;
  is_financed?: boolean;
  is_armored?: boolean;
  has_natural_gas?: boolean;
  has_sunroof?: boolean;
  parking_zip_code?: string;
  
  has_home_garage?: boolean;
  has_automatic_gate?: boolean;
  has_work_garage?: boolean | string;  // Updated to allow string values
  has_school_garage?: boolean | string; // Updated to allow string values
  vehicle_usage?: "personal" | "work" | "passenger_transport";
  vehicles_at_residence?: number;
  covers_young_drivers?: boolean;
  condutor_menor?: string;
  
  is_driver_insured?: boolean;
  driver_document_number?: string;
  driver_full_name?: string;
  driver_birth_date?: string;
  driver_marital_status?: "single" | "married" | "divorced" | "widowed" | "other";
  driver_gender?: "male" | "female" | "other";
  driver_relationship?: string;
  driver_license_number?: string;
  driver_license_category?: string;
  driver_license_expiration?: string;
  driver_profession?: string;
  driver_income?: number;
  seller: "Felipe" | "Renan" | "Renata" | "Gabriel";
}
