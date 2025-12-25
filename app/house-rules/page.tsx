"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";

interface Rule {
  Title: string;
  Content: string;
}

export default function HouseRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    fetch("/api/house-rules")
      .then((res) => res.json())
      .then(setRules)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <PageHeader 
        title="House Rules" 
        subtitle="To ensure a peaceful stay for everyone"
      />

      {/* Rules */}
      <section className="py-16 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8">
            {rules.map((rule) => (
              <div key={rule.Title} className="pb-8 border-b border-foreground/10 last:border-0">
                <h3 className="font-serif text-lg text-foreground/80 mb-3">{rule.Title}</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">{rule.Content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-olive text-sand">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg text-sand/90">
            Thank you for helping us keep this a peaceful place.
          </p>
        </div>
      </section>
    </div>
  );
}
