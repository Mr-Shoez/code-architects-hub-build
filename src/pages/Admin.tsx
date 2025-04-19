
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EdgeFunctionTest from "@/components/EdgeFunctionTest";
import StatsCards from "@/components/admin/StatsCards";
import AdminTabs from "@/components/admin/AdminTabs";
import { Database } from "@/integrations/supabase/types";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  stNumber: string;
  submittedAt: string;
};

type ApprovedMember = {
  id: string;
  name: string;
  email: string;
  stNumber: string;
  role: string;
};

type ActivityItem = {
  id: string;
  action: string;
  timestamp: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedMembers, setApprovedMembers] = useState<ApprovedMember[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

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
        if (data) {
          await fetchData();
        }
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

  const fetchData = async () => {
    try {
      // Fetch pending requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Fetch approved members
      const { data: membersData, error: membersError } = await supabase
        .from('club_members')
        .select('*');

      if (membersError) throw membersError;

      // Fetch activity logs
      const { data: activityData, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (activityError) throw activityError;

      setPendingUsers(pendingData.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        stNumber: item.st_number,
        submittedAt: item.submitted_at
      })));

      setApprovedMembers(membersData.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        stNumber: item.st_number,
        role: item.role
      })));

      setActivity(activityData.map(item => ({
        id: item.id,
        action: item.action,
        timestamp: item.timestamp
      })));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Error loading admin data");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { data, error } = await supabase.rpc('approve_membership_request', {
        request_id: id
      });

      if (error) throw error;

      toast.success("Member approved successfully");
      await fetchData();
    } catch (error) {
      console.error('Error approving member:', error);
      toast.error("Error approving member");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { data, error } = await supabase.rpc('reject_membership_request', {
        request_id: id
      });

      if (error) throw error;

      toast.success("Member rejected successfully");
      await fetchData();
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast.error("Error rejecting member");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const { data, error } = await supabase.rpc('change_member_role', {
        member_id: id,
        new_role: newRole
      });

      if (error) throw error;

      toast.success("Role updated successfully");
      await fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Error updating role");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

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
