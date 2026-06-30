-- Database Schema for Production Control System

-- Create Users Table (Custom users table, in addition to Supabase Auth if needed)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Production Manager', 'Store Manager', 'Operator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Orders Table
CREATE TABLE IF NOT EXISTS public.production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Consumption Saved', 'Planning Completed', 'In Production', 'Completed', 'Rejected')),
  created_date DATE DEFAULT CURRENT_DATE,
  planner_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOM Materials Table
CREATE TABLE IF NOT EXISTS public.bom_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material Average Consumption Table
CREATE TABLE IF NOT EXISTS public.material_average_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_material_id UUID NOT NULL UNIQUE REFERENCES public.bom_materials(id) ON DELETE CASCADE,
  average_consumption DECIMAL(10, 3) NOT NULL CHECK (average_consumption > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Colors Table
CREATE TABLE IF NOT EXISTS public.production_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(production_order_id, color_name) -- Prevent duplicate colors per order
);

-- Production Logs Table (History tracking)
CREATE TABLE IF NOT EXISTS public.production_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  status_from TEXT,
  status_to TEXT NOT NULL,
  changed_by TEXT, -- Or UUID referencing users table
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs Table (Audit trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions and Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON public.production_orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bom_materials_updated_at BEFORE UPDATE ON public.bom_materials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_material_average_consumption_updated_at BEFORE UPDATE ON public.material_average_consumption FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_production_colors_updated_at BEFORE UPDATE ON public.production_colors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Seed some initial users for testing (Password handled by Supabase Auth ideally, but here we just seed the role data)
INSERT INTO public.users (email, role) VALUES 
('admin@shreeradhastudio.com', 'Admin'),
('pm@shreeradhastudio.com', 'Production Manager'),
('sm@shreeradhastudio.com', 'Store Manager'),
('operator@shreeradhastudio.com', 'Operator')
ON CONFLICT (email) DO NOTHING;

-- Material Requirements Table
CREATE TABLE IF NOT EXISTS public.material_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  color TEXT,
  average_consumption DECIMAL(10, 3) NOT NULL CHECK (average_consumption > 0),
  planned_quantity INTEGER NOT NULL,
  issue_quantity INTEGER NOT NULL CHECK (issue_quantity >= 0),
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_material_requirements_updated_at BEFORE UPDATE ON public.material_requirements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Process Allocations Table
CREATE TABLE IF NOT EXISTS public.process_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  assigned_employee TEXT,
  assigned_team TEXT,
  priority TEXT DEFAULT 'Medium',
  start_date DATE,
  end_date DATE,
  remarks TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_process_allocations_updated_at BEFORE UPDATE ON public.process_allocations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Process Material Mapping Table
CREATE TABLE IF NOT EXISTS public.process_material_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  color_name TEXT,
  material_name TEXT NOT NULL,
  average_consumption DECIMAL(10, 3) NOT NULL,
  required_quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  touching BOOLEAN DEFAULT FALSE,
  embroidery BOOLEAN DEFAULT FALSE,
  latkan BOOLEAN DEFAULT FALSE,
  stitching BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_process_material_mapping_updated_at BEFORE UPDATE ON public.process_material_mapping FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Process Assignments Table
CREATE TABLE IF NOT EXISTS public.process_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  assigned_to TEXT NOT NULL,
  priority TEXT NOT NULL,
  remarks TEXT,
  status TEXT DEFAULT 'Pending',
  assigned_by TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_process_assignments_updated_at BEFORE UPDATE ON public.process_assignments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Karigars Table
CREATE TABLE IF NOT EXISTS public.karigars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT,
  specialization TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_karigars_updated_at BEFORE UPDATE ON public.karigars FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Seed Karigars
INSERT INTO public.karigars (name, specialization) VALUES
('Ahmad', 'Touching'),
('Prashant', 'Embroidery'),
('Prabhat', 'Embroidery'),
('Imran', 'Stitching'),
('Raju', 'Latkan'),
('Shubham', 'All'),
('Manish', 'All'),
('Abhay', 'All'),
('Sonu', 'All'),
('Sahil', 'All')
ON CONFLICT DO NOTHING;

-- Karigar Allocations Table
CREATE TABLE IF NOT EXISTS public.karigar_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  karigar_id UUID NOT NULL REFERENCES public.karigars(id) ON DELETE RESTRICT,
  rate_per_piece DECIMAL(10, 2) NOT NULL CHECK (rate_per_piece > 0),
  production_quantity INTEGER NOT NULL CHECK (production_quantity > 0),
  total_amount DECIMAL(12, 2) NOT NULL,
  allocated_by TEXT,
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_karigar_allocations_updated_at BEFORE UPDATE ON public.karigar_allocations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


