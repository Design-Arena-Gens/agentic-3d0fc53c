import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiVideoGenerator } from '@/lib/video-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, duration } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Demo mode: Create a mock user
    const userId = 'demo-user';

    // Generate video (in demo, this returns a placeholder URL)
    const videoUrl = await aiVideoGenerator.generateVideo({
      prompt,
      style,
      duration,
    });

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId,
        fileName: `ai-generated-${Date.now()}.mp4`,
        filePath: videoUrl,
        fileSize: 0,
        status: 'processing',
        aiGenerated: true,
        prompt,
      },
    });

    // In production, you would:
    // 1. Queue the video generation job
    // 2. Process it asynchronously
    // 3. Update the video status when complete
    // 4. Notify the user

    return NextResponse.json({
      success: true,
      videoId: video.id,
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
