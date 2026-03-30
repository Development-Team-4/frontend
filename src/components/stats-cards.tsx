'use client';

import { Card } from '@/components/ui/card';
import { useStatsCard } from '@/features/stats-card';

export function StatsCards() {
  const { stats } = useStatsCard();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4 p-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-card-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
