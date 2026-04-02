import { NotificationsChannels } from '@/widgets/notifications/notifications-channels';
import { ProfileSettings } from '@/widgets/profile/profile-settings';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and notification preferences
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Theme</h2>
        <ThemeToggle />
      </div>

      <ProfileSettings />
      <NotificationsChannels />
    </div>
  );
}
