import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownContent } from '@/components/ui/markdown-content';
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  useAssignStaffToCategory,
  useCheckStaffAssignments,
  useRemoveStaffFromCategory,
} from '@/entities/category/model';
import { roleLabels, roleStyles } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { User } from '@/shared/types';
import { Edit2, Loader2, Mail } from 'lucide-react';

export const StaffItem = ({
  user,
  isCategoriesLoading,
}: {
  user: User;
  isCategoriesLoading: boolean;
}) => {
  const categories = useStore((state) => state.categories);
  const getCategoryById = useStore((state) => state.getCategoryById);
  const { mutateAsync: assignStaffToCategory, isPending: isAssigning } =
    useAssignStaffToCategory();
  const { mutateAsync: removeStaffFromCategory, isPending: isRemoving } =
    useRemoveStaffFromCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<
    'assign' | 'remove' | null
  >(null);

  const userCategoryIds = user.categoryIds || [];
  const assignedCategoryIdsFromCategories = categories
    .filter(
      (category) =>
        Array.isArray(category.assignedStaff) &&
        category.assignedStaff.includes(user.userId),
    )
    .map((category) => category.id);

  const assignedCategoryIds = new Set([
    ...userCategoryIds,
    ...assignedCategoryIdsFromCategories,
  ]);

  const { assignmentByCategoryId } = useCheckStaffAssignments({
    staffId: user.userId,
    categoryIds: categories.map((category) => category.id),
    enabled: user.userRole !== 'ADMIN' && categories.length > 0,
  });

  const isAssignedToCategory = (categoryId: string) =>
    assignmentByCategoryId[categoryId] ?? assignedCategoryIds.has(categoryId);

  const checkedAssignedCategoryIds = new Set(
    categories
      .filter((category) => isAssignedToCategory(category.id))
      .map((category) => category.id),
  );

  const userCategories =
    categories.length > 0
      ? categories.filter((category) =>
          checkedAssignedCategoryIds.has(category.id),
        )
      : userCategoryIds.map((id) => getCategoryById(id)).filter(Boolean);

  const handleAssignCategory = async (categoryId: string) => {
    if (isAssignedToCategory(categoryId)) return;

    setPendingCategoryId(categoryId);
    setPendingAction('assign');

    try {
      await assignStaffToCategory({
        categoryId,
        payload: { staffId: user.userId },
      });
    } finally {
      setPendingCategoryId(null);
      setPendingAction(null);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (!isAssignedToCategory(categoryId)) return;

    setPendingCategoryId(categoryId);
    setPendingAction('remove');

    try {
      await removeStaffFromCategory({
        categoryId,
        staffId: user.userId,
      });
    } finally {
      setPendingCategoryId(null);
      setPendingAction(null);
    }
  };

  return (
    <TableRow key={user.userId}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
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
        <Badge className={`border-0 text-[10px] ${roleStyles[user.userRole]}`}>
          {roleLabels[user.userRole]}
        </Badge>
      </TableCell>

      <TableCell>
        {user.userRole === 'ADMIN' ? (
          <span className="text-xs italic text-muted-foreground">
            Полный доступ
          </span>
        ) : userCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {userCategories.map((category) => (
              <Badge
                key={category!.id}
                variant="outline"
                className="text-[10px]"
              >
                {category!.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground">
            Не назначены
          </span>
        )}
      </TableCell>

      <TableCell>
        {user.userRole !== 'ADMIN' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Edit2 className="h-3.5 w-3.5" />
                Назначить
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Назначение категорий</DialogTitle>
                <DialogDescription>
                  Назначьте или удалите доступ к категориям для {user.userName}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Уже назначено
                  </p>
                  {userCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {userCategories.map((category) => (
                        <Badge key={category!.id} variant="secondary">
                          {category!.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Пока нет назначенных категорий
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Категории
                  </p>

                  {isCategoriesLoading ? (
                    <p className="text-sm text-muted-foreground">
                      Загружаем категории...
                    </p>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Нет доступных категорий
                    </p>
                  ) : (
                    <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
                      {categories.map((category) => {
                        const checkedAssignment =
                          assignmentByCategoryId[category.id];
                        const isAssigned = isAssignedToCategory(category.id);
                        const isCheckingAssignment =
                          isDialogOpen && checkedAssignment === null;
                        const isCurrentPending =
                          pendingCategoryId === category.id;

                        return (
                          <div
                            key={category.id}
                            className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-card-foreground">
                                {category.name}
                              </p>
                              {category.description && (
                                <MarkdownContent
                                  content={category.description}
                                  className="line-clamp-2 text-xs text-muted-foreground"
                                />
                              )}
                            </div>

                            <div className="flex w-full gap-2 sm:w-auto">
                              <Button
                                type="button"
                                size="sm"
                                className="flex-1 sm:flex-none"
                                onClick={() =>
                                  handleAssignCategory(category.id)
                                }
                                disabled={
                                  isAssigned ||
                                  isCheckingAssignment ||
                                  isAssigning ||
                                  isRemoving
                                }
                              >
                                {isCurrentPending &&
                                pendingAction === 'assign' ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isCheckingAssignment ? (
                                  '...'
                                ) : isAssigned ? (
                                  'Назначен'
                                ) : (
                                  'Назначить'
                                )}
                              </Button>

                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="flex-1 sm:flex-none"
                                onClick={() =>
                                  handleRemoveCategory(category.id)
                                }
                                disabled={
                                  !isAssigned ||
                                  isCheckingAssignment ||
                                  isAssigning ||
                                  isRemoving
                                }
                              >
                                {isCurrentPending &&
                                pendingAction === 'remove' ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isCheckingAssignment ? (
                                  '...'
                                ) : (
                                  'Удалить'
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Готово
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  );
};
