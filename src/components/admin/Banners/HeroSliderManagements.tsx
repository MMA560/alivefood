import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Move,
  Power,
  PowerOff,
  Star,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

// استيراد نظام Toast
import { useToast } from "@/hooks/use-toast";

// استيراد API functions مباشرة
import { heroSliderAPI, HeroSlide, HeroSliderResponse } from "@/lib/banners_api";

// استيراد المكونات الفرعية
import StatsCards from "./sliders/StatsCards";
import SlidePreview from "./sliders/SlidePreview";
import SlidesTable from "./sliders/SlidesTable";
import SlideModal from "./sliders/SlideModal";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  slideTitle,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 transform transition-all">
        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-red-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            تأكيد الحذف
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            هل أنت متأكد من حذف الشريحة
            {slideTitle && (
              <span className="font-medium text-gray-900 block mt-1">
                "{slideTitle}"
              </span>
            )}
            ؟ لا يمكن التراجع عن هذا الإجراء.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم احذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Components
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="mr-3">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {[...Array(4)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

const SkeletonPreview = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="animate-pulse">
      {/* Table Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Table Rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonSearchFilter = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-32 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

// Type definitions
interface SlideFormData {
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  link_url: string;
  order: number;
  is_active: boolean;
}

const HeroSliderManagement = () => {
  // استيراد Toast hook
  const { toast } = useToast();

  // States for slides data
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Load all slides on component mount
  const loadSlides = async () => {
    try {
      setLoading(true);
      // 🔥 استخدام getAllSlides للحصول على جميع الشرائح (نشطة وغير نشطة)
      const response: HeroSliderResponse = await heroSliderAPI.getAllSlides();
      setSlides(response.slides || []);
    } catch (error) {
      console.error("Error loading slides:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل الشرائح",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load slides on component mount
  useEffect(() => {
    loadSlides();
  }, []);

  // Calculate statistics
  const activeSlides = slides.filter(slide => slide.is_active);
  const inactiveSlides = slides.filter(slide => !slide.is_active);

  // Filter slides based on search and status
  const filteredSlides = slides.filter((slide: HeroSlide) => {
    const matchesSearch =
      (slide?.title_ar || "").includes(searchTerm) ||
      (slide?.title_en || "").includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && slide?.is_active) ||
      (statusFilter === "inactive" && !slide?.is_active);
    return matchesSearch && matchesStatus;
  });

  const openModal = (slide: HeroSlide | null = null): void => {
    setEditingSlide(slide);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setEditingSlide(null);
  };

  const openDeleteModal = (slide: HeroSlide): void => {
    setSlideToDelete(slide);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = (): void => {
    setShowDeleteModal(false);
    setSlideToDelete(null);
  };

  const handleDelete = async (slideId: string | number): Promise<void> => {
    const slide = slides?.find((s) => s.id === slideId);
    if (slide) {
      openDeleteModal(slide);
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!slideToDelete) return;

    setDeleteLoading(true);
    try {
      console.log("🔄 بدء عملية الحذف للشريحة:", slideToDelete?.id);

      const success = await heroSliderAPI.deleteSlide(slideToDelete?.id?.toString() || "");

      console.log("📊 نتيجة الحذف:", success);

      if (success) {
        console.log("✅ نجح الحذف");
        toast({
          title: "تم حذف الشريحة",
          description: "تم حذف الشريحة بنجاح",
        });
        closeDeleteModal();
        // إعادة تحميل البيانات
        await loadSlides();
      } else {
        console.log("❌ فشل الحذف");
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف الشريحة",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("💥 خطأ غير متوقع:", error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ غير متوقع أثناء حذف الشريحة",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (slideId: string | number): Promise<void> => {
    try {
      setActionLoading(true);
      const slide = slides?.find((s) => s.id === slideId);
      
      // استخدام updateSlide لتغيير الحالة
      const success = await heroSliderAPI.updateSlide(slideId.toString(), {
        is_active: !slide?.is_active
      });

      if (success) {
        const newStatus = !slide?.is_active;
        toast({
          title: newStatus ? "تم تفعيل الشريحة" : "تم إلغاء تفعيل الشريحة",
          description: newStatus
            ? "الشريحة أصبحت نشطة الآن"
            : "الشريحة أصبحت غير نشطة الآن",
        });
        // إعادة تحميل البيانات
        await loadSlides();
      } else {
        toast({
          title: "خطأ في تغيير الحالة",
          description: "حدث خطأ أثناء تغيير حالة الشريحة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تغيير الحالة",
        description: "حدث خطأ أثناء تغيير حالة الشريحة",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSlideSubmit = async (formData: SlideFormData): Promise<boolean> => {
    try {
      setActionLoading(true);
      let success = false;
      
      if (editingSlide) {
        const updatedSlide = await heroSliderAPI.updateSlide(editingSlide?.id?.toString() || "", formData);
        success = !!updatedSlide;
        if (success) {
          toast({
            title: "تم تحديث الشريحة",
            description: "تم تحديث بيانات الشريحة بنجاح",
          });
        } else {
          toast({
            title: "خطأ في التحديث",
            description: "حدث خطأ أثناء تحديث الشريحة",
            variant: "destructive",
          });
        }
      } else {
        const newSlide = await heroSliderAPI.createSlide(formData);
        success = !!newSlide;
        if (success) {
          toast({
            title: "تم إنشاء الشريحة",
            description: "تم إنشاء الشريحة الجديدة بنجاح",
          });
        } else {
          toast({
            title: "خطأ في الإنشاء",
            description: "حدث خطأ أثناء إنشاء الشريحة",
            variant: "destructive",
          });
        }
      }

      if (success) {
        closeModal();
        // إعادة تحميل البيانات
        await loadSlides();
      }
      return success;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg ml-3">
            <Move className="h-6 w-6 text-blue-600" />
          </div>
          إدارة شرائح الهيرو
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || actionLoading}
        >
          {(loading || actionLoading) ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 ml-2" />
          )}
          إضافة شريحة جديدة
        </button>
      </div>

      {/* Stats Cards with Skeleton */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <StatsCards
          totalSlides={slides?.length || 0}
          activeSlides={activeSlides?.length || 0}
          inactiveSlides={inactiveSlides?.length || 0}
          featuredSlides={0}
        />
      )}

      {/* Search and Filter with Skeleton */}
      {loading ? (
        <SkeletonSearchFilter />
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الشرائح..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || actionLoading}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || actionLoading}
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Slides Preview with Skeleton */}
      {loading ? (
        <SkeletonPreview />
      ) : (
        <SlidePreview slides={filteredSlides} />
      )}

      {/* Slides Table with Skeleton */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <SlidesTable
          slides={filteredSlides}
          loading={actionLoading}
          onEdit={openModal}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Slide Modal */}
      {showModal && (
        <SlideModal
          slide={editingSlide}
          slides={slides}
          onClose={closeModal}
          onSubmit={handleSlideSubmit}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        slideTitle={slideToDelete?.title_ar || slideToDelete?.title_en}
        loading={deleteLoading}
      />
    </div>
  );
};

export default HeroSliderManagement;