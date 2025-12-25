import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Three intimate rooms in a 300-year-old riad in Marrakech medina. Hidden Gem, Trésor Caché, and Jewel Box - each with its own character and story.",
  openGraph: {
    title: "Rooms | Riad di Siena",
    description: "Three intimate rooms in a 300-year-old riad in Marrakech medina.",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
