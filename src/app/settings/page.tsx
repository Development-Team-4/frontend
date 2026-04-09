import { NotificationsChannels } from '@/widgets/notifications/notifications-channels';
import { ProfileSettings } from '@/widgets/profile/profile-settings';

export default function SettingsPage() {
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
      <NotificationsChannels />
    </div>
  );
}
