"use client";

import { useState, useEffect } from "react";

interface JourneysContent {
  Title: string;
  Subtitle: string;
  Body: string;
  Button_Text: string;
  Button_Link: string;
}

export default function JourneysPage() {
  const [content, setContent] = useState<JourneysContent | null>(null);

  useEffect(() => {
    fetch("/api/journeys")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-24 bg-sand">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground/80 mb-4">
            {content?.Title || "Beyond the Walls"}
          </h1>
          {content?.Subtitle && (
            <p className="font-display italic text-foreground/60 text-lg mb-8">
              {content.Subtitle}
            </p>
          )}
          {content?.Body && (
            <p className="text-foreground/70 leading-relaxed mb-12">
              {content.Body}
            </p>
          )}
          {content?.Button_Link && (
            <a 
              href={content.Button_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest border border-foreground px-8 py-4 hover:bg-foreground hover:text-cream transition-colors inline-block"
            >
              {content?.Button_Text || "EXPLORE SLOW MOROCCO"}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
