import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoScheduler } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    // Demo mode
    const userId = 'demo-user';

    const schedules = await prisma.schedule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, frequency, time, aiPrompt, platforms } = body;

    if (!name || !frequency || !time || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Demo mode
    const userId = 'demo-user';

    const schedule = await prisma.schedule.create({
      data: {
        userId,
        name,
        frequency,
        time,
        aiPrompt: aiPrompt || null,
        platforms: JSON.stringify(platforms),
        isActive: true,
      },
    });

    // Create scheduler job
    await videoScheduler.createJob(schedule);

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
