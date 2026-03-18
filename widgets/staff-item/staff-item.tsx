import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { User } from '@/entities/user/types';
import { useStaffList } from '@/features/staff-list';
import { roleLabels, roleStyles } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { Edit2, Mail } from 'lucide-react';

export const StaffItem = ({ user }: { user: User }) => {
  const getCategoryById = useStore((state) => state.getCategoryById);

  const userCategories = (user.categoryIds || [])
    .map((id) => getCategoryById(id))
    .filter(Boolean);
  const {
    selectedUser,
    selectedCategories,
    handleEditCategories,
    toggleCategory,
    categories,
  } = useStaffList();
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <span className="text-sm font-medium text-card-foreground">
            {user.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          {user.email}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`border-0 text-[10px] ${roleStyles[user.role]}`}>
          {roleLabels[user.role]}
        </Badge>
      </TableCell>
      <TableCell>
        {user.role === 'ADMIN' ? (
          <span className="text-xs text-muted-foreground italic">
            Полный доступ
          </span>
        ) : userCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {userCategories.map((cat) => (
              <Badge key={cat!.id} variant="outline" className="text-[10px]">
                {cat!.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Не назначены
          </span>
        )}
      </TableCell>
      <TableCell>
        {user.role !== 'ADMIN' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handleEditCategories(user)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Назначить категории</DialogTitle>
                <DialogDescription>
                  Выберите категории для сотрудника {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex flex-col gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  );
};
