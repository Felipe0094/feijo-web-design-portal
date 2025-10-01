export interface CivilWorksInsuranceFormData {
  full_name: string;
  document_number: string;
  phone: string;
  email: string;
  
  // Client history questions
  has_previous_insurance: boolean;
  has_previous_claims: boolean;
  
  // Risk object details
  construction_type: 'Residencial' | 'Comercial' | 'Industrial';
  service_type: 'Obra nova' | 'Ampliação' | 'Reforma' | 'Instalação/montagem/desmontagem';
  
  // Address
  zip_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement?: string;
  
  // Construction details
  services_description: string;
  start_date: Date;
  end_date: Date;
  upper_floors_count: number;
  basement_count: number;
  has_grounding_service: boolean;
  
  // Structure types
  structure_types: {
    wood: boolean;
    concrete: boolean;
    metal: boolean;
    other: boolean;
  };
  
  // Additional questions
  demolition_type: 'manual' | 'mechanical' | 'none';
  has_tie_rods: boolean;
  has_adjacent_buildings: boolean;
  has_water_table_lowering: boolean;
  has_excavation: boolean;
  has_terrain_containment: boolean;
  has_structural_reinforcement: boolean;
  contractors_count: number;
  
  // Coverage options - changed from boolean to number values
  coverage_options: {
    basic: number;
    property_owner_material_damages: number;
    cross_liability: number;
    employer_liability: number;
    moral_damages: number;
    project_error: number;
    water_leakage: number;
    pollution: number;
    resulting_moral_damages: number;
  };
  
  // Additional metadata
  seller: 'Felipe' | 'Renan' | 'Renata' | 'Gabriel' | 'Carlos Henrique';
}
