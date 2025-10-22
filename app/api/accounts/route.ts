import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chromeProfileManager } from '@/lib/chrome-profiles';

export async function GET(request: NextRequest) {
  try {
    // Demo mode
    const userId = 'demo-user';

    const accounts = await prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, accountName } = body;

    if (!platform || !accountName) {
      return NextResponse.json(
        { error: 'Platform and account name are required' },
        { status: 400 }
      );
    }

    // Demo mode
    const userId = 'demo-user';

    // Create Chrome profile for this account
    const accountId = `${userId}-${platform}-${Date.now()}`;
    const profilePath = await chromeProfileManager.createProfile(accountId);

    const account = await prisma.socialAccount.create({
      data: {
        userId,
        platform,
        accountName,
        chromeProfile: profilePath,
        isActive: true,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
