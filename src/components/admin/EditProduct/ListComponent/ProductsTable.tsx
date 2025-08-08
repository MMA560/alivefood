import React, { useState } from "react";
import { Edit3, Trash2, Eye, Plus, Package, X } from "lucide-react";

const ProductsTable = ({ products, onEdit, onView, onDelete, onCreateNew }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const truncateTitle = (title, maxLength = 65) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  const renderRating = (rating, reviewCount) => {
    if (!rating && !reviewCount) {
      return <span className="text-gray-400">لا يوجد تقييم</span>;
    }

    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    // إضافة النجوم الممتلئة
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }

    // إضافة النجمة النصف إذا كانت موجودة
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }

    // إضافة النجوم الفارغة
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="mr-1 text-sm text-gray-600">({reviewCount || 0})</span>
      </div>
    );
  };

  const renderCategories = (product) => {
    // إذا كان هناك قائمة تصنيفات، اعرضها
    if (product.categories && product.categories.length > 0) {
      return (
        <div className="flex flex-col space-y-1">
          {product.categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {category}
            </span>
          ))}
        </div>
      );
    }

    // إذا لم يكن هناك قائمة تصنيفات، اعرض التصنيف الأساسي
    if (product.category) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      );
    }

    return <span className="text-gray-400 text-sm">غير محدد</span>;
  };

  const getTotalStock = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }
    return product.variants.reduce(
      (total, variant) => total + (variant.stock || 0),
      0
    );
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {product.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Image */}
            <div className="mb-6">
              <img
                src={product.image}
                alt={product.title}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">التصنيفات</h3>
              {renderCategories(product)}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">التقييم</h3>
              {renderRating(product.rating, product.reviewCount)}
            </div>

            {/* Prices */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">الأسعار</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">السعر الأساسي</span>
                  <p className="font-semibold">
                    {formatPrice(product.base_price)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">السعر الحالي</span>
                  <p className="font-semibold text-green-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {product.old_price && (
                  <div>
                    <span className="text-sm text-gray-500">السعر القديم</span>
                    <p className="font-semibold text-red-500 line-through">
                      {formatPrice(product.old_price)}
                    </p>
                  </div>
                )}
                {product.discount && (
                  <div>
                    <span className="text-sm text-gray-500">نسبة الخصم</span>
                    <p className="font-semibold text-red-600">
                      {product.discount}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">المتغيرات</h3>
              <div className="space-y-3">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant, index) => (
                    <div
                      key={variant.id || index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <img
                          src={variant.image}
                          alt={variant.color}
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {variant.color}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(variant.price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-sm text-gray-500">المخزون</span>
                        <p
                          className={`font-semibold ${
                            variant.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {variant.stock || 0}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">لا توجد متغيرات</p>
                )}
              </div>
            </div>

            {/* Total Stock */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                إجمالي المخزون
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {getTotalStock(product)} قطعة
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيفات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقييم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={product.image}
                          alt={product.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                      <div className="mr-4 max-w-xs">
                        <div
                          className="text-sm font-medium text-gray-900"
                          title={product.title}
                        >
                          {truncateTitle(product.title)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{renderCategories(product)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getTotalStock(product) > 10
                          ? "bg-green-100 text-green-800"
                          : getTotalStock(product) > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getTotalStock(product)} قطعة
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderRating(product.rating, product.reviewCount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(product.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                        title="تعديل"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="حذف"
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

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              لا توجد منتجات
            </h3>
            <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة منتج جديد</p>
            <div className="mt-6">
              <button
                onClick={onCreateNew}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="ml-2 h-5 w-5" />
                إضافة منتج جديد
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </>
  );
};

export default ProductsTable;
