-- Adicionar coluna construction_year
ALTER TABLE business_insurance_quotes
ADD COLUMN IF NOT EXISTS construction_year text;

-- Enable RLS
ALTER TABLE business_insurance_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts"
ON business_insurance_quotes
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow anonymous selects
CREATE POLICY "Allow anonymous selects"
ON business_insurance_quotes
FOR SELECT
TO anon
USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access"
ON business_insurance_quotes
TO service_role
USING (true)
WITH CHECK (true); 