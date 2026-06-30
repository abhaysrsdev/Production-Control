import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle, PackageOpen } from 'lucide-react';

const ProductionPlanning = () => {
  const { id } = useParams();
  
  // Mock Data State
  const [status, setStatus] = useState('Pending');
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Mononet', average_consumption: '', unit: 'Meter' },
    { id: 2, name: 'BKS-01', average_consumption: '', unit: 'Piece' },
    { id: 3, name: 'Cancan', average_consumption: '', unit: 'Meter' },
    { id: 4, name: 'Haddi', average_consumption: '', unit: 'Piece' },
  ]);

  const [colors, setColors] = useState<{name: string, qty: number}[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [qtyInput, setQtyInput] = useState('');

  // Material Requirement state
  const [requirements, setRequirements] = useState<{
    id: string;
    material_name: string;
    color: string | null;
    average_consumption: string;
    planned_quantity: number;
    issue_quantity: string;
    unit: string;
  }[]>([]);

  const handleConsumptionChange = (id: number, value: string) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, average_consumption: value } : m));
  };

  const saveConsumption = () => {
    // Validate
    const invalid = materials.some(m => !m.average_consumption || Number(m.average_consumption) <= 0);
    if (invalid) {
      alert('Average Consumption must be greater than zero for all materials.');
      return;
    }
    setStatus('Consumption Saved');
  };

  const addColor = () => {
    if (!colorInput || !qtyInput || isNaN(Number(qtyInput)) || Number(qtyInput) <= 0) return;
    
    if (colors.find(c => c.name.toLowerCase() === colorInput.toLowerCase())) {
      alert("Color already exists!");
      return;
    }

    setColors([...colors, { name: colorInput, qty: Number(qtyInput) }]);
    setColorInput('');
    setQtyInput('');
  };

  const removeColor = (name: string) => {
    setColors(colors.filter(c => c.name !== name));
  };

  const totalQty = colors.reduce((acc, curr) => acc + curr.qty, 0);

  const saveColors = () => {
    setStatus('Material Planning Pending');
  };

  // Generate requirements when status becomes Material Planning Pending or colors change if already pending
  useEffect(() => {
    if ((status === 'Material Planning Pending' || status === 'Planning Completed')) {
      const generatedReqs: typeof requirements = [];
      
      materials.forEach(m => {
        const avgCons = Number(m.average_consumption) || 0;
        
        if (m.name.toUpperCase().startsWith('BKS')) {
          // Split by color
          colors.forEach(c => {
            const requiredQty = avgCons * c.qty;
            generatedReqs.push({
              id: `${m.name}-${c.name}`,
              material_name: `${m.name}-${c.name}`,
              color: c.name,
              average_consumption: m.average_consumption,
              planned_quantity: requiredQty, // Required Quantity = Average Consumption * Color Qty
              issue_quantity: '',
              unit: m.unit
            });
          });
        } else {
          // Single row
          const requiredQty = avgCons * totalQty;
          generatedReqs.push({
            id: m.name,
            material_name: m.name,
            color: null,
            average_consumption: m.average_consumption,
            planned_quantity: requiredQty, // Required Quantity = Average Consumption * Total Qty
            issue_quantity: '',
            unit: m.unit
          });
        }
      });

      // Preserve existing actual issue quantities if we are regenerating
      setRequirements(current => {
        return generatedReqs.map(newReq => {
          const existing = current.find(r => r.id === newReq.id);
          if (existing) {
            newReq.issue_quantity = existing.issue_quantity;
          }
          return newReq;
        });
      });
    }
  }, [status, materials, colors, totalQty]); // Re-run if colors or status changes

  const handleIssueChange = (id: string, value: string) => {
    setRequirements(requirements.map(r => r.id === id ? { ...r, issue_quantity: value } : r));
  };

  const saveMaterialRequirements = () => {
    // Validate
    const invalid = requirements.some(r => r.issue_quantity === '' || Number(r.issue_quantity) < 0);
    if (invalid) {
      alert('Please enter a valid actual issue quantity (>= 0) for all materials.');
      return;
    }
    setStatus('Planning Completed');
  };

  const isPlanningComplete = status === 'Planning Completed';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/production" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 transition-all border border-gray-200 bg-white md:bg-transparent md:border-transparent shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 flex-wrap">
              Production Planning 
              <span className="text-purple-600 bg-purple-100 px-3 py-1 text-sm md:text-base rounded-lg border border-purple-200">#208216</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Define bill of materials and variants.</p>
          </div>
        </div>
        <div className="md:ml-auto flex w-full md:w-auto">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border text-center w-full md:w-auto ${
            status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
            status === 'Consumption Saved' ? 'bg-blue-100 text-blue-700 border-blue-200' :
            status === 'Material Planning Pending' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
            'bg-green-100 text-green-700 border-green-200'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* Materials Section */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPlanningComplete ? 'opacity-70 pointer-events-none' : ''}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Average Consumption</h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-gray-500 text-sm">
                <th className="px-6 py-4 font-semibold w-1/3 whitespace-nowrap">Material Name</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Average Consumption</th>
                <th className="px-6 py-4 font-semibold w-1/4 whitespace-nowrap">Unit</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b border-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      min="0.001"
                      step="0.01"
                      className="w-full max-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g. 1.5"
                      value={m.average_consumption}
                      onChange={(e) => handleConsumptionChange(m.id, e.target.value)}
                      disabled={status !== 'Pending'}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{m.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {status === 'Pending' && (
          <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-end">
            <button 
              onClick={saveConsumption}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 md:py-2.5 rounded-xl font-medium transition-all shadow-sm w-full md:w-auto min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              Save Average Consumption
            </button>
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className={`space-y-6 ${status === 'Pending' ? 'hidden' : ''} ${isPlanningComplete ? 'opacity-70 pointer-events-none' : ''}`}>
        
        {/* Add Color Form */}
        {status === 'Consumption Saved' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in slide-in-from-bottom-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 md:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[44px]"
                  placeholder="e.g. Red, Maroon..."
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 md:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[44px]"
                  placeholder="0"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <button 
                  onClick={addColor}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full py-3 md:py-2.5 rounded-xl font-medium transition-all shadow-sm min-h-[44px]"
                >
                  <Plus className="w-5 h-5" />
                  Add Color
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Colors Table */}
        {colors.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Color</th>
                  <th className="px-6 py-4 font-semibold">Quantity</th>
                  {status === 'Consumption Saved' && <th className="px-6 py-4 font-semibold text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {colors.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      {c.name}
                    </td>
                    <td className="px-6 py-4 font-medium">{c.qty}</td>
                    {status === 'Consumption Saved' && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeColor(c.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                <tr className="bg-purple-50/50 border-t border-purple-100">
                  <td className="px-6 py-4 font-bold text-gray-900 text-right">Total Production Quantity:</td>
                  <td className="px-6 py-4 font-bold text-purple-700 text-xl" colSpan={status === 'Consumption Saved' ? 2 : 1}>{totalQty}</td>
                </tr>
              </tbody>
            </table>
            {status === 'Consumption Saved' && (
              <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={saveColors}
                  disabled={colors.length === 0}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 md:py-2.5 rounded-xl font-medium transition-all shadow-sm w-full md:w-auto min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  Save Colors
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NEW SECTION: Material Requirement / Material Issue Planning */}
      {(status === 'Material Planning Pending' || status === 'Planning Completed') && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 pt-8 border-t-2 border-dashed border-gray-200">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <PackageOpen className="w-6 h-6 text-indigo-600" />
              Material Requirement Planning
            </h2>
            <p className="text-gray-500 mt-1">Total Production Quantity: <span className="font-bold text-gray-800">{totalQty}</span></p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50 border-b border-indigo-100 text-indigo-900 text-sm">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Material</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Average Consumption</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Required Qty</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Actual Issue Qty</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        {req.color && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                        {req.material_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{req.average_consumption}</td>
                      <td className="px-6 py-4 text-gray-600 font-bold">{req.planned_quantity}</td>
                      <td className="px-6 py-4">
                        <input 
                          type="number"
                          min="0"
                          className={`w-full max-w-[150px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isPlanningComplete ? 'bg-gray-50 border-gray-100 text-gray-600' : 'border-gray-300'}`}
                          placeholder="e.g. 120"
                          value={req.issue_quantity}
                          onChange={(e) => handleIssueChange(req.id, e.target.value)}
                          disabled={isPlanningComplete}
                          required
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500">{req.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Card inside the section */}
            <div className="bg-gray-50/80 p-4 md:p-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Production Code</p>
                  <p className="font-bold text-gray-900 text-lg">208216</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Colors</p>
                  <p className="font-bold text-gray-900 text-lg">{colors.length}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Quantity</p>
                  <p className="font-bold text-gray-900 text-lg">{totalQty}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Materials</p>
                  <p className="font-bold text-gray-900 text-lg">{requirements.length}</p>
                </div>
              </div>
            </div>
          </div>

          {!isPlanningComplete && (
            <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4">
              <button 
                onClick={() => setStatus('Consumption Saved')}
                className="px-6 py-3.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors w-full md:w-auto text-center"
              >
                Back
              </button>
              <button 
                onClick={saveMaterialRequirements}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-green-600/20 text-lg w-full md:w-auto"
              >
                <CheckCircle className="w-5 h-5" />
                Save Material Requirement
              </button>
            </div>
          )}
          {isPlanningComplete && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 pt-4">
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4">
                 <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                 <div>
                    <h3 className="font-bold text-lg">Planning Completed Successfully!</h3>
                    <p className="text-green-700 mt-1 md:mt-0">All material requirements and issues have been saved and finalized.</p>
                 </div>
              </div>
              <div className="flex flex-col pt-2">
                <Link 
                  to={`/process-mapping/${id || '208216'}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 text-lg w-full md:w-auto md:self-end"
                >
                  Move to Process Allocation
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductionPlanning;
