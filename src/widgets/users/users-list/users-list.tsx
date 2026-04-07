'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { roleLabels, roleStyles } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { Mail } from 'lucide-react';

export const UsersList = () => {
  const users = useStore((state) => state.users);
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-medium text-foreground">
        Все пользователи системы
      </h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Пользователь</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((u) => u.userRole === 'USER')
              .map((user) => (
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
