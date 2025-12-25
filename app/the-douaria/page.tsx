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

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Image_URL: string;
  features: string[];
  iCal_URL?: string;
  Bookable?: string;
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

// Minimal monochrome icons - 20x20, strokeWidth 1.25, no fills
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

const AcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="4" width="16" height="10" rx="1" />
    <path d="M5 17c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" />
    <path d="M10 17c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" />
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M2 8c4.5-4 11.5-4 16 0" />
    <path d="M5 11c3-2.5 7-2.5 10 0" />
    <path d="M8 14c1.5-1 3.5-1 5 0" />
    <circle cx="10" cy="16" r="1" fill="currentColor" />
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

const SittingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M5 17v-5h10v5" />
    <path d="M3 12h14" />
    <path d="M5 12V8a2 2 0 012-2h6a2 2 0 012 2v4" />
  </svg>
);

// Map features to icons
const iconMap: Record<string, () => JSX.Element> = {
  "bed": BedIcon,
  "king": BedIcon,
  "queen": BedIcon,
  "bathroom": BathIcon,
  "en-suite": BathIcon,
  "ensuite": BathIcon,
  "air": AcIcon,
  "conditioning": AcIcon,
  "wifi": WifiIcon,
  "wi-fi": WifiIcon,
  "terrace": TerraceIcon,
  "sitting": SittingIcon,
  "seating": SittingIcon,
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

export default function TheDouariaPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/douaria-hero").then((res) => res.json()),
      fetch("/api/douaria-content").then((res) => res.json()),
      fetch("/api/douaria-rooms").then((res) => res.json()),
      fetch("/api/douaria-gallery").then((res) => res.json()),
    ])
      .then(([heroData, contentData, roomsData, galleryData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        setRooms(roomsData);
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
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{hero?.Title || "The Douaria"}</h1>
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
              <p key={i} dangerouslySetInnerHTML={{ __html: p.Content.replace(/douaria/gi, '<em>douaria</em>') }} />
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground/90">Three rooms, three moods</h2>
          </div>

          {loading ? (
            <div className="text-center text-foreground/50">Loading rooms...</div>
          ) : (
            <div className="space-y-16">
              {rooms.map((room, index) => (
                <div 
                  key={room.Room_ID}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className={`aspect-[4/3] bg-foreground/10 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    {room.Image_URL && (
                      <img 
                        src={room.Image_URL} 
                        alt={room.Name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <h3 className="font-serif text-2xl mb-2">{room.Name}</h3>
                    <p className="text-foreground/60 text-sm mb-4">From {formatPrice(parseFloat(room.Price_EUR))} / night</p>
                    <p className="text-foreground/70 leading-relaxed mb-6">{room.Description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      {room.features.map((feature) => {
                        const icon = getIconForFeature(feature);
                        return (
                          <div key={feature} className="flex items-center gap-2 text-foreground/60">
                            <span className="text-foreground/40">
                              {icon || <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 block" />}
                            </span>
                            <span className="text-xs">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {room.Bookable?.toLowerCase() === "no" ? (
                      <p className="text-xs tracking-widest text-muted-foreground italic">
                        Not available for direct booking
                      </p>
                    ) : (
                      <button 
                        onClick={() => openBookingModal(room)}
                        className="text-xs tracking-widest border-b border-foreground/30 pb-1 hover:border-foreground transition-colors"
                      >
                        BOOK THIS ROOM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
          }}
          item={{
            id: selectedRoom.Room_ID,
            name: selectedRoom.Name,
            priceEUR: selectedRoom.Price_EUR,
            iCalURL: selectedRoom.iCal_URL,
          }}
          config={{
            maxGuests: 2,
            hasCityTax: true,
            selectCheckout: true,
            paypalContainerId: `paypal-douaria-${selectedRoom.Room_ID}`,
          }}
          formatPrice={formatPrice}
          paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
        />
      )}
    </div>
  );
}
