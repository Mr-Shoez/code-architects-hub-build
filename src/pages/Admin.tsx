import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EdgeFunctionTest from "@/components/EdgeFunctionTest";
import StatsCards from "@/components/admin/StatsCards";
import AdminTabs from "@/components/admin/AdminTabs";
import { initialPendingUsers, initialApprovedMembers, initialActivity } from "@/data/mockAdminData";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers);
  const [approvedMembers, setApprovedMembers] = useState(initialApprovedMembers);
  const [activity, setActivity] = useState(initialActivity);

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
      setApprovedMembers([...approvedMembers, { ...userToApprove, role: "Member" }]);
      
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
      member.id === id ? { ...member, role: newRole } : member
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
        
        <AdminTabs 
          pendingUsers={pendingUsers}
          approvedMembers={approvedMembers}
          activity={activity}
          onApprove={handleApprove}
          onReject={handleReject}
          onRoleChange={handleRoleChange}
        />
      </div>
    </Layout>
  );
};

export default Admin;
