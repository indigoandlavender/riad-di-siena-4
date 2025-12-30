"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Section {
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
}

export default function PhilosophyPage() {
  const [content, setContent] = useState<Record<string, Section>>({});

  useEffect(() => {
    fetch("/api/philosophy")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  const hero = content.hero;
  const intro = content.intro;
  const imperfection = content.imperfection;
  const wabisabi = content["wabi-sabi"];
  const soul = content.soul;
  const heroImage = hero?.Image_URL || "";

  return (
    <div className="bg-[#f5f0e8] text-[#2a2520] min-h-screen">
      {/* Hero - Full viewport with image */}
      <section className="min-h-screen flex items-center justify-center relative">
        {heroImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="absolute inset-0 bg-[#2a2520]/40" />
          </>
        )}
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl relative z-10">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
            Riad di Siena
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] font-light mb-8 text-white">
            P H I L O S O P H Y
          </h1>
          {hero?.Subtitle && (
            <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-2xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </div>
      </section>

      {/* Opening - Magazine two-column */}
      {intro?.Subtitle && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
              <div className="lg:col-span-4">
                <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-4">
                  Our Approach
                </p>
                <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2a2520]/90">
                  A sanctuary is not built. It is revealed.
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-[#2a2520]/60 leading-relaxed text-lg">
                <p>{intro.Subtitle}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pull Quote */}
      {hero?.Title && (
        <section className="py-20 md:py-28 bg-[#ebe5db]">
          <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-[#2a2520]/80 italic">
              "{hero.Title}"
            </p>
          </div>
        </section>
      )}

      {/* Imperfection Section - Staggered */}
      {(imperfection?.Subtitle || imperfection?.Body) && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-16 text-center">
              The Beauty of Imperfection
            </p>
            
            <div className="space-y-16">
              {imperfection?.Subtitle && (
                <div className="max-w-2xl mr-auto">
                  <p className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 leading-relaxed">
                    {imperfection.Subtitle}
                  </p>
                </div>
              )}
              {imperfection?.Body && (
                <div className="max-w-2xl ml-auto text-right">
                  <p className="text-lg md:text-xl leading-relaxed text-[#2a2520]/60">
                    {imperfection.Body}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Wabi-Sabi Section */}
      {(wabisabi?.Title || wabisabi?.Subtitle) && (
        <section className="py-24 md:py-32 bg-[#ebe5db]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
                    Wabi-Sabi
                  </p>
                  {wabisabi?.Title && (
                    <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2a2520]/90 italic">
                      {wabisabi.Title}
                    </h2>
                  )}
                </div>
                <div className="space-y-6 text-[#2a2520]/60 leading-relaxed">
                  {wabisabi?.Subtitle && <p>{wabisabi.Subtitle}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Soul Quote */}
      {(soul?.Title || soul?.Subtitle) && (
        <section className="py-16 md:py-20 border-y border-[#2a2520]/10 bg-[#f5f0e8]">
          <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
            <div className="flex items-start gap-6">
              <span className="font-serif text-6xl md:text-8xl text-[#2a2520]/20 leading-none">"</span>
              <div>
                {soul?.Title && (
                  <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#2a2520]/80">
                    {soul.Title}
                  </p>
                )}
                {soul?.Subtitle && (
                  <p className="text-[#2a2520]/40 text-sm mt-4 italic">
                    {soul.Subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#f5f0e8]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 text-[#2a2520]/90">
            Experience the sanctuary.
          </h2>
          <p className="text-[#2a2520]/50 leading-relaxed mb-12 text-lg">
            Three hundred years of stories, waiting for yours.
          </p>
          <Link
            href="/rooms"
            className="inline-block border border-[#2a2520]/20 px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#2a2520] hover:text-[#f5f0e8] transition-colors"
          >
            View Rooms
          </Link>
        </div>
      </section>
    </div>
  );
}
