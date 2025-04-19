
import { useState } from "react";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  stNumber: string;
  submittedAt: string;
}

interface PendingApprovalsProps {
  pendingUsers: PendingUser[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingApprovals = ({ pendingUsers, onApprove, onReject }: PendingApprovalsProps) => {
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
      <h2 className="text-xl font-semibold mb-4">User Verification</h2>
      {pendingUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ST Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map(user => (
                <TableRow key={user.id} data-user-id={user.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-500">{user.stNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-500">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-500">{formatDate(user.submittedAt)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="default"
                      onClick={() => onApprove(user.id)}
                      className="mr-2"
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => onReject(user.id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-500">No pending approvals at this time.</p>
      )}
    </div>
  );
};

export default PendingApprovals;
