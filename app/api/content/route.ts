import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/sheets";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");
  
  if (!page) {
    return NextResponse.json({ error: "Missing page parameter" }, { status: 400 });
  }

  try {
    const content = await getPageContent(page);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json({});
  }
}
