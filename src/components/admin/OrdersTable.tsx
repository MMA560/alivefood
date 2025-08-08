import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Phone, MapPin, Package, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  status: "pending" | "confirmed" | "in_delivery" | "delivered" | "canceled";
  totalPrice: number;
  cost: number;
  createdAt: string;
  isRead: boolean;
  notes?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  in_delivery: "قيد التوصيل",
  delivered: "تم التسليم",
  canceled: "ملغي",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
};

const DeleteConfirmDialog: React.FC<{
  orderId: string;
  customerName: string;
  onConfirm: () => void;
  children: React.ReactNode;
}> = ({ orderId, customerName, onConfirm, children }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف الطلب</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من حذف الطلب رقم <strong>#{orderId}</strong> الخاص
            بالعميل <strong>{customerName}</strong>؟
            <br />
            <span className="text-red-600 font-medium">
              هذا الإجراء لا يمكن التراجع عنه.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            حذف الطلب
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MobileOrderCard: React.FC<{
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}> = ({ order, onStatusChange, onViewOrder, onDeleteOrder }) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 space-y-3 bg-white",
        !order.isRead && "bg-yellow-50 border-yellow-300 shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-blue-600">#{order.id}</span>
          {!order.isRead && (
            <Badge variant="secondary" className="text-xs">
              جديد
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOrder(order)}
          >
            <Eye className="w-4 h-4 mr-1" />
            عرض
          </Button>
          <DeleteConfirmDialog
            orderId={order.id}
            customerName={order.customerName}
            onConfirm={() => onDeleteOrder(order.id)}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </DeleteConfirmDialog>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {order.customerName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{order.phone}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{order.address}</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span>
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            {new Date(order.createdAt).toLocaleDateString("ar-SA", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Price and Status */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="text-lg font-bold text-green-600">
          {order.totalPrice.toLocaleString()} ر.س
        </div>

        <Select
          value={order.status}
          onValueChange={(value) =>
            onStatusChange(order.id, value as Order["status"])
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                <Badge
                  className={statusColors[value as keyof typeof statusColors]}
                >
                  {label}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onStatusChange,
  onViewOrder,
  onDeleteOrder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Cards */}
        <div className="space-y-3">
          {orders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onViewOrder={onViewOrder}
              onDeleteOrder={onDeleteOrder}
            />
          ))}
        </div>

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              السابق
            </Button>

            <span className="text-sm text-gray-600">
              صفحة {currentPage} من {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Desktop Table
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-center font-bold">
                رقم الطلب
              </TableHead>
              <TableHead>اسم العميل</TableHead>
              <TableHead>رقم الهاتف</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead className="text-center">الكمية</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">السعر الإجمالي</TableHead>
              <TableHead className="text-center">تاريخ الإنشاء</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className={cn(
                  !order.isRead && "bg-yellow-100 border-yellow-300 shadow-sm"
                )}
              >
                <TableCell className="font-bold text-center text-lg text-blue-600">
                  {order.id}#
                </TableCell>
                <TableCell className="font-medium">
                  {order.customerName}
                  {!order.isRead && (
                    <Badge variant="secondary" className="mr-2 text-xs">
                      جديد
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {order.address}
                </TableCell>
                <TableCell className="text-center">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      onStatusChange(order.id, value as Order["status"])
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <Badge
                            className={
                              statusColors[value as keyof typeof statusColors]
                            }
                          >
                            {label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="font-medium text-center">
                  {order.totalPrice.toLocaleString()} ر.س
                </TableCell>
                <TableCell className="text-center">
                  {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <DeleteConfirmDialog
                      orderId={order.id}
                      customerName={order.customerName}
                      onConfirm={() => onDeleteOrder(order.id)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        حذف
                      </Button>
                    </DeleteConfirmDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Desktop Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OrdersTable;
