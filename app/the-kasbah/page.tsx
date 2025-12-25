"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import BookingModal from "@/components/BookingModal";
import GalleryCarousel from "@/components/GalleryCarousel";
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

interface Experience {
  Package_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Single_Supplement_EUR?: string;
  Duration: string;
  Min_Guests: string;
  includes: string[];
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

export default function TheKasbahPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/kasbah-hero").then((res) => res.json()),
      fetch("/api/kasbah-content").then((res) => res.json()),
      fetch("/api/kasbah-experience").then((res) => res.json()),
      fetch("/api/kasbah-gallery").then((res) => res.json()),
    ])
      .then(([heroData, contentData, expData, galleryData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        if (expData.length > 0) setExperience(expData[0]);
        setGallery(galleryData);
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
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{hero?.Title || "The Kasbah"}</h1>
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
              <p key={i} dangerouslySetInnerHTML={{ __html: p.Content.replace(/kasbah/gi, '<em>kasbah</em>').replace(/pisé/gi, '<em>pisé</em>') }} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Package */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground/90">
              {experience?.Name || "Two nights in the deep south"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-foreground/50">Loading experience...</div>
          ) : experience ? (
            <div className="bg-sand p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-serif text-xl mb-6">What's included</h3>
                  <ul className="space-y-4 text-foreground/70 text-sm">
                    {experience.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-6">Pricing</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-foreground/60 text-xs tracking-widest mb-2">PER NIGHT (DOUBLE OCCUPANCY)</p>
                      <p className="font-serif text-3xl">{formatPrice(parseFloat(experience.Price_EUR))}</p>
                    </div>
                    {experience.Single_Supplement_EUR && (
                      <div>
                        <p className="text-foreground/60 text-xs tracking-widest mb-2">SINGLE SUPPLEMENT</p>
                        <p className="font-serif text-xl">{formatPrice(parseFloat(experience.Single_Supplement_EUR))}</p>
                      </div>
                    )}
                    <p className="text-foreground/50 text-xs">
                      Price includes all transfers, accommodation, meals, and activities. 
                      Minimum {experience.Min_Guests} guests. Private kasbah buyout available on request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-foreground/10 text-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs tracking-widest bg-foreground text-sand px-10 py-4 hover:bg-foreground/90 transition-colors inline-block"
                >
                  BOOK THE KASBAH EXPERIENCE
                </button>
                <p className="text-foreground/50 text-xs mt-6">
                  Also part of{" "}
                  <a 
                    href="/#the-journey" 
                    className="underline hover:text-foreground transition-colors"
                  >
                    The Slow Journey South
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-foreground/50">No experience package available</div>
          )}
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />

      {/* Booking Modal - Keep mounted for PayPal safety */}
      <BookingModal
        isOpen={isModalOpen && experience !== null}
        onClose={() => setIsModalOpen(false)}
        item={experience ? {
          id: experience.Package_ID,
          name: experience.Name,
          priceEUR: experience.Price_EUR,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 3,
          baseGuestsPerUnit: 2,
          extraPersonFee: parseFloat(experience?.Extra_Person_EUR || "0"),
          maxNights: 5,
          maxUnits: 3,
          unitLabel: "room",
          selectCheckout: false,
          propertyName: "The Kasbah",
          paypalContainerId: "paypal-kasbah",
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
