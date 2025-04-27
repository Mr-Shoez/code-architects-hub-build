
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PendingApprovals from "./PendingApprovals";
import RoleManagement from "./RoleManagement";
import ActivityLog from "./ActivityLog";
import useAuth from "@/hooks/useAuth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AdminTabsProps {
  pendingUsers: Array<{
    id: string;
    name: string;
    email: string;
    stNumber: string;
    submittedAt: string;
  }>;
  approvedMembers: Array<{
    id: string;
    name: string;
    email: string;
    stNumber: string;
    role: string;
  }>;
  activity: Array<{
    id: string;
    action: string;
    timestamp: string;
  }>;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRoleChange: (id: string, newRole: string) => void;
}

const AdminTabs = ({
  pendingUsers,
  approvedMembers,
  activity,
  onApprove,
  onReject,
  onRoleChange,
}: AdminTabsProps) => {
  const { userRole } = useAuth();
  
  // Determine which tabs are available based on role
  const canManageRoles = ["President", "Vice President"].includes(userRole);
  const canApproveMembers = ["President", "Vice President", "Secretary"].includes(userRole);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Tabs defaultValue={canApproveMembers ? "pending" : "roles"}>
        <TabsList className="w-full border-b">
          {canApproveMembers && (
            <TabsTrigger value="pending" className="flex-1">
              Pending Approvals {pendingUsers.length > 0 && <span className="ml-2 bg-navy text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">{pendingUsers.length}</span>}
            </TabsTrigger>
          )}
          
          <TabsTrigger value="roles" className="flex-1">
            Role Management
          </TabsTrigger>
          
          <TabsTrigger value="activity" className="flex-1">
            Activity
          </TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          {!canApproveMembers && !canManageRoles && (
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Limited Access</AlertTitle>
              <AlertDescription>
                Your current role ({userRole}) doesn't have permissions to approve members or change roles.
                Only viewing is allowed.
              </AlertDescription>
            </Alert>
          )}
          
          {canApproveMembers && (
            <TabsContent value="pending">
              <PendingApprovals
                pendingUsers={pendingUsers}
                onApprove={onApprove}
                onReject={onReject}
              />
            </TabsContent>
          )}
          
          <TabsContent value="roles">
            <RoleManagement
              members={approvedMembers}
              onRoleChange={canManageRoles ? onRoleChange : () => {}} 
            />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityLog activities={activity} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminTabs;
