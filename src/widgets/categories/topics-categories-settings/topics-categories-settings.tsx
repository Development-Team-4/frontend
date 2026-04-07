'use client';
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
    newTopicDescription,
    setNewTopicDescription,
    newCategoryName,
    setNewCategoryName,
    newCategoryDescription,
    setNewCategoryDescription,
    selectedTopicForCategory,
    setSelectedTopicForCategory,
    topics,
    isCreateTopicOpen,
    setIsCreateTopicOpen,
    isCreatingTopic,
    canCreateTopic,
    handleCreateTopic,
    isCreateCategoryOpen,
    setIsCreateCategoryOpen,
    isCreatingCategory,
    canCreateCategory,
    handleCreateCategory,
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
        <Dialog open={isCreateTopicOpen} onOpenChange={setIsCreateTopicOpen}>
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

              <Label htmlFor="topicDescription" className="mt-4 block text-xs">
                Описание темы
              </Label>
              <Input
                id="topicDescription"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                placeholder="Кратко опишите, для каких обращений эта тема"
                className="mt-1.5"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleCreateTopic}
                disabled={!canCreateTopic}
              >
                {isCreatingTopic ? 'Создание...' : 'Создать тему'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCreateCategoryOpen}
          onOpenChange={setIsCreateCategoryOpen}
        >
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
                        <div className="flex flex-col">
                          <span>{topic.name}</span>
                          {topic.description && (
                            <span className="text-xs text-muted-foreground">
                              {topic.description}
                            </span>
                          )}
                        </div>
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
              <div>
                <Label htmlFor="categoryDescription" className="text-xs">
                  Описание категории
                </Label>
                <Input
                  id="categoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Опишите, какие тикеты относятся к этой категории"
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={!canCreateCategory}
              >
                {isCreatingCategory ? 'Создание...' : 'Создать категорию'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
