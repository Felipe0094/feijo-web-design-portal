-- Enable RLS
ALTER TABLE civil_works_insurance_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts"
ON civil_works_insurance_quotes
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow anonymous selects
CREATE POLICY "Allow anonymous selects"
ON civil_works_insurance_quotes
FOR SELECT
TO anon
USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access"
ON civil_works_insurance_quotes
TO service_role
USING (true)
WITH CHECK (true); 