import { StaffList } from '@/widgets/staff/staff-list';
import { UsersList } from '@/widgets/users/users-list';

export default function StaffPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Сотрудники поддержки
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление сотрудниками и их назначениями на категории
        </p>
      </div>

      <StaffList />
      <UsersList />
    </div>
  );
}
