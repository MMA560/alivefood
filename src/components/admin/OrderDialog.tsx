import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X, Package, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ordersApi, UpdateOrderRequest } from '@/lib/api';

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

interface OrderDialogProps {
  order: Order;
  onClose: () => void;
  onUpdate: (order: Order) => void;
}

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  in_delivery: 'قيد التوصيل',
  delivered: 'تم التسليم',
  canceled: 'ملغي'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800'
};

const OrderDialog: React.FC<OrderDialogProps> = ({ order, onClose, onUpdate }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare data in the format expected by the API
      const updateData: UpdateOrderRequest = {
        customer_info: {
          customerName: editedOrder.customerName,
          phoneNumber: editedOrder.phone,
          fullAddress: editedOrder.address
        },
        items: editedOrder.items.map(item => ({
          product_id: item.id,
          title: item.name,
          image: '', // Default empty image
          quantity: item.quantity,
          price: item.price,
          base_price: item.base_price || item.price,
          variant_name: item.variant_name,
          variant_id: item.variant_id
        })),
        shippingFee: 0, // Default shipping fee
        status: editedOrder.status,
        notes: editedOrder.notes || ''
      };

      await ordersApi.updateOrder(parseInt(order.id), updateData);
      
      onUpdate(editedOrder);
      setIsEditing(false);
      
      toast({
        title: "تم تحديث الطلب",
        description: "تم حفظ جميع التغييرات بنجاح",
      });
    } catch (error) {
      console.error('Failed to update order:', error);
      toast({
        title: "خطأ في التحديث",
        description: "فشل في حفظ التغييرات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  const updateItem = (itemId: string, field: 'quantity' | 'price', value: number) => {
    setEditedOrder(prev => {
      const updatedItems = prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      );
      
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalPrice: newTotalPrice
      };
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-[95vw] h-[95vh] max-w-none max-h-none p-0 rounded-lg' 
          : 'max-w-4xl max-h-[90vh]'
        } overflow-y-auto
      `}>
        <DialogHeader className={isMobile ? 'p-4 pb-2 border-b relative' : ''}>
          <DialogTitle className="flex items-center justify-between">
            <span className={isMobile ? 'text-lg pr-8' : ''}>
              تفاصيل الطلب #{order.id}
            </span>
            
            {/* زر الإغلاق للهاتف */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="absolute left-2 top-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
            
            {/* أزرار التحرير */}
            <div className={`flex gap-2 ${isMobile ? 'ml-10' : ''}`}>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)} size={isMobile ? "sm" : "default"}>
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isLoading} size={isMobile ? "sm" : "default"}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isLoading} size={isMobile ? "sm" : "default"}>
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
          {/* Customer Information */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                معلومات العميل
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">اسم العميل</Label>
                {isEditing ? (
                  <Input
                    id="customerName"
                    value={editedOrder.customerName}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, customerName: e.target.value }))}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="p-2 border rounded bg-gray-50">{order.customerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedOrder.phone}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="p-2 border rounded bg-gray-50 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedOrder.address}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="p-2 border rounded bg-gray-50 flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1" />
                    {order.address}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="w-5 h-5 mr-2" />
                معلومات الطلب
              </h3>

              <div className="space-y-2">
                <Label>الحالة</Label>
                {isEditing ? (
                  <Select
                    value={editedOrder.status}
                    onValueChange={(value) => setEditedOrder(prev => ({ ...prev, status: value as Order['status'] }))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>تاريخ الإنشاء</Label>
                <p className="p-2 border rounded bg-gray-50">
                  {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                {isEditing ? (
                  <Textarea
                    id="notes"
                    value={editedOrder.notes || ''}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="أضف ملاحظات..."
                    rows={3}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="p-2 border rounded bg-gray-50 min-h-[80px]">
                    {order.notes || 'لا توجد ملاحظات'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">عناصر الطلب</h3>
            
            <div className="space-y-3">
              {(isEditing ? editedOrder.items : order.items).map((item, index) => (
                <div key={item.id} className={`p-4 border rounded-lg ${
                  isMobile ? 'space-y-3' : 'flex items-center justify-between'
                }`}>
                  <div className={isMobile ? 'mb-3' : 'flex-1'}>
                    <h4 className="font-medium">{item.name}</h4>
                    
                    {/* عرض المتغيرات إذا كانت متوفرة */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.variant_name && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          اللون: {item.variant_name}
                        </Badge>
                      )}
                      {item.variant_id && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          كود المتغير: {item.variant_id}
                        </Badge>
                      )}
                      {item.base_price && item.base_price !== item.price && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                          السعر الأساسي: {item.base_price} ر.س
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className={`${
                    isMobile 
                      ? 'grid grid-cols-2 gap-4' 
                      : 'flex items-center gap-4'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Label className={isMobile ? 'text-sm' : ''}>الكمية:</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className={isMobile ? 'w-16 h-8' : 'w-20'}
                          min="1"
                          disabled={isLoading}
                        />
                      ) : (
                        <span className="font-medium">{item.quantity}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className={isMobile ? 'text-sm' : ''}>السعر:</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className={isMobile ? 'w-20 h-8' : 'w-24'}
                          min="0"
                          step="0.01"
                          disabled={isLoading}
                        />
                      ) : (
                        <span className="font-medium">{item.price.toLocaleString()} ر.س</span>
                      )}
                    </div>
                    
                    {!isMobile && (
                      <div className="flex items-center gap-2">
                        <Label>المجموع:</Label>
                        <span className="font-bold text-blue-600">
                          {(item.quantity * item.price).toLocaleString()} ر.س
                        </span>
                      </div>
                    )}
                  </div>

                  {isMobile && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">المجموع:</Label>
                        <span className="font-bold text-blue-600">
                          {(item.quantity * item.price).toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              ملخص الطلب
            </h3>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-gray-600">إجمالي السعر</Label>
                <p className="text-2xl font-bold text-green-600">
                  {(isEditing ? editedOrder.totalPrice : order.totalPrice).toLocaleString()} ر.س
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-gray-600">التكلفة</Label>
                <p className="text-2xl font-bold text-red-600">
                  {order.cost.toLocaleString()} ر.س
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-gray-600">صافي الربح</Label>
                <p className="text-2xl font-bold text-blue-600">
                  {((isEditing ? editedOrder.totalPrice : order.totalPrice) - order.cost).toLocaleString()} ر.س
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;