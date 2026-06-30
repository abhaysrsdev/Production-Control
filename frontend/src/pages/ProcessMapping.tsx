import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, PackageOpen } from 'lucide-react';

const ProcessMapping = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock initial data based on the previous planning
  const [materials, setMaterials] = useState([
    { id: '1', color: 'Red', name: 'Mononet', avg: 0.5, req: 30, unit: 'Meter', touching: true, embroidery: false, latkan: false, stitching: true },
    { id: '2', color: 'Red', name: 'Cancan', avg: 2, req: 120, unit: 'Meter', touching: true, embroidery: false, latkan: false, stitching: true },
    { id: '3', color: 'Red', name: 'Haddi', avg: 1, req: 60, unit: 'Piece', touching: false, embroidery: true, latkan: false, stitching: true },
    { id: '4', color: 'Red', name: 'BKS-Red', avg: 1, req: 20, unit: 'Piece', touching: false, embroidery: false, latkan: true, stitching: true },
    { id: '5', color: 'Blue', name: 'Mononet', avg: 0.5, req: 30, unit: 'Meter', touching: false, embroidery: true, latkan: false, stitching: true },
    { id: '6', color: 'Green', name: 'Mononet', avg: 0.5, req: 30, unit: 'Meter', touching: true, embroidery: true, latkan: true, stitching: true },
  ]);

  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isAllocated, setIsAllocated] = useState(false);

  const toggleProcess = (id: string, process: 'touching' | 'embroidery' | 'latkan' | 'stitching') => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [process]: !m[process] } : m));
  };

  const saveProcessAllocation = () => {
    if (!assignedTo || !priority) {
      alert('Please fill out all required fields: Assigned To and Priority.');
      return;
    }
    setIsAllocated(true);
    // In real app: call API to save mapping and assignment, then update status
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/production/${id}`} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
            Process Mapping 
            <span className="text-blue-600 bg-blue-100 px-3 py-1 text-base rounded-lg border border-blue-200">#208216</span>
          </h1>
          <p className="text-gray-500 mt-1">Assign materials color-wise to manufacturing processes.</p>
        </div>
      </div>

      {/* Production Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Production Code</p>
            <p className="font-bold text-gray-900 text-lg">208216</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Party Name</p>
            <p className="font-bold text-gray-900 text-lg">Shree Radha Retail</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Quantity</p>
            <p className="font-bold text-gray-900 text-lg">60</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block mt-1 ${isAllocated ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
              {isAllocated ? 'Process Allocated' : 'Planning Completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-blue-600" />
            Color-Wise Process Mapping
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100 text-blue-900 text-sm">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Color</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Material Name</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Average Consumption</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Required Quantity</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Unit</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Touching</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Embroidery</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Latkan</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Stitching</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      m.color === 'Red' ? 'bg-red-500' : m.color === 'Blue' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    {m.color}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500">{m.avg}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{m.req}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{m.unit}</td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={m.touching} onChange={() => toggleProcess(m.id, 'touching')} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={m.embroidery} onChange={() => toggleProcess(m.id, 'embroidery')} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={m.latkan} onChange={() => toggleProcess(m.id, 'latkan')} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={m.stitching} onChange={() => toggleProcess(m.id, 'stitching')} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW SECTION: Process Assignment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">Process Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order By <span className="text-red-500">*</span></label>
            <select 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Employee</option>
              <option value="Shubham">Shubham</option>
              <option value="Manish">Manish</option>
              <option value="Abhay">Abhay</option>
              <option value="Sonu">Sonu</option>
              <option value="Sahil">Sahil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority <span className="text-red-500">*</span></label>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="" disabled>Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
              placeholder="Add any special instructions or remarks here..."
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">
          {!isAllocated ? (
            <button 
              onClick={saveProcessAllocation}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 text-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Save Process Allocation
            </button>
          ) : (
            <Link 
              to={`/karigar-allocation/${id || '208216'}`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 text-lg"
            >
              Move to Karigar Allocation
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessMapping;
