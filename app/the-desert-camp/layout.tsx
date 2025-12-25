import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Desert Camp",
  description: "Sahara desert camp at Erg Chebbi. Sleep under stars in traditional nomad tents. Camel treks, dune sunsets, and silence you can hear.",
  openGraph: {
    title: "The Desert Camp | Riad di Siena",
    description: "Sahara desert camp experience at Erg Chebbi, Morocco.",
  },
};

export default function TheDesertCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
