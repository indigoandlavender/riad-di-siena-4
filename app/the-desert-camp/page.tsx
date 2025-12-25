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

interface Tent {
  Tent_ID: string;
  Level: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  features: string[];
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

// Minimal monochrome icons - 20x20, strokeWidth 1.25, no fills
const TentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M10 2L2 17h16L10 2z" />
    <path d="M10 17v-6" />
  </svg>
);

const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="1" y="8" width="18" height="8" rx="1" />
    <path d="M3 8V5a2 2 0 012-2h10a2 2 0 012 2v3" />
    <line x1="1" y1="16" x2="1" y2="18" />
    <line x1="19" y1="16" x2="19" y2="18" />
  </svg>
);

const BathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M3 10h14a1 1 0 011 1v3a4 4 0 01-4 4H6a4 4 0 01-4-4v-3a1 1 0 011-1z" />
    <path d="M4 10V5a2 2 0 012-2h1" />
  </svg>
);

const TerraceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="10" width="16" height="7" rx="1" />
    <path d="M2 13h16" />
    <path d="M6 10V7" />
    <path d="M14 10V7" />
    <path d="M4 7h12" />
  </svg>
);

const ViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <circle cx="10" cy="10" r="3" />
    <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" />
  </svg>
);

const CamelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M5 17v-5l2-2 1-4h2l1 2 3 1v8" />
    <path d="M5 17h2M14 17h2" />
    <circle cx="15" cy="5" r="1.5" />
    <path d="M14 6l-2 2" />
  </svg>
);

const MealsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <ellipse cx="10" cy="14" rx="7" ry="3" />
    <path d="M10 11V3" />
    <path d="M7 3v4a3 3 0 006 0V3" />
  </svg>
);

// Map features to icons
const iconMap: Record<string, () => JSX.Element> = {
  "tent": TentIcon,
  "handwoven": TentIcon,
  "bed": BedIcon,
  "linens": BedIcon,
  "bedding": BedIcon,
  "bathroom": BathIcon,
  "en-suite": BathIcon,
  "ensuite": BathIcon,
  "terrace": TerraceIcon,
  "view": ViewIcon,
  "dune": ViewIcon,
  "location": ViewIcon,
  "camel": CamelIcon,
  "dinner": MealsIcon,
  "breakfast": MealsIcon,
  "meal": MealsIcon,
};

const getIconForFeature = (feature: string): JSX.Element | null => {
  const lowerFeature = feature.toLowerCase();
  const matchedKey = Object.keys(iconMap).find(key => lowerFeature.includes(key));
  if (matchedKey) {
    const Icon = iconMap[matchedKey];
    return <Icon />;
  }
  return null;
};

export default function TheDesertCampPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [tents, setTents] = useState<Tent[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingModal = (tent: Tent) => {
    setSelectedTent(tent);
    setIsModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/desert-hero").then((res) => res.json()),
      fetch("/api/desert-content").then((res) => res.json()),
      fetch("/api/desert-tents").then((res) => res.json()),
      fetch("/api/desert-gallery").then((res) => res.json()),
    ])
      .then(([heroData, contentData, tentsData, galleryData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        setTents(tentsData);
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
        <div className="absolute inset-0 bg-foreground/50" />
        
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] mb-6">{hero.Location.toUpperCase()}</p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{hero?.Title || "The Desert Camp"}</h1>
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

      {/* Tent Options */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground/90">Two ways to experience the night</h2>
          </div>

          {loading ? (
            <div className="text-center text-foreground/50">Loading options...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {tents.map((tent, index) => (
                <div 
                  key={tent.Tent_ID}
                  className={index === 0 ? "bg-sand p-8" : "bg-foreground text-sand p-8"}
                >
                  <p className={`text-xs tracking-[0.3em] mb-2 ${index === 0 ? 'text-muted-foreground' : 'text-sand/60'}`}>
                    {tent.Level.toUpperCase()}
                  </p>
                  <h3 className="font-serif text-2xl mb-4">{tent.Name}</h3>
                  <p className={`text-sm leading-relaxed mb-6 ${index === 0 ? 'text-foreground/70' : 'text-sand/70'}`}>
                    {tent.Description}
                  </p>
                  
                  <div className={`space-y-3 mb-8 ${index === 0 ? 'text-foreground/60' : 'text-sand/60'}`}>
                    {tent.features.map((feature, i) => {
                      const icon = getIconForFeature(feature);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className={index === 0 ? 'text-foreground/40' : 'text-sand/40'}>
                            {icon || <span className="w-1.5 h-1.5 rounded-full bg-current block" />}
                          </span>
                          <span className="text-sm">{feature}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`pt-6 border-t ${index === 0 ? 'border-foreground/10' : 'border-sand/20'}`}>
                    <p className={`text-xs tracking-widest mb-2 ${index === 0 ? 'text-foreground/60' : 'text-sand/60'}`}>FROM</p>
                    <p className="font-serif text-2xl mb-4">
                      {formatPrice(parseFloat(tent.Price_EUR))} 
                      <span className={`text-sm font-sans ${index === 0 ? 'text-foreground/60' : 'text-sand/60'}`}> / night</span>
                    </p>
                    <button 
                      onClick={() => openBookingModal(tent)}
                      className={`text-xs tracking-widest border px-6 py-3 inline-block transition-colors ${
                        index === 0 
                          ? 'border-foreground hover:bg-foreground hover:text-sand' 
                          : 'border-sand/70 hover:bg-sand/10'
                      }`}
                    >
                      BOOK {tent.Name.toUpperCase()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-foreground/50 text-xs mt-8">
            Transfers from Marrakech available on request.
          </p>
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />

      {/* Booking Modal */}
      {selectedTent && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTent(null);
          }}
          item={{
            id: selectedTent.Tent_ID,
            name: selectedTent.Name,
            priceEUR: selectedTent.Price_EUR,
          }}
          config={{
            maxNights: 3,
            maxUnits: 4,
            unitLabel: "tent",
            selectCheckout: false,
            propertyName: "The Desert Camp",
            paypalContainerId: `paypal-tent-${selectedTent.Tent_ID}`,
          }}
          formatPrice={formatPrice}
          paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
        />
      )}
    </div>
  );
}
