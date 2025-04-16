import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EdgeFunctionTest from "@/components/EdgeFunctionTest";
import PendingApprovals from "@/components/admin/PendingApprovals";
import RoleManagement from "@/components/admin/RoleManagement";
import ActivityLog from "@/components/admin/ActivityLog";
import StatsCards from "@/components/admin/StatsCards";

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
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers);
  const [approvedMembers, setApprovedMembers] = useState(initialApprovedMembers);
  const [activity, setActivity] = useState(initialActivity);
  const [activeTab, setActiveTab] = useState("pending");
  
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to access this page");
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error || !data) {
          console.error('Error checking admin role:', error);
          toast.error("You do not have admin privileges");
          navigate('/');
          return;
        }

        setIsAdmin(Boolean(data));
      } catch (error) {
        console.error('Error in admin check:', error);
        toast.error("Error checking admin permissions");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const handleApprove = (id: number) => {
    console.log(`Approved user ${id}`);
    const userToApprove = pendingUsers.find(user => user.id === id);
    
    if (userToApprove) {
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
      setApprovedMembers([...approvedMembers, {
        ...userToApprove,
        role: "Member"
      }]);
      
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
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
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
      const newActivity = {
        id: activity.length + 1,
        action: `Admin changed ${member.name}'s role to ${newRole}`,
        timestamp: new Date().toISOString()
      };
      setActivity([newActivity, ...activity]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <EdgeFunctionTest />
        </div>

        <StatsCards 
          totalMembers={approvedMembers.length}
          pendingApprovals={pendingUsers.length}
          activeEvents={4}
        />
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
          
          <div className="p-6">
            {activeTab === 'pending' && (
              <PendingApprovals
                pendingUsers={pendingUsers}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
            
            {activeTab === 'roles' && (
              <RoleManagement
                members={approvedMembers}
                onRoleChange={handleRoleChange}
              />
            )}
            
            {activeTab === 'activity' && (
              <ActivityLog activities={activity} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
