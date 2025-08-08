// ProductsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/lib/api";
import { Plus, Package } from "lucide-react";
import SearchAndFilter from "./ListComponent/SearchAndFilter";
import { ProductsStats } from "./ListComponent/ProductStates";
import ProductsTable from "./ListComponent/ProductsTable";
import { DeleteModal } from "./ListComponent/ProductStates";
import { LoadingSkeleton } from "./ListComponent/ProductStates";

const ProductsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    product: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء جلب قائمة المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch;
  });

  const handleEdit = (productId) => {
  // مجرد الانتقال بالمعرف بدون تمرير البيانات
  navigate(`/admin/products/edit/${productId}`, {
    state: { isEditing: true }
  });
};

  const handleView = (productId) => {
    navigate(`/admin/products/view/${productId}`);
  };

  const handleDelete = (product) => {
    setDeleteModal({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    
    try {
      setIsDeleting(true);
      
      await productsApi.deleteProduct(deleteModal.product.id.toString());
      
      setProducts(products.filter((p) => p.id !== deleteModal.product.id));
      
      toast({
        title: "تم حذف المنتج",
        description: `تم حذف المنتج "${deleteModal.product.title}" بنجاح`,
      });
      
      setDeleteModal({ open: false, product: null });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.message || "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="ml-2 h-6 w-6 text-blue-600" />
            إدارة المنتجات
          </h1>
          <button
            onClick={() => navigate("/admin/products/edit")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة منتج جديد
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      <ProductsStats products={products} />

      <ProductsTable
        products={filteredProducts}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onCreateNew={() => navigate("/admin/products/edit")}
      />

      <DeleteModal
        isOpen={deleteModal.open}
        product={deleteModal.product}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, product: null })}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductsList;