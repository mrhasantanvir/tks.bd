import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

    // Fetch credentials from settings
    const settings = await prisma.settings.findMany({
      where: { key: { in: ['steadfast_portal_email', 'steadfast_portal_password'] } }
    });
    
    const email = settings.find(s => s.key === 'steadfast_portal_email')?.value;
    const password = settings.find(s => s.key === 'steadfast_portal_password')?.value;

    if (!email || !password) {
      return NextResponse.json({ error: "Steadfast portal credentials not configured in Settings." }, { status: 400 });
    }

    // 1. GET Login Page to extract CSRF Token and Cookies
    const loginPageRes = await fetch("https://steadfast.com.bd/login", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!loginPageRes.ok) {
      return NextResponse.json({ error: "Failed to reach Steadfast Login Page (Cloudflare block or site down)" }, { status: 500 });
    }

    const html = await loginPageRes.text();
    const cookiesRaw = loginPageRes.headers.getSetCookie();
    let cookieString = cookiesRaw.map(c => c.split(';')[0]).join('; ');

    const tokenMatch = html.match(/<input[^>]*name=["']_token["'][^>]*value=["']([^"']+)["']/);
    if (!tokenMatch) {
      return NextResponse.json({ error: "CSRF Token not found on Steadfast. Website structure might have changed." }, { status: 500 });
    }
    const token = tokenMatch[1];

    // 2. POST Login
    const loginFormData = new URLSearchParams();
    loginFormData.append('_token', token);
    loginFormData.append('email', email);
    loginFormData.append('password', password);

    const loginRes = await fetch("https://steadfast.com.bd/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Origin': 'https://steadfast.com.bd',
        'Referer': 'https://steadfast.com.bd/login',
        'Cookie': cookieString
      },
      body: loginFormData.toString(),
      redirect: 'manual' // Handle redirect manually to capture new cookies
    });

    // Capture new session cookies if provided
    const newCookiesRaw = loginRes.headers.getSetCookie();
    if (newCookiesRaw && newCookiesRaw.length > 0) {
      cookieString = newCookiesRaw.map(c => c.split(';')[0]).join('; ');
    }

    // 3. GET Fraud Check Data
    const fraudUrl = `https://steadfast.com.bd/user/frauds/check/${encodeURIComponent(phone)}`;
    const fraudRes = await fetch(fraudUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://steadfast.com.bd/',
        'Cookie': cookieString
      }
    });

    if (!fraudRes.ok) {
        // Fallback without cookies
        const fallbackRes = await fetch(fraudUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/plain, */*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!fallbackRes.ok) {
            return NextResponse.json({ error: "Failed to fetch fraud data from Steadfast" }, { status: 500 });
        }
        const fallbackData = await fallbackRes.json();
        return NextResponse.json({ data: fallbackData });
    }

    const responseText = await fraudRes.text();
    if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
      return NextResponse.json({ error: "Steadfast returned HTML instead of JSON. Authentication might have failed or endpoint changed." }, { status: 500 });
    }

    const data = JSON.parse(responseText);
    
    // Structure like Jahid15
    const successful = Number(data.total_delivered || 0);
    const cancelled = Number(data.total_cancelled || 0);
    const total = successful + cancelled;

    return NextResponse.json({ 
      data: {
        success: successful,
        cancel: cancelled,
        total: total,
        frauds: data.frauds || []
      }
    });

  } catch (err: any) {
    console.error("Fraud check error:", err);
    return NextResponse.json({ error: "Server Error: " + err.message }, { status: 500 });
  }
}
