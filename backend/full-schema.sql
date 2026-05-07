-- Full Umansky Toyota Schema (ERD + Security)
-- Run in Supabase SQL Editor

-- Auth users (Supabase built-in)
-- Users sign up with email=worker_id@umansky.toyota, password.

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

-- Parts
CREATE TABLE IF NOT EXISTS parts (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  price numeric NOT NULL,
  stock integer DEFAULT 0,
  location text,
  compatible_models text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  worker_id text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'employee' CHECK (role IN ('employee', 'manager'))
);

-- Inventory Updates (audit)
CREATE TABLE IF NOT EXISTS inventory_updates (
  id serial PRIMARY KEY,
  employee_id uuid REFERENCES profiles(id),
  part_id text REFERENCES parts(id),
  update_type text,
  quantity_changed integer,
  date timestamptz DEFAULT now()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS parts_updated ON parts;
CREATE TRIGGER parts_updated BEFORE UPDATE ON parts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies (Security)
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS parts_select ON parts;
CREATE POLICY parts_select ON parts FOR SELECT USING (true);

DROP POLICY IF EXISTS parts_update_manager ON parts;
CREATE POLICY parts_update_manager ON parts FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'manager'
);

-- Insert categories + mock
INSERT INTO categories (name) VALUES
('Engine'), ('Brakes'), ('HVAC'), ('Ignition'), ('Fluids'), ('Exterior'), ('Suspension')
ON CONFLICT (name) DO NOTHING;

-- Mock parts (full 8)
INSERT INTO parts (id, name, category, price, stock, location, compatible_models, description) VALUES
('TOY-0421', 'Oil Filter', 'Engine', 12.99, 48, 'A-12', 'Camry, Corolla, RAV4', 'OEM Toyota oil filter for 4-cylinder engines.'),
('TOY-1187', 'Brake Pad Set (Front)', 'Brakes', 54.99, 22, 'B-04', 'Camry 2018-2024, Avalon', 'Ceramic front brake pads, low-dust formula.'),
('TOY-2034', 'Air Filter', 'Engine', 19.49, 5, 'A-09', 'Tacoma, Tundra, 4Runner', 'High-flow OEM air filter for V6 engines.'),
('TOY-3310', 'Cabin Air Filter', 'HVAC', 21.99, 31, 'C-01', 'Prius, Corolla, Yaris', 'Activated carbon cabin air filter.'),
('TOY-4455', 'Spark Plug (x4)', 'Ignition', 38.00, 0, 'A-17', 'Corolla 2015-2022', 'Iridium spark plugs, set of 4.'),
('TOY-5520', 'Transmission Fluid', 'Fluids', 16.75, 14, 'D-03', 'All models (ATF WS)', 'Toyota WS automatic transmission fluid, 1 qt.'),
('TOY-6601', 'Wiper Blade (Driver)', 'Exterior', 28.50, 60, 'E-08', 'Camry, RAV4, Highlander', 'OEM beam wiper blade, 26-inch.'),
('TOY-7788', 'Rear Shock Absorber', 'Suspension', 89.99, 8, 'B-11', 'Tacoma 2016-2023', 'KYB Gas-a-Just rear shock absorber.')
ON CONFLICT (id) DO NOTHING;

-- Bulk seed: 100 additional unique parts (normalized order)
INSERT INTO parts (id, name, category, price, stock, location, compatible_models, description) VALUES
('TOY-8001','Engine Mount Bracket','Engine',24.99,12,'A-01','Camry, Corolla','OEM engine mount support bracket.'),
('TOY-8002','Oil Pan Gasket','Engine',18.50,19,'A-02','Camry, RAV4','Sealing gasket for oil pan replacement.'),
('TOY-8003','Timing Chain Guide','Engine',42.00,7,'A-03','Corolla, Prius','Durable timing chain guide rail.'),
('TOY-8004','Brake Caliper Pin Kit','Brakes',15.25,28,'B-01','Camry, Avalon','Front caliper slide pin service kit.'),
('TOY-8005','Rear Brake Rotor','Brakes',67.99,14,'B-02','RAV4, Highlander','OEM rear brake rotor disc.'),
('TOY-8006','Brake Fluid DOT3','Brakes',11.75,34,'D-01','All models','Toyota-approved DOT3 brake fluid.'),
('TOY-8007','Blower Motor Resistor','HVAC',29.99,16,'C-01','Corolla, Yaris','HVAC blower motor resistor module.'),
('TOY-8008','Heater Core Hose','HVAC',13.49,25,'C-02','Camry, Corolla','Reinforced heater core hose.'),
('TOY-8009','AC Compressor Clutch','HVAC',119.00,6,'C-03','RAV4, Tacoma','A/C compressor clutch assembly.'),
('TOY-8010','Ignition Coil','Ignition',49.99,21,'A-04','Corolla, Camry','Direct-fit ignition coil pack.'),
('TOY-8011','Crankshaft Position Sensor','Ignition',36.80,17,'A-05','Tacoma, Tundra','Engine crankshaft position sensor.'),
('TOY-8012','Spark Plug Wire Set','Ignition',27.50,9,'A-06','4Runner, Tacoma','High-temp spark plug wire set.'),
('TOY-8013','Coolant Long Life 1qt','Fluids',14.20,41,'D-02','All models','Toyota long-life engine coolant.'),
('TOY-8014','Power Steering Fluid','Fluids',12.60,23,'D-03','Camry, Corolla','OEM spec power steering fluid.'),
('TOY-8015','Differential Gear Oil','Fluids',19.95,11,'D-04','Tacoma, 4Runner','High-performance differential oil.'),
('TOY-8016','Front Grille Emblem','Exterior',38.40,8,'E-01','Camry, Corolla','Replacement front grille emblem.'),
('TOY-8017','Mirror Cover LH','Exterior',21.90,15,'E-02','RAV4, Highlander','Left-hand side mirror cover.'),
('TOY-8018','Door Weatherstrip','Exterior',26.75,13,'E-03','Corolla, Prius','Front door weatherstrip seal.'),
('TOY-8019','Strut Mount Bearing','Suspension',31.30,20,'B-03','Camry, Avalon','Front strut mount bearing.'),
('TOY-8020','Control Arm Bushing','Suspension',17.40,29,'B-04','RAV4, Highlander','Lower control arm bushing.'),
('TOY-8021','Sway Bar Link','Suspension',22.10,18,'B-05','Tacoma, 4Runner','Stabilizer sway bar end link.'),
('TOY-8022','Valve Cover Gasket','Engine',23.80,14,'A-07','Corolla, Yaris','Rubber valve cover gasket.'),
('TOY-8023','Fuel Injector Seal Kit','Engine',16.40,22,'A-08','Camry, RAV4','Injector O-ring and seal set.'),
('TOY-8024','Engine Air Duct','Engine',28.90,10,'A-09','Tacoma, Tundra','Intake air duct replacement.'),
('TOY-8025','Front Brake Pad Shim','Brakes',9.99,45,'B-06','Camry, Corolla','Noise-reduction brake shim set.'),
('TOY-8026','ABS Wheel Speed Sensor','Brakes',44.50,12,'B-07','RAV4, Prius','ABS front wheel speed sensor.'),
('TOY-8027','Parking Brake Cable','Brakes',35.00,11,'B-08','Avalon, Highlander','Rear parking brake cable.'),
('TOY-8028','Cabin Blower Motor','HVAC',79.99,9,'C-04','Corolla, Camry','HVAC cabin blower motor.'),
('TOY-8029','AC Condenser Fan','HVAC',92.40,7,'C-05','Prius, RAV4','Radiator condenser cooling fan.'),
('TOY-8030','Heater Control Valve','HVAC',24.70,16,'C-06','Yaris, Corolla','Coolant heater control valve.'),
('TOY-8031','Ignition Switch Assembly','Ignition',58.60,8,'A-10','Camry, Avalon','Steering column ignition switch.'),
('TOY-8032','Distributor Cap','Ignition',19.30,13,'A-11','Tacoma, 4Runner','High-voltage distributor cap.'),
('TOY-8033','Knock Sensor','Ignition',47.20,12,'A-12','Tundra, Sequoia','Engine knock sensor module.'),
('TOY-8034','Washer Fluid Concentrate','Fluids',8.99,38,'D-05','All models','Windshield washer fluid concentrate.'),
('TOY-8035','Transmission Filter Kit','Fluids',33.60,15,'D-06','Camry, Corolla','Automatic transmission filter kit.'),
('TOY-8036','Transfer Case Fluid','Fluids',22.80,9,'D-07','4Runner, Tacoma','Transfer case gear fluid.'),
('TOY-8037','Rear Spoiler Clip Set','Exterior',12.50,27,'E-04','Corolla, Camry','Clip set for rear spoiler mount.'),
('TOY-8038','Headlight Housing RH','Exterior',129.00,6,'E-05','RAV4, Highlander','Right headlight housing assembly.'),
('TOY-8039','Fog Light Bezel','Exterior',18.20,19,'E-06','Tacoma, Tundra','Front fog light trim bezel.'),
('TOY-8040','Rear Coil Spring','Suspension',66.70,10,'B-09','Prius, Corolla','Rear suspension coil spring.'),
('TOY-8041','Ball Joint Lower','Suspension',29.50,17,'B-10','Camry, Avalon','Lower suspension ball joint.'),
('TOY-8042','Shock Dust Boot','Suspension',14.90,24,'B-11','RAV4, Highlander','Dust boot for rear shock.'),
('TOY-8043','PCV Valve','Engine',10.40,31,'A-13','Corolla, Yaris','Positive crankcase ventilation valve.'),
('TOY-8044','Camshaft Seal','Engine',7.80,36,'A-14','Camry, RAV4','Front camshaft oil seal.'),
('TOY-8045','Throttle Body Gasket','Engine',6.95,42,'A-15','Tacoma, 4Runner','Throttle body mounting gasket.'),
('TOY-8046','Brake Master Cylinder','Brakes',118.75,5,'B-12','Camry, Corolla','Brake master cylinder assembly.'),
('TOY-8047','Rear Drum Shoe Set','Brakes',45.20,13,'B-13','Yaris, Prius C','Rear brake shoe kit.'),
('TOY-8048','Brake Booster Hose','Brakes',13.35,18,'B-14','Avalon, Highlander','Vacuum brake booster hose.'),
('TOY-8049','AC Expansion Valve','HVAC',34.00,14,'C-07','Corolla, Camry','A/C expansion valve.'),
('TOY-8050','Evaporator Temperature Sensor','HVAC',16.10,20,'C-08','Prius, RAV4','HVAC evaporator temp sensor.'),
('TOY-8051','Cabin Recirculation Actuator','HVAC',39.90,11,'C-09','Tacoma, Tundra','Air recirculation mode actuator.'),
('TOY-8052','Ignition Lock Cylinder','Ignition',63.40,7,'A-16','Camry, Corolla','Replacement ignition lock cylinder.'),
('TOY-8053','Starter Relay','Ignition',12.15,30,'A-17','RAV4, Highlander','Electrical starter relay.'),
('TOY-8054','Glow Plug Control Unit','Ignition',97.30,4,'A-18','Hilux, Land Cruiser','Diesel glow plug controller.'),
('TOY-8055','Engine Flush Additive','Fluids',15.85,22,'D-08','All models','Pre-service engine flush additive.'),
('TOY-8056','Radiator Stop Leak','Fluids',9.70,25,'D-09','All models','Cooling system stop leak formula.'),
('TOY-8057','Premium Washer Fluid','Fluids',7.25,40,'D-10','All models','All-season washer fluid.'),
('TOY-8058','Roof Rail End Cap','Exterior',11.60,18,'E-07','RAV4, Highlander','Roof rail end cap replacement.'),
('TOY-8059','Tailgate Handle','Exterior',27.20,12,'E-08','Tacoma, Tundra','Rear tailgate handle assembly.'),
('TOY-8060','Bumper Retainer Clip Set','Exterior',8.45,55,'E-09','Camry, Corolla','Front bumper retainer clip set.'),
('TOY-8061','Front Stabilizer Bushing','Suspension',13.90,21,'B-15','Prius, Corolla','Front stabilizer bar bushing.'),
('TOY-8062','Strut Bearing Plate','Suspension',26.30,15,'B-16','Camry, Avalon','Front strut bearing plate.'),
('TOY-8063','Rear Suspension Arm','Suspension',82.10,6,'B-17','RAV4, Highlander','Rear lateral suspension arm.'),
('TOY-8064','Engine Coolant Sensor','Engine',18.75,19,'A-19','Corolla, Camry','Coolant temperature sensor.'),
('TOY-8065','Oil Pressure Switch','Engine',14.25,23,'A-20','Tacoma, 4Runner','Engine oil pressure sending switch.'),
('TOY-8066','Intake Manifold Bolt Kit','Engine',21.70,13,'A-21','Tundra, Sequoia','Intake manifold bolt and washer kit.'),
('TOY-8067','Brake Bleeder Screw','Brakes',4.99,60,'B-18','All models','Universal brake bleeder screw.'),
('TOY-8068','Front Wheel Hub','Brakes',88.40,9,'B-19','Camry, Corolla','Front wheel hub assembly.'),
('TOY-8069','Hand Brake Lever Boot','Brakes',10.80,17,'B-20','Yaris, Prius','Parking brake lever boot.'),
('TOY-8070','HVAC Blend Door Actuator','HVAC',42.95,10,'C-10','Camry, Avalon','Blend door actuator motor.'),
('TOY-8071','Heater Hose Clamp Kit','HVAC',6.70,39,'C-11','Corolla, RAV4','Heater hose clamp assortment.'),
('TOY-8072','AC Pressure Switch','HVAC',23.55,14,'C-12','Tacoma, Tundra','A/C high-pressure switch.'),
('TOY-8073','Spark Plug Socket Tool','Ignition',12.30,26,'A-22','All models','Dedicated spark plug service socket.'),
('TOY-8074','Igniter Module','Ignition',74.20,8,'A-23','4Runner, Tacoma','Electronic ignition igniter module.'),
('TOY-8075','Coil Connector Pigtail','Ignition',9.95,33,'A-24','Camry, Corolla','Ignition coil connector harness.'),
('TOY-8076','Synthetic Oil 0W-20','Fluids',12.99,48,'D-11','All models','Toyota synthetic engine oil 0W-20.'),
('TOY-8077','CVT Fluid FE 1qt','Fluids',18.60,20,'D-12','Corolla, Prius','Toyota CVT FE fluid.'),
('TOY-8078','Engine Degreaser','Fluids',9.40,28,'D-13','All models','Professional engine degreaser.'),
('TOY-8079','Rear Wiper Arm','Exterior',24.10,16,'E-10','RAV4, Highlander','Rear wiper arm replacement.'),
('TOY-8080','Hood Lift Support','Exterior',31.85,14,'E-11','Camry, Avalon','Gas-charged hood lift support.'),
('TOY-8081','License Plate Lamp','Exterior',7.15,50,'E-12','Corolla, Prius','Rear license plate lamp.'),
('TOY-8082','Front Shock Cartridge','Suspension',93.50,7,'B-21','Tacoma, 4Runner','Front shock absorber cartridge.'),
('TOY-8083','Trailing Arm Bushing','Suspension',19.80,18,'B-22','RAV4, Highlander','Rear trailing arm bushing.'),
('TOY-8084','Ride Height Sensor Link','Suspension',27.65,12,'B-23','Land Cruiser, Sequoia','Suspension ride height link.'),
('TOY-8085','Cylinder Head Bolt','Engine',5.95,70,'A-25','Corolla, Camry','Torque-to-yield head bolt.'),
('TOY-8086','Water Pump Pulley','Engine',22.40,11,'A-26','Tacoma, Tundra','Engine water pump pulley.'),
('TOY-8087','Engine Ground Strap','Engine',8.75,27,'A-27','All models','Braided engine ground strap.'),
('TOY-8088','Brake Dust Shield','Brakes',17.60,15,'B-24','Camry, Corolla','Front brake rotor dust shield.'),
('TOY-8089','Caliper Bracket Bolt','Brakes',3.99,80,'B-25','RAV4, Highlander','Brake caliper bracket bolt.'),
('TOY-8090','Proportioning Valve','Brakes',56.30,6,'B-26','Tacoma, 4Runner','Brake proportioning valve unit.'),
('TOY-8091','HVAC Fresh Air Filter Housing','HVAC',33.20,10,'C-13','Prius, Corolla','Fresh-air intake filter housing.'),
('TOY-8092','Defroster Vent Grill','HVAC',14.55,19,'C-14','Camry, Avalon','Dashboard defroster vent grill.'),
('TOY-8093','AC Line O-Ring Kit','HVAC',11.35,32,'C-15','All models','A/C refrigerant line O-ring set.'),
('TOY-8094','Plug Gap Gauge','Ignition',4.50,44,'A-28','All models','Spark plug gap measuring tool.'),
('TOY-8095','Ignition Harness Clip','Ignition',2.95,90,'A-29','Camry, Corolla','Ignition wiring harness clip.'),
('TOY-8096','Coil Pack Mount Bolt','Ignition',1.99,120,'A-30','RAV4, Highlander','Ignition coil pack mounting bolt.'),
('TOY-8097','Coolant System Cleaner','Fluids',10.60,24,'D-14','All models','Cooling system cleaning additive.'),
('TOY-8098','Transmission Sealer','Fluids',8.90,21,'D-15','All models','Transmission leak sealer.'),
('TOY-8099','Fuel System Cleaner','Fluids',9.80,30,'D-16','All models','Fuel injector and line cleaner.'),
('TOY-8100','Fender Liner Clip','Exterior',1.75,150,'E-13','Camry, Corolla, RAV4','Universal fender liner retainer clip.')
ON CONFLICT (id) DO NOTHING;

-- Note: signUp: supabase.auth.signUp({email: 'EMP001@umansky.toyota', password}), then insert profile.
