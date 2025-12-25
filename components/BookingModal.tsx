"use client";

import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    paypal?: any;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface BookingItem {
  id: string;
  name: string;
  priceEUR: string;
  iCalURL?: string;
}

export interface BookingConfig {
  maxGuests?: number;
  maxNights?: number;
  maxUnits?: number;
  unitLabel?: string;
  hasCityTax?: boolean;
  cityTaxPerNight?: number;
  selectCheckout?: boolean;
  propertyName?: string;
  paypalContainerId?: string;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingItem;
  config: BookingConfig;
  formatPrice: (amount: number) => string;
  paypalClientId: string;
  onBookingComplete?: (data: any) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BookingModal({
  isOpen,
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: BookingModalProps) {
  // Don't render anything if not open or no item
  if (!isOpen || !item) return null;

  return (
    <BookingModalContent
      onClose={onClose}
      item={item}
      config={config}
      formatPrice={formatPrice}
      paypalClientId={paypalClientId}
      onBookingComplete={onBookingComplete}
    />
  );
}

// Separate inner component to ensure clean mount/unmount
function BookingModalContent({
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: Omit<BookingModalProps, "isOpen">) {
  const {
    maxGuests = 2,
    hasCityTax = false,
    cityTaxPerNight = 2.5,
  } = config;

  // State
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Ref for PayPal container - keeps it outside React's DOM management
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRendered = useRef(false);

  // Calculate nights
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const pricePerNight = parseFloat(item.priceEUR) || 0;
  const subtotal = pricePerNight * nights;
  const cityTax = hasCityTax ? cityTaxPerNight * guests * nights : 0;
  const total = subtotal + cityTax;

  // Fetch booked dates on mount
  useEffect(() => {
    if (item.iCalURL) {
      fetch(`/api/ical?url=${encodeURIComponent(item.iCalURL)}`)
        .then(res => res.json())
        .then(data => {
          if (data.bookedDates) {
            const dates: string[] = [];
            data.bookedDates.forEach((booking: { start: string; end: string }) => {
              const start = new Date(booking.start);
              const end = new Date(booking.end);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dates.push(d.toISOString().split("T")[0]);
              }
            });
            setBookedDates(dates);
          }
        })
        .catch(err => console.error("Failed to fetch availability:", err));
    }
  }, [item.iCalURL]);

  const handlePaymentSuccess = useCallback(async (transactionId: string) => {
    setIsSubmitting(true);

    const bookingData = {
      itemId: item.id,
      itemName: item.name,
      checkIn,
      checkOut,
      nights,
      guests,
      totalEUR: total.toFixed(2),
      firstName,
      lastName,
      email,
      phone,
      message,
      paypalTransactionId: transactionId,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (result.success) {
        setStep(4);
        onBookingComplete?.(bookingData);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to save booking. Please contact us.");
    } finally {
      setIsSubmitting(false);
    }
  }, [item.id, item.name, checkIn, checkOut, nights, guests, total, firstName, lastName, email, phone, message, onBookingComplete]);

  // Load PayPal script and render buttons when on step 3
  useEffect(() => {
    if (step !== 3) {
      paypalButtonsRendered.current = false;
      return;
    }

    // Already rendered
    if (paypalButtonsRendered.current) return;

    const renderButtons = () => {
      if (!paypalContainerRef.current || !window.paypal) return;
      if (paypalButtonsRendered.current) return;

      // Clear container using DOM API (not React)
      while (paypalContainerRef.current.firstChild) {
        paypalContainerRef.current.removeChild(paypalContainerRef.current.firstChild);
      }

      paypalButtonsRendered.current = true;

      window.paypal.Buttons({
        style: { 
          layout: "vertical", 
          color: "black", 
          shape: "rect", 
          label: "pay", 
          height: 50 
        },
        createOrder: (_: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `${item.name} - ${nights} nights`,
              amount: { value: total.toFixed(2), currency_code: "EUR" },
            }],
          });
        },
        onApprove: async (_: any, actions: any) => {
          const order = await actions.order.capture();
          await handlePaymentSuccess(order.id);
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          alert("Payment failed. Please try again.");
        },
      }).render(paypalContainerRef.current);
    };

    // If PayPal is already loaded
    if (window.paypal) {
      setPaypalReady(true);
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        renderButtons();
      });
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    if (existingScript) {
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          clearInterval(checkPayPal);
          setPaypalReady(true);
          renderButtons();
        }
      }, 100);
      return () => clearInterval(checkPayPal);
    }

    // Load PayPal script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
    script.async = true;
    script.onload = () => {
      setPaypalReady(true);
      renderButtons();
    };
    document.body.appendChild(script);
  }, [step, paypalClientId, item.name, nights, total, handlePaymentSuccess]);

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  // Check if a date is booked
  const isDateBooked = (dateStr: string) => bookedDates.includes(dateStr);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#f8f5f0" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <h2 className="font-serif text-2xl mb-2">{item.name}</h2>
          <p className="text-sm text-foreground/50 mb-6">{formatPrice(pricePerNight)} per night</p>

          {/* Step 1: Dates */}
          {step === 1 && (
            <div>
              <p className="text-xs tracking-widest text-foreground/40 mb-4">STEP 1 OF 3 — SELECT DATES</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-foreground/70 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) {
                        setCheckOut("");
                      }
                    }}
                    className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                  />
                  {checkIn && isDateBooked(checkIn) && (
                    <p className="text-xs text-red-600 mt-1">This date may be unavailable</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-foreground/70 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                  />
                </div>

                {maxGuests > 1 && (
                  <div>
                    <label className="block text-sm text-foreground/70 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                    >
                      {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {nights > 0 && (
                <div className="mb-6 p-4 bg-foreground/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{formatPrice(pricePerNight)} × {nights} nights</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {hasCityTax && (
                    <div className="flex justify-between text-sm mb-2 text-foreground/60">
                      <span>City tax ({guests} × {nights} × €{cityTaxPerNight})</span>
                      <span>€{cityTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t border-foreground/10">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!checkIn || !checkOut || nights < 1}
                className="w-full py-3 bg-foreground text-cream disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <p className="text-xs tracking-widest text-foreground/40 mb-4">STEP 2 OF 3 — YOUR DETAILS</p>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40"
                />
                <textarea
                  placeholder="Special requests (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground/40 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-foreground text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!firstName || !lastName || !email}
                  className="flex-1 py-3 bg-foreground text-cream disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <p className="text-xs tracking-widest text-foreground/40 mb-4">STEP 3 OF 3 — PAYMENT</p>

              <div className="mb-6 p-4 bg-foreground/5">
                <p className="text-sm mb-1">{item.name}</p>
                <p className="text-sm text-foreground/60 mb-3">{checkIn} → {checkOut} · {nights} nights · {guests} guest{guests > 1 ? "s" : ""}</p>
                <div className="flex justify-between font-medium pt-2 border-t border-foreground/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* PayPal container - using ref instead of id */}
              <div 
                ref={paypalContainerRef} 
                className="mb-4 min-h-[50px]"
                suppressHydrationWarning
              >
                {!paypalReady && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {isSubmitting && (
                <p className="text-center text-sm text-foreground/50">Processing payment...</p>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 border border-foreground text-foreground mt-4"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="8,16 14,22 24,10" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-2">Booking Confirmed</h3>
              <p className="text-foreground/60 mb-6">
                Thank you! A confirmation email has been sent to {email}
              </p>
              <button
                onClick={onClose}
                className="text-sm tracking-widest text-foreground/60 hover:text-foreground"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
