// components/ProductsStats.jsx
import { Package, CheckCircle, AlertTriangle } from "lucide-react";

const ProductsStats = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">المنتجات النشطة</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">تحتاج مراجعة</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/DeleteModal.jsx
import { XCircle } from "lucide-react";

const DeleteModal = ({ isOpen, product, onConfirm, onCancel, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-4">تأكيد الحذف</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              هل أنت متأكد من حذف المنتج "{product?.title}"؟ لا يمكن التراجع عن
              هذا الإجراء.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "جاري الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/LoadingSkeleton.jsx
const LoadingSkeleton = () => {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProductsStats, DeleteModal, LoadingSkeleton };