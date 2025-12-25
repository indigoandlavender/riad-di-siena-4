"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 bg-sand">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground/90 mb-4">
              Thank you.
            </h1>
            <p className="text-foreground/60">We'll be in touch soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-sand">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Title */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground/90 leading-[1.1]">
              SEND<br />
              US<br />
              A<br />
              NOTE.
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.2em] text-foreground/50 block mb-3">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full border-b border-foreground/20 pb-2 bg-transparent focus:border-foreground outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] text-foreground/50 block mb-3">
                  LAST NAME
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full border-b border-foreground/20 pb-2 bg-transparent focus:border-foreground outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] text-foreground/50 block mb-3">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border-b border-foreground/20 pb-2 bg-transparent focus:border-foreground outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] text-foreground/50 block mb-3">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-b border-foreground/20 pb-2 bg-transparent focus:border-foreground outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] text-foreground/50 block mb-3">
                MESSAGE (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-b border-foreground/20 pb-2 bg-transparent focus:border-foreground outline-none text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-xs tracking-[0.2em] border border-foreground px-8 py-3 hover:bg-foreground hover:text-sand transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "SENDING..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
