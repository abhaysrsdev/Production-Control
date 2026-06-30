import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Factory } from 'lucide-react';

const ProcessQueue = () => {
  const { processName } = useParams();
  
  // Format process name (e.g. 'touching' -> 'Touching')
  const formattedName = processName ? processName.charAt(0).toUpperCase() + processName.slice(1) : '';

  // Mock data representing items queued for this specific process
  const [queueItems] = useState([
    { id: '1', production: '208216', color: 'Red', name: 'Mononet', req: 30, unit: 'Meter' },
    { id: '2', production: '208216', color: 'Red', name: 'Cancan', req: 120, unit: 'Meter' },
    { id: '3', production: '208216', color: 'Green', name: 'Mononet', req: 30, unit: 'Meter' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/production" className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
            {formattedName} Queue
            <span className="text-orange-600 bg-orange-100 px-3 py-1 text-base rounded-lg border border-orange-200">{queueItems.length} Items</span>
          </h1>
          <p className="text-gray-500 mt-1">Materials mapped and waiting for the {formattedName} process.</p>
        </div>
      </div>

      {/* Production Group Card */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Enhanced Header with Assignment Details */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Factory className="w-5 h-5 text-gray-500" />
                Production Code: 208216
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <p>Order By: <span className="font-semibold text-gray-900">Manish</span></p>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <p>Status: <span className="font-semibold text-orange-600">Pending</span></p>
              </div>
            </div>
            <button className="text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">Start Process</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap w-1/4">Color</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Material Name</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Required Quantity</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {queueItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.color === 'Red' ? 'bg-red-500' : item.color === 'Blue' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      {item.color}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{item.req} <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span></td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        Queued
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessQueue;
