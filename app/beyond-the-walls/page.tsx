"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Property {
  Property_ID: string;
  Name: string;
  Tagline: string;
  Description: string;
  Image_URL: string;
  Link: string;
  Order: string;
}

interface HeroContent {
  Title: string;
  Subtitle: string;
  Intro: string;
  Image_URL: string;
}

export default function BeyondTheWallsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/beyond-the-walls").then((res) => res.json()),
      fetch("/api/beyond-the-walls-hero").then((res) => res.json()),
    ])
      .then(([propertiesData, heroData]) => {
        setProperties(propertiesData);
        setHero(heroData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {hero?.Image_URL && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.Image_URL}')` }}
          />
        )}
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          <p className="text-xs tracking-[0.4em] mb-6">RIAD DI SIENA</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            {hero?.Title || "Beyond the Walls"}
          </h1>
          {hero?.Subtitle && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-sand">
        <div className="max-w-xl mx-auto px-6 text-center">
          {hero?.Intro && (
            <p className="text-foreground/70 leading-relaxed">
              {hero.Intro}
            </p>
          )}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {properties.map((property) => (
              <Link 
                key={property.Property_ID} 
                href={property.Link}
                className="group block"
              >
                <article>
                  <div className="aspect-[4/3] bg-foreground/5 overflow-hidden mb-6">
                    {property.Image_URL ? (
                      <img 
                        src={property.Image_URL} 
                        alt={property.Name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/20">
                        No image
                      </div>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl text-foreground/90 mb-2">
                    {property.Name}
                  </h2>
                  <p className="text-foreground/60 italic">
                    {property.Tagline}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
