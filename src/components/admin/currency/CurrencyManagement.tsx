import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Loader,
  DollarSign,
  TrendingUp,
  CheckCircle,
  PauseCircle,
  RefreshCw,
  Coins,
  Globe,
} from "lucide-react";
import { useCurrencySettings } from "@/hooks/useCurrencySettings";

const CurrencyManagement = () => {
  const {
    currencies,
    loading,
    error,
    loadData,
    addCurrency,
    editCurrency,
    toggleCurrency,
    clearError,
  } = useCurrencySettings();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    code: "",
    name_ar: "",
    name_en: "",
    symbol: "",
    conversion_rate: "1",
    country: "",
    decimal_places: "2",
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.name_ar?.includes(searchTerm) ||
      currency.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && currency.is_active) ||
      (filterStatus === "inactive" && !currency.is_active);

    return matchesSearch && matchesFilter;
  });

  const activeCurrencies = currencies.filter((c) => c.is_active);
  const inactiveCurrencies = currencies.filter((c) => !c.is_active);

  const resetForm = () => {
    setFormData({
      code: "",
      name_ar: "",
      name_en: "",
      symbol: "",
      conversion_rate: "1",
      country: "",
      decimal_places: "2",
      is_active: true,
    });
    setEditingCurrency(null);
  };

  const handleAddCurrency = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditCurrency = (currency) => {
    setFormData({
      code: currency.code,
      name_ar: currency.name_ar,
      name_en: currency.name_en,
      symbol: currency.symbol || "",
      conversion_rate: currency.conversion_rate.toString(),
      country: currency.country || "",
      decimal_places: currency.decimal_places.toString(),
      is_active: currency.is_active,
    });
    setEditingCurrency(currency);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCurrency) {
        await editCurrency(editingCurrency.code, {
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          symbol: formData.symbol,
          conversion_rate: parseFloat(formData.conversion_rate),
          is_active: formData.is_active,
        });
      } else {
        await addCurrency({
          code: formData.code,
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          symbol: formData.symbol,
          conversion_rate: parseFloat(formData.conversion_rate),
          decimal_places: parseInt(formData.decimal_places),
          is_active: formData.is_active,
          country: formData.country,
        });
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleToggleStatus = async (currency) => {
    await toggleCurrency(currency.code);
  };

  const getStatusBadge = (isActive) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-gray-100 text-gray-600 border border-gray-200"
      }`}
    >
      {isActive ? "نشط" : "غير نشط"}
    </span>
  );

  const getCountryDisplay = (country) => {
    const countryMap = {
      Egypt: "مصر",
      Saudi_Arabia: "السعودية",
      Europe: "أوروبا",
      Others: "أخرى",
    };
    return countryMap[country] || country || "غير محدد";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Coins className="text-white" size={24} />
          </div>
          إدارة العملات
        </h1>

        <button
          onClick={handleAddCurrency}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus size={20} />
          إضافة عملة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي العملات</p>
                <p className="text-3xl font-bold text-blue-600">
                  {currencies.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">نشط</p>
                <p className="text-3xl font-bold text-green-600">
                  {activeCurrencies.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">غير نشط</p>
                <p className="text-3xl font-bold text-orange-600">
                  {inactiveCurrencies.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <PauseCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">معدل التحديث</p>
                <p className="text-3xl font-bold text-purple-600">24</p>
                <p className="text-xs text-gray-500">ساعة</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث في العملات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط فقط</option>
              <option value="inactive">غير نشط فقط</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Skeleton Loader Component */}
      {loading && (
        <>
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      الإجراءات
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      معدل التحويل
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      البلد
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      الرمز
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      الاسم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      الكود
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-200 rounded"></div>
                          <div className="w-5 h-5 bg-gray-200 rounded"></div>
                          <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Currency Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الإجراءات
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    معدل التحويل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    البلد
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الرمز
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الاسم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الكود
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCurrencies.map((currency, index) => (
                  <tr
                    key={currency.code}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(currency)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title={currency.is_active ? "إلغاء التفعيل" : "تفعيل"}
                        >
                          {currency.is_active ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditCurrency(currency)}
                          className="text-yellow-500 hover:text-yellow-700 p-1"
                          title="تعديل"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {currency.created_at
                        ? new Date(currency.created_at).toLocaleDateString(
                            "ar-EG"
                          )
                        : "غير محدد"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {currency.conversion_rate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCountryDisplay(currency.country)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {currency.symbol || currency.code}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(currency.is_active)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {currency.name_ar}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currency.name_en}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600">
                      {currency.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCurrencies.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <div className="flex justify-center mb-4">
                  <Coins size={64} className="text-gray-300" />
                </div>
                <p className="text-lg font-medium">لا توجد عملات</p>
                <p className="text-sm">ابدأ بإضافة عملة جديدة</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Coins className="text-white" size={20} />
                  </div>
                  {editingCurrency ? "تعديل العملة" : "إضافة عملة جديدة"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  المعلومات الأساسية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود العملة *
                    </label>
                    <select
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      disabled={editingCurrency}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">اختر كود العملة</option>
                      <option value="SAR">SAR - ريال سعودي</option>
                      <option value="USD">USD - دولار أمريكي</option>
                      <option value="EUR">EUR - يورو</option>
                      <option value="EGP">EGP - جنيه مصري</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البلد/المنطقة
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر البلد</option>
                      <option value="Egypt">مصر</option>
                      <option value="Saudi Arabia">السعودية</option>
                      <option value="Europe">أوروبا</option>
                      <option value="Others">أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم بالعربية *
                    </label>
                    <input
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, name_ar: e.target.value })
                      }
                      placeholder="مثال: ريال سعودي"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم بالإنجليزية *
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) =>
                        setFormData({ ...formData, name_en: e.target.value })
                      }
                      placeholder="مثال: Saudi Riyal"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرمز
                    </label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) =>
                        setFormData({ ...formData, symbol: e.target.value })
                      }
                      placeholder="مثال: ر.س"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      معدل التحويل *
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="0.000001"
                      value={formData.conversion_rate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          conversion_rate: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنازل العشرية
                    </label>
                    <select
                      value={formData.decimal_places}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          decimal_places: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="mr-3 text-sm font-medium text-gray-700">
                      عملة نشطة
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.code ||
                    !formData.name_ar ||
                    !formData.name_en
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {editingCurrency ? "تحديث العملة" : "إضافة العملة"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyManagement;
