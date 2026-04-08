'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { STATUS_COLORS, STATUS_LABELS } from '@/shared/consts';
import { TicketStatus } from '@/shared/types';
import {
  useTicketCategoriesStatistics,
  useTicketStatusesStatistics,
  useTicketTopicsStatistics,
} from '@/entities/statistics/model';
import { useTopics } from '@/entities/topic/model';
import { categoriesDataApi } from '@/entities/category/api';
import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

const TOPIC_COLORS = [
  'oklch(0.65 0.19 250)',
  'oklch(0.72 0.16 165)',
  'oklch(0.68 0.19 45)',
  'oklch(0.62 0.2 20)',
  'oklch(0.7 0.16 300)',
];

const STATUS_ORDER: TicketStatus[] = [
  'OPEN',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export function TicketCharts() {
  const { data: topics = [], isLoading: isTopicsLoading } = useTopics();
  const { data: topicStats = {}, isLoading: isTopicStatsLoading } =
    useTicketTopicsStatistics();
  const { data: categoryStats = {}, isLoading: isCategoryStatsLoading } =
    useTicketCategoriesStatistics();
  const { data: statusStats, isLoading: isStatusStatsLoading } =
    useTicketStatusesStatistics();

  const categoriesQueries = useQueries({
    queries: topics.map((topic) => ({
      queryKey: ['topic-categories', topic.id],
      queryFn: () => categoriesDataApi.getCategoriesDataByTopicId(topic.id),
      enabled: Boolean(topic.id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const categoriesById = useMemo(() => {
    const map = new Map<string, string>();

    categoriesQueries.forEach((query) => {
      (query.data ?? []).forEach((category) => {
        map.set(category.id, category.name);
      });
    });

    return map;
  }, [categoriesQueries]);

  const statusData = STATUS_ORDER.map((status) => ({
    name: STATUS_LABELS[status],
    value: statusStats?.[status] || 0,
    fill: STATUS_COLORS[status],
  }));

  const categoryData = Object.entries(categoryStats)
    .map(([categoryId, value]) => ({
      name: categoriesById.get(categoryId) || categoryId,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const topicData = Object.entries(topicStats)
    .map(([topicId, value], index) => ({
      name: topics.find((topic) => topic.id === topicId)?.name || topicId,
      value,
      fill: TOPIC_COLORS[index % TOPIC_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const isLoading =
    isTopicsLoading ||
    isTopicStatsLoading ||
    isCategoryStatsLoading ||
    isStatusStatsLoading;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-medium text-card-foreground">
          По статусу
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.17 0.005 260)',
                  border: '1px solid oklch(0.27 0.01 260)',
                  borderRadius: '6px',
                  color: 'oklch(0.95 0 0)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-[10px] text-muted-foreground">
                {item.name} ({isLoading ? '...' : item.value})
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-sm font-medium text-card-foreground">
          По категориям
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: 'oklch(0.62 0.01 260)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar
                dataKey="value"
                fill="oklch(0.65 0.19 250)"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.17 0.005 260)',
                  border: '1px solid oklch(0.27 0.01 260)',
                  borderRadius: '6px',
                  color: 'oklch(0.95 0 0)',
                  fontSize: '12px',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-sm font-medium text-card-foreground">
          По темам
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.17 0.005 260)',
                  border: '1px solid oklch(0.27 0.01 260)',
                  borderRadius: '6px',
                  color: 'oklch(0.95 0 0)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {topicData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-[10px] text-muted-foreground">
                {item.name} ({isLoading ? '...' : item.value})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
