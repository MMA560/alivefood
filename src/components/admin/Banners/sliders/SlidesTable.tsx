import React from 'react';
import { Edit2, Trash2, Power, PowerOff, Move } from 'lucide-react';

interface Slide {
  id?: number | string;
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  link_url?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
}

interface SlidesTableProps {
  slides: Slide[];
  loading: boolean;
  onEdit: (slide: Slide) => void;
  onDelete: (slideId: string | number) => void;
  onToggleStatus: (slideId: string | number) => void;
}

const SlidesTable: React.FC<SlidesTableProps> = ({
  slides,
  loading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">الشريحة</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">تاريخ الإنشاء</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">ترتيب العرض</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">الحالة</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slides.map((slide: Slide) => (
              <tr key={slide?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={slide?.image_url || ''}
                      alt={slide?.title_ar || ''}
                      className="h-16 w-24 object-cover rounded-md ml-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {slide?.title_ar || ''}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {slide?.subtitle_ar && slide.subtitle_ar.length > 50
                          ? slide.subtitle_ar.substring(0, 50) + '...'
                          : slide?.subtitle_ar || ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {slide?.created_at ? new Date(slide.created_at).toLocaleDateString('ar') : 'غير محدد'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {slide?.order || 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    slide?.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slide?.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(slide?.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        slide?.is_active
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={slide?.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                      disabled={loading}
                    >
                      {slide?.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => onEdit(slide)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(slide?.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Move className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد شرائح</h3>
          <p className="text-gray-500">ابدأ بإضافة شريحة جديدة لعرضها هنا</p>
        </div>
      )}
    </div>
  );
};

export default SlidesTable;