import React from 'react';
import { Plus, X, Settings, Info } from 'lucide-react';

const ProductDetails = ({ formData, onNestedChange, errors }) => {
  const addDetailSection = () => {
    const newSections = [
      ...formData.details.sections,
      { title: '', items: [''] }
    ];
    onNestedChange('details', 'sections', newSections);
  };

  const updateSectionTitle = (sectionIndex, title) => {
    const newSections = [...formData.details.sections];
    newSections[sectionIndex].title = title;
    onNestedChange('details', 'sections', newSections);
  };

  const updateSectionItem = (sectionIndex, itemIndex, value) => {
    const newSections = [...formData.details.sections];
    newSections[sectionIndex].items[itemIndex] = value;
    onNestedChange('details', 'sections', newSections);
  };

  const addItemToSection = (sectionIndex) => {
    const newSections = [...formData.details.sections];
    newSections[sectionIndex].items.push('');
    onNestedChange('details', 'sections', newSections);
  };

  const removeItemFromSection = (sectionIndex, itemIndex) => {
    const newSections = [...formData.details.sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    onNestedChange('details', 'sections', newSections);
  };

  const removeSection = (sectionIndex) => {
    const newSections = formData.details.sections.filter((_, i) => i !== sectionIndex);
    onNestedChange('details', 'sections', newSections);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف التفاصيل
        </label>
        <textarea
          value={formData.details.description}
          onChange={(e) => onNestedChange('details', 'description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors?.['details.description'] ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="وصف عام للتفاصيل التقنية والمواصفات"
        />
        {errors?.['details.description'] && (
          <p className="mt-1 text-sm text-red-600">{errors['details.description']}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">أقسام التفاصيل</h3>
          <button
            type="button"
            onClick={addDetailSection}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            إضافة قسم
          </button>
        </div>

        {formData.details.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القسم
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: المواصفات التقنية"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                العناصر
              </label>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateSectionItem(sectionIndex, itemIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: المعالج: Intel Core i7"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemFromSection(sectionIndex, itemIndex)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={section.items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItemToSection(sectionIndex)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                إضافة عنصر
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                حذف القسم
              </button>
            </div>
          </div>
        ))}

        {formData.details.sections.length === 0 && (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد أقسام تفاصيل بعد</p>
            <p className="text-sm">اضغط على "إضافة قسم" لبدء إضافة التفاصيل التقنية</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-900 mb-1">نصائح لتنظيم التفاصيل</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• قم بتجميع التفاصيل المتشابهة في أقسام منفصلة</li>
              <li>• استخدم عناوين واضحة لكل قسم (مثل: المواصفات، الأبعاد، المحتويات)</li>
              <li>• اكتب كل عنصر بصيغة "الخاصية: القيمة" للوضوح</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;