
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
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name: string; role: string } | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedMembers, setApprovedMembers] = useState<ApprovedMember[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("You must be logged in to access this page");
          navigate('/');
          return;
        }

        // First, check if the user is a member by querying club_members
        const { data: memberData, error: memberError } = await supabase
          .from('club_members')
          .select('name, role')
          .eq('user_id', user.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          console.error('Error checking member status:', memberError);
          toast.error("Error checking member status");
          return;
        }

        // If found in club_members, they are at least a member
        if (memberData) {
          setIsMember(true);
          setUserInfo({ name: memberData.name, role: memberData.role });
          
          // Check if they have admin role specifically
          try {
            const { data: adminCheck, error: adminError } = await supabase.rpc('has_role', {
              _user_id: user.id,
              _role: 'admin'
            });

            if (adminError) {
              console.error('Error checking admin role:', adminError);
              // Continue as regular member even if admin check fails
            } else {
              setIsAdmin(Boolean(adminCheck));
            }
          } catch (err) {
            console.error('Error in admin check:', err);
            // Continue as regular member
          }
          
          // Load relevant data based on member status
          if (isAdmin) {
            await fetchAdminData();
          } else {
            await fetchMemberData();
          }
        } else {
          // Not a member at all
          toast.error("You are not registered as a club member");
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        toast.error("Error checking user permissions");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [navigate]);

  const fetchAdminData = async () => {
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
      console.error('Error fetching admin data:', error);
      toast.error("Error loading admin data");
    }
  };

  const fetchMemberData = async () => {
    try {
      // For regular members, we just fetch the member list
      const { data: membersData, error: membersError } = await supabase
        .from('club_members')
        .select('*');

      if (membersError) throw membersError;

      setApprovedMembers(membersData.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        stNumber: item.st_number,
        role: item.role
      })));
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast.error("Error loading member data");
    }
  };

  const handleApprove = async (id: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('approve_membership_request', {
        request_id: id
      });

      if (error) throw error;

      toast.success("Member approved successfully");
      await fetchAdminData();
    } catch (error) {
      console.error('Error approving member:', error);
      toast.error("Error approving member");
    }
  };

  const handleReject = async (id: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('reject_membership_request', {
        request_id: id
      });

      if (error) throw error;

      toast.success("Member rejected successfully");
      await fetchAdminData();
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast.error("Error rejecting member");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('change_member_role', {
        member_id: id,
        new_role: newRole
      });

      if (error) throw error;

      toast.success("Role updated successfully");
      await fetchAdminData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Error updating role");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-navy mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <>
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
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-navy mb-8">Member Dashboard</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome, {userInfo?.name || 'Club Member'}!</h2>
                  <p className="text-gray-600">Your role: {userInfo?.role || 'Member'}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Member since: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                <p className="text-gray-600">Visit the Events page to see upcoming club activities.</p>
                <button 
                  onClick={() => navigate('/events')}
                  className="mt-4 bg-navy text-white py-2 px-4 rounded hover:bg-navy/90"
                >
                  View Events
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Club Members</h3>
                <p className="text-gray-600">Connect with {approvedMembers.length} club members.</p>
                <button 
                  onClick={() => navigate('/members')}
                  className="mt-4 bg-navy text-white py-2 px-4 rounded hover:bg-navy/90"
                >
                  View Members
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Announcements</h3>
                <p className="text-gray-600">Check the latest club announcements.</p>
                <button 
                  onClick={() => navigate('/announcements')}
                  className="mt-4 bg-navy text-white py-2 px-4 rounded hover:bg-navy/90"
                >
                  View Announcements
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Club Members</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedMembers.slice(0, 5).map(member => (
                      <tr key={member.id} className="border-b border-gray-200">
                        <td className="py-2 px-4">{member.name}</td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            member.role === 'President' ? 'bg-purple-100 text-purple-800' :
                            member.role === 'Vice President' ? 'bg-blue-100 text-blue-800' :
                            member.role === 'Secretary' ? 'bg-green-100 text-green-800' :
                            member.role === 'Treasurer' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {approvedMembers.length > 5 && (
                  <div className="text-right mt-4">
                    <button 
                      onClick={() => navigate('/members')}
                      className="text-navy hover:underline"
                    >
                      View all members
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
