import React from "react";
import {
  Package,
  DollarSign,
  Camera,
  Settings,
  Video,
  FileText,
  HelpCircle,
  AlertCircle,
  Check,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

interface ValidationErrors {
  [key: string]: string | null;
}

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  progress: number;
  errors: ValidationErrors;
  isNewProduct?: boolean;
  isEditing?: boolean;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  progress,
  errors,
  isNewProduct = false,
  isEditing = false,
}) => {
  // تاب التوليد - مخفي في وضع التعديل
  const generateTab = {
    id: "generate",
    name: "إنشاء منتج ذكي",
    icon: Sparkles,
  };

  // باقي التابات
  const baseTabs = [
    { id: "basic", name: "المعلومات الأساسية", icon: Package },
    { id: "pricing", name: "الأسعار والمتغيرات", icon: DollarSign },
    { id: "images", name: "الصور", icon: Camera },
    { id: "video", name: "الفيديو", icon: Video },
    { id: "details", name: "التفاصيل التقنية", icon: Settings },
    { id: "content", name: "المحتوى الإضافي", icon: FileText },
    { id: "faq", name: "الأسئلة الشائعة", icon: HelpCircle },
  ];

  // التابات المعروضة - إخفاء تاب التوليد في وضع التعديل
  const tabs = isEditing ? baseTabs : [generateTab, ...baseTabs];

  const hasTabErrors = (tabId: string): boolean => {
    const tabFieldsMap: { [key: string]: string[] } = {
      basic: ["title", "category", "description"],
      pricing: ["price"],
      images: ["images"],
      details: [],
      content: [],
      faq: [],
      generate: [],
    };

    const tabFields = tabFieldsMap[tabId] || [];
    return tabFields.some((field) => errors && errors[field]);
  };

  const getNextTab = (currentTabId: string): string | null => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    if (currentIndex >= 0 && currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1].id;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <nav className="space-y-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const hasErrors = hasTabErrors(tab.id);
          const isActive = activeTab === tab.id;
          const nextTab = getNextTab(tab.id);

          return (
            <div key={tab.id} className="relative">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-right rounded-lg transition-colors relative group ${
                  isActive
                    ? tab.id === "generate"
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium flex-1">{tab.name}</span>

                {isActive && nextTab && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabChange(nextTab);
                      }}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 animate-pulse"
                      style={{
                        animationDuration: '2s'
                      }}
                      title={`الانتقال إلى ${
                        tabs.find((t) => t.id === nextTab)?.name
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {hasErrors && <AlertCircle className="h-4 w-4 text-red-500" />}
              </button>
            </div>
          );
        })}
      </nav>

      {activeTab !== "generate" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span>اكتمال البيانات</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progress === 100 ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">{progress}%</div>
            {progress === 100 && (
              <div className="flex items-center gap-1 text-green-600">
                <Check className="h-3 w-3" />
                <span className="text-xs font-medium">مكتمل</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationTabs;