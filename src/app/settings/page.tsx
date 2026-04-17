'use client';

import { NotificationsChannels } from '@/widgets/notifications/notifications-channels';
import { ProfileSettings } from '@/widgets/profile/profile-settings';
import { useStore } from '@/shared/store/store';

export default function SettingsPage() {
  const userRole = useStore((state) => state.userData?.userRole);

  return (
    <div className="mx-auto max-w-2xl px-3 py-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Настройки
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Профиль и каналы уведомлений
        </p>
      </div>

      <ProfileSettings />
      {userRole !== 'SUPPORT' && <NotificationsChannels />}
    </div>
  );
}
