
interface StatsCardsProps {
  totalMembers: number;
  pendingApprovals: number;
  activeEvents: number;
}

const StatsCards = ({ totalMembers, pendingApprovals, activeEvents }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-navy">{totalMembers}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="fas fa-users text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pending Approvals</p>
            <p className="text-2xl font-bold text-navy">{pendingApprovals}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <i className="fas fa-user-clock text-yellow-500 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Events</p>
            <p className="text-2xl font-bold text-navy">{activeEvents}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fas fa-calendar-check text-green-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
