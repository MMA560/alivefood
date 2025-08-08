
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="pl-10"
          placeholder="من تاريخ"
        />
      </div>
      <span className="text-gray-500">إلى</span>
      <div className="relative">
        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="pl-10"
          placeholder="إلى تاريخ"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
