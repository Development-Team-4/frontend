'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useUpdateUserRole, useUsers } from '@/entities/user/model/use-user';
import { roleLabels, roleStyles } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { Loader2, Mail } from 'lucide-react';

export const UsersList = () => {
  const { isLoading } = useUsers();
  const users = useStore((state) => state.users);
  const regularUsers = users.filter((u) => u.userRole === 'USER');
  const { mutateAsync: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();

  const handlePromoteToSupport = async (userId: string) => {
    await updateUserRole({ userId, userRole: 'SUPPORT' });
  };

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-medium text-foreground">
        Все пользователи системы
      </h2>
      <Card>
        <p className="px-4 pt-3 text-[11px] text-muted-foreground md:hidden">
          Проведите влево/вправо, чтобы посмотреть всю таблицу
        </p>
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead className="w-[190px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, id) => (
                  <TableRow key={`users-skeleton-${id}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-36" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                regularUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                          {user.userName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-sm font-medium text-card-foreground">
                          {user.userName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 text-[10px] ${roleStyles[user.userRole]}`}
                      >
                        {roleLabels[user.userRole]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isUpdatingRole}
                        onClick={() => handlePromoteToSupport(user.userId)}
                      >
                        {isUpdatingRole ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Сделать поддержкой'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && regularUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-28 text-center text-sm text-muted-foreground"
                  >
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
