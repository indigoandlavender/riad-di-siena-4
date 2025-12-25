"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ExperienceBookingModal from "./ExperienceBookingModal";

// The Slow Way South - Syndication Component
// Pulls the 3-Day Sahara Circle journey data from Slow Morocco

interface SlowWaySouthProps {
  ctaUrl?: string;
  ctaText?: string;
}

export default function SlowWaySouth({ 
  ctaUrl = "https://slowmorocco.com/journeys/3-Day-Sahara-Circle",
  ctaText = "The Full Journey"
}: SlowWaySouthProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the 3-Day Sahara Circle journey from Slow Morocco
    fetch("https://www.slowmorocco.com/api/journeys/3-Day-Sahara-Circle")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.journey?.heroImage) {
          setHeroImage(data.journey.heroImage);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Slow Morocco journey:", err);
        setLoading(false);
      });
  }, []);

  // Journey details for the booking modal
  const journeyExperience = {
    Package_ID: "sahara-circle-3day",
    Name: "The Slow Way South - 3-Day Sahara Circle",
    Price_EUR: "600",
    Single_Supplement_EUR: "150",
    Duration: "3 days",
    Min_Guests: "2"
  };

  return (
    <section className="bg-sand">
      {/* Immersive Hero Image */}
      <div className="relative h-[70vh] bg-[#e8e0d4]">
        {heroImage && (
          <Image
            src={heroImage}
            alt="3-Day Sahara Circle"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-16 text-white">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/80">
              3 Days · Desert · Mountains
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              The Slow Way South
            </h2>
            <p className="max-w-xl text-white/90 leading-relaxed">
              From the riad to the Sahara and back. Through valleys where kasbahs rise 
              from red earth, nights under stars thick enough to press against your chest.
            </p>
          </div>
        </div>
      </div>

      {/* Journey Details */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Day markers */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-sm mx-auto mb-4">
                1
              </div>
              <h3 className="font-serif text-lg mb-2">Marrakech → Draa Valley</h3>
              <p className="text-sm text-muted-foreground">
                Over the Atlas. Down into palm groves and ancient kasbahs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-sm mx-auto mb-4">
                2
              </div>
              <h3 className="font-serif text-lg mb-2">The Sahara</h3>
              <p className="text-sm text-muted-foreground">
                Dunes at sunset. Dinner over coals. Stars without end.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-sm mx-auto mb-4">
                3
              </div>
              <h3 className="font-serif text-lg mb-2">Return via the Gorges</h3>
              <p className="text-sm text-muted-foreground">
                Nine hours through Todra and Dades. Stone and light shifting.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            {/* Price */}
            <p className="text-2xl font-serif mb-2">€1,200</p>
            <p className="text-sm text-muted-foreground mb-8">for 2 guests / all meals included</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                The Full Journey
              </Link>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-block bg-foreground text-sand px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
              >
                Begin
              </button>
            </div>

            {/* Attribution */}
            <p className="text-xs text-muted-foreground mb-4">
              A journey by{" "}
              <a 
                href="https://slowmorocco.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Slow Morocco
              </a>
            </p>

            {/* Day Adventures Link */}
            <a 
              href="https://slowmorocco.com/day-trips" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Day Adventures →
            </a>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <ExperienceBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        experience={journeyExperience}
        propertyName="Slow Morocco"
      />
    </section>
  );
}
