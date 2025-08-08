import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorNotification = ({ errors }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const messages = Object.entries(errors)
        .filter(([key, value]) => value && String(value).trim() !== '')
        .map(([key, value]) => ({
          field: key,
          message: String(value)
        }));
      
      if (messages.length > 0) {
        setErrorMessages(messages);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  }, [errors]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Auto hide after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || errorMessages.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .shrink-animation {
          animation: shrink 8s linear forwards;
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg animate-pulse">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-red-800">
                  يرجى تصحيح الأخطاء التالية:
                </h3>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  {errorMessages.length} خطأ
                </span>
              </div>
              <ul className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                {errorMessages.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                    <span className="flex-1">{error.message}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleClose}
              className="text-red-400 hover:text-red-600 flex-shrink-0 p-1 rounded-md hover:bg-red-100 transition-colors"
              title="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar for auto-hide */}
          <div className="mt-3 w-full bg-red-200 rounded-full h-1">
            <div className="bg-red-500 h-1 rounded-full shrink-animation"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorNotification;