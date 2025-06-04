-- Adicionar novos campos à tabela auto_insurance_quotes
ALTER TABLE auto_insurance_quotes
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS complement text,
ADD COLUMN IF NOT EXISTS is_financed boolean,
ADD COLUMN IF NOT EXISTS is_armored boolean,
ADD COLUMN IF NOT EXISTS armoring_value numeric,
ADD COLUMN IF NOT EXISTS has_natural_gas boolean,
ADD COLUMN IF NOT EXISTS gas_kit_value numeric,
ADD COLUMN IF NOT EXISTS has_sunroof boolean,
ADD COLUMN IF NOT EXISTS is_driver_insured boolean,
ADD COLUMN IF NOT EXISTS driver_full_name text,
ADD COLUMN IF NOT EXISTS driver_document_number text,
ADD COLUMN IF NOT EXISTS driver_birth_date date,
ADD COLUMN IF NOT EXISTS driver_gender gender,
ADD COLUMN IF NOT EXISTS driver_marital_status marital_status,
ADD COLUMN IF NOT EXISTS driver_residence_type residence_type,
ADD COLUMN IF NOT EXISTS driver_relationship text,
ADD COLUMN IF NOT EXISTS driver_license_number text,
ADD COLUMN IF NOT EXISTS driver_license_category text,
ADD COLUMN IF NOT EXISTS driver_license_expiration date,
ADD COLUMN IF NOT EXISTS driver_profession text,
ADD COLUMN IF NOT EXISTS driver_income numeric,
ADD COLUMN IF NOT EXISTS youngest_driver_age integer,
ADD COLUMN IF NOT EXISTS vehicles_at_residence integer,
ADD COLUMN IF NOT EXISTS parking_zip_code text;

-- Atualizar a coluna address para ser apenas o endereço completo
ALTER TABLE auto_insurance_quotes
ALTER COLUMN address TYPE text; 