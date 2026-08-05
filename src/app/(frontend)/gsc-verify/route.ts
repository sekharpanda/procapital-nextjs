import { NextResponse } from "next/server"

export function GET() {
  return new NextResponse("google-site-verification: googleb02c6c602345eaad.html\n", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}