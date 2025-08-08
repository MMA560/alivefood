import React from 'react';
import { Save, ArrowUp, Zap } from 'lucide-react';

interface FloatingActionsProps {
  onScrollToTop: () => void;
  onQuickSave: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ 
  onScrollToTop, 
  onQuickSave, 
  onSubmit, 
  isLoading, 
  isSaving 
}) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
      {/* زر العودة للأعلى */}
      <button
        onClick={onScrollToTop}
        className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="العودة للأعلى"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* زر الحفظ السريع */}
      <button
        onClick={onQuickSave}
        disabled={isLoading}
        className="p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="حفظ سريع"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <Zap className="h-5 w-5" />
        )}
      </button>

      {/* زر الحفظ النهائي */}
      <button
        onClick={onSubmit}
        disabled={isSaving}
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="حفظ المنتج"
      >
        {isSaving ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <Save className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default FloatingActions;