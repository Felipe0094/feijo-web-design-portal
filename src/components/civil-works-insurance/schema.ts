import * as z from "zod";

export const civilWorksInsuranceFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  document_number: z.string().min(11, "CPF/CNPJ é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  
  has_previous_insurance: z.boolean().default(false),
  has_previous_claims: z.boolean().default(false),
  
  construction_type: z.enum(["Residencial", "Comercial", "Industrial"]).default("Residencial"),
  service_type: z.enum(["Obra nova", "Ampliação", "Reforma", "Instalação/montagem/desmontagem"]).default("Obra nova"),
  
  zip_code: z.string().min(8, "CEP é obrigatório"),
  street: z.string().min(3, "Logradouro é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "UF deve ter 2 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  
  services_description: z.string().min(10, "Descrição dos serviços deve ter pelo menos 10 caracteres").optional().default(""),
  start_date: z.coerce.date({
    required_error: "Data de início é obrigatória",
  }),
  end_date: z.coerce.date({
    required_error: "Data de término é obrigatória",
  }),
  upper_floors_count: z.number().min(0, "Quantidade inválida").default(0),
  basement_count: z.number().min(0, "Quantidade inválida").default(0),
  has_grounding_service: z.boolean().default(false),
  
  structure_types: z.object({
    wood: z.boolean().default(false),
    concrete: z.boolean().default(true),
    metal: z.boolean().default(false),
    other: z.boolean().default(false),
  }).refine(data => data.wood || data.concrete || data.metal || data.other, {
    message: "Selecione pelo menos um tipo de estrutura",
  }),
  
  demolition_type: z.enum(["manual", "mechanical", "none"]).default("none"),
  has_tie_rods: z.boolean().default(false),
  has_adjacent_buildings: z.boolean().default(false),
  has_water_table_lowering: z.boolean().default(false),
  has_excavation: z.boolean().default(false),
  has_terrain_containment: z.boolean().default(false),
  has_structural_reinforcement: z.boolean().default(false),
  contractors_count: z.number().min(0, "Quantidade inválida").default(1),
  
  coverage_options: z.object({
    basic: z.number().min(0, "Valor inválido").default(0),
    property_owner_material_damages: z.number().min(0, "Valor inválido").default(0),
    cross_liability: z.number().min(0, "Valor inválido").default(0),
    employer_liability: z.number().min(0, "Valor inválido").default(0),
    moral_damages: z.number().min(0, "Valor inválido").default(0),
    project_error: z.number().min(0, "Valor inválido").default(0),
    water_leakage: z.number().min(0, "Valor inválido").default(0),
    pollution: z.number().min(0, "Valor inválido").default(0),
    resulting_moral_damages: z.number().min(0, "Valor inválido").default(0),
  }),
  
  seller: z.enum(["Carlos Henrique", "Felipe", "Gabriel", "Renan", "Renata"]),
});

export type CivilWorksInsuranceFormSchemaType = z.infer<typeof civilWorksInsuranceFormSchema>;
