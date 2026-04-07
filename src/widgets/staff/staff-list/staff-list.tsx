'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStaffList } from '@/features/staff-list/use-staff-list';
import { useUsers } from '@/entities/user/model/use-user';
import { StaffItem } from '../staff-item';

export const StaffList = () => {
  useUsers();
  const { supportStaff } = useStaffList();
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Сотрудник</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Категории</TableHead>
            <TableHead className="w-[80px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportStaff.map((user, id) => (
            <StaffItem key={id} user={user} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
