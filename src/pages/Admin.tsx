
import Layout from "../components/Layout";
import { useState } from "react";

// Mock data for pending approvals
const initialPendingUsers = [
  { id: 1, name: "Emily Parker", email: "emily.p@rosebank.edu", stNumber: "ST87654321", submittedAt: "2023-05-01T10:15:00" },
  { id: 2, name: "Michael Rodriguez", email: "michael.r@rosebank.edu", stNumber: "ST76543210", submittedAt: "2023-05-02T09:30:00" },
  { id: 3, name: "Sarah Johnson", email: "sarah.j@rosebank.edu", stNumber: "ST65432109", submittedAt: "2023-05-03T14:45:00" }
];

// Mock data for approved members
const initialApprovedMembers = [
  { id: 4, name: "Jane Doe", email: "jane.doe@rosebank.edu", stNumber: "ST12345678", role: "President" },
  { id: 5, name: "John Smith", email: "john.smith@rosebank.edu", stNumber: "ST23456789", role: "Vice President" },
  { id: 6, name: "Alex Johnson", email: "alex.j@rosebank.edu", stNumber: "ST34567890", role: "Secretary" },
  { id: 7, name: "Sam Williams", email: "sam.w@rosebank.edu", stNumber: "ST45678901", role: "Treasurer" },
  { id: 8, name: "Taylor Brown", email: "taylor.b@rosebank.edu", stNumber: "ST56789012", role: "Member" },
  { id: 9, name: "Casey Miller", email: "casey.m@rosebank.edu", stNumber: "ST67890123", role: "Member" }
];

// Mock data for recent activity
const initialActivity = [
  { id: 1, action: "Jane Doe approved Sam Williams", timestamp: "2023-05-04T10:30:00" },
  { id: 2, action: "John Smith created a new event: Web Development Workshop", timestamp: "2023-05-03T15:45:00" },
  { id: 3, action: "Alex Johnson posted an announcement", timestamp: "2023-05-03T09:15:00" },
  { id: 4, action: "Casey Miller registered for the hackathon", timestamp: "2023-05-02T14:20:00" },
  { id: 5, action: "Jane Doe changed Taylor Brown's role to Member", timestamp: "2023-05-01T11:10:00" }
];

const Admin = () => {
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers);
  const [approvedMembers, setApprovedMembers] = useState(initialApprovedMembers);
  const [activity, setActivity] = useState(initialActivity);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  const handleApprove = (id: number) => {
    console.log(`Approved user ${id}`);
    const userToApprove = pendingUsers.find(user => user.id === id);
    
    if (userToApprove) {
      // Remove from pending
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
      // Add to approved with default role
      setApprovedMembers([...approvedMembers, {
        ...userToApprove,
        role: "Member"
      }]);
      
      // Add activity
      const newActivity = {
        id: activity.length + 1,
        action: `Admin approved ${userToApprove.name}`,
        timestamp: new Date().toISOString()
      };
      setActivity([newActivity, ...activity]);
    }
  };
  
  const handleReject = (id: number) => {
    console.log(`Rejected user ${id}`);
    const userToReject = pendingUsers.find(user => user.id === id);
    
    if (userToReject) {
      // Remove from pending
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
      // Add activity
      const newActivity = {
        id: activity.length + 1,
        action: `Admin rejected ${userToReject.name}`,
        timestamp: new Date().toISOString()
      };
      setActivity([newActivity, ...activity]);
    }
  };
  
  const handleRoleChange = (id: number, newRole: string) => {
    console.log(`Changed role for user ${id} to ${newRole}`);
    
    setApprovedMembers(approvedMembers.map(member => 
      member.id === id 
        ? { ...member, role: newRole }
        : member
    ));
    
    const member = approvedMembers.find(m => m.id === id);
    if (member) {
      // Add activity
      const newActivity = {
        id: activity.length + 1,
        action: `Admin changed ${member.name}'s role to ${newRole}`,
        timestamp: new Date().toISOString()
      };
      setActivity([newActivity, ...activity]);
    }
  };
  
  const filteredMembers = approvedMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.stNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Admin Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-navy">{approvedMembers.length}</p>
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
                <p className="text-2xl font-bold text-navy">{pendingUsers.length}</p>
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
                <p className="text-2xl font-bold text-navy">4</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-calendar-check text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'pending' ? 'text-navy border-b-2 border-lime' : 'text-gray-500 hover:text-navy'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approvals
            </button>
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'roles' ? 'text-navy border-b-2 border-lime' : 'text-gray-500 hover:text-navy'}`}
              onClick={() => setActiveTab('roles')}
            >
              Role Management
            </button>
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'activity' ? 'text-navy border-b-2 border-lime' : 'text-gray-500 hover:text-navy'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Pending Approvals Tab */}
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Verification</h2>
                
                {pendingUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ST Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingUsers.map(user => (
                          <tr key={user.id} data-user-id={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{user.stNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-500">{formatDate(user.submittedAt)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                className="bg-lime text-navy font-medium py-1 px-3 rounded-md hover:bg-lime/90 transition mr-2"
                                onClick={() => handleApprove(user.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded-md hover:bg-gray-300 transition"
                                onClick={() => handleReject(user.id)}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No pending approvals at this time.</p>
                )}
              </div>
            )}
            
            {/* Role Management Tab */}
            {activeTab === 'roles' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Role Management</h2>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ST Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map(member => (
                        <tr key={member.id} data-user-id={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{member.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">{member.stNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-500">{member.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <select 
                              className="mr-2 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                              defaultValue=""
                            >
                              <option value="" disabled>Change Role</option>
                              <option value="President">President</option>
                              <option value="Vice President">Vice President</option>
                              <option value="Secretary">Secretary</option>
                              <option value="Treasurer">Treasurer</option>
                              <option value="Member">Member</option>
                            </select>
                            <button 
                              className="bg-navy text-white font-medium py-1 px-3 rounded-md hover:bg-navy/90 transition"
                              onClick={(e) => {
                                const select = e.currentTarget.previousElementSibling as HTMLSelectElement;
                                if (select.value) {
                                  handleRoleChange(member.id, select.value);
                                  select.value = "";
                                }
                              }}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                
                <div className="space-y-3">
                  {activity.map(item => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <p className="text-gray-800">{item.action}</p>
                        <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
