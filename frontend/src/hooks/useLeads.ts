import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { getErrorMessage } from '../lib/utils';
import type { Lead, PaginatedResponse, GetLeadsQuery } from '../types/lead.types';
import type { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';

export const LEADS_QUERY_KEY = 'leads';

// Fetch all leads
export function useLeads(params: GetLeadsQuery) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, params],
    queryFn: async ({ signal }) => {
      // Remove undefined/empty values from params
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
      );
      
      const response = await api.get<PaginatedResponse<Lead>>('/leads', {
        params: cleanParams,
        signal, // React Query will abort this request if the component unmounts or query key changes
      });
      return response.data;
    },
    // Keep previous data while fetching new to avoid loading UI flash
    placeholderData: (prev) => prev,
  });
}

// Fetch single lead
export function useLead(id: string) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, id],
    queryFn: async ({ signal }) => {
      const response = await api.get<{ data: Lead }>(`/leads/${id}`, { signal });
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Create lead
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLeadInput) => {
      const response = await api.post('/leads', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to create lead'));
    }
  });
}

// Update lead
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadInput }) => {
      const response = await api.patch(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Lead updated successfully');
      // Invalidate both the list and the specific item
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY, variables.id] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update lead'));
    }
  });
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to delete lead'));
    }
  });
}
