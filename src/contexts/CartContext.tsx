import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: { en: string; ar: string };
  image: string;
  price: number;
  base_price: number;
  quantity: number;
  variant_id?: string;
  variant_name?: string; // اسم المتغير (اللون)
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, variant_id?: string) => void;
  updateQuantity: (id: string, quantity: number, variant_id?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  getItemKey: (id: string, variant_id?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const shippingFee = 0; // Fixed shipping fee

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // التأكد من أن البيانات المحفوظة تحتوي على variant_name
        setItems(parsedCart);
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // دالة مساعدة لإنشاء مفتاح فريد للعنصر مع المتغير
  const getItemKey = (id: string, variant_id?: string) => {
    return variant_id ? `${id}-${variant_id}` : id;
  };

  // دالة مساعدة للعثور على العنصر في السلة
  const findItem = (id: string, variant_id?: string) => {
    return items.find(
      (item) => item.id === id && item.variant_id === variant_id
    );
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = findItem(product.id, product.variant_id);
      
      if (existingItem) {
        // إذا كان العنصر موجود، زيادة الكمية
        return prev.map((item) =>
          item.id === product.id && item.variant_id === product.variant_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // إذا لم يكن موجود، إضافة عنصر جديد
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, variant_id?: string) => {
    setItems((prev) => 
      prev.filter((item) => 
        !(item.id === id && item.variant_id === variant_id)
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, variant_id?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant_id);
      return;
    }
    
    setItems((prev) =>
      prev.map((item) => 
        (item.id === id && item.variant_id === variant_id) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = subtotal + (items.length > 0 ? shippingFee : 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        totalPrice,
        getItemKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};