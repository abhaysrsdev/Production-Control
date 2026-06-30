import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Import Production Order from Busy Software (Mocked API)
app.post('/api/production/import', async (req, res) => {
  const { production_code, materials } = req.body;
  if (!production_code || !materials || !Array.isArray(materials)) {
    return res.status(400).json({ error: 'Invalid payload. Required: production_code, materials[]' });
  }

  try {
    // 1. Create Production Order
    const { data: order, error: orderError } = await supabase
      .from('production_orders')
      .insert({ production_code, status: 'Pending' })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create BOM Materials
    const bomPayload = materials.map((m: any) => ({
      production_order_id: order.id,
      material_name: m.material_name,
      unit: m.unit
    }));

    const { error: bomError } = await supabase
      .from('bom_materials')
      .insert(bomPayload);

    if (bomError) throw bomError;

    // 3. Log Activity
    await supabase.from('activity_logs').insert({
      action: 'Imported Production Order',
      details: { production_code }
    });

    res.status(201).json({ message: 'Import successful', order });
  } catch (error: any) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// List Production Orders
app.get('/api/production', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('production_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Production Order Details
app.get('/api/production/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error: orderError } = await supabase
      .from('production_orders')
      .select(`
        *,
        bom_materials (*, material_average_consumption(*)),
        production_colors (*)
      `)
      .eq('id', id)
      .single();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ error: 'Not found' });

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save Material Average Consumption
app.post('/api/material-average-consumption', async (req, res) => {
  const { average_consumptions, production_order_id } = req.body;

  if (!average_consumptions || !Array.isArray(average_consumptions) || !production_order_id) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = average_consumptions.map((c: any) => ({
      bom_material_id: c.bom_material_id,
      average_consumption: c.average_consumption
    }));

    const { error } = await supabase
      .from('material_average_consumption')
      .upsert(payload, { onConflict: 'bom_material_id' });

    if (error) throw error;

    // Update status to 'Consumption Saved' if it's currently 'Pending'
    const { data: order } = await supabase
      .from('production_orders')
      .select('status')
      .eq('id', production_order_id)
      .single();

    if (order && order.status === 'Pending') {
      await supabase
        .from('production_orders')
        .update({ status: 'Consumption Saved' })
        .eq('id', production_order_id);
    }

    res.status(200).json({ message: 'Average Consumption saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save Colors
app.post('/api/colors', async (req, res) => {
  const { colors, production_order_id } = req.body;
  // colors array of { color_name, quantity }

  if (!colors || !Array.isArray(colors) || !production_order_id) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = colors.map((c: any) => ({
      production_order_id,
      color_name: c.color_name,
      quantity: c.quantity
    }));

    const { error } = await supabase
      .from('production_colors')
      .insert(payload);

    if (error) throw error;

    // Update status to 'Material Planning Pending'
    await supabase
      .from('production_orders')
      .update({ status: 'Material Planning Pending' })
      .eq('id', production_order_id);

    res.status(200).json({ message: 'Colors saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Color
app.delete('/api/colors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('production_colors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Color deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save Material Requirements
app.post('/api/material-requirements', async (req, res) => {
  const { requirements, production_order_id } = req.body;
  if (!requirements || !Array.isArray(requirements) || !production_order_id) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = requirements.map((reqItem: any) => ({
      production_order_id,
      material_name: reqItem.material_name,
      color: reqItem.color || null,
      average_consumption: reqItem.average_consumption,
      planned_quantity: reqItem.planned_quantity,
      issue_quantity: reqItem.issue_quantity,
      unit: reqItem.unit
    }));

    // In a real app we might delete existing ones or upsert, but for simplicity insert
    const { error } = await supabase
      .from('material_requirements')
      .insert(payload);

    if (error) throw error;

    // Update status to 'Planning Completed'
    await supabase
      .from('production_orders')
      .update({ status: 'Planning Completed' })
      .eq('id', production_order_id);

    res.status(200).json({ message: 'Requirements saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Material Requirements
app.get('/api/material-requirements/:productionId', async (req, res) => {
  try {
    const { productionId } = req.params;
    const { data, error } = await supabase
      .from('material_requirements')
      .select('*')
      .eq('production_order_id', productionId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// We also need to change the save colors logic to update status to 'Material Planning Pending' instead of 'Planning Completed'
app.put('/api/production/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { error } = await supabase
      .from('production_orders')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Status updated' });
  } catch(error:any) {
    res.status(500).json({ error: error.message });
  }
});


// Save Process Mapping
app.post('/api/process-mapping', async (req, res) => {
  const { mappings, production_order_id } = req.body;
  if (!mappings || !Array.isArray(mappings) || !production_order_id) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = mappings.map((m: any) => ({
      production_order_id,
      color_name: m.color_name,
      material_name: m.material_name,
      average_consumption: m.average_consumption,
      required_quantity: m.required_quantity,
      unit: m.unit,
      touching: m.touching,
      embroidery: m.embroidery,
      latkan: m.latkan,
      stitching: m.stitching
    }));

    const { error } = await supabase
      .from('process_material_mapping')
      .insert(payload);

    if (error) throw error;
    res.status(200).json({ message: 'Process mapping saved' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Process Queues
app.get('/api/process-queues/:processName', async (req, res) => {
  try {
    const { processName } = req.params;
    // processName will be touching, embroidery, latkan, or stitching
    if (!['touching', 'embroidery', 'latkan', 'stitching'].includes(processName)) {
      return res.status(400).json({ error: 'Invalid process queue name' });
    }

    const { data, error } = await supabase
      .from('process_material_mapping')
      .select('*, production_orders(production_code)')
      .eq(processName, true);

    if (error) throw error;
    res.status(200).json(data);
  } catch(error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Save Process Assignment
app.post('/api/process-assignment', async (req, res) => {
  const { production_order_id, assigned_to, priority, remarks, assigned_by } = req.body;
  if (!production_order_id || !assigned_to || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { error } = await supabase
      .from('process_assignments')
      .insert({
        production_order_id,
        assigned_to,
        priority,
        remarks,
        assigned_by,
        status: 'Pending'
      });

    if (error) throw error;

    // Update status to 'Process Allocated'
    await supabase
      .from('production_orders')
      .update({ status: 'Process Allocated' })
      .eq('id', production_order_id);

    res.status(200).json({ message: 'Process Assignment saved' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Process Assignments
app.get('/api/process-assignment/:productionId', async (req, res) => {
  try {
    const { productionId } = req.params;
    const { data, error } = await supabase
      .from('process_assignments')
      .select('*')
      .eq('production_order_id', productionId);

    if (error) throw error;
    res.status(200).json(data);
  } catch(error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Karigars
app.get('/api/karigars', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('karigars')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch(error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Save Karigar Allocation
app.post('/api/karigar-allocation', async (req, res) => {
  const { allocations, production_order_id } = req.body;
  if (!allocations || !Array.isArray(allocations) || !production_order_id) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const payload = allocations.map((a: any) => ({
      production_order_id,
      process_name: a.process_name,
      karigar_id: a.karigar_id,
      rate_per_piece: a.rate_per_piece,
      production_quantity: a.production_quantity,
      total_amount: a.total_amount,
      allocated_by: a.allocated_by,
      status: 'Pending'
    }));

    const { error } = await supabase
      .from('karigar_allocations')
      .insert(payload);

    if (error) throw error;

    // Update status to 'Karigar Allocated'
    await supabase
      .from('production_orders')
      .update({ status: 'Karigar Allocated' })
      .eq('id', production_order_id);

    res.status(200).json({ message: 'Karigar Allocations saved' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Karigar Allocations
app.get('/api/karigar-allocation/:productionId', async (req, res) => {
  try {
    const { productionId } = req.params;
    const { data, error } = await supabase
      .from('karigar_allocations')
      .select(`
        *,
        karigars (name)
      `)
      .eq('production_order_id', productionId);

    if (error) throw error;
    res.status(200).json(data);
  } catch(error:any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
