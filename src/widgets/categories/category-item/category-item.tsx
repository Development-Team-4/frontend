import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStore } from '@/shared/store/store';
import { Category } from '@/shared/types';
import { Edit2, Trash2, Users } from 'lucide-react';

export const CategoryItem = ({ category }: { category: Category }) => {
  const getStaffForCategory = useStore((state) => state.getStaffForCategory);
  const staff = getStaffForCategory(category.id);
  return (
    <Card key={category.id} className="p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-card-foreground">
              {category.name}
            </span>
          </div>
          {category.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {category.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              Сотрудники:{' '}
              {staff.length > 0
                ? staff.map((s) => s.userName).join(', ')
                : 'Не назначены'}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
