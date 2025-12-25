"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";

interface Section {
  title: string;
  content: string;
}

interface LegalContent {
  title: string;
  sections: Section[];
}

interface NexusLegalPageProps {
  pageId: string;
  fallbackTitle: string;
  localApiEndpoint?: string; // Optional local API fallback
}

export default function NexusLegalPage({ pageId, fallbackTitle, localApiEndpoint }: NexusLegalPageProps) {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [useNexus, setUseNexus] = useState(true);

  useEffect(() => {
    // Try Nexus first
    fetch(`/api/nexus/legal?page=${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nexus not available");
        return res.json();
      })
      .then((data) => {
        if (data.sections && data.sections.length > 0) {
          setContent(data);
          setLoading(false);
        } else {
          throw new Error("No Nexus content");
        }
      })
      .catch(() => {
        // Fallback to local API if available
        if (localApiEndpoint) {
          setUseNexus(false);
          fetch(localApiEndpoint)
            .then((res) => res.json())
            .then((data) => {
              // Convert local format to Nexus format
              if (Array.isArray(data)) {
                setContent({
                  title: fallbackTitle,
                  sections: data.map((s: { Title: string; Content: string }) => ({
                    title: s.Title,
                    content: s.Content,
                  })),
                });
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
  }, [pageId, localApiEndpoint, fallbackTitle]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <PageHeader title={fallbackTitle} />
        <section className="py-16 bg-sand">
          <div className="max-w-3xl mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
              <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
              <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <PageHeader title={content?.title || fallbackTitle} />

      <section className="py-16 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          {content?.sections && content.sections.length > 0 ? (
            <div className="space-y-10">
              {content.sections.map((section, index) => (
                <div key={index}>
                  {section.title && section.title !== "Intro" && (
                    <h2 className="font-serif text-lg text-foreground/80 mb-3">{section.title}</h2>
                  )}
                  <p className="text-foreground/60 leading-relaxed text-sm whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">Content not available.</p>
          )}

          {/* Source indicator (optional - for debugging) */}
          {/* <p className="mt-12 text-xs text-foreground/30">
            Source: {useNexus ? "Nexus" : "Local"}
          </p> */}
        </div>
      </section>
    </div>
  );
}
