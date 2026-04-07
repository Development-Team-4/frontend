'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    assigneeFilter,
    setAssigneeFilter,
    supportStaff,
    hasFilters,
    topics,
    clearFilters,
  } = useTicketsFilter();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск тикетов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="CREATED">Создан</SelectItem>
          <SelectItem value="IN_WORK">В работе</SelectItem>
          <SelectItem value="RESOLVED">Решён</SelectItem>
          <SelectItem value="CLOSED">Закрыт</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={topicFilter}
        onValueChange={(v) => {
          setTopicFilter(v);
          setCategoryFilter('all');
        }}
      >
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue placeholder="Тема" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все темы</SelectItem>
          {topics.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={categoryFilter}
        onValueChange={setCategoryFilter}
        disabled={topicFilter === 'all'}
      >
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue
            placeholder={
              topicFilter === 'all' ? 'Сначала выберите тему' : 'Категория'
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все категории</SelectItem>
          {filteredCategories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
        <SelectTrigger className="w-[160px] bg-card">
          <SelectValue placeholder="Исполнитель" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все исполнители</SelectItem>
          <SelectItem value="unassigned">Без исполнителя</SelectItem>
          {supportStaff.map((a) => (
            <SelectItem key={a.userId} value={a.userId}>
              {a.userName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Сбросить
        </Button>
      )}
      <div className="ml-auto">
        <Button asChild size="sm">
          <Link href="/tickets/new">
            <Plus className="mr-1 h-3.5 w-3.5" />
            Новый тикет
          </Link>
        </Button>
      </div>
    </div>
  );
};
