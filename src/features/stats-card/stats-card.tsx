import {
  useTicketCategoriesStatistics,
  useTicketStatusesStatistics,
} from '@/entities/statistics/model';
import { CheckCircle2, FolderOpen, Inbox, Loader2 } from 'lucide-react';

export const useStatsCard = () => {
  const { data: statusCounts, isLoading: isStatusesLoading } =
    useTicketStatusesStatistics();
  const { data: categoriesCounts, isLoading: isCategoriesLoading } =
    useTicketCategoriesStatistics();

  const stats = [
    {
      label: 'Новые тикеты',
      value: statusCounts?.OPEN || 0,
      icon: Inbox,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    },
    {
      label: 'В работе',
      value: (statusCounts?.ASSIGNED || 0) + (statusCounts?.IN_PROGRESS || 0),
      icon: Loader2,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
    },
    {
      label: 'Решенные',
      value: statusCounts?.RESOLVED || 0,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Категорий с тикетами',
      value: Object.keys(categoriesCounts || {}).length,
      icon: FolderOpen,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
  ];

  return {
    stats,
    isLoading: isStatusesLoading || isCategoriesLoading,
  };
};
