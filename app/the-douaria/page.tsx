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

// Minimal monochrome icons
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
  const [cityTaxPerNight, setCityTaxPerNight] = useState(2.5);

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
      fetch("/api/settings").then((res) => res.json()),
    ])
      .then(([heroData, contentData, roomsData, galleryData, settingsData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        setRooms(roomsData);
        setGallery(galleryData);
        if (settingsData.city_tax_eur) {
          setCityTaxPerNight(parseFloat(settingsData.city_tax_eur));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
              {hero.Location}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            T H E<br />D O U A R I A
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

      {/* Description */}
      {paragraphs.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p.Content.replace(/douaria/gi, '<em>douaria</em>') }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rooms */}
      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-[#2a2520]/40 mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 italic">Three rooms, three moods</h2>
          </div>

          {loading ? (
            <div className="text-center text-[#2a2520]/50">Loading rooms...</div>
          ) : (
            <div className="space-y-24">
              {rooms.map((room, index) => (
                <div 
                  key={room.Room_ID}
                  className="grid md:grid-cols-2 gap-12 items-start"
                >
                  <div className={`aspect-[3/4] overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    {room.Image_URL && (
                      <img 
                        src={room.Image_URL} 
                        alt={room.Name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={`pt-4 md:pt-8 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="font-serif text-2xl mb-2 italic">{room.Name}</h3>
                    <p className="text-[#2a2520]/50 text-sm mb-4">From {formatPrice(parseFloat(room.Price_EUR))} / night</p>
                    <p className="text-[#2a2520]/60 leading-relaxed mb-6 text-lg">{room.Description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      {room.features.map((feature) => {
                        const icon = getIconForFeature(feature);
                        return (
                          <div key={feature} className="flex items-center gap-2 text-[#2a2520]/50">
                            <span className="text-[#2a2520]/30">
                              {icon || <span className="w-1.5 h-1.5 rounded-full bg-[#2a2520]/30 block" />}
                            </span>
                            <span className="text-xs">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {room.Bookable?.toLowerCase() === "no" ? (
                      <p className="text-xs tracking-widest text-[#2a2520]/40 italic">
                        Not available for direct booking
                      </p>
                    ) : (
                      <button 
                        onClick={() => openBookingModal(room)}
                        className="text-xs tracking-widest border-b border-[#2a2520]/30 pb-1 hover:border-[#2a2520] transition-colors"
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
      <BookingModal
        isOpen={isModalOpen && selectedRoom !== null}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedRoom(null), 300);
        }}
        item={selectedRoom ? {
          id: selectedRoom.Room_ID,
          name: selectedRoom.Name,
          priceEUR: selectedRoom.Price_EUR,
          iCalURL: selectedRoom.iCal_URL,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 2,
          baseGuestsPerUnit: 2,
          hasCityTax: true,
          cityTaxPerNight,
          selectCheckout: true,
          paypalContainerId: `paypal-douaria-${selectedRoom?.Room_ID || "default"}`,
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
