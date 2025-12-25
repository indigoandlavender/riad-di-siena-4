"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";

interface Section {
  Section: string;
  Title: string;
  Content: string;
}

export default function DisclaimerPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch("/api/disclaimer")
      .then((res) => res.json())
      .then(setSections)
      .catch(console.error);
  }, []);

  const intro = sections.find((s) => s.Section === "intro");

  return (
    <div className="min-h-screen pt-24">
      <PageHeader title={intro?.Title || "Before you book"} />

      {/* Content */}
      <section className="py-24 bg-sand">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-8 text-foreground/70 leading-relaxed">
            {sections.map((section, i) => (
              section.Content && <p key={i}>{section.Content}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-16 bg-cream">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="text-xs tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              Read FAQ
            </Link>
            <Link
              href="/house-rules"
              className="text-xs tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              House Rules
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
