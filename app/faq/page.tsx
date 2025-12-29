"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import FAQAccordion from "@/components/FAQAccordion";

interface FAQItem {
  Section: string;
  Question: string;
  Answer: string;
  Order: string;
}

export default function FAQPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then(setFaqItems)
      .catch(console.error);
  }, []);

  // Group by section
  const sections: Record<string, FAQItem[]> = {};
  faqItems.forEach((item) => {
    if (!sections[item.Section]) {
      sections[item.Section] = [];
    }
    sections[item.Section].push(item);
  });

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.Question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.Answer,
      },
    })),
  };

  return (
    <div className="min-h-screen pt-24">
      {/* FAQ Schema */}
      {faqItems.length > 0 && (
        <Script id="faq-schema" type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#e8e0d4]">
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          <p className="text-xs tracking-[0.4em] mb-6">RIAD DI SIENA</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">Frequently Asked Questions</h1>
          <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">
            Everything you need to know about staying at Riad di Siena
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <FAQAccordion sections={sections} />
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-cream">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-foreground/60 text-sm">
            Still have questions?{" "}
            <a href="/contact" className="underline hover:text-foreground transition-colors">
              Get in touch
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
