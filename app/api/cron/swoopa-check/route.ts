import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch all SavedDeals that have Swoopa active
    const watches = await (prisma.savedDeal as any).findMany({
      where: {
        swoopaActive: true,
      },
      include: {
        deal: true,
      },
    });

    const now = new Date();
    let alertCount = 0;

    for (const watch of watches) {
      const { deal, targetPrice, lastAlertedAt, userId, dealId } = watch as any;

      // Ensure targetPrice has a value. If not, fallback to a 10% discount check from saved price.
      const thresholdPrice = targetPrice || (deal.originalPrice * 0.9);
      const isMatch = deal.currentPrice <= thresholdPrice;

      // Throttle alerts to once every 24 hours per watch
      const hasBeenAlertedRecently =
        lastAlertedAt &&
        now.getTime() - new Date(lastAlertedAt).getTime() < 24 * 60 * 60 * 1000;

      if (isMatch && !hasBeenAlertedRecently) {
        console.log(`[Swoopa] Match found for user ${userId} on deal "${deal.title}" ($${deal.currentPrice} <= $${thresholdPrice})`);

        // Trigger Novu push notification
        const novuApiKey = process.env.NOVU_API_KEY;
        if (novuApiKey) {
          let novuBackendUrl = process.env.NOVU_BACKEND_URL || 'https://api.novu.co/v1';
          novuBackendUrl = novuBackendUrl.replace(/\/$/, '');

          try {
            const triggerResponse = await fetch(`${novuBackendUrl}/events/trigger`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey ${novuApiKey}`,
              },
              body: JSON.stringify({
                name: 'swoopa-alert', // Workflow ID in Novu dashboard
                to: {
                  subscriberId: userId,
                },
                payload: {
                  title: 'Swoopa Deal Match! 🦅',
                  body: `${deal.title} has dropped to $${deal.currentPrice}! Click here to swoop this deal.`,
                  dealTitle: deal.title,
                  currentPrice: deal.currentPrice,
                  targetPrice: thresholdPrice,
                  discount: deal.discount,
                  dealId: dealId,
                },
              }),
            });

            if (!triggerResponse.ok) {
              const errText = await triggerResponse.text();
              console.error(`[Swoopa] Novu trigger failed: ${triggerResponse.status} - ${errText}`);
            } else {
              alertCount++;
            }
          } catch (err) {
            console.error('[Swoopa] Failed to contact Novu server:', err);
          }
        } else {
          console.warn('[Swoopa] NOVU_API_KEY not configured on server. Alert generated internally.');
          alertCount++;
        }

        // Update lastAlertedAt in the database
        await (prisma.savedDeal as any).update({
          where: {
            userId_dealId: {
              userId,
              dealId,
            },
          },
          data: {
            lastAlertedAt: now,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: watches.length,
      alertsSent: alertCount,
    });
  } catch (error: any) {
    console.error('[Swoopa] Error during cron scan:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
