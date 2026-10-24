import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const filename = slug.join('/');
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    let contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.gif') contentType = 'image/gif';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Image not found', { status: 404 });
  }
}
