
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderData {
  customerName: string;
  items: Array<{
    id: string;
    title: { en: string; ar: string };
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  orderDate: string;
}

const ThankYouPage = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('loading')}</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>{t('backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const firstName = orderData.customerName.split(' ')[0];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t('thankYou')}, {firstName}!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('contactNote')}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">{t('orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="font-medium">{item.title[language]}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price} {t('sar')}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">
                      {item.price * item.quantity} {t('sar')}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>{orderData.subtotal} {t('sar')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  <span>{orderData.shippingFee} {t('sar')}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                  <span>{t('total')}</span>
                  <span className="text-green-600">{orderData.total} {t('sar')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
