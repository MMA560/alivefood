import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import {
  preventDangerousCharacters,
  handleTextPaste,
  cleanTextValue,
} from '@/lib/productValidation';

const AdditionalContent = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">المحتوى الإضافي</h2>
        <p className="text-gray-600 text-sm mt-1">أضف تعليمات الاستخدام والتخزين</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تعليمات الاستخدام (اختياري)
        </label>
        <textarea
          value={formData.usage_instructions || ''}
          onChange={(e) => onInputChange('usage_instructions', cleanTextValue(e.target.value))}
          onKeyPress={preventDangerousCharacters}
          onPaste={handleTextPaste}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل تعليمات الاستخدام والإرشادات للعملاء..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.usage_instructions?.length || 0} حرف
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تعليمات التخزين (اختياري)
        </label>
        <textarea
          value={formData.storage_instructions || ''}
          onChange={(e) => onInputChange('storage_instructions', cleanTextValue(e.target.value))}
          onKeyPress={preventDangerousCharacters}
          onPaste={handleTextPaste}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل تعليمات التخزين والحفظ..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.storage_instructions?.length || 0} حرف
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-900 mb-1">💡 نصائح للمحتوى الإضافي:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• اكتب التعليمات بشكل واضح ومباشر</li>
              <li>• استخدم نقاط أو قوائم مرقمة للخطوات</li>
              <li>• أضف تحذيرات مهمة إن وجدت</li>
              <li>• اذكر أي احتياطات خاصة</li>
              <li>• تجنب الرموز الخاصة مثل {'<'} {'>'} {'{'} {'}'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">📝 أمثلة:</h4>
            <div className="text-sm text-blue-700 space-y-2 mt-2">
              <div>
                <p className="font-medium">تعليمات الاستخدام:</p>
                <p className="text-xs mt-1">
                  "1. قم بإزالة الغلاف الواقي<br/>
                  2. اشحن المنتج بالكامل قبل الاستخدام الأول<br/>
                  3. اضغط على زر التشغيل لمدة 3 ثوان"
                </p>
              </div>
              <div className="mt-3">
                <p className="font-medium">تعليمات التخزين:</p>
                <p className="text-xs mt-1">
                  "احفظ المنتج في مكان جاف وبارد بعيداً عن أشعة الشمس المباشرة.<br/>
                  تجنب التعرض للرطوبة أو الحرارة الشديدة."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalContent;