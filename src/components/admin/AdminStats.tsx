import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface AdminStatsProps {
  stats: {
    total: number;
    delivered: number;
    inDelivery: number;
    pending: number;
    canceled: number;
    confirmed: number;
    revenue: number;
    cost: number;
    profit: number;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'طلبات مؤكدة',
      value: stats.confirmed,
      icon: FileCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'قيد التوصيل',
      value: stats.inDelivery,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'تم التسليم',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'قيد الانتظار',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'ملغية',
      value: stats.canceled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'إجمالي الإيرادات',
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      isFinancial: true
    },
    {
      title: 'صافي الربح',
      value: formatCurrency(stats.profit),
      icon: TrendingUp,
      color: stats.profit >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: stats.profit >= 0 ? 'bg-blue-50' : 'bg-red-50',
      borderColor: stats.profit >= 0 ? 'border-blue-200' : 'border-red-200',
      isFinancial: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`transition-all duration-200 hover:shadow-md ${stat.bgColor} ${stat.borderColor} border-2`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.isFinancial ? stat.value : stat.value.toLocaleString()}
              </div>
              {stat.isFinancial && (
                <p className="text-xs text-gray-600 mt-1">
                  {stat.title === 'صافي الربح' 
                    ? (stats.profit >= 0 ? 'ربح' : 'خسارة') 
                    : 'ريال سعودي'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;