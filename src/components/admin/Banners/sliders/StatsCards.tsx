import React from 'react';
import { Move, Power, PowerOff, Star } from 'lucide-react';

interface StatsCardsProps {
  totalSlides: number;
  activeSlides: number;
  inactiveSlides: number;
  featuredSlides: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalSlides,
  activeSlides,
  inactiveSlides,
  featuredSlides
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">إجمالي الشرائح</p>
            <p className="text-2xl font-bold text-blue-600">{totalSlides}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <Move className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">نشط</p>
            <p className="text-2xl font-bold text-green-600">{activeSlides}</p>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <Power className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">غير نشط</p>
            <p className="text-2xl font-bold text-orange-600">{inactiveSlides}</p>
          </div>
          <div className="bg-orange-100 p-2 rounded-lg">
            <PowerOff className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">مميز</p>
            <p className="text-2xl font-bold text-purple-600">{featuredSlides}</p>
          </div>
          <div className="bg-purple-100 p-2 rounded-lg">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;