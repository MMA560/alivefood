import React from 'react';
import { Plus, X, HelpCircle } from 'lucide-react';

const FAQ = ({ formData, onArrayChange }) => {
  const addFAQItem = () => {
    const newFAQ = [
      ...formData.faq,
      { question: '', answer: '' }
    ];
    onArrayChange('faq', newFAQ);
  };

  const updateFAQItem = (index, field, value) => {
    const newFAQ = [...formData.faq];
    newFAQ[index][field] = value;
    onArrayChange('faq', newFAQ);
  };

  const removeFAQItem = (index) => {
    const newFAQ = formData.faq.filter((_, i) => i !== index);
    onArrayChange('faq', newFAQ);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">الأسئلة الشائعة</h3>
        <button
          type="button"
          onClick={addFAQItem}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة سؤال
        </button>
      </div>

      {formData.faq.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السؤال
              </label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل السؤال"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجابة
              </label>
              <textarea
                value={item.answer}
                onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل الإجابة"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeFAQItem(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {formData.faq.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد أسئلة شائعة بعد</p>
          <p className="text-sm">اضغط على "إضافة سؤال" لبدء إضافة الأسئلة الشائعة</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;