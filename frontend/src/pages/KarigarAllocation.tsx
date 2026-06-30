import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Users, PlayCircle } from 'lucide-react';

const KarigarAllocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Karigars from DB
  const karigars = [
    'Ahmad', 'Prashant', 'Prabhat', 'Imran', 'Raju', 'Shubham', 'Manish', 'Abhay', 'Sonu', 'Sahil'
  ];

  // Selected processes from previous mapping
  const [allocations, setAllocations] = useState([
    { id: '1', process: 'Touching', karigar: '', rate: '', qty: 100 },
    { id: '2', process: 'Embroidery', karigar: '', rate: '', qty: 100 },
    { id: '3', process: 'Latkan', karigar: '', rate: '', qty: 100 },
    { id: '4', process: 'Stitching', karigar: '', rate: '', qty: 100 },
  ]);

  const [status, setStatus] = useState('Process Allocated');

  const handleUpdate = (index: number, field: string, value: string) => {
    const newAllocations = [...allocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setAllocations(newAllocations);
  };

  const grandTotal = allocations.reduce((acc, curr) => {
    const amount = (Number(curr.rate) || 0) * curr.qty;
    return acc + amount;
  }, 0);

  const saveAllocation = () => {
    // Validate
    const invalid = allocations.some(a => !a.karigar || !a.rate || Number(a.rate) <= 0);
    if (invalid) {
      alert('Please select a Karigar and enter a valid Rate (> 0) for all processes.');
      return;
    }
    setStatus('Karigar Allocated');
  };

  const isAllocated = status === 'Karigar Allocated';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/process-mapping/${id}`} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
            Karigar Allocation
            <span className="text-blue-600 bg-blue-100 px-3 py-1 text-base rounded-lg border border-blue-200">#208216</span>
          </h1>
          <p className="text-gray-500 mt-1">Assign specialized karigars to mapped manufacturing processes.</p>
        </div>
        <div className="ml-auto">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isAllocated ? 'bg-green-100 text-green-700 border-green-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Allocation Table */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isAllocated ? 'opacity-80 pointer-events-none' : ''}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Process Karigar Mapping
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-900 text-sm">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Process</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap w-[250px]">Karigar</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap w-[150px]">Rate Per Piece</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Production Quantity</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{a.process}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={a.karigar}
                      onChange={(e) => handleUpdate(i, 'karigar', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="" disabled>Select Karigar...</option>
                      {karigars.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input 
                        type="number"
                        min="1"
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="0.00"
                        value={a.rate}
                        onChange={(e) => handleUpdate(i, 'rate', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{a.qty}</td>
                  <td className="px-6 py-4 font-bold text-indigo-700 text-right text-lg">
                    ₹{((Number(a.rate) || 0) * a.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-gray-100 border-b border-gray-800 pb-4">Allocation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Production Code</p>
            <p className="text-2xl font-bold">208216</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Processes</p>
            <p className="text-2xl font-bold">{allocations.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Production Quantity</p>
            <p className="text-2xl font-bold">100</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl -mt-4 border border-white/20">
            <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-wider">Grand Total Labour Cost</p>
            <p className="text-3xl font-black text-white">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {!isAllocated ? (
          <button 
            onClick={saveAllocation}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 text-lg"
          >
            <Save className="w-5 h-5" />
            Save Karigar Allocation
          </button>
        ) : (
          <button 
            onClick={() => navigate('/production')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-green-600/20 text-lg animate-in zoom-in-95"
          >
            <PlayCircle className="w-5 h-5" />
            Start Production
          </button>
        )}
      </div>

    </div>
  );
};

export default KarigarAllocation;
