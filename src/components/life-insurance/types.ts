export interface LifeInsuranceFormData {
  insurance_type: "new" | "renewal";
  full_name: string;
  document_number: string;
  birth_date: string;
  phone: string;
  email: string;
  weight: number;
  height: number;
  monthly_income: number | null;
  smoker: boolean;
  practices_sports: boolean;
  sports_description?: string;
  retirement_status: "none" | "time_age" | "disability";
  standard_death_coverage: number | null;
  accidental_death_coverage: number | null;
  permanent_disability_coverage: number | null;
  seller: 'Carlos Henrique' | 'Felipe' | 'Renan' | 'Renata' | 'Gabriel';
}
