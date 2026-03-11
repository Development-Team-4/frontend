import { NotificationInfo } from '@/widgets/notification-info';
import { NotificationList } from '@/widgets/notifications-list';

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <NotificationInfo />
      <NotificationList />
    </div>
  );
}
