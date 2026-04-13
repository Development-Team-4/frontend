'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useUsers } from '@/entities/user/model/use-user';
import { categoriesDataApi } from '@/entities/category/api';
import { useStaffList } from '@/features/staff-list/use-staff-list';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { StaffItem } from '../staff-item';

const STAFF_PER_PAGE = 10;

export const StaffList = () => {
  const { isLoading } = useUsers();
  const { supportStaff, categories, isCategoriesLoading } = useStaffList();
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const normalizedSearch = searchValue.trim().toLowerCase();
  const supportOnly = useMemo(
    () => supportStaff.filter((user) => user.userRole === 'SUPPORT'),
    [supportStaff],
  );

  const assignmentQueries = useQueries({
    queries:
      categoryFilter === 'all'
        ? []
        : supportOnly.map((user) => ({
            queryKey: ['category-staff-check', categoryFilter, user.userId],
            queryFn: () =>
              categoriesDataApi.checkStaffCategoryAssignment(
                categoryFilter,
                user.userId,
              ),
            enabled: Boolean(categoryFilter) && categoryFilter !== 'all',
            staleTime: 60 * 1000,
          })),
  });

  const assignedSupportByCategory = useMemo(() => {
    if (categoryFilter === 'all') {
      return new Set<string>();
    }

    const assignedIds = new Set<string>();

    supportOnly.forEach((user, index) => {
      const checked = assignmentQueries[index]?.data?.assigned;

      if (checked === true) {
        assignedIds.add(user.userId);
      }
    });

    return assignedIds;
  }, [assignmentQueries, categoryFilter, supportOnly]);

  const isAssignmentChecksLoading = assignmentQueries.some(
    (query) => query.isLoading || query.isFetching,
  );

  const filteredSupportStaff = useMemo(
    () =>
      supportStaff.filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.userName.toLowerCase().includes(normalizedSearch) ||
          user.userEmail.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          categoryFilter === 'all'
            ? true
            : user.userRole === 'SUPPORT' &&
              assignedSupportByCategory.has(user.userId);

        return matchesSearch && matchesCategory;
      }),
    [assignedSupportByCategory, categoryFilter, normalizedSearch, supportStaff],
  );
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSupportStaff.length / STAFF_PER_PAGE),
  );
  const paginatedSupportStaff = useMemo(() => {
    const start = (page - 1) * STAFF_PER_PAGE;
    return filteredSupportStaff.slice(start, start + STAFF_PER_PAGE);
  }, [filteredSupportStaff, page]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchValue, categoryFilter]);

  return (
    <Card>
      <div className="grid grid-cols-1 gap-2 px-4 pt-4 sm:grid-cols-2">
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск сотрудников поддержки по имени или email"
          className="h-9"
        />
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          disabled={categories.length === 0}
        >
          <SelectTrigger className="h-9">
            <SelectValue
              placeholder={
                categories.length === 0
                  ? 'Нет категорий'
                  : 'Фильтр по категории'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="px-4 pt-3 text-[11px] text-muted-foreground md:hidden">
        Проведите влево/вправо, чтобы посмотреть всю таблицу
      </p>
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
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
              paginatedSupportStaff.map((user) => (
                <StaffItem
                  key={user.userId}
                  user={user}
                  isCategoriesLoading={isCategoriesLoading}
                />
              ))}

            {!isLoading && filteredSupportStaff.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  {categoryFilter !== 'all' && isAssignmentChecksLoading
                    ? 'Проверяем назначения сотрудников...'
                    : searchValue || categoryFilter !== 'all'
                      ? 'Сотрудники не найдены по вашему запросу'
                      : 'Сотрудники поддержки пока не добавлены'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && filteredSupportStaff.length > STAFF_PER_PAGE && (
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
    </Card>
  );
};
