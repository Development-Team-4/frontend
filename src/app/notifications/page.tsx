import { NotificationInfo } from '@/widgets/notifications/notification-info';
import { NotificationList } from '@/widgets/notifications/notifications-list';

export default function NotificationsPage() {
  return (
    <div className="px-3 py-3 sm:p-4 lg:p-6">
      <NotificationInfo />
      <NotificationList />
    </div>
  );
}
