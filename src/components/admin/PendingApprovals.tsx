
import { useState } from "react";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "./ConfirmDialog";
import { Loader } from "lucide-react";

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
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState<PendingUser | null>(null);

  const handleApprove = async (user: PendingUser) => {
    try {
      setLoading(user.id);
      await onApprove(user.id);
      toast.success(`Successfully approved ${user.name}'s membership request`);
    } catch (error) {
      toast.error(`Failed to approve ${user.name}'s membership request`);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (user: PendingUser) => {
    try {
      setLoading(user.id);
      await onReject(user.id);
      toast.success(`Successfully rejected ${user.name}'s membership request`);
    } catch (error) {
      toast.error(`Failed to reject ${user.name}'s membership request`);
    } finally {
      setLoading(null);
      setConfirmReject(null);
    }
  };

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
                      onClick={() => handleApprove(user)}
                      disabled={loading === user.id}
                      className="mr-2"
                    >
                      {loading === user.id ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setConfirmReject(user)}
                      disabled={loading === user.id}
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

      <ConfirmDialog
        isOpen={!!confirmReject}
        onClose={() => setConfirmReject(null)}
        onConfirm={() => confirmReject && handleReject(confirmReject)}
        title="Reject Membership Request"
        description={`Are you sure you want to reject ${confirmReject?.name}'s membership request? This action cannot be undone.`}
        confirmText="Reject"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PendingApprovals;
