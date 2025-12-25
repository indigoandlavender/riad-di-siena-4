import { NextResponse } from "next/server";
import { getPageContent } from "@/lib/sheets";

export async function GET() {
  try {
    const content = await getPageContent("home");
    return NextResponse.json({
      success: true,
      content,
      heroImage: content.hero?.Image_URL || "NO HERO IMAGE FOUND",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
