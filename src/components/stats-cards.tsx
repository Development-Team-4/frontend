'use client';

import { Card } from '@/components/ui/card';
import { useStatsCard } from '@/features/stats-card';

export function StatsCards() {
  const { stats, isLoading } = useStatsCard();
  const hasAnyValue = stats.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4 p-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-card-foreground">
              {isLoading ? '...' : stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}

      {!isLoading && !hasAnyValue && (
        <Card className="col-span-2 border-dashed p-4 lg:col-span-4">
          <p className="text-sm text-muted-foreground">
            Статистика пока пустая. Карточки начнут заполняться после появления
            тикетов.
          </p>
        </Card>
      )}
    </div>
  );
}
