"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="border-2 border-t-0 border-[#1a1a1a]/10 first:border-t-2"
        >
          <AccordionTrigger className="px-6 py-4 text-left font-[family-name:var(--font-space-mono)] text-sm font-bold tracking-wide hover:no-underline hover:text-[#ff4d00] [&[data-state=open]]:text-[#ff4d00]">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-sm leading-relaxed text-[#1a1a1a]/50">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
