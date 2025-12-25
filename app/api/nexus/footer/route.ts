import { NextResponse } from "next/server";
import { 
  getNexusFooterLinks, 
  getNexusCurrencies, 
  getNexusLanguages,
  getSiteConfig 
} from "@/lib/nexus";

export async function GET() {
  try {
    // Fetch all data in parallel
    const [footerLinks, currencies, languages, siteConfig] = await Promise.all([
      getNexusFooterLinks(),
      getNexusCurrencies(),
      getNexusLanguages(),
      getSiteConfig(),
    ]);

    // Group footer links by column
    const columns: Record<string, { title: string; links: { label: string; href: string; type: string }[] }> = {};
    
    footerLinks
      .sort((a, b) => {
        // Sort by column first, then by order
        const colDiff = parseInt(a.column_number) - parseInt(b.column_number);
        if (colDiff !== 0) return colDiff;
        return parseInt(a.link_order) - parseInt(b.link_order);
      })
      .forEach((link) => {
        const colNum = link.column_number;
        if (!columns[colNum]) {
          columns[colNum] = {
            title: link.column_title,
            links: [],
          };
        }
        columns[colNum].links.push({
          label: link.link_label,
          href: link.link_href || "",
          type: link.link_type,
        });
      });

    // Filter currencies that apply to travel sites
    const filteredCurrencies = currencies
      .filter((c) => c.currency_code && c.show_for_site_types?.includes("travel"))
      .map((c) => ({
        code: c.currency_code,
        symbol: c.currency_symbol,
        label: c.currency_label,
      }));

    // Filter enabled languages
    const filteredLanguages = languages
      .filter((l) => l.language_code && l.enabled_default === "TRUE")
      .map((l) => ({
        code: l.language_code.split("-")[0].toUpperCase(), // "en-US" -> "EN"
        label: l.language_label,
        native: l.native_label,
        rtl: l.rtl === "TRUE",
      }));

    return NextResponse.json({
      success: true,
      footer: {
        columns: Object.values(columns),
        siteInfo: siteConfig ? {
          name: siteConfig.site_name,
          address1: siteConfig.address_line1,
          address2: siteConfig.address_line2,
          phone: siteConfig.contact_phone,
          whatsapp: siteConfig.whatsapp,
          email: siteConfig.contact_email,
        } : null,
      },
      currencies: filteredCurrencies,
      languages: filteredLanguages,
    });
  } catch (error) {
    console.error("Error fetching Nexus footer data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}
