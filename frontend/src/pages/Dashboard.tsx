import { Package, Clock, CheckCircle2, Factory, XCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">Here is the latest production status.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
        <StatCard title="Today's Orders" value="12" icon={Package} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Planning" value="8" icon={Clock} colorClass="bg-orange-50 text-orange-600" />
        <StatCard title="Planning Completed" value="4" icon={CheckCircle2} colorClass="bg-green-50 text-green-600" />
        <StatCard title="In Production" value="25" icon={Factory} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Rejected" value="1" icon={XCircle} colorClass="bg-red-50 text-red-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
           No recent activity to show.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
