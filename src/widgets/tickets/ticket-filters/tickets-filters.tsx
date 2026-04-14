'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownContent } from '@/components/ui/markdown-content';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTicketsFilter } from '@/features/tickets-filter';
import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';

export const TicketsFilters = () => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    topicFilter,
    setTopicFilter,
    categoryFilter,
    setCategoryFilter,
    filteredCategories,
    hasFilters,
    topics,
    clearFilters,
  } = useTicketsFilter();

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-12">
        <div className="relative xl:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск тикетов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background pl-9"
          />
        </div>

        <div className="xl:col-span-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="OPEN">Открыт</SelectItem>
              <SelectItem value="ASSIGNED">Назначен</SelectItem>
              <SelectItem value="IN_PROGRESS">В процессе</SelectItem>
              <SelectItem value="RESOLVED">Решён</SelectItem>
              <SelectItem value="CLOSED">Закрыт</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="xl:col-span-3">
          <Select
            value={topicFilter}
            onValueChange={(value) => {
              setTopicFilter(value);
              setCategoryFilter('all');
            }}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Тема" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все темы</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  <div className="flex flex-col">
                    <span>{topic.name}</span>
                    {topic.description && (
                      <MarkdownContent
                        content={topic.description}
                        className="text-xs text-muted-foreground"
                      />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="xl:col-span-3">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            disabled={topicFilter === 'all'}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue
                placeholder={
                  topicFilter === 'all' ? 'Сначала выберите тему' : 'Категория'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row xl:col-span-12 xl:justify-end">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full text-muted-foreground hover:text-foreground sm:w-auto cursor-pointer"
            >
              <X className="mr-1 h-3 w-3" />
              Сбросить
            </Button>
          )}

          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/tickets/new">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Новый тикет
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
