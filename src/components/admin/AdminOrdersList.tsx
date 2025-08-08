import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrdersTable from '@/components/admin/OrdersTable';

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
  }>;
  status: 'pending' | 'confirmed' | 'in_delivery' | 'delivered' | 'canceled';
  totalPrice: number;
  cost: number;
  createdAt: string;
  isRead: boolean;
  notes?: string;
}

interface AdminOrdersListProps {
  orders: Order[];
  filteredOrdersLength: number;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => Promise<void>; // إضافة هذا السطر
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminOrdersList: React.FC<AdminOrdersListProps> = ({
  orders,
  filteredOrdersLength,
  onStatusChange,
  onViewOrder,
  onDeleteOrder, // إضافة هذا
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الطلبات ({filteredOrdersLength})</CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTable
          orders={orders}
          onStatusChange={onStatusChange}
          onViewOrder={onViewOrder}
          onDeleteOrder={onDeleteOrder} // تمرير الدالة إلى OrdersTable
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
};

export default AdminOrdersList;