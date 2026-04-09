import { StaffList } from '@/widgets/staff/staff-list';
import { UsersList } from '@/widgets/users/users-list';

export default function StaffPage() {
  return (
    <div className="px-3 py-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
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
