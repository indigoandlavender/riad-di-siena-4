import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Debug endpoint active",
    timestamp: new Date().toISOString(),
  });
}
