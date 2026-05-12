-- Add vehicle filtering columns to parts table
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_year integer;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_make text DEFAULT 'Toyota';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_model text;

-- Create indexes for filtering performance
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_year ON parts(vehicle_year);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_make ON parts(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_model ON parts(vehicle_model);

-- Update existing parts with sample structured data (optional - based on compatible_models)
UPDATE parts SET 
  vehicle_year = 2024,
  vehicle_model = 'Camry'
WHERE compatible_models ILIKE '%camry%';

UPDATE parts SET 
  vehicle_year = 2024,
  vehicle_model = 'Corolla'
WHERE compatible_models ILIKE '%corolla%';

UPDATE parts SET 
  vehicle_year = 2024,
  vehicle_model = 'RAV4'
WHERE compatible_models ILIKE '%rav4%';

UPDATE parts SET 
  vehicle_year = 2024,
  vehicle_model = 'Tacoma'
WHERE compatible_models ILIKE '%tacoma%';

UPDATE parts SET 
  vehicle_year = 2024,
  vehicle_model = 'Prius'
WHERE compatible_models ILIKE '%prius%';

-- Seed more parts with vehicle data for testing
INSERT INTO parts (id, name, category, price, stock, location, vehicle_year, vehicle_make, vehicle_model, compatible_models, description) VALUES
('TOY-V001', '2024 Camry Oil Filter', 'Engine', 12.99, 50, 'A-01', 2024, 'Toyota', 'Camry', 'Camry 2024', 'OEM oil filter for 2024 Camry.'),
('TOY-V002', '2024 Corolla Air Filter', 'Engine', 19.49, 35, 'A-02', 2024, 'Toyota', 'Corolla', 'Corolla 2024', 'High-flow air filter for 2024 Corolla.'),
('TOY-V003', '2023 RAV4 Brake Pads', 'Brakes', 54.99, 25, 'B-01', 2023, 'Toyota', 'RAV4', 'RAV4 2023', 'Ceramic brake pads for 2023 RAV4.'),
('TOY-V004', '2022 Tacoma Strut', 'Suspension', 89.99, 15, 'B-02', 2022, 'Toyota', 'Tacoma', 'Tacoma 2022', 'KYB struts for 2022 Tacoma.')
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON TABLE parts TO authenticated;
