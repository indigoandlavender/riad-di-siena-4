"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";

interface Condition {
  Section: string;
  Title: string;
  Content: string;
}

export default function BookingConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    fetch("/api/booking-conditions")
      .then((res) => res.json())
      .then(setConditions)
      .catch(console.error);
  }, []);

  // Group by section
  const sections: Record<string, Condition[]> = {};
  conditions.forEach((item) => {
    if (!sections[item.Section]) {
      sections[item.Section] = [];
    }
    sections[item.Section].push(item);
  });

  return (
    <div className="min-h-screen pt-24">
      <PageHeader title="Booking Conditions" />

      {/* Content */}
      <section className="py-16 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-12">
            {Object.entries(sections).map(([sectionName, items]) => (
              <div key={sectionName}>
                <h2 className="font-serif text-lg text-foreground/80 mb-4">{sectionName}</h2>
                {items.length === 1 && !items[0].Title ? (
                  <p className="text-foreground/60 text-sm">{items[0].Content}</p>
                ) : (
                  <ul className="space-y-2 text-foreground/60 text-sm">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-foreground/40">•</span>
                        <span>
                          {item.Title ? (
                            item.Content.includes("FAQ") || item.Content.includes("House Rules") || item.Content.includes("Disclaimer") ? (
                              <span>{item.Title && `${item.Title}: `}<Link href={item.Content.includes("FAQ") ? "/faq" : item.Content.includes("Disclaimer") ? "/disclaimer" : "/house-rules"} className="underline">{item.Content}</Link></span>
                            ) : (
                              <span>{item.Title}: {item.Content}</span>
                            )
                          ) : (
                            item.Content.includes("FAQ") || item.Content.includes("House Rules") || item.Content.includes("Disclaimer") ? (
                              <Link href={item.Content.includes("FAQ") ? "/faq" : item.Content.includes("Disclaimer") ? "/disclaimer" : "/house-rules"} className="underline">{item.Content}</Link>
                            ) : (
                              item.Content
                            )
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
