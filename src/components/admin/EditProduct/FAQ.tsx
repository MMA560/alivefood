import React from 'react';
import { Plus, X, HelpCircle, AlertCircle } from 'lucide-react';
import {
  preventDangerousCharacters,
  handleTextPaste,
  cleanTextValue,
} from '@/lib/productValidation';

const FAQ = ({ formData, onArrayChange }) => {
  const addFAQItem = () => {
    const newFAQ = [
      ...formData.faq,
      { question: '', answer: '' }
    ];
    onArrayChange('faq', newFAQ);
  };

  const updateFAQItem = (index: number, field: string, value: string) => {
    const newFAQ = [...formData.faq];
    newFAQ[index][field] = cleanTextValue(value);
    onArrayChange('faq', newFAQ);
  };

  const removeFAQItem = (index: number) => {
    const newFAQ = formData.faq.filter((_: any, i: number) => i !== index);
    onArrayChange('faq', newFAQ);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">الأسئلة الشائعة</h2>
        <p className="text-gray-600 text-sm mt-1">أضف الأسئلة الشائعة وإجاباتها لمساعدة العملاء</p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">قائمة الأسئلة</h3>
        <button
          type="button"
          onClick={addFAQItem}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة سؤال
        </button>
      </div>

      {formData.faq.map((item: any, index: number) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السؤال *
              </label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                onKeyPress={preventDangerousCharacters}
                onPaste={handleTextPaste}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل السؤال (5-500 حرف)"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {item.question?.length || 0}/500 حرف
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجابة *
              </label>
              <textarea
                value={item.answer}
                onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                onKeyPress={preventDangerousCharacters}
                onPaste={handleTextPaste}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل الإجابة (10 أحرف على الأقل)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {item.answer?.length || 0} حرف (الحد الأدنى: 10)
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                السؤال رقم {index + 1}
              </div>
              <button
                type="button"
                onClick={() => removeFAQItem(index)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}

      {formData.faq.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد أسئلة شائعة بعد</p>
          <p className="text-sm">اضغط على "إضافة سؤال" لبدء إضافة الأسئلة الشائعة</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">💡 نصائح للأسئلة الشائعة:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• اكتب الأسئلة كما يطرحها العملاء عادة</li>
              <li>• اجعل الإجابات واضحة ومباشرة</li>
              <li>• ركز على الأسئلة الأكثر شيوعاً</li>
              <li>• استخدم لغة بسيطة وسهلة الفهم</li>
              <li>• تجنب الرموز الخاصة مثل {'<'} {'>'} {'{'} {'}'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;