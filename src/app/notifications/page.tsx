import { NotificationInfo } from '@/widgets/notifications/notification-info';
import { NotificationList } from '@/widgets/notifications/notifications-list';

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <NotificationInfo />
      <NotificationList />
    </div>
  );
}
