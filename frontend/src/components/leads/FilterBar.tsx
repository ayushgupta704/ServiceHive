import { Search, Download } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { LeadStatus, LeadSource, GetLeadsQuery } from '../../types/lead.types';

interface FilterBarProps {
  filters: GetLeadsQuery;
  onFilterChange: (filters: Partial<GetLeadsQuery>) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
  onExport: () => void;
}

export function FilterBar({ filters, onFilterChange, onSearchChange, searchTerm, onExport }: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            type="text"
            placeholder="Search leads..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search leads by name or email"
          />
        </div>

        <select
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: (e.target.value || undefined) as LeadStatus })}
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: (e.target.value || undefined) as LeadSource })}
          aria-label="Filter by Source"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={filters.sort || ''}
          onChange={(e) => onFilterChange({ sort: e.target.value || undefined })}
          aria-label="Sort leads"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
