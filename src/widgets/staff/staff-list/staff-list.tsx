'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStaffList } from '@/features/staff-list/use-staff-list';
import { useUsers } from '@/entities/user/model/use-user';
import { StaffItem } from '../staff-item';

export const StaffList = () => {
  const { isLoading } = useUsers();
  const { supportStaff, isCategoriesLoading } = useStaffList();
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
          {isLoading &&
            Array.from({ length: 4 }).map((_, id) => (
              <TableRow key={`staff-skeleton-${id}`}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading &&
            supportStaff.map((user) => (
              <StaffItem
                key={user.userId}
                user={user}
                isCategoriesLoading={isCategoriesLoading}
              />
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};
