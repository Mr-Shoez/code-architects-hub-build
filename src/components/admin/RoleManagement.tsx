
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  email: string;
  stNumber: string;
  role: string;
}

interface RoleManagementProps {
  members: Member[];
  onRoleChange: (id: string, newRole: string) => void;
}

const RoleManagement = ({ members, onRoleChange }: RoleManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.stNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <div className="text-gray-500">{member.role}</div>
                </TableCell>
                <TableCell className="text-right">
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
                  <Button 
                    variant="default"
                    onClick={(e) => {
                      const select = e.currentTarget.previousElementSibling as HTMLSelectElement;
                      if (select.value) {
                        onRoleChange(member.id, select.value);
                        select.value = "";
                      }
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoleManagement;
