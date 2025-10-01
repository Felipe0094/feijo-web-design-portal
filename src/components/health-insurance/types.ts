
export interface Dependent {
  id: string;
  name: string;
  cpf: string;
  birth_date: string;
  age?: number;
  relationship?: string;
}

export interface HealthInsuranceFormData {
  document_number: string;
  responsible_name: string;
  phone: string;
  email: string;
  insured_name: string;
  insured_cpf: string;
  insured_birth_date: string;
  insured_age?: number;
  municipality: string;
  room_type: string;
  has_copayment: 'yes' | 'no';
  notes?: string;
  dependents: Dependent[];
  seller: 'Carlos Henrique' | 'Felipe' | 'Gabriel' | 'Renan' | 'Renata';
}
