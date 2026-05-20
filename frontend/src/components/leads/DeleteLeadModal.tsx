import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Lead } from '../../types/lead.types';
import { useDeleteLead } from '../../hooks/useLeads';

interface DeleteLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export function DeleteLeadModal({ isOpen, onClose, lead }: DeleteLeadModalProps) {
  const deleteMutation = useDeleteLead();

  if (!lead) return null;

  const handleDelete = () => {
    deleteMutation.mutate(lead._id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Lead">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{lead.name}</span>? 
          This action cannot be undone and will remove all associated data.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="danger" 
            isLoading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Delete Lead
          </Button>
        </div>
      </div>
    </Modal>
  );
}
