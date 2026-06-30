import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';

const ProductionList = () => {
  // Mock Data since backend is not fully connected yet
  const productions = [
    { id: '1', code: '208216', status: 'Pending', date: '2026-06-30', planner: 'N/A' },
    { id: '2', code: '208217', status: 'In Production', date: '2026-06-29', planner: 'Rahul' },
    { id: '3', code: '208218', status: 'Planning Completed', date: '2026-06-28', planner: 'Amit' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Planning Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Production': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Production Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all production batches.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Production Code..." 
            className="pl-10 pr-4 py-3 md:py-2 border border-gray-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <th className="px-6 py-4 font-semibold">Production Code</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Created Date</th>
              <th className="px-6 py-4 font-semibold">Planner</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">#{prod.code}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(prod.status)}`}>
                    {prod.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{prod.date}</td>
                <td className="px-6 py-4 text-gray-500">{prod.planner}</td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/production/${prod.id}`}
                    className="inline-flex items-center justify-center p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                    title="View Planning"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {productions.map((prod) => (
          <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Production Code</p>
                <p className="font-bold text-gray-900 text-lg">#{prod.code}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(prod.status)}`}>
                {prod.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-gray-900 font-medium">{prod.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Planner</p>
                <p className="text-gray-900 font-medium">{prod.planner}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                to={`/production/${prod.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl transition-colors font-semibold"
              >
                <Eye className="w-5 h-5" />
                View Order
              </Link>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ProductionList;
