
interface ActivityItem {
  id: number;
  action: string;
  timestamp: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

const ActivityLog = ({ activities }: ActivityLogProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map(item => (
          <div key={item.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <p className="text-gray-800">{item.action}</p>
              <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
