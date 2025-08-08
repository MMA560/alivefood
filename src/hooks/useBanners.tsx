//src/hooks/useBanners.ts

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import {
  heroSliderAPI,
  promoBannerAPI,
  uploadAPI,
  HeroSlide,
  HeroSlideCreate,
  HeroSlideUpdate,
  PromoBanner,
  PromoBannerCreate,
  PromoBannerUpdate,
} from "@/lib/banners_api";

// Hero Slider Hook
export const useHeroSlider = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all slides
  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await heroSliderAPI.getAllSlides();
      // تأكد من أن البيانات array
      setSlides(Array.isArray(data) ? data : data.slides || []);
    } catch (err: any) {
      const errorMessage = err.message || "حدث خطأ في تحميل الشرائح";
      setError(errorMessage);
      setSlides([]); // تعيين array فارغ عند الخطأ
      toast({
        title: "خطأ",
        description: "فشل في تحميل شرائح الهيرو",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create slide
  const createSlide = useCallback(
    async (slideData: HeroSlideCreate): Promise<boolean> => {
      try {
        setLoading(true);
        const newSlide = await heroSliderAPI.createSlide(slideData);
        setSlides((prev) =>
          Array.isArray(prev) ? [...prev, newSlide] : [newSlide]
        );
        toast({
          title: "نجح",
          description: "تم إنشاء الشريحة بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في إنشاء الشريحة";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في إنشاء الشريحة",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update slide
  const updateSlide = useCallback(
    async (slideId: string, slideData: HeroSlideUpdate): Promise<boolean> => {
      try {
        setLoading(true);
        const updatedSlide = await heroSliderAPI.updateSlide(
          slideId,
          slideData
        );
        setSlides((prev) =>
          Array.isArray(prev)
            ? prev.map((slide) =>
                slide.id?.toString() === slideId ? updatedSlide : slide
              )
            : [updatedSlide]
        );
        toast({
          title: "نجح",
          description: "تم تحديث الشريحة بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في تحديث الشريحة";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في تحديث الشريحة",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete slide
  const deleteSlide = useCallback(
    async (slideId: string): Promise<boolean> => {
      try {
        setLoading(true);

        // 🎯 بساطة! الـ API هيرجع true لو نجح
        const success = await heroSliderAPI.deleteSlide(slideId);

        console.log("✅ نجح الحذف:", success);

        if (success) {
          // تحديث الـ state
          setSlides((prev) =>
            Array.isArray(prev)
              ? prev.filter((slide) => slide.id?.toString() !== slideId)
              : []
          );

          toast({
            title: "تم حذف الشريحة",
            description: "تم حذف الشريحة بنجاح",
          });

          return true;
        }

        return false;
      } catch (err: any) {
        console.error("❌ خطأ في حذف الشريحة:", err);

        const errorMessage = err.message || "حدث خطأ في حذف الشريحة";
        setError(errorMessage);

        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف الشريحة",
          variant: "destructive",
        });

        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Toggle slide status
  const toggleSlideStatus = useCallback(
    async (slideId: string): Promise<boolean> => {
      try {
        const updatedSlide = await heroSliderAPI.toggleSlideStatus(slideId);
        setSlides((prev) =>
          Array.isArray(prev)
            ? prev.map((slide) =>
                slide.id?.toString() === slideId ? updatedSlide : slide
              )
            : [updatedSlide]
        );
        toast({
          title: "نجح",
          description: `تم ${
            updatedSlide.is_active ? "تفعيل" : "إلغاء تفعيل"
          } الشريحة`,
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في تغيير حالة الشريحة";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في تغيير حالة الشريحة",
          variant: "destructive",
        });
        return false;
      }
    },
    []
  );

  // Reorder slides
  const reorderSlides = useCallback(
    async (slideIds: string[]): Promise<boolean> => {
      try {
        await heroSliderAPI.reorderSlides(slideIds);
        // Update local state with new order
        if (Array.isArray(slides)) {
          const reorderedSlides = slideIds
            .map((id) => slides.find((slide) => slide.id?.toString() === id)!)
            .filter(Boolean); // إزالة العناصر غير الموجودة
          setSlides(reorderedSlides);
        }
        toast({
          title: "نجح",
          description: "تم إعادة ترتيب الشرائح بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في ترتيب الشرائح";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في ترتيب الشرائح",
          variant: "destructive",
        });
        return false;
      }
    },
    [slides]
  );

  // Get slide by ID
  const getSlide = useCallback(
    (slideId: string): HeroSlide | undefined => {
      return Array.isArray(slides)
        ? slides.find((slide) => slide.id?.toString() === slideId)
        : undefined;
    },
    [slides]
  );

  // Get active slides count - مع حماية من الخطأ
  const activeSlides = Array.isArray(slides)
    ? slides.filter((slide) => slide.is_active)
    : [];
  const inactiveSlides = Array.isArray(slides)
    ? slides.filter((slide) => !slide.is_active)
    : [];

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  return {
    slides,
    activeSlides,
    inactiveSlides,
    loading,
    error,
    fetchSlides,
    createSlide,
    updateSlide,
    deleteSlide,
    toggleSlideStatus,
    reorderSlides,
    getSlide,
  };
};

// Promo Banner Hook
export const usePromoBanners = () => {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all banners
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoBannerAPI.getAllBanners();
      // تأكد من أن البيانات array
      setBanners(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const errorMessage = err.message || "حدث خطأ في تحميل البانرات";
      setError(errorMessage);
      setBanners([]); // تعيين array فارغ عند الخطأ
      toast({
        title: "خطأ",
        description: "فشل في تحميل البانرات الترويجية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create banner
  const createBanner = useCallback(
    async (bannerData: PromoBannerCreate): Promise<boolean> => {
      try {
        setLoading(true);
        const newBanner = await promoBannerAPI.createBanner(bannerData);
        setBanners((prev) =>
          Array.isArray(prev) ? [...prev, newBanner] : [newBanner]
        );
        toast({
          title: "نجح",
          description: "تم إنشاء البانر بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في إنشاء البانر";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في إنشاء البانر",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update banner
  const updateBanner = useCallback(
    async (
      bannerId: string,
      bannerData: PromoBannerUpdate
    ): Promise<boolean> => {
      try {
        setLoading(true);
        const updatedBanner = await promoBannerAPI.updateBanner(
          bannerId,
          bannerData
        );
        setBanners((prev) =>
          Array.isArray(prev)
            ? prev.map((banner) =>
                banner.id?.toString() === bannerId ? updatedBanner : banner
              )
            : [updatedBanner]
        );
        toast({
          title: "نجح",
          description: "تم تحديث البانر بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في تحديث البانر";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في تحديث البانر",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete banner
  const deleteBanner = useCallback(
    async (bannerId: string): Promise<boolean> => {
      try {
        setLoading(true);
        await promoBannerAPI.deleteBanner(bannerId);
        setBanners((prev) =>
          Array.isArray(prev)
            ? prev.filter((banner) => banner.id?.toString() !== bannerId)
            : []
        );
        toast({
          title: "نجح",
          description: "تم حذف البانر بنجاح",
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في حذف البانر";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في حذف البانر",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Toggle banner status
  const toggleBannerStatus = useCallback(
    async (bannerId: string): Promise<boolean> => {
      try {
        const updatedBanner = await promoBannerAPI.toggleBannerStatus(bannerId);
        setBanners((prev) =>
          Array.isArray(prev)
            ? prev.map((banner) =>
                banner.id?.toString() === bannerId ? updatedBanner : banner
              )
            : [updatedBanner]
        );
        toast({
          title: "نجح",
          description: `تم ${
            updatedBanner.is_active ? "تفعيل" : "إلغاء تفعيل"
          } البانر`,
        });
        return true;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في تغيير حالة البانر";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: "فشل في تغيير حالة البانر",
          variant: "destructive",
        });
        return false;
      }
    },
    []
  );

  // Get banner by ID
  const getBanner = useCallback(
    (bannerId: string): PromoBanner | undefined => {
      return Array.isArray(banners)
        ? banners.find((banner) => banner.id?.toString() === bannerId)
        : undefined;
    },
    [banners]
  );

  // Get active banners count - مع حماية من الخطأ
  const activeBanners = Array.isArray(banners)
    ? banners.filter((banner) => banner.is_active)
    : [];
  const inactiveBanners = Array.isArray(banners)
    ? banners.filter((banner) => !banner.is_active)
    : [];

  // Get expired banners - مع حماية من الخطأ
  const expiredBanners = Array.isArray(banners)
    ? banners.filter((banner) => {
        if (!banner.end_date) return false;
        return new Date(banner.end_date) < new Date();
      })
    : [];

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    activeBanners,
    inactiveBanners,
    expiredBanners,
    loading,
    error,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    getBanner,
  };
};

// Upload Hook
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, folder: string = "banners"): Promise<string | null> => {
      try {
        setUploading(true);
        setUploadError(null);

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("يجب أن يكون الملف صورة");
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        }

        const imageUrl = await uploadAPI.uploadImage(file, folder);
        toast({
          title: "نجح",
          description: "تم رفع الصورة بنجاح",
        });
        return imageUrl;
      } catch (err: any) {
        const errorMessage = err.message || "حدث خطأ في رفع الصورة";
        setUploadError(errorMessage);
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return {
    uploading,
    uploadError,
    uploadImage,
  };
};
