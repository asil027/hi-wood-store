import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Handle multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.png';
      const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      const filename = `bag-${Date.now()}-${cleanName}${ext}`;

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      });
    }

    // Handle JSON (Base64 fallback)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { base64, filename: originalName } = body;

      if (!base64) {
        return NextResponse.json({ error: 'No base64 data provided' }, { status: 400 });
      }

      // Format: data:image/png;base64,xxxx
      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = '.png';

      if (matches) {
        const mime = matches[1];
        if (mime === 'image/jpeg' || mime === 'image/jpg') ext = '.jpg';
        else if (mime === 'image/webp') ext = '.webp';
        else if (mime === 'image/gif') ext = '.gif';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64, 'base64');
      }

      const cleanName = (originalName || 'bag').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
      const filename = `bag-${Date.now()}-${cleanName}${ext}`;

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      });
    }

    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload processing failed' }, { status: 500 });
  }
}
