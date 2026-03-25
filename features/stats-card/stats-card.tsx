import { useStore } from '@/shared/store/store';
import { CheckCircle2, FolderOpen, Inbox, Loader2 } from 'lucide-react';

export const useStatsCard = () => {
  const tickets = useStore((state) => state.tickets);
  const categories = useStore((state) => state.categories);
  const statusCounts = tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = [
    {
      label: 'Новые тикеты',
      value: statusCounts['CREATED'] || 0,
      icon: Inbox,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    },
    {
      label: 'В работе',
      value: statusCounts['IN_WORK'] || 0,
      icon: Loader2,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
    },
    {
      label: 'Решённые',
      value: statusCounts['RESOLVED'] || 0,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Категорий',
      value: categories.length,
      icon: FolderOpen,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
  ];
  return {
    stats,
  };
};
