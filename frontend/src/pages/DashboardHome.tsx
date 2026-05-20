import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { FilterBar } from '../components/leads/FilterBar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { DeleteLeadModal } from '../components/leads/DeleteLeadModal';
import type { GetLeadsQuery, Lead } from '../types/lead.types';
import { api } from '../services/api';

export const DashboardHome = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState<GetLeadsQuery>({
    page: 1,
    limit: 10,
    sort: '-createdAt',
  });

  // State for search (debounced)
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Combine filters with debounced search
  const queryParams: GetLeadsQuery = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isError } = useLeads(queryParams);

  // Handlers
  const handleFilterChange = useCallback((newFilters: Partial<GetLeadsQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleExport = async () => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== '')
      );
      // Remove pagination limits for export
      delete cleanParams.page;
      delete cleanParams.limit;
      
      const response = await api.get('/leads/export/csv', {
        params: cleanParams,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export leads. Please try again.');
    }
  };

  // Modal Handlers
  const handleCreateLead = () => {
    setSelectedLead(null);
    setIsFormModalOpen(true);
  };
  
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };
  
  const handleViewLead = (lead: Lead) => {
    // For now, view acts like edit but we could easily build a read-only View modal
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all the leads in your account including their name, status, and source.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={handleCreateLead}>
            <Plus className="h-4 w-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={handleExport}
      />

      {isError && (
        <div className="bg-red-50 p-4 rounded-md mb-6 text-red-700">
          Failed to load leads. Please check your connection and try again.
        </div>
      )}

      <LeadsTable
        leads={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        onView={handleViewLead}
      />

      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <LeadFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        lead={selectedLead}
      />

      <DeleteLeadModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
};
