import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              progress === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 min-w-[3rem]">{progress}%</span>
      </div>
      {progress === 100 && (
        <div className="flex items-center gap-1 text-green-600">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">مكتمل</span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;