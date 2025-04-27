
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  name: string;
  email: string;
  stNumber: string;
  role: string;
  user_id?: string | null;
}

interface RoleManagementProps {
  members: Member[];
  onRoleChange: (id: string, newRole: string) => void;
}

const RoleManagement = ({ members, onRoleChange }: RoleManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmChange, setConfirmChange] = useState<{member: Member, newRole: string} | null>(null);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.stNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      setLoading(memberId);
      await onRoleChange(memberId, newRole);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setLoading(null);
      setConfirmChange(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'President':
        return 'bg-purple-100 text-purple-800';
      case 'Vice President':
        return 'bg-blue-100 text-blue-800';
      case 'Secretary':
        return 'bg-green-100 text-green-800';
      case 'Treasurer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Role Management</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ST Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map(member => (
              <TableRow key={member.id} data-user-id={member.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{member.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500">{member.stNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500">{member.email}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(member.role)} variant="outline">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <select 
                    className="mr-2 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    defaultValue=""
                    disabled={loading === member.id}
                  >
                    <option value="" disabled>Change Role</option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Member">Member</option>
                  </select>
                  <Button 
                    variant="default"
                    disabled={loading === member.id}
                    onClick={(e) => {
                      const select = e.currentTarget.previousElementSibling as HTMLSelectElement;
                      if (select.value && select.value !== member.role) {
                        setConfirmChange({ member, newRole: select.value });
                      }
                    }}
                  >
                    {loading === member.id ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmChange}
        onClose={() => setConfirmChange(null)}
        onConfirm={() => confirmChange && handleRoleChange(confirmChange.member.id, confirmChange.newRole)}
        title="Change Member Role"
        description={`Are you sure you want to change ${confirmChange?.member.name}'s role from ${confirmChange?.member.role} to ${confirmChange?.newRole}?`}
        confirmText="Update Role"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RoleManagement;
