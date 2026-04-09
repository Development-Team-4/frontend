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

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    payload?: { name?: string; value?: number | string };
  }>;
  label?: string;
};

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const first = payload[0];
  const name = first.payload?.name || first.name || label || 'Без названия';
  const rawValue = first.value ?? first.payload?.value ?? 0;
  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue) || 0;

  return (
    <div className="rounded-md border border-border/70 bg-popover px-2.5 py-2 shadow-sm">
      <p className="max-w-48 break-words text-xs font-medium text-popover-foreground">
        {name}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Тикетов:{' '}
        <span className="font-semibold text-popover-foreground">{value}</span>
      </p>
    </div>
  );
};

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
  const categoryNonZeroData = categoryData.filter((item) => item.value > 0);

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

  const hasStatusData = statusData.some((item) => item.value > 0);
  const hasCategoryData = categoryData.some((item) => item.value > 0);
  const hasTopicData = topicData.some((item) => item.value > 0);
  const hasAnyStats = hasStatusData || hasCategoryData || hasTopicData;
  const statusNonZeroCount = statusData.filter((item) => item.value > 0).length;
  const topicNonZeroCount = topicData.filter((item) => item.value > 0).length;
  const categoryChartHeight = Math.max(
    64,
    Math.min(192, categoryNonZeroData.length * 30 + 12),
  );
  const categoryBarSize =
    categoryNonZeroData.length <= 2
      ? 26
      : categoryNonZeroData.length <= 4
        ? 18
        : 14;

  if (!isLoading && !hasAnyStats) {
    return (
      <Card className="p-6">
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-center">
          <p className="text-sm font-medium text-card-foreground">
            Пока нет данных для графиков
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Статистика появится, когда в системе будут тикеты
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <h3 className="mb-1 text-sm font-medium text-card-foreground">
          По статусу
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Распределение тикетов по текущим статусам
        </p>
        <div className="h-48">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Загрузка...
            </div>
          ) : !hasStatusData ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border/70 text-xs text-muted-foreground">
              Нет данных по статусам
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={statusNonZeroCount > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
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
        <h3 className="mb-1 text-sm font-medium text-card-foreground">
          По категориям
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Категории с наибольшим числом тикетов
        </p>
        <div style={{ height: categoryChartHeight }}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Загрузка...
            </div>
          ) : !hasCategoryData ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border/70 text-xs text-muted-foreground">
              Нет данных по категориям
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryNonZeroData}
                layout="vertical"
                barCategoryGap="18%"
              >
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
                  barSize={categoryBarSize}
                />
                <Tooltip content={<ChartTooltip />} cursor={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-1 text-sm font-medium text-card-foreground">
          По темам
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Структура тикетов по тематическим разделам
        </p>
        <div className="h-48">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Загрузка...
            </div>
          ) : !hasTopicData ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border/70 text-xs text-muted-foreground">
              Нет данных по темам
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={topicNonZeroCount > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
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
