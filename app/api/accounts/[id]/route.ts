import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chromeProfileManager } from '@/lib/chrome-profiles';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isActive } = body;

    const account = await prisma.socialAccount.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.socialAccount.findUnique({
      where: { id: params.id },
    });

    if (account) {
      // Delete Chrome profile
      await chromeProfileManager.deleteProfile(params.id);

      // Delete account
      await prisma.socialAccount.delete({
        where: { id: params.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
