import { FileText } from 'lucide-react';

const AdditionalContent = ({ formData, onInputChange, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تعليمات الاستخدام
        </label>
        <textarea
          value={formData.usage_instructions}
          onChange={(e) => onInputChange('usage_instructions', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors?.usage_instructions ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="كيفية استخدام المنتج - مثال: اتبع الخطوات التالية للحصول على أفضل النتائج..."
        />
        {errors?.usage_instructions && (
          <p className="mt-1 text-sm text-red-600">{errors.usage_instructions}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تعليمات التخزين
        </label>
        <textarea
          value={formData.storage_instructions}
          onChange={(e) => onInputChange('storage_instructions', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors?.storage_instructions ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="كيفية تخزين المنتج - مثال: يُحفظ في مكان بارد وجاف، بعيداً عن أشعة الشمس المباشرة..."
        />
        {errors?.storage_instructions && (
          <p className="mt-1 text-sm text-red-600">{errors.storage_instructions}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">نصائح للمحتوى الإضافي</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• استخدم نقاط واضحة ومرقمة لسهولة القراءة</li>
              <li>• أضف التحذيرات المهمة في بداية النص</li>
              <li>• اكتب بأسلوب واضح ومباشر</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalContent;