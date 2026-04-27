import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // Verify Admin
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = JSON.parse(sessionCookie.value);
  const user = await prisma.users.findUnique({ where: { id: session.id } });
  if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
