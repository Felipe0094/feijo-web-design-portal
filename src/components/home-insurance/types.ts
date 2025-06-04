export interface HomeInsuranceFormData {
  insurance_type: "new" | "renewal";
  full_name: string;
  document_number: string;
  birth_date?: string;
  phone: string;
  email: string;
  
  residence_type: "house" | "apartment";
  construction_type: "superior" | "solid" | "mixed" | "inferior";
  occupation_type: "habitual" | "vacation";
  
  zip_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement?: string;
  
  security_equipment?: string[];
  
  additional_data?: {
    is_owner: boolean;
    is_rural: boolean;
    is_gated_community: boolean;
    is_vacant_or_construction: boolean;
    is_historical: boolean;
    has_professional_activity: boolean;
    is_next_to_vacant: boolean;
  };
  
  insured_value?: number;
  electrical_damage_value?: number;
  glass_value?: number;
  flooding_value?: number;
  pipe_leakage_value?: number;
  theft_value?: number;
  other_coverage_notes?: string;
  
  seller: "Carlos Henrique" | "Felipe" | "Renan" | "Renata" | "Gabriel";
}
