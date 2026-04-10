import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateCategory } from '@/entities/category/model';
import { Category } from '@/shared/types';
import { Edit2 } from 'lucide-react';

export const CategoryItem = ({ category }: { category: Category }) => {
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategory();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');

  const canSave =
    name.trim().length > 0 &&
    (name.trim() !== category.name ||
      description.trim() !== (category.description || '')) &&
    !isUpdatingCategory;

  const handleOpen = (open: boolean) => {
    setIsEditOpen(open);
    if (open) {
      setName(category.name);
      setDescription(category.description || '');
    }
  };

  const handleSave = async () => {
    if (!canSave) return;

    await updateCategory({
      id: category.id,
      payload: {
        topicId: category.topicId,
        name: name.trim(),
        description: description.trim() || undefined,
      },
    });

    setIsEditOpen(false);
  };

  return (
    <>
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
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleOpen(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={handleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать категорию</DialogTitle>
            <DialogDescription>
              Измените название и описание категории.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label
                htmlFor={`category-name-${category.id}`}
                className="text-xs"
              >
                Название категории
              </Label>
              <Input
                id={`category-name-${category.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Ошибки и баги"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label
                htmlFor={`category-description-${category.id}`}
                className="text-xs"
              >
                Описание категории
              </Label>
              <Input
                id={`category-description-${category.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите, какие тикеты относятся к этой категории"
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSave} disabled={!canSave}>
              {isUpdatingCategory ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
