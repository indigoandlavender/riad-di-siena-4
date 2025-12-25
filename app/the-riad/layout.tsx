import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Riad",
  description: "A 300-year-old house in Marrakech medina. Original tilework, carved plaster, and a courtyard that has seen three centuries of stories. Not a hotel — a house.",
  openGraph: {
    title: "The Riad | Riad di Siena",
    description: "A 300-year-old house in Marrakech medina. Original tilework, carved plaster, and a courtyard with history.",
  },
};

export default function TheRiadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
