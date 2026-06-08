import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { subscription } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: 'Missing push subscription object' },
        { status: 400 }
      );
    }

    // 2. Retrieve Novu keys from environment variables
    const novuApiKey = process.env.NOVU_API_KEY;
    let novuBackendUrl = process.env.NOVU_BACKEND_URL || 'https://api.novu.co/v1';

    if (!novuApiKey) {
      console.warn('NOVU_API_KEY is not configured on the server. Skipping Novu sync.');
      return NextResponse.json(
        { error: 'Novu notifications are not configured on this server' },
        { status: 503 }
      );
    }

    // Normalize URL
    // If NEXT_PUBLIC_NOVU_BACKEND_URL or NOVU_BACKEND_URL ends with '/api' (e.g. self-hosted / cloud), make sure it has /v1 if required,
    // but typically standard is ${backendUrl}/subscribers/{subscriberId}/credentials.
    // Let's strip trailing slash if any
    novuBackendUrl = novuBackendUrl.replace(/\/$/, '');

    // Novu credentials update endpoint: PUT /v1/subscribers/{subscriberId}/credentials
    const endpoint = `${novuBackendUrl}/subscribers/${encodeURIComponent(userId)}/credentials`;

    console.log(`Syncing push credentials for user ${userId} to Novu endpoint: ${endpoint}`);

    // Novu expects:
    // {
    //   "providerId": "fcm", // or other webpush provider
    //   "credentials": {
    //     "deviceTokens": ["token_or_subscription_json"]
    //   }
    // }
    // Passing the subscription object stringified is standard for web push integrations.
    const novuResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${novuApiKey}`,
      },
      body: JSON.stringify({
        providerId: 'fcm', // Default push provider (FCM or webpush provider)
        credentials: {
          deviceTokens: [JSON.stringify(subscription)],
        },
      }),
    });

    if (!novuResponse.ok) {
      const errorText = await novuResponse.text();
      console.error(`Novu credentials sync failed: ${novuResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to update credentials in Novu API' },
        { status: novuResponse.status }
      );
    }

    console.log(`Successfully synced push credentials to Novu for subscriber: ${userId}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in notifications subscribe API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
