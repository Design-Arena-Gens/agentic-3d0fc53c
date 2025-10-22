import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoScheduler } from '@/lib/scheduler';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isActive } = body;

    const schedule = await prisma.schedule.update({
      where: { id: params.id },
      data: { isActive },
    });

    // Update scheduler job
    if (isActive) {
      await videoScheduler.updateJob(schedule);
    } else {
      await videoScheduler.removeJob(params.id);
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.schedule.delete({
      where: { id: params.id },
    });

    // Remove scheduler job
    await videoScheduler.removeJob(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
