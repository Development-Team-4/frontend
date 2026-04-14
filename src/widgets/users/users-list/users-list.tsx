'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useCreateUserByAdmin,
  useUpdateUserRole,
  useUsers,
} from '@/entities/user/model/use-user';
import { getApiFieldErrors, normalizeApiError } from '@/shared/api/errors';
import { roleLabels, roleStyles } from '@/shared/consts';
import { UserRole } from '@/shared/types';
import { useStore } from '@/shared/store/store';
import { Loader2, Mail, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const USERS_PER_PAGE = 10;

export const UsersList = () => {
  const { isLoading } = useUsers();
  const users = useStore((state) => state.users);
  const [searchValue, setSearchValue] = useState('');
  const { mutateAsync: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUserByAdmin();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('USER');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => user.userRole === 'USER')
      .filter((user) => {
        if (!normalizedSearch) return true;

        return (
          user.userName.toLowerCase().includes(normalizedSearch) ||
          user.userEmail.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) =>
        a.userName.localeCompare(b.userName, 'ru', { sensitivity: 'base' }),
      );
  }, [normalizedSearch, users]);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, page]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const resetCreateForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserConfirmPassword('');
    setNewUserRole('USER');
    setFieldErrors({});
  };

  const handlePromoteToSupport = async (userId: string) => {
    try {
      const updatedUser = await updateUserRole({ userId, userRole: 'SUPPORT' });
      toast.success(`${updatedUser.userName} назначен агентом поддержки`);
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось изменить роль пользователя',
      );
      toast.error(apiError.message);
    }
  };

  const validateCreateUserForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const trimmedName = newUserName.trim();
    const trimmedEmail = newUserEmail.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Введите корректный email';
    }

    if (newUserPassword.length < 6) {
      nextErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (newUserPassword !== newUserConfirmPassword) {
      nextErrors.confirmPassword = 'Пароли не совпадают';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateCreateUserForm()) return;

    try {
      await createUser({
        userName: newUserName.trim(),
        userEmail: newUserEmail.trim(),
        userPassword: newUserPassword,
        userRole: newUserRole,
      });

      toast.success(
        newUserRole === 'SUPPORT'
          ? 'Пользователь создан и назначен агентом поддержки'
          : 'Пользователь успешно создан',
      );
      setIsCreateDialogOpen(false);
      resetCreateForm();
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось создать пользователя',
      );
      const mappedFieldErrors = getApiFieldErrors(apiError, {
        userName: 'name',
        userEmail: 'email',
        userPassword: 'password',
        confirmPassword: 'confirmPassword',
      });

      if (Object.keys(mappedFieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...mappedFieldErrors }));
      } else {
        toast.error(apiError.message);
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-medium text-foreground">
          Все пользователи системы
        </h2>

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              resetCreateForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto cursor-pointer">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Создать пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать пользователя</DialogTitle>
              <DialogDescription>
                Администратор может вручную создать нового пользователя.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div>
                <Label className="text-xs" htmlFor="admin-create-name">
                  Имя
                </Label>
                <Input
                  id="admin-create-name"
                  className="mt-1.5"
                  value={newUserName}
                  onChange={(event) => setNewUserName(event.target.value)}
                  placeholder="Иван Петров"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs" htmlFor="admin-create-email">
                  Email
                </Label>
                <Input
                  id="admin-create-email"
                  className="mt-1.5"
                  value={newUserEmail}
                  onChange={(event) => setNewUserEmail(event.target.value)}
                  placeholder="user@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs" htmlFor="admin-create-password">
                  Пароль
                </Label>
                <Input
                  id="admin-create-password"
                  type="password"
                  className="mt-1.5"
                  value={newUserPassword}
                  onChange={(event) => setNewUserPassword(event.target.value)}
                  placeholder="Минимум 6 символов"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <Label
                  className="text-xs"
                  htmlFor="admin-create-confirm-password"
                >
                  Подтверждение пароля
                </Label>
                <Input
                  id="admin-create-confirm-password"
                  type="password"
                  className="mt-1.5"
                  value={newUserConfirmPassword}
                  onChange={(event) =>
                    setNewUserConfirmPassword(event.target.value)
                  }
                  placeholder="Повторите пароль"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs">Роль</Label>
                <Select
                  value={newUserRole}
                  onValueChange={(value) => setNewUserRole(value as UserRole)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Пользователь</SelectItem>
                    <SelectItem value="SUPPORT">Агент поддержки</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleCreateUser}
                disabled={isCreatingUser}
                className="w-full sm:w-auto cursor-pointer"
              >
                {isCreatingUser ? 'Создание...' : 'Создать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-3">
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск пользователей по имени или email"
          className="h-9"
        />
      </div>
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
                paginatedUsers.map((user) => (
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isUpdatingRole}
                            className="cursor-pointer"
                          >
                            {isUpdatingRole ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              'Сделать поддержкой'
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Подтвердите изменение роли
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Перевести пользователя {user.userName} в агента
                              поддержки?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={isUpdatingRole}
                              className="cursor-pointer"
                            >
                              Отмена
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={isUpdatingRole}
                              className="cursor-pointer"
                              onClick={() =>
                                handlePromoteToSupport(user.userId)
                              }
                            >
                              Подтвердить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && filteredUsers.length === 0 && (
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
      {!isLoading && filteredUsers.length > USERS_PER_PAGE && (
        <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Страница {page} из {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              В начало
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={page === 1}
            >
              Назад
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setPage((currentPage) => Math.min(totalPages, currentPage + 1))
              }
              disabled={page === totalPages}
            >
              Вперед
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              В конец
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
