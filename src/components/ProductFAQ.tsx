import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string | { en: string; ar: string };
  answer: string | { en: string; ar: string };
}

interface ProductFAQProps {
  faq: FAQItem[];
  language: string;
  t: (key: string) => string;
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ faq, language, t }) => {
  if (!faq || faq.length === 0) {
    return null;
  }

  const getTranslatedText = (text: string | { en: string; ar: string }) => {
    if (typeof text === 'string') {
      return text;
    }
    return text[language as keyof typeof text] || text.en;
  };

  return (
    <Card className="mb-16">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">الاسئلة الشائعة</h2>
        <Accordion type="single" collapsible>
          {faq.map((faqItem, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {getTranslatedText(faqItem.question)}
              </AccordionTrigger>
              <AccordionContent>
                {getTranslatedText(faqItem.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProductFAQ;