import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Riad di Siena. Book your stay in Marrakech medina, ask questions, or plan your journey to Morocco.",
  openGraph: {
    title: "Contact | Riad di Siena",
    description: "Contact Riad di Siena in Marrakech medina.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
