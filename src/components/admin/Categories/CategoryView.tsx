// // src/components/admin/Categories/CategoryView.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { categoriesApi } from "@/lib/api";
import {
  ArrowRight,
  Edit,
  Tag,
  Calendar,
  Image as ImageIcon,
  Star,
  Eye,
  EyeOff,
  Hash,
  FileText,
  Settings,
  AlertCircle,
} from "lucide-react";

const CategoryView = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getCategoryById(categoryId);
      setCategory(data);
    } catch (error) {
      toast({
        title: "خطأ في جلب التصنيف",
        description: "حدث خطأ أثناء جلب بيانات التصنيف",
        variant: "destructive",
      });
      navigate("/admin/categories/list");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غير نشط";
      case "draft":
        return "مسودة";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Eye className="h-4 w-4" />;
      case "inactive":
        return <EyeOff className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            التصنيف غير موجود
          </h3>
          <p className="text-gray-500 mb-4">
            لم يتم العثور على التصنيف المطلوب
          </p>
          <button
            onClick={() => navigate("/admin/categories/list")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="ml-2 h-5 w-5" />
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin/categories/list")}
              className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Tag className="ml-2 h-6 w-6 text-blue-600" />
              تفاصيل التصنيف
            </h1>
          </div>

          <button
            onClick={() =>
              navigate(`/admin/categories/edit/${categoryId}`, {
                state: { isEditing: true },
              })
            }
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="ml-2 h-5 w-5" />
            تعديل التصنيف
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Tag className="ml-2 h-5 w-5 text-gray-600" />
                المعلومات الأساسية
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  اسم التصنيف
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {category.name}
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Hash className="ml-1 h-4 w-4" />
                  الرابط المختصر
                </label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border">
                  {category.slug}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FileText className="ml-1 h-4 w-4" />
                  الوصف
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-900 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ImageIcon className="ml-2 h-5 w-5 text-gray-600" />
                صورة التصنيف
              </h2>
            </div>
            <div className="p-6">
              {category.image ? (
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-category.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
                    صورة التصنيف
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">لا توجد صورة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Settings */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="ml-2 h-5 w-5 text-gray-600" />
                الحالة والإعدادات
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  حالة التصنيف
                </label>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-lg border ${getStatusColor(
                    category.status
                  )}`}
                >
                  {getStatusIcon(category.status)}
                  <span className="mr-2 font-medium">
                    {getStatusText(category.status)}
                  </span>
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  التصنيف المميز
                </label>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                    category.is_featured
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <Star
                    className={`h-4 w-4 mr-2 ${
                      category.is_featured ? "text-purple-600" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">
                    {category.is_featured ? "مميز" : "عادي"}
                  </span>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  ترتيب العرض
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded border">
                  <span className="text-lg font-semibold text-gray-900">
                    {category.sort_order}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="ml-2 h-5 w-5 text-gray-600" />
                معلومات إضافية
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* ID */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  رقم التصنيف
                </label>
                <p className="text-gray-900 font-mono">#{category.id}</p>
              </div>

              {/* Created Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  تاريخ الإنشاء
                </label>
                <p className="text-gray-900">
                  {new Date(category.created_at).toLocaleDateString("ar-SA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(category.created_at).toLocaleTimeString("ar-SA")}
                </p>
              </div>

              {/* Updated Date */}
              {category.updated_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    آخر تحديث
                  </label>
                  <p className="text-gray-900">
                    {new Date(category.updated_at).toLocaleDateString("ar-SA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(category.updated_at).toLocaleTimeString("ar-SA")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 space-y-3">
              <button
                onClick={() =>
                  navigate(`/admin/categories/edit/${categoryId}`, {
                    state: { isEditing: true },
                  })
                }
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-5 w-5 ml-2" />
                تعديل التصنيف
              </button>

              <button
                onClick={() => navigate("/admin/categories/list")}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <ArrowRight className="h-5 w-5 ml-2" />
                العودة للقائمة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
