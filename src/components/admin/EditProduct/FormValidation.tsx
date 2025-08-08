import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormValidation = ({ errors }) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">يرجى تصحيح الأخطاء التالية:</span>
      </div>
      <ul className="mt-2 text-sm list-disc list-inside space-y-1">
        {Object.values(errors).filter(Boolean).map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormValidation;