/**
 * Converts a base64 VAPID public key string to a Uint8Array.
 * This is required by the browser's PushManager subscription method.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    const code = rawData.charCodeAt(i);
    outputArray[i] = code;
  }
  return outputArray;
}

/**
 * Requests push notification permission and subscribes the user's browser PWA to Web Push.
 * Sends the subscription details to the backend API to register with Novu.
 * 
 * @returns {Promise<boolean>} True if subscription succeeded, false otherwise.
 */
export async function subscribeUserToPush(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Check support for Service Workers and PushManager
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported in this browser/device.');
    return false;
  }

  try {
    // 2. Wait for Service Worker to be ready
    const registration = await navigator.serviceWorker.ready;

    // 3. Check / request notification permission
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.warn('Notification permission was denied by the user.');
      return false;
    }

    // 4. Retrieve VAPID Public Key from environment variables
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error(
        'Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable. ' +
        'Please generate a VAPID key pair and add it to your .env.local file.'
      );
      return false;
    }

    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

    // 5. Subscribe to Push Manager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey as unknown as BufferSource,
    });

    // 6. Send the subscription payload to the backend
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to sync push subscription with backend.');
    }

    console.log('Successfully registered PWA Web Push notification with backend/Novu.');
    return true;
  } catch (error) {
    console.error('Error during web push subscription flow:', error);
    return false;
  }
}

/**
 * Unsubscribes the current user browser subscription from Web Push.
 * 
 * @returns {Promise<boolean>} True if unsubscribed successfully.
 */
export async function unsubscribeUserFromPush(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // 1. Tell backend to delete this subscription from Novu
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      }).catch(err => console.error('Failed to notify backend of unsubscription:', err));

      // 2. Unsubscribe browser
      const unsubscribed = await subscription.unsubscribe();
      return unsubscribed;
    }
    return true;
  } catch (error) {
    console.error('Error unsubscribing from web push:', error);
    return false;
  }
}
