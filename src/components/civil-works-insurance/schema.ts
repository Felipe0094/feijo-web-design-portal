
import * as z from "zod";

export const civilWorksInsuranceFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  document_number: z.string().min(11, "CPF/CNPJ é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  
  has_previous_insurance: z.boolean(),
  has_previous_claims: z.boolean(),
  
  construction_type: z.enum(["Residencial", "Comercial", "Industrial"]),
  service_type: z.enum(["Obra nova", "Ampliação", "Reforma", "Instalação/montagem/desmontagem"]),
  
  zip_code: z.string().min(8, "CEP é obrigatório"),
  street: z.string().min(3, "Logradouro é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "UF deve ter 2 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  
  services_description: z.string().min(10, "Descrição dos serviços é obrigatória"),
  start_date: z.date({
    required_error: "Data de início é obrigatória",
  }),
  end_date: z.date({
    required_error: "Data de término é obrigatória",
  }),
  upper_floors_count: z.number().min(0, "Quantidade inválida"),
  basement_count: z.number().min(0, "Quantidade inválida"),
  has_grounding_service: z.boolean(),
  
  structure_types: z.object({
    wood: z.boolean(),
    concrete: z.boolean(),
    metal: z.boolean(),
    other: z.boolean(),
  }).refine(data => data.wood || data.concrete || data.metal || data.other, {
    message: "Selecione pelo menos um tipo de estrutura",
  }),
  
  demolition_type: z.enum(["manual", "mechanical", "none"]),
  has_tie_rods: z.boolean(),
  has_adjacent_buildings: z.boolean(),
  has_water_table_lowering: z.boolean(),
  has_excavation: z.boolean(),
  has_terrain_containment: z.boolean(),
  has_structural_reinforcement: z.boolean(),
  contractors_count: z.number().min(0, "Quantidade inválida"),
  
  coverage_options: z.object({
    basic: z.number().min(0, "Valor inválido"),
    property_owner_material_damages: z.number().min(0, "Valor inválido"),
    cross_liability: z.number().min(0, "Valor inválido"),
    employer_liability: z.number().min(0, "Valor inválido"),
    moral_damages: z.number().min(0, "Valor inválido"),
    project_error: z.number().min(0, "Valor inválido"),
    water_leakage: z.number().min(0, "Valor inválido"),
    pollution: z.number().min(0, "Valor inválido"),
    resulting_moral_damages: z.number().min(0, "Valor inválido"),
  }),
  
  seller: z.enum(["Felipe", "Renan", "Renata", "Gabriel"]).default("Felipe"),
});

export type CivilWorksInsuranceFormSchemaType = z.infer<typeof civilWorksInsuranceFormSchema>;
