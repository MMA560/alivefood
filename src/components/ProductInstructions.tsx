
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductInstructionsProps {
  usageInstructions?: string;
  storageInstructions?: string;
  language: string;
}

const ProductInstructions: React.FC<ProductInstructionsProps> = ({
  usageInstructions,
  storageInstructions,
  language
}) => {
  return (
    <>
      {/* Usage Instructions Section */}
      {usageInstructions && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'طريقة الاستخدام' : 'Usage Instructions'}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {usageInstructions}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Instructions Section */}
      {storageInstructions && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'طريقة الحفظ' : 'Storage Instructions'}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {storageInstructions}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ProductInstructions;
