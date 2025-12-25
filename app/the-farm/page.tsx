"use client";

import { useState, useEffect } from "react";
import BeyondTheWallsNav from "@/components/BeyondTheWallsNav";

interface Hero {
  Title: string;
  Subtitle: string;
  Location: string;
  Image_URL: string;
}

interface Paragraph {
  Content: string;
}

interface Produce {
  Produce_ID: string;
  Name: string;
  Description: string;
  Season: string;
}

export default function TheFarmPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/farm-hero").then((res) => res.json()),
      fetch("/api/farm-content").then((res) => res.json()),
      fetch("/api/farm-produce").then((res) => res.json()),
    ])
      .then(([heroData, contentData, produceData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        setProduce(produceData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroImage = hero?.Image_URL || "";

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
        
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] mb-6">{hero.Location.toUpperCase()}</p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{hero?.Title || "The Farm"}</h1>
          {hero?.Subtitle && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">{hero.Subtitle}</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-foreground/70 leading-relaxed space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i}>{p.Content}</p>
            ))}
          </div>
        </div>
      </section>

      {/* What Comes from The Farm */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-4">FROM THE FARM</p>
            <h2 className="font-serif text-xl text-foreground/80">What reaches your table</h2>
          </div>
          
          {loading ? (
            <div className="text-center text-foreground/50">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {produce.map((item) => (
                <div key={item.Produce_ID} className="py-4">
                  <p className="font-serif text-lg mb-1">{item.Name}</p>
                  <p className="text-foreground/50 text-sm">{item.Description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />
    </div>
  );
}
