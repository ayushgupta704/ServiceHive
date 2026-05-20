import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { createLeadSchema, updateLeadSchema, type CreateLeadInput } from '../../schemas/lead.schema';
import type { Lead } from '../../types/lead.types';
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads';

import { type Resolver } from 'react-hook-form';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null; // If null, it's create mode. If passed, it's edit mode.
}

export function LeadFormModal({ isOpen, onClose, lead }: LeadFormModalProps) {
  const isEditMode = !!lead;
  
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(isEditMode ? updateLeadSchema : createLeadSchema) as unknown as Resolver<CreateLeadInput>,
    defaultValues: {
      status: 'New',
      source: 'Website',
    },
  });

  // Reset form when modal opens/closes or lead changes
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          company: lead.company || '',
          status: lead.status,
          source: lead.source,
          notes: lead.notes || '',
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'New',
          source: 'Website',
          notes: '',
        });
      }
    }
  }, [isOpen, lead, reset]);

  const onSubmit = (data: CreateLeadInput) => {
    if (isEditMode && lead) {
      updateMutation.mutate(
        { id: lead._id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Lead' : 'Add New Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <Input
          label="Full Name"
          placeholder="e.g. Sarah Connor"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. sarah@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone (Optional)"
            placeholder="e.g. 555-0123"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Company (Optional)"
            placeholder="e.g. Cyberdyne"
            error={errors.company?.message}
            {...register('company')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register('status')}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register('source')}
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && <p className="mt-1 text-sm text-red-500">{errors.source.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
          <textarea
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            rows={3}
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditMode ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
