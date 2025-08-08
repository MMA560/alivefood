import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrders, useUpdateOrderStatus, useMarkOrderAsRead, useDeleteOrder, transformApiOrderToOrder } from '@/hooks/useOrders';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilters from '@/components/admin/AdminFilters';
import AdminOrdersList from '@/components/admin/AdminOrdersList';
import OrderDialog from '@/components/admin/OrderDialog';
import { useQueryClient } from '@tanstack/react-query';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    base_price?: number;
    variant_name?: string;
    variant_id?: string;
  }>;
  status: 'pending' | 'confirmed' | 'in_delivery' | 'delivered' | 'canceled';
  totalPrice: number;
  cost: number;
  createdAt: string;
  isRead: boolean;
  notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 30;

  // API hooks
  const { data: ordersData, isLoading, error } = useOrders(currentPage, ordersPerPage);
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const markOrderAsReadMutation = useMarkOrderAsRead();
  const deleteOrderMutation = useDeleteOrder();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      // حفظ قيمة is_admin في localStorage
      localStorage.setItem('is_admin', 'true');
    }
  }, [navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <div className="h-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg" style={{ animationDelay: '0.8s' }}></div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Transform API orders to component format
  const orders = ordersData?.orders.map(transformApiOrderToOrder) || [];
  
  // Filter orders based on search, date range, and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.includes(searchTerm);
    
    const matchesDateRange = !dateRange.from || !dateRange.to || 
      (() => {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Include the entire end date
        return orderDate >= fromDate && orderDate <= toDate;
      })();

    // فلتر الحالة
    const matchesStatus = statusFilter === 'all' || !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesDateRange && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Mark order as read first
      await markOrderAsReadMutation.mutateAsync(parseInt(orderId));
      
      // Then update status
      await updateOrderStatusMutation.mutateAsync({
        id: parseInt(orderId),
        status: newStatus
      });

      // Invalidate and refetch orders to update stats immediately
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: "تم تحديث الحالة",
        description: "تم تغيير حالة الطلب بنجاح",
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  const handleOrderView = async (order: Order) => {
    // Mark order as read first
    if (!order.isRead) {
      try {
        await markOrderAsReadMutation.mutateAsync(parseInt(order.id));
        // Invalidate queries to update the UI
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } catch (error) {
        console.error('Failed to mark order as read:', error);
      }
    }
    
    setSelectedOrder(order);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(parseInt(orderId));
      
      // Invalidate and refetch orders to update stats immediately
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: "تم حذف الطلب",
        description: "تم حذف الطلب بنجاح",
      });
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الطلب",
        variant: "destructive",
      });
    }
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    setSelectedOrder(null);
    // Invalidate queries to update the stats
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast({
      title: "تم تحديث الطلب",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  // Calculate statistics - الإيرادات والتكلفة فقط من الطلبات المكتملة
  const revenue = filteredOrders.reduce((sum, o) => o.status === 'delivered' ? sum + o.totalPrice : sum, 0);
  const cost = filteredOrders.reduce((sum, o) => o.status === 'delivered' ? sum + o.cost : sum, 0);
  
  const stats = {
    total: filteredOrders.length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    inDelivery: filteredOrders.filter(o => o.status === 'in_delivery').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    canceled: filteredOrders.filter(o => o.status === 'canceled').length,
    revenue,
    cost,
    profit: revenue - cost
  };

  const totalPages = ordersData?.total_pages || 1;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminStats stats={stats} />

        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <AdminOrdersList
          orders={filteredOrders}
          filteredOrdersLength={ordersData?.total_count || 0}
          onStatusChange={handleStatusChange}
          onViewOrder={handleOrderView}
          onDeleteOrder={handleDeleteOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedOrder && (
        <OrderDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;