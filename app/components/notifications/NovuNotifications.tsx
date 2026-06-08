'use client';

import { useSession } from 'next-auth/react';
import { Inbox } from '@novu/react';
import { Bell } from 'lucide-react';

interface NovuNotificationsProps {
  variant?: 'header-desktop' | 'header-mobile' | 'dashboard-desktop' | 'dashboard-mobile';
}

export default function NovuNotifications({ variant = 'header-desktop' }: NovuNotificationsProps) {
  const { data: session, status } = useSession();

  // If not logged in, don't show the notification bell at all (except on dashboard where they are always logged in)
  if (status !== 'loading' && !session?.user?.id) {
    return null;
  }

  // Fallback to placeholder if environment variable is not yet loaded in current dev server process
  const appIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_IDENTIFIER || 'your_app_identifier';
  const backendUrl = process.env.NEXT_PUBLIC_NOVU_BACKEND_URL;
  const socketUrl = process.env.NEXT_PUBLIC_NOVU_SOCKET_URL;

  // Class names for different variants
  let buttonClass = "";
  let iconClass = "w-5 h-5";
  let showDot = false;

  if (variant === 'header-desktop') {
    buttonClass = "relative flex items-center p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 cursor-pointer";
    iconClass = "w-5 h-5";
  } else if (variant === 'header-mobile') {
    buttonClass = "p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors rounded-full hover:bg-gray-100 cursor-pointer";
    iconClass = "w-5 h-5";
  } else if (variant === 'dashboard-mobile') {
    buttonClass = "cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors relative touch-active rounded-full hover:bg-gray-100";
    iconClass = "w-5 h-5";
    showDot = true;
  } else if (variant === 'dashboard-desktop') {
    buttonClass = "cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors touch-active text-white flex items-center justify-center";
    iconClass = "w-5 h-5 text-white";
  }

  // If loading session, render skeleton loader matching the style
  if (status === 'loading') {
    return (
      <div className={`${buttonClass} animate-pulse`}>
        <Bell className={`${iconClass} text-gray-300`} />
      </div>
    );
  }

  const userId = session?.user?.id || '';

  return (
    <div className="relative flex items-center justify-center">
      <Inbox
        applicationIdentifier={appIdentifier}
        subscriber={userId}
        backendUrl={backendUrl || undefined}
        socketUrl={socketUrl || undefined}
        renderBell={(unread) => (
          <button className={buttonClass} title="Notifications">
            <Bell className={iconClass} />
            {(showDot || (unread && unread.total > 0)) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        )}
      />
    </div>
  );
}
