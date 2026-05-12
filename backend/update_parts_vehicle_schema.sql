-- Updated Parts Table Schema with Vehicle Filtering Support
-- Run this in Supabase SQL Editor to add vehicle fields and sample data

-- 1. Add vehicle columns if they don't exist
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_year integer;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_make text DEFAULT 'Toyota';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_model text;

-- 2. Create indexes for filtering performance
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_year ON parts(vehicle_year);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_make ON parts(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_model ON parts(vehicle_model);

-- 3. Update existing parts with vehicle data (mapped from compatible_models)
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Camry' WHERE compatible_models ILIKE '%camry%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Corolla' WHERE compatible_models ILIKE '%corolla%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'RAV4' WHERE compatible_models ILIKE '%rav4%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Tacoma' WHERE compatible_models ILIKE '%tacoma%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Prius' WHERE compatible_models ILIKE '%prius%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Tundra' WHERE compatible_models ILIKE '%tundra%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = '4Runner' WHERE compatible_models ILIKE '%4runner%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Highlander' WHERE compatible_models ILIKE '%highlander%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Yaris' WHERE compatible_models ILIKE '%yaris%';
UPDATE parts SET vehicle_year = 2024, vehicle_model = 'Avalon' WHERE compatible_models ILIKE '%avalon%';

-- 4. Insert sample parts WITH vehicle data (unique parts specifically for filtering demo)
INSERT INTO parts (id, name, category, price, stock, location, vehicle_year, vehicle_make, vehicle_model, compatible_models, description) VALUES
('TOY-V101', '2025 Camry Oil Filter', 'Engine', 12.99, 50, 'A-01', 2025, 'Toyota', 'Camry', 'Camry 2025', 'OEM oil filter for 2025 Camry 4-cyl.'),
('TOY-V102', '2025 Camry Air Filter', 'Engine', 19.49, 35, 'A-02', 2025, 'Toyota', 'Camry', 'Camry 2025', 'High-flow air filter for 2025 Camry V6.'),
('TOY-V103', '2024 Camry Brake Pads (Front)', 'Brakes', 54.99, 25, 'B-01', 2024, 'Toyota', 'Camry', 'Camry 2024', 'Ceramic front brake pads for 2024 Camry.'),
('TOY-V104', '2024 Corolla Oil Filter', 'Engine', 12.99, 45, 'A-03', 2024, 'Toyota', 'Corolla', 'Corolla 2024', 'OEM oil filter for 2024 Corolla.'),
('TOY-V105', '2024 Corolla Air Filter', 'Engine', 18.99, 40, 'A-04', 2024, 'Toyota', 'Corolla', 'Corolla 2024', 'High-flow air filter for 2024 Corolla.'),
('TOY-V106', '2024 RAV4 Oil Filter', 'Engine', 13.99, 30, 'A-05', 2024, 'Toyota', 'RAV4', 'RAV4 2024', 'OEM oil filter for 2024 RAV4.'),
('TOY-V107', '2024 RAV4 Brake Pads (Front)', 'Brakes', 59.99, 20, 'B-02', 2024, 'Toyota', 'RAV4', 'RAV4 2024', 'Ceramic front brake pads for 2024 RAV4.'),
('TOY-V108', '2023 RAV4 Strut Assembly', 'Suspension', 129.99, 12, 'B-03', 2023, 'Toyota', 'RAV4', 'RAV4 2023', 'Complete front strut for 2023 RAV4.'),
('TOY-V109', '2022 Tacoma Oil Filter', 'Engine', 14.99, 25, 'A-06', 2022, 'Toyota', 'Tacoma', 'Tacoma 2022', 'OEM oil filter for 2022 Tacoma.'),
('TOY-V110', '2022 Tacoma Air Filter', 'Engine', 21.99, 20, 'A-07', 2022, 'Toyota', 'Tacoma', 'Tacoma 2022', 'High-flow air filter for 2022 Tacoma V6.'),
('TOY-V111', '2024 Prius Cabin Air Filter', 'HVAC', 24.99, 35, 'C-01', 2024, 'Toyota', 'Prius', 'Prius 2024', 'Premium cabin air filter for 2024 Prius.'),
('TOY-V112', '2024 Highlander Oil Filter', 'Engine', 15.99, 18, 'A-08', 2024, 'Toyota', 'Highlander', 'Highlander 2024', 'OEM oil filter for 2024 Highlander.'),
('TOY-V113', '2023 4Runner Oil Filter', 'Engine', 16.99, 22, 'A-09', 2023, 'Toyota', '4Runner', '4Runner 2023', 'OEM oil filter for 2023 4Runner.'),
('TOY-V114', '2022 Tundra Air Filter', 'Engine', 25.99, 15, 'A-10', 2022, 'Toyota', 'Tundra', 'Tundra 2022', 'High-flow air filter for 2022 Tundra.'),
('TOY-V115', '2021 Yaris Oil Filter', 'Engine', 11.99, 28, 'A-11', 2021, 'Toyota', 'Yaris', 'Yaris 2021', 'OEM oil filter for 2021 Yaris.')
ON CONFLICT (id) DO NOTHING;

-- 5. Grant permissions for authenticated users
GRANT SELECT, INSERT, UPDATE ON TABLE parts TO authenticated;

-- 6. Ensure RLS policies include vehicle fields (if using RLS)
-- Already covered by existing policies, but verify:
DROP POLICY IF EXISTS parts_select ON parts;
CREATE POLICY parts_select ON parts FOR SELECT TO authenticated USING (true);

-- Verify the schema
SELECT id, name, category, price, stock, vehicle_year, vehicle_make, vehicle_model, compatible_models 
FROM parts 
WHERE vehicle_year IS NOT NULL
ORDER BY vehicle_year DESC, vehicle_model, name
LIMIT 20;
