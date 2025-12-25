import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Kasbah",
  description: "A 500-year-old fortified house in the Draa Valley. Our partner property for guests seeking the silence of the south. 6 hours from Marrakech, centuries away.",
  openGraph: {
    title: "The Kasbah | Riad di Siena",
    description: "500-year-old fortified house in Morocco's Draa Valley.",
  },
};

export default function TheKasbahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
