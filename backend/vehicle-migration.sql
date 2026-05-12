-- Vehicle Data Migration Script for Umansky Toyota Parts
-- Run in Supabase SQL Editor - Simple version

-- Step 1: Add vehicle columns
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_year integer;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_make text DEFAULT 'Toyota';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS vehicle_model text;

-- Step 2: Update existing parts with vehicle data
UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Camry',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%Camry%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Corolla',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%Corolla%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'RAV4',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%RAV4%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Tacoma',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%Tacoma%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Prius',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%Prius%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Camry',
    vehicle_year = 2023
WHERE vehicle_year IS NULL AND compatible_models LIKE '%2023%';

UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'All',
    vehicle_year = 2024
WHERE vehicle_year IS NULL AND compatible_models LIKE '%All%';

-- Update remaining null parts with default values
UPDATE parts SET 
    vehicle_make = 'Toyota',
    vehicle_model = 'Camry',
    vehicle_year = 2024
WHERE vehicle_year IS NULL;

-- Step 3: Create indexes for vehicle filtering performance
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_year ON parts(vehicle_year);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_make ON parts(vehicle_make);
CREATE INDEX IF NOT EXISTS idx_parts_vehicle_model ON parts(vehicle_model);

-- Step 4: Insert additional parts WITH vehicle year/model data (from compatible_models)
INSERT INTO parts (id, name, category, price, stock, location, vehicle_year, vehicle_make, vehicle_model, compatible_models, description) VALUES
('TOY-V001', 'Oil Filter Premium', 'Engine', 14.99, 35, 'A-01', 2024, 'Toyota', 'Camry', 'Camry 2024', 'Premium oil filter for Camry'),
('TOY-V002', 'Oil Filter Standard', 'Engine', 11.99, 45, 'A-02', 2023, 'Toyota', 'Corolla', 'Corolla 2023', 'Standard oil filter for Corolla'),
('TOY-V003', 'Air Filter Sport', 'Engine', 24.99, 20, 'A-03', 2024, 'Toyota', 'RAV4', 'RAV4 2024', 'Sport air filter for RAV4'),
('TOY-V004', 'Cabin Air Filter', 'HVAC', 22.99, 28, 'C-01', 2023, 'Toyota', 'Prius', 'Prius 2023', 'Activated carbon cabin filter'),
('TOY-V005', 'Brake Pad Set Front', 'Brakes', 59.99, 15, 'B-01', 2024, 'Toyota', 'Camry', 'Camry 2024', 'Ceramic brake pads front'),
('TOY-V006', 'Brake Pad Set Rear', 'Brakes', 49.99, 18, 'B-02', 2024, 'Toyota', 'Camry', 'Camry 2024', 'Ceramic brake pads rear'),
('TOY-V007', 'Spark Plug Iridium', 'Ignition', 9.99, 60, 'A-04', 2023, 'Toyota', 'Corolla', 'Corolla 2023', 'Iridium spark plug single'),
('TOY-V008', 'Wiper Blade 22in', 'Exterior', 29.99, 25, 'E-01', 2024, 'Toyota', 'RAV4', 'RAV4 2024', '22 inch wiper blade'),
('TOY-V009', 'Wiper Blade 26in', 'Exterior', 32.99, 22, 'E-02', 2024, 'Toyota', 'Camry', 'Camry 2024', '26 inch wiper blade'),
('TOY-V010', 'Transmission Fluid', 'Fluids', 18.99, 30, 'D-01', 2023, 'Toyota', 'Tacoma', 'Tacoma 2023', 'WS transmission fluid'),
('TOY-V011', 'Battery 12V', 'Engine', 159.99, 12, 'A-05', 2024, 'Toyota', 'Camry', 'Camry 2024', '12V automotive battery'),
('TOY-V012', 'Radiator Hose Upper', 'Engine', 34.99, 18, 'A-06', 2023, 'Toyota', 'Highlander', 'Highlander 2023', 'Upper radiator hose'),
('TOY-V013', 'Coolant Temperature Sensor', 'Engine', 19.99, 22, 'A-07', 2024, 'Toyota', '4Runner', '4Runner 2024', 'ECT sensor'),
('TOY-V014', 'Oxygen Sensor', 'Ignition', 79.99, 10, 'A-08', 2023, 'Toyota', 'Tacoma', 'Tacoma 2023', 'Downstream O2 sensor'),
('TOY-V015', 'ABS Sensor Front', 'Brakes', 64.99, 14, 'B-03', 2024, 'Toyota', 'RAV4', 'RAV4 2024', 'Front ABS wheel speed sensor'),
('TOY-V016', 'Wheel Hub Assembly', 'Brakes', 129.99, 8, 'B-04', 2024, 'Toyota', 'Corolla', 'Corolla 2024', 'Front wheel hub assembly'),
('TOY-V017', 'Strut Assembly Front', 'Suspension', 189.99, 6, 'B-05', 2023, 'Toyota', 'Camry', 'Camry 2023', 'Complete front strut'),
('TOY-V018', 'Shock Absorber Rear', 'Suspension', 99.99, 10, 'B-06', 2023, 'Toyota', 'RAV4', 'RAV4 2023', 'Rear shock absorber'),
('TOY-V019', 'Control Arm Lower', 'Suspension', 149.99, 8, 'B-07', 2024, 'Toyota', 'Highlander', 'Highlander 2024', 'Lower control arm'),
('TOY-V020', 'Tie Rod End', 'Suspension', 44.99, 16, 'B-08', 2023, 'Toyota', 'Tacoma', 'Tacoma 2023', 'Outer tie rod end')
ON CONFLICT (id) DO NOTHING;

-- Verify the data was applied
SELECT id, name, vehicle_year, vehicle_make, vehicle_model, category, stock, price 
FROM parts 
WHERE vehicle_year IS NOT NULL
ORDER BY vehicle_year DESC, vehicle_model, name
LIMIT 20;
