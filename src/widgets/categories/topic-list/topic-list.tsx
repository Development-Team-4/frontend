'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useTopicsList } from '@/features/topics-list/use-topics-list';
import { Edit2, FolderTree } from 'lucide-react';
import { CategoryItem } from '../category-item';

export const TopicList = () => {
  const {
    topics,
    isTopicsLoading,
    getCategoriesByTopicId,
    isTopicCategoriesLoading,
    isEditTopicOpen,
    setIsEditTopicOpen,
    editingTopicName,
    setEditingTopicName,
    editingTopicDescription,
    setEditingTopicDescription,
    isUpdatingTopic,
    canUpdateTopic,
    openEditTopic,
    handleUpdateTopic,
  } = useTopicsList();

  if (isTopicsLoading) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center text-sm text-muted-foreground">
        Загрузка тем...
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center">
        <p className="text-sm font-medium text-card-foreground">
          Темы пока не созданы
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Добавьте первую тему в блоке настроек выше
        </p>
      </div>
    );
  }

  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={topics.map((topic) => topic.id)}
        className="w-full rounded-lg border border-border bg-card px-3 sm:px-4"
      >
        {topics.map((topic) => {
          const topicCategories = getCategoriesByTopicId(topic.id);

          return (
            <AccordionItem key={topic.id} value={topic.id}>
              <div className="flex items-start gap-2">
                <AccordionTrigger className="min-w-0 flex-1 py-3 hover:no-underline">
                  <div className="flex w-full min-w-0 items-start gap-2 sm:gap-3">
                    <FolderTree className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1 text-left">
                      <span className="block truncate font-medium">
                        {topic.name}
                      </span>
                      {topic.description && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {topic.description}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {isTopicCategoriesLoading(topic.id)
                        ? '...'
                        : topicCategories.length}{' '}
                      категорий
                    </Badge>
                  </div>
                </AccordionTrigger>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 w-7 shrink-0 p-0"
                  onClick={() => openEditTopic(topic)}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <AccordionContent>
                <div className="flex flex-col gap-2 pb-2 pl-0 pt-1 sm:pl-7 sm:pt-2">
                  {isTopicCategoriesLoading(topic.id) ? (
                    <p className="py-3 text-sm text-muted-foreground">
                      Загрузка категорий...
                    </p>
                  ) : topicCategories.length === 0 ? (
                    <p className="py-3 text-sm text-muted-foreground">
                      В этой теме пока нет категорий
                    </p>
                  ) : (
                    topicCategories.map((category) => (
                      <CategoryItem key={category.id} category={category} />
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={isEditTopicOpen} onOpenChange={setIsEditTopicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать тему</DialogTitle>
            <DialogDescription>
              Обновите название и описание темы.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="editTopicName" className="text-xs">
                Название темы
              </Label>
              <Input
                id="editTopicName"
                value={editingTopicName}
                onChange={(e) => setEditingTopicName(e.target.value)}
                placeholder="Например: Техническая поддержка"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="editTopicDescription" className="text-xs">
                Описание темы
              </Label>
              <Input
                id="editTopicDescription"
                value={editingTopicDescription}
                onChange={(e) => setEditingTopicDescription(e.target.value)}
                placeholder="Кратко опишите, для каких обращений эта тема"
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleUpdateTopic}
              disabled={!canUpdateTopic}
              className="w-full sm:w-auto"
            >
              {isUpdatingTopic ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
