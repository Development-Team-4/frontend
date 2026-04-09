import { NotificationsChannels } from '@/widgets/notifications/notifications-channels';
import { ProfileSettings } from '@/widgets/profile/profile-settings';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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

      <div className="mb-4 sm:mb-6">
        <h2 className="mb-3 text-base font-medium text-foreground sm:mb-4 sm:text-lg">
          Тема
        </h2>
        <ThemeToggle />
      </div>

      <ProfileSettings />
      <NotificationsChannels />
    </div>
  );
}
