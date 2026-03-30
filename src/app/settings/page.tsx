import { NotificationsChannels } from '@/widgets/notifications/notifications-channels';
import { ProfileSettings } from '@/widgets/profile/profile-settings';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and notification preferences
        </p>
      </div>

      <ProfileSettings />
      <NotificationsChannels />
    </div>
  );
}
