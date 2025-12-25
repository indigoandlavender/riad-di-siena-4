import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Douaria",
  description: "Our modern annex across the alley. Three contemporary rooms with rooftop terrace, designed for guests who want traditional Marrakech with modern comfort.",
  openGraph: {
    title: "The Douaria | Riad di Siena",
    description: "Modern annex with rooftop terrace in Marrakech medina.",
  },
};

export default function TheDouariaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
