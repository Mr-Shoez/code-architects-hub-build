
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PendingApprovals from "./PendingApprovals";
import RoleManagement from "./RoleManagement";
import ActivityLog from "./ActivityLog";

interface AdminTabsProps {
  pendingUsers: Array<{
    id: number;
    name: string;
    email: string;
    stNumber: string;
    submittedAt: string;
  }>;
  approvedMembers: Array<{
    id: number;
    name: string;
    email: string;
    stNumber: string;
    role: string;
  }>;
  activity: Array<{
    id: number;
    action: string;
    timestamp: string;
  }>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRoleChange: (id: number, newRole: string) => void;
}

const AdminTabs = ({
  pendingUsers,
  approvedMembers,
  activity,
  onApprove,
  onReject,
  onRoleChange,
}: AdminTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Tabs defaultValue="pending">
        <TabsList className="w-full border-b">
          <TabsTrigger value="pending" className="flex-1">
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex-1">
            Role Management
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">
            Activity
          </TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          <TabsContent value="pending">
            <PendingApprovals
              pendingUsers={pendingUsers}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          
          <TabsContent value="roles">
            <RoleManagement
              members={approvedMembers}
              onRoleChange={onRoleChange}
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
