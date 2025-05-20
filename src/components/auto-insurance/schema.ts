
import * as z from "zod"

export const formSchema = z.object({
  document_number: z.string(),
  full_name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  insurance_type: z.enum(["new", "renewal"]),
  address: z.string(),
  zip_code: z.string(),
  birth_date: z.string(),
  marital_status: z.string(),
  gender: z.string(),
  residence_type: z.string(),
  is_new_vehicle: z.boolean(),
  license_plate: z.string(),
  chassis_number: z.string(),
  manufacture_year: z.number().optional(),
  model_year: z.number().optional(),
  model: z.string(),
  fuel_type: z.string(),
  seller: z.enum(["Felipe", "Renan", "Renata", "Gabriel"]),
  covers_young_drivers: z.boolean().optional(),
  condutor_menor: z.string().optional(),
})
