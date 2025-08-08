import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Filter } from 'lucide-react';

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: { from: string; to: string };
  onDateRangeChange: (value: { from: string; to: string }) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const AdminFilters: React.FC<AdminFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const handleFromDateChange = (value: string) => {
    onDateRangeChange({ ...dateRange, from: value });
  };

  const handleToDateChange = (value: string) => {
    onDateRangeChange({ ...dateRange, to: value });
  };

  const clearFilters = () => {
    onSearchChange('');
    onDateRangeChange({ from: '', to: '' });
    onStatusFilterChange('all');
  };

  const hasActiveFilters = searchTerm || dateRange.from || dateRange.to || (statusFilter && statusFilter !== 'all');

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'in_delivery', label: 'قيد التوصيل' },
    { value: 'delivered', label: 'تم التسليم' },
    { value: 'canceled', label: 'ملغي' }
  ];

  const handleStatusChange = (value: string) => {
    onStatusFilterChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">الفلاتر والبحث</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              مسح الفلاتر
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">
              البحث
            </Label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="اسم العميل، رقم الهاتف، أو رقم الطلب..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              فلترة حسب الحالة
            </Label>
            <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <Label htmlFor="from-date" className="text-sm font-medium text-gray-700">
              من تاريخ
            </Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label htmlFor="to-date" className="text-sm font-medium text-gray-700">
              إلى تاريخ
            </Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) => handleToDateChange(e.target.value)}
                className="pr-10"
                min={dateRange.from}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">الفلاتر النشطة:</span>
              
              {searchTerm && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  <span>البحث: "{searchTerm}"</span>
                  <button 
                    onClick={() => onSearchChange('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              )}

              {statusFilter && statusFilter !== 'all' && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <Filter className="w-3 h-3" />
                  <span>الحالة: {statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
                  <button 
                    onClick={() => onStatusFilterChange('all')}
                    className="ml-1 hover:bg-green-200 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {dateRange.from && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>من: {new Date(dateRange.from).toLocaleDateString('ar-SA')}</span>
                  <button 
                    onClick={() => handleFromDateChange('')}
                    className="ml-1 hover:bg-purple-200 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {dateRange.to && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>إلى: {new Date(dateRange.to).toLocaleDateString('ar-SA')}</span>
                  <button 
                    onClick={() => handleToDateChange('')}
                    className="ml-1 hover:bg-purple-200 rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFilters;