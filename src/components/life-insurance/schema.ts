import { z } from "zod";

const lifeInsuranceSchema = z.object({
  standard_death_coverage: z.string().optional(),
  accidental_death_coverage: z.string().optional(),
  permanent_disability_coverage: z.string().optional(),
  seller: z.enum(["Carlos Henrique", "Felipe", "Renan", "Renata", "Gabriel"]).optional(),
}); 