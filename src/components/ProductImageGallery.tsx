import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Variant {
  id: string;
  color: string;
  image: string;
  stock: number;
  price: string;
}

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  selectedVariant?: string;
  variants?: Variant[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  title, 
  selectedVariant, 
  variants 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // دمج جميع الصور: الأصلية + صور المتغيرات
  const allImages = React.useMemo(() => {
    let combinedImages = [...images]; // نبدأ بالصور الأصلية
    
    // إضافة صور المتغيرات إذا لم تكن موجودة بالفعل
    if (variants && variants.length > 0) {
      variants.forEach(variant => {
        if (variant.image && !combinedImages.includes(variant.image)) {
          combinedImages.push(variant.image);
        }
      });
    }
    
    return combinedImages;
  }, [images, variants]);

  // تحديث الصورة الرئيسية عند تغيير المتغير المختار
  useEffect(() => {
    if (selectedVariant && variants) {
      const variant = variants.find(v => v.id === selectedVariant);
      if (variant && variant.image) {
        const variantImageIndex = allImages.findIndex(img => img === variant.image);
        if (variantImageIndex !== -1) {
          setCurrentImageIndex(variantImageIndex);
        }
      }
    }
  }, [selectedVariant, variants, allImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // If only one image, use simple display
  if (allImages.length <= 1) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
          <img
            src={allImages[0]}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            } group-hover:scale-110 group-hover:rotate-1`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
        <img
          src={allImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          } group-hover:scale-110 group-hover:rotate-1`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
        
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 hover:shadow-lg border-0 shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 hover:shadow-lg border-0 shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Enhanced Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Enhanced Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                index === currentImageIndex
                  ? 'border-green-500 shadow-lg shadow-green-500/25 scale-105'
                  : 'border-gray-200 hover:border-gray-300 shadow-md'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;