import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  
  // Method 1: Delete using next/headers (Recommended for App Router)
  cookieStore.delete("user_session");

  // Method 2: Fallback response-based clearing
  const response = NextResponse.json({ success: true });
  response.cookies.set("user_session", "", { 
    expires: new Date(0), 
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });
  
  return response;
}
