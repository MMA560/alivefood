import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  List,
  Tag,
  BarChart3,
  TrendingUp,
  Globe,
  FileText,
  Calendar,
  Settings,
  User,
  Shield,
  DollarSign,
  Home, // Added Home icon for home page offers
} from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  current: boolean;
  hasSubmenu?: boolean;
  submenu?: {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
  }[];
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [analyticsMenuOpen, setAnalyticsMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدامك لوحة التحكم",
    });
    navigate("/admin");
  };

  const navigation: NavigationItem[] = [
    {
      name: "إدارة الطلبات",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: location.pathname === "/admin/dashboard",
    },
    {
      name: "إدارة عروض الصفحة الرئيسية", // Added new navigation item
      href: "/admin/home-offers",
      icon: Home, // Using Home icon
      current: location.pathname === "/admin/home-offers",
    },
    {
      name: "إدارة المنتجات",
      icon: Package,
      current: location.pathname.startsWith("/admin/products"),
      hasSubmenu: true,
      submenu: [
        {
          name: "إنشاء منتج",
          href: "/admin/products/edit",
          icon: Plus,
          current: location.pathname === "/admin/products/edit",
        },
        {
          name: "قائمة المنتجات",
          href: "/admin/products/list",
          icon: List,
          current: location.pathname === "/admin/products/list",
        },
      ],
    },
    {
      name: "إدارة التصنيفات",
      icon: Tag,
      current: location.pathname.startsWith("/admin/categories"),
      hasSubmenu: true,
      submenu: [
        {
          name: "إنشاء تصنيف",
          href: "/admin/categories/edit",
          icon: Plus,
          current: location.pathname === "/admin/categories/edit",
        },
        {
          name: "قائمة التصنيفات",
          href: "/admin/categories/list",
          icon: List,
          current: location.pathname === "/admin/categories/list",
        },
      ],
    },
    {
      name: "الإحصائيات والتحليلات",
      icon: BarChart3,
      current: location.pathname.startsWith("/admin/analytics"),
      hasSubmenu: true,
      submenu: [
        {
          name: "الإحصائيات العامة",
          href: "/admin/analytics/stats",
          icon: TrendingUp,
          current: location.pathname === "/admin/analytics/stats",
        },
        {
          name: "الصفحات الشائعة",
          href: "/admin/analytics/popular-pages",
          icon: FileText,
          current: location.pathname === "/admin/analytics/popular-pages",
        },
        {
          name: "التوزيع الجغرافي",
          href: "/admin/analytics/geography",
          icon: Globe,
          current: location.pathname === "/admin/analytics/geography",
        },
        {
          name: "الأحداث والفعاليات",
          href: "/admin/analytics/events",
          icon: Calendar,
          current: location.pathname === "/admin/analytics/events",
        },
      ],
    },
    {
      name: "إدارة العملات",
      href: "/admin/currencies",
      icon: DollarSign,
      current: location.pathname === "/admin/currencies",
    },
    {
      name: "الإعدادات",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
      hasSubmenu: true,
      submenu: [
        {
          name: "إعدادات الحساب",
          href: "/admin/settings/account",
          icon: User,
          current: location.pathname === "/admin/settings/account",
        },
        {
          name: "إدارة المشرفين",
          href: "/admin/settings/admins",
          icon: Shield,
          current: location.pathname === "/admin/settings/admins",
        },
      ],
    },
  ];

  // Check if menus should be open based on current path
  React.useEffect(() => {
    if (location.pathname.startsWith("/admin/products")) {
      setProductsMenuOpen(true);
    }
    if (location.pathname.startsWith("/admin/categories")) {
      setCategoriesMenuOpen(true);
    }
    if (location.pathname.startsWith("/admin/analytics")) {
      setAnalyticsMenuOpen(true);
    }
    if (location.pathname.startsWith("/admin/settings")) {
      setSettingsMenuOpen(true);
    }
  }, [location.pathname]);

  const handleNavigationClick = (item: NavigationItem) => {
    if (item.hasSubmenu) {
      if (item.name === "إدارة المنتجات") {
        setProductsMenuOpen(!productsMenuOpen);
      } else if (item.name === "إدارة التصنيفات") {
        setCategoriesMenuOpen(!categoriesMenuOpen);
      } else if (item.name === "الإحصائيات والتحليلات") {
        setAnalyticsMenuOpen(!analyticsMenuOpen);
      } else if (item.name === "الإعدادات") {
        setSettingsMenuOpen(!settingsMenuOpen);
      }
    } else {
      navigate(item.href);
      setSidebarOpen(false);
    }
  };

  const handleSubmenuClick = (submenuItem: NonNullable<NavigationItem['submenu']>[0]) => {
    navigate(submenuItem.href);
    setSidebarOpen(false);
  };

  const renderNavigationItem = (item: NavigationItem, isMobile: boolean = false) => {
    const Icon = item.icon;
    const textSize = isMobile ? "text-base" : "text-sm";
    const iconSize = isMobile ? "h-6 w-6" : "h-5 w-5";
    const paddingY = isMobile ? "py-2" : "py-2";

    // Determine which submenu to show
    let isSubmenuOpen = false;
    if (item.name === "إدارة المنتجات") {
      isSubmenuOpen = productsMenuOpen;
    } else if (item.name === "إدارة التصنيفات") {
      isSubmenuOpen = categoriesMenuOpen;
    } else if (item.name === "الإحصائيات والتحليلات") {
      isSubmenuOpen = analyticsMenuOpen;
    } else if (item.name === "الإعدادات") {
      isSubmenuOpen = settingsMenuOpen;
    }

    return (
      <div key={item.name}>
        <button
          onClick={() => handleNavigationClick(item)}
          className={`w-full group flex items-center px-2 ${paddingY} ${textSize} font-medium rounded-md transition-all duration-200 ${
            item.current && !item.hasSubmenu
              ? "bg-blue-100 text-blue-900 border-r-4 border-blue-500"
              : item.current
              ? "bg-blue-50 text-blue-800"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
          title={sidebarCollapsed ? item.name : ""}
        >
          <Icon
            className={`${
              sidebarCollapsed && !isMobile
                ? "mx-auto"
                : isMobile
                ? "mr-4"
                : "mr-3"
            } ${iconSize} flex-shrink-0 ${
              item.current
                ? "text-blue-500"
                : "text-gray-400 group-hover:text-gray-500"
            }`}
          />
          {(!sidebarCollapsed || isMobile) && (
            <>
              <span className="transition-opacity duration-200 font-bold flex-1 text-right">
                {item.name}
              </span>
              {item.hasSubmenu && (
                <span className="mr-2">
                  {isSubmenuOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              )}
            </>
          )}
        </button>

        {/* Submenu */}
        {item.hasSubmenu &&
          isSubmenuOpen &&
          (!sidebarCollapsed || isMobile) && (
            <div className="mr-4 mt-1 space-y-1">
              {item.submenu.map((submenuItem) => {
                const SubmenuIcon = submenuItem.icon;
                return (
                  <button
                    key={submenuItem.name}
                    onClick={() => handleSubmenuClick(submenuItem)}
                    className={`w-full group flex items-center px-2 py-2 ${textSize} font-medium rounded-md transition-all duration-200 ${
                      submenuItem.current
                        ? "bg-blue-100 text-blue-900 border-r-4 border-blue-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <SubmenuIcon
                      className={`${isMobile ? "mr-3" : "mr-2"} ${
                        isMobile ? "h-5 w-5" : "h-4 w-4"
                      } flex-shrink-0 ${
                        submenuItem.current
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span className="font-medium">{submenuItem.name}</span>
                  </button>
                );
              })}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="pt-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة التحكم
                </h1>
                <p className="text-xs text-gray-500 mt-1">الإصدار V1.13</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div
            className={`flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? "w-14" : "w-48"
            }`}
          >
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              {/* Toggle Button */}
              <div className="px-2 mb-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {sidebarCollapsed ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
              </div>

              <nav className="mt-1 flex-1 px-2 space-y-1">
                {navigation.map((item) => renderNavigationItem(item, false))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 flex z-40">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 left-0 -ml-12 pt-2">
                  <button
                    type="button"
                    className="mr-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => renderNavigationItem(item, true))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;