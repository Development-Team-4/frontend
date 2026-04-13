'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
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
import { Edit2, FolderTree, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CategoryItem } from '../category-item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TopicListProps = {
  readOnly?: boolean;
};

const TOPICS_PER_PAGE = 10;

export const TopicList = ({ readOnly = false }: TopicListProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [topicsFilter, setTopicsFilter] = useState<
    'all' | 'with-categories' | 'without-categories'
  >('all');
  const [page, setPage] = useState(1);

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

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const topicCategories = getCategoriesByTopicId(topic.id);
      const hasCategories = topicCategories.length > 0;

      const topicText =
        `${topic.name} ${topic.description || ''}`.toLowerCase();
      const categoriesText = topicCategories
        .map((category) => `${category.name} ${category.description || ''}`)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        topicText.includes(normalizedSearch) ||
        categoriesText.includes(normalizedSearch);

      const matchesFilter =
        topicsFilter === 'all' ||
        (topicsFilter === 'with-categories' && hasCategories) ||
        (topicsFilter === 'without-categories' && !hasCategories);

      return matchesSearch && matchesFilter;
    });
  }, [getCategoriesByTopicId, normalizedSearch, topics, topicsFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTopics.length / TOPICS_PER_PAGE),
  );
  const paginatedTopics = useMemo(() => {
    const start = (page - 1) * TOPICS_PER_PAGE;
    return filteredTopics.slice(start, start + TOPICS_PER_PAGE);
  }, [filteredTopics, page]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchValue, topicsFilter]);

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
          {readOnly
            ? 'Список тем появится здесь, как только их создаст администратор'
            : 'Добавьте первую тему в блоке настроек выше'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Поиск по темам и категориям..."
            className="pl-8 pr-8"
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchValue('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <Select
          value={topicsFilter}
          onValueChange={(value) =>
            setTopicsFilter(
              value as 'all' | 'with-categories' | 'without-categories',
            )
          }
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Фильтр тем" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все темы</SelectItem>
            <SelectItem value="with-categories">
              Только с категориями
            </SelectItem>
            <SelectItem value="without-categories">Без категорий</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-2 text-xs text-muted-foreground">
        Найдено: {filteredTopics.length} из {topics.length}
      </p>

      {filteredTopics.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center">
          <p className="text-sm font-medium text-card-foreground">
            Ничего не найдено
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Попробуйте изменить строку поиска или фильтр
          </p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={paginatedTopics.map((topic) => topic.id)}
          className="w-full rounded-lg border border-border bg-card px-3 sm:px-4"
        >
          {paginatedTopics.map((topic) => {
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
                          <MarkdownContent
                            content={topic.description}
                            className="mt-0.5 block text-xs text-muted-foreground"
                          />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px]"
                      >
                        {isTopicCategoriesLoading(topic.id)
                          ? '...'
                          : topicCategories.length}{' '}
                        категорий
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 w-7 shrink-0 p-0"
                      onClick={() => openEditTopic(topic)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
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
                        <CategoryItem
                          key={category.id}
                          category={category}
                          readOnly={readOnly}
                        />
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {filteredTopics.length > TOPICS_PER_PAGE && (
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

      {!readOnly && (
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
                <MarkdownEditor
                  id="editTopicDescription"
                  value={editingTopicDescription}
                  onChange={setEditingTopicDescription}
                  placeholder="Кратко опишите, для каких обращений эта тема"
                  heightClassName="h-[120px]"
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
      )}
    </>
  );
};
