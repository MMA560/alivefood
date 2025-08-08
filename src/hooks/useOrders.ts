// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrdersResponse, OrderDetail, ApiOrder } from '@/lib/api';

// Orders list hook with smart refresh
export const useOrders = (page: number = 1, perPage: number = 10) => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', page, perPage],
    queryFn: () => ordersApi.getOrders(page, perPage),
    staleTime: 60000, // البيانات صالحة لمدة دقيقة
    refetchOnWindowFocus: true, // تحديث عند العودة للتبويب
    refetchOnMount: true, // تحديث عند تحميل الكومبوننت
    refetchOnReconnect: true, // تحديث عند عودة الاتصال
    // بدون refetchInterval - لا يحدث تحديث تلقائي مستمر
  });
};

// Single order details hook
export const useOrderDetails = (id: number, enabled: boolean = true) => {
  return useQuery<OrderDetail>({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled,
    staleTime: 60000, // البيانات صالحة لمدة دقيقة
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Invalidate specific order details
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
};

// Mark order as read mutation
export const useMarkOrderAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.markOrderAsRead(id),
    onSuccess: (_, id) => {
      // Update the specific order in cache
      queryClient.setQueryData(['order', id], (oldData: OrderDetail | undefined) => {
        if (oldData) {
          return { ...oldData, is_read: true };
        }
        return oldData;
      });
      
      // Update orders list cache
      queryClient.setQueriesData(
        { queryKey: ['orders'] },
        (oldData: OrdersResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              orders: oldData.orders.map(order =>
                order.id === id ? { ...order, is_read: true } : order
              ),
            };
          }
          return oldData;
        }
      );
    },
  });
};

// Delete order mutation
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.deleteOrder(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch orders list to update stats and remove deleted order
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Remove specific order from cache
      queryClient.removeQueries({ queryKey: ['order', id] });
    },
  });
};

// Transform API data to match existing component interfaces
export const transformApiOrderToOrder = (apiOrder: ApiOrder) => ({
  id: apiOrder.id.toString(),
  customerName: apiOrder.customer_info.customerName,
  phone: apiOrder.customer_info.phoneNumber,
  address: apiOrder.customer_info.fullAddress,
  items: apiOrder.items.map(item => ({
    id: item.product_id,
    name: item.title,
    quantity: item.quantity,
    price: item.price,
    base_price: item.base_price,
    variant_name: item.variant_name,
    variant_id: item.variant_id,
  })),
  status: apiOrder.status,
  totalPrice: apiOrder.total,
  cost: apiOrder.items.reduce((sum, item) => sum + (item.base_price || 0) * item.quantity, 0),
  createdAt: apiOrder.updated_at,
  isRead: apiOrder.is_read,
  notes: apiOrder.notes || '',
});

export const transformOrderDetailToOrder = (orderDetail: OrderDetail) => {
  return transformApiOrderToOrder(orderDetail);
};