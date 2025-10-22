import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    const caption = formData.get('caption') as string;
    const platforms = JSON.parse(formData.get('platforms') as string);

    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Save video file
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const fileName = `${Date.now()}-${video.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Demo mode: Create a mock user
    const userId = 'demo-user';

    // Create video record
    const videoRecord = await prisma.video.create({
      data: {
        userId,
        fileName,
        filePath,
        fileSize: buffer.length,
        status: 'ready',
      },
    });

    // Create post records for each platform
    for (const platformId of platforms) {
      // Find or create account for this platform
      let account = await prisma.socialAccount.findFirst({
        where: {
          userId,
          platform: platformId,
        },
      });

      if (!account) {
        // Create demo account
        account = await prisma.socialAccount.create({
          data: {
            userId,
            platform: platformId,
            accountName: `demo-${platformId}`,
            chromeProfile: `profile-${platformId}`,
            isActive: true,
          },
        });
      }

      await prisma.post.create({
        data: {
          videoId: videoRecord.id,
          accountId: account.id,
          caption: caption || '',
          status: 'pending',
        },
      });
    }

    return NextResponse.json({ success: true, videoId: videoRecord.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
