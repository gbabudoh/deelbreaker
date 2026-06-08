import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const novuApiKey = process.env.NOVU_API_KEY;
    let novuBackendUrl = process.env.NOVU_BACKEND_URL || 'https://api.novu.co/v1';

    if (!novuApiKey) {
      return NextResponse.json({ success: true }); // Graceful exit if not configured
    }

    novuBackendUrl = novuBackendUrl.replace(/\/$/, '');
    const endpoint = `${novuBackendUrl}/subscribers/${encodeURIComponent(userId)}/credentials`;

    // Setting deviceTokens to empty array clears the active push devices for this provider
    const novuResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${novuApiKey}`,
      },
      body: JSON.stringify({
        providerId: 'fcm',
        credentials: {
          deviceTokens: [],
        },
      }),
    });

    if (!novuResponse.ok) {
      const errorText = await novuResponse.text();
      console.warn(`Novu unsubscribe credentials clear failed: ${novuResponse.status} - ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in notifications unsubscribe API route:', error);
    return NextResponse.json({ success: true }); // Return success to avoid frontend breaking
  }
}
