"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

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
// PAYPAL COMPONENT - Isolated with proper cleanup
// ============================================================================

function PayPalButton({
  amount,
  description,
  clientId,
  onSuccess,
  onError,
}: {
  amount: string;
  description: string;
  clientId: string;
  onSuccess: (transactionId: string) => void;
  onError: (err: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const buttonsInstance = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let timeoutId: NodeJS.Timeout;

    const renderButton = async () => {
      if (!containerRef.current || !window.paypal || !isMounted.current) return;

      try {
        // Clear any existing content safely
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        buttonsInstance.current = window.paypal.Buttons({
          style: { layout: "vertical", color: "black", shape: "rect", label: "pay", height: 50 },
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{ description, amount: { value: amount, currency_code: "EUR" } }],
            });
          },
          onApprove: async (_: any, actions: any) => {
            if (!isMounted.current) return;
            const order = await actions.order.capture();
            onSuccess(order.id);
          },
          onError: (err: any) => {
            if (!isMounted.current) return;
            onError(err);
          },
        });

        if (containerRef.current && isMounted.current) {
          await buttonsInstance.current.render(containerRef.current);
          if (isMounted.current) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("PayPal render error:", err);
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const initPayPal = () => {
      if (window.paypal) {
        renderButton();
      } else {
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
          script.async = true;
          script.onload = () => {
            if (isMounted.current) renderButton();
          };
          script.onerror = () => {
            if (isMounted.current) {
              setError(true);
              setLoading(false);
            }
          };
          document.head.appendChild(script);
        } else {
          // Script exists, wait for it
          const checkInterval = setInterval(() => {
            if (window.paypal) {
              clearInterval(checkInterval);
              if (isMounted.current) renderButton();
            }
          }, 100);
          
          // Timeout after 10 seconds
          timeoutId = setTimeout(() => {
            clearInterval(checkInterval);
            if (isMounted.current && !window.paypal) {
              setError(true);
              setLoading(false);
            }
          }, 10000);
        }
      }
    };

    // Small delay to ensure DOM is ready
    requestAnimationFrame(initPayPal);

    // Cleanup function - critical for preventing the error
    return () => {
      isMounted.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      
      // Close PayPal buttons if they exist
      if (buttonsInstance.current && typeof buttonsInstance.current.close === "function") {
        try {
          buttonsInstance.current.close();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      buttonsInstance.current = null;
    };
  }, [amount, description, clientId, onSuccess, onError]);

  if (error) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
        <p>Unable to load payment. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
          <div style={{
            width: "24px",
            height: "24px",
            border: "2px solid #ccc",
            borderTopColor: "#333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or if not mounted
  if (!mounted) return null;
  
  // Don't render if not open or no valid item
  if (!isOpen || !item || !item.id) return null;

  return createPortal(
    <BookingModalContent
      onClose={onClose}
      item={item}
      config={config}
      formatPrice={formatPrice}
      paypalClientId={paypalClientId}
      onBookingComplete={onBookingComplete}
    />,
    document.body
  );
}

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

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const pricePerNight = parseFloat(item.priceEUR) || 0;
  const subtotal = pricePerNight * nights;
  const cityTax = hasCityTax ? cityTaxPerNight * guests * nights : 0;
  const total = subtotal + cityTax;

  const today = new Date().toISOString().split("T")[0];

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
  }, [item, checkIn, checkOut, nights, guests, total, firstName, lastName, email, phone, message, onBookingComplete]);

  const handlePaymentError = useCallback((err: any) => {
    console.error("PayPal error:", err);
    alert("Payment failed. Please try again.");
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset form when item changes
  useEffect(() => {
    setStep(1);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }, [item.id]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "relative",
        backgroundColor: "#f8f5f0",
        width: "100%",
        maxWidth: "28rem",
        margin: "1rem",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        <div style={{ padding: "2rem" }}>
          <h2 style={{ fontFamily: "serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.name}</h2>
          <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1.5rem" }}>{formatPrice(pricePerNight)} per night</p>

          {/* Step 1: Dates */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#999", marginBottom: "1rem" }}>STEP 1 OF 3 — SELECT DATES</p>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", color: "#555", marginBottom: "0.25rem" }}>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent", marginBottom: "1rem" }}
                />

                <label style={{ display: "block", fontSize: "0.875rem", color: "#555", marginBottom: "0.25rem" }}>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent", marginBottom: "1rem" }}
                />

                {maxGuests > 1 && (
                  <>
                    <label style={{ display: "block", fontSize: "0.875rem", color: "#555", marginBottom: "0.25rem" }}>Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent" }}
                    >
                      {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {nights > 0 && (
                <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    <span>{formatPrice(pricePerNight)} × {nights} nights</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {hasCityTax && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#666" }}>
                      <span>City tax</span>
                      <span>€{cityTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "500", paddingTop: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!checkIn || !checkOut || nights < 1}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: checkIn && checkOut && nights >= 1 ? "#1a1a1a" : "#ccc",
                  color: "#f8f5f0",
                  border: "none",
                  cursor: checkIn && checkOut && nights >= 1 ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#999", marginBottom: "1rem" }}>STEP 2 OF 3 — YOUR DETAILS</p>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ padding: "0.75rem", border: "1px solid #ccc", background: "transparent" }}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ padding: "0.75rem", border: "1px solid #ccc", background: "transparent" }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent", marginBottom: "1rem" }}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent", marginBottom: "1rem" }}
                />
                <textarea
                  placeholder="Special requests (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", background: "transparent", resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: "0.75rem", border: "1px solid #1a1a1a", background: "transparent", cursor: "pointer" }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!firstName || !lastName || !email}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: firstName && lastName && email ? "#1a1a1a" : "#ccc",
                    color: "#f8f5f0",
                    border: "none",
                    cursor: firstName && lastName && email ? "pointer" : "not-allowed",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment - Only render PayPal when on this step */}
          {step === 3 && (
            <div>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#999", marginBottom: "1rem" }}>STEP 3 OF 3 — PAYMENT</p>

              <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(0,0,0,0.03)" }}>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{item.name}</p>
                <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.75rem" }}>{checkIn} → {checkOut} · {nights} nights · {guests} guest{guests > 1 ? "s" : ""}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "500", paddingTop: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <PayPalButton
                amount={total.toFixed(2)}
                description={`${item.name} - ${nights} nights`}
                clientId={paypalClientId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {isSubmitting && (
                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#666" }}>Processing payment...</p>
              )}

              <button
                onClick={() => setStep(2)}
                style={{ width: "100%", padding: "0.75rem", border: "1px solid #1a1a1a", background: "transparent", cursor: "pointer", marginTop: "1rem" }}
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                border: "2px solid #1a1a1a",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="8,16 14,22 24,10" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Booking Confirmed</h3>
              <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                Thank you! A confirmation email has been sent to {email}
              </p>
              <button
                onClick={onClose}
                style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#666", background: "none", border: "none", cursor: "pointer" }}
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
