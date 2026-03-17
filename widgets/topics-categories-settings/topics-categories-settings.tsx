import { Button } from '@/components/ui/button';
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
import { useTopicsCategoriesSettings } from '@/features/topics-categories-settings';
import { Plus } from 'lucide-react';

export const TopicsCategoriesSettings = () => {
  const {
    newTopicName,
    setNewTopicName,
    newCategoryName,
    setNewCategoryName,
    selectedTopicForCategory,
    setSelectedTopicForCategory,
    topics,
  } = useTopicsCategoriesSettings();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Темы и категории
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление структурой тем и категорий тикетов
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Новая тема
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать тему</DialogTitle>
              <DialogDescription>
                Темы - это верхний уровень структуры. Категории создаются внутри
                тем.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="topicName" className="text-xs">
                Название темы
              </Label>
              <Input
                id="topicName"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Например: Техническая поддержка"
                className="mt-1.5"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!newTopicName.trim()}>
                Создать тему
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Новая категория
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать категорию</DialogTitle>
              <DialogDescription>
                Категории создаются внутри тем. Сотрудники назначаются на
                категории.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div>
                <Label className="text-xs">Тема</Label>
                <Select
                  value={selectedTopicForCategory}
                  onValueChange={setSelectedTopicForCategory}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoryName" className="text-xs">
                  Название категории
                </Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Например: Ошибки и баги"
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!newCategoryName.trim() || !selectedTopicForCategory}
              >
                Создать категорию
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
