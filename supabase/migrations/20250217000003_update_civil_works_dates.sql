-- Alterar o tipo das colunas de data para DATE
ALTER TABLE civil_works_insurance_quotes
ALTER COLUMN start_date TYPE DATE USING start_date::DATE,
ALTER COLUMN end_date TYPE DATE USING end_date::DATE; 