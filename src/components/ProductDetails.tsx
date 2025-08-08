import React from "react";

interface ProductDetailsProps {
    productId: string;
    isRTL?: boolean;
    language?: 'ar' | 'en';
    productData?: any;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
    productId,
    isRTL = false,
    language = 'en',
    productData
}) => {
    // إذا لم تكن هناك بيانات، لا تعرض أي شيء
    if (!productData) {
        console.log('No product data provided to ProductDetails');
        return null;
    }

    // تحقق من وجود تفاصيل المنتج
    if (!productData.details) {
        console.log('No details found in product data:', productData);
        return null;
    }

    const details = productData.details;
    
    // إضافة console.log للتحقق من البيانات
    console.log('Product details:', details);
    
    const description = details.description || '';
    const sections = details.sections || [];

    // إذا لم تكن هناك محتويات للعرض
    if (!description && sections.length === 0) {
        console.log('No description or sections to display');
        return null;
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg border shadow-sm">
            <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    {language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </h3>
                
                <div className="space-y-4">
                    {description && (
                        <div className="mb-6">
                            <p className="text-gray-600 leading-relaxed text-lg" dir={isRTL ? 'rtl' : 'ltr'}>
                                {description}
                            </p>
                        </div>
                    )}
                    
                    {sections.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            {sections.map((section: any, index: number) => (
                                <div key={index} className="space-y-4">
                                    <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">
                                        {section.title}
                                    </h4>
                                    {section.items && section.items.length > 0 && (
                                        <ul className="space-y-3 text-sm" dir="ltr">
                                        {section.items.map((item: string, i: number) => (
                                            <li
                                                key={i}
                                                className={`flex items-start gap-3 text-gray-700 ${
                                                    isRTL ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                            >
                                                <span className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;