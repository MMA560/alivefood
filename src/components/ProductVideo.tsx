import React, { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FrontendProductVideoData } from "@/lib/api";

// إضافة interface للـ Props
interface ProductVideoSectionProps {
  videoInfo: FrontendProductVideoData;
  language: 'en' | 'ar';
  isRTL: boolean;
}

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const extractYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const ProductVideoSection: React.FC<ProductVideoSectionProps> = ({
  videoInfo,
  language,
  isRTL,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isYouTube = isYouTubeUrl(videoInfo.videoUrl);
  const youtubeId = isYouTube ? extractYouTubeId(videoInfo.videoUrl) : null;

  const translations = {
    en: {
      productVideo: "Product Video",
      playVideo: "Play Video",
    },
    ar: {
      productVideo: "فيديو المنتج",
      playVideo: "تشغيل الفيديو",
    },
  };

  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  return (
    <div className="mb-16">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {videoInfo.title || t("productVideo")}
        </h2>
        <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
      </div>

      {/* Video Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Video Player */}
        <div className={`${isRTL ? "lg:order-2" : "lg:order-1"}`}>
          <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-xl border border-gray-200 shadow-lg">
            {isPlaying ? (
              isYouTube && youtubeId ? (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="absolute inset-0 w-full h-full rounded-xl"
                  src={videoInfo.videoUrl}
                  controls
                  autoPlay
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                <img
                  src={videoInfo.thumbnail}
                  alt="صورة مصغرة للفيديو"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl group-hover:bg-black/50 transition-all duration-300"></div>
                
                <Button
                  onClick={() => setIsPlaying(true)}
                  size="icon"
                  className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 z-10 transition-all duration-300 shadow-xl"
                  aria-label={t("playVideo")}
                >
                  <Play className="h-10 w-10 text-green-600 ml-1" fill="currentColor" />
                </Button>
                
                {videoInfo.overlayText && (
                  <p className="text-white z-10 mt-6 font-medium text-lg text-center px-4 drop-shadow-lg">
                    {videoInfo.overlayText}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Video Description */}
        <div className={`space-y-6 ${isRTL ? "lg:order-1 text-right" : "lg:order-2 text-left"}`}>
          {videoInfo.descriptionTitle && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {videoInfo.descriptionTitle}
              </h3>
              <div className="w-16 h-1 bg-green-600 rounded-full"></div>
            </div>
          )}
          
          {videoInfo.description && (
            <p className="text-gray-700 leading-relaxed text-lg">
              {videoInfo.description}
            </p>
          )}
          

        </div>
      </div>
    </div>
  );
};

export default ProductVideoSection;