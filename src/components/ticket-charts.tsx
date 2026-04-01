'use client';

import { getCategoryById, getTopicById } from '@/shared/lib/mock-data';
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
import { STATUS_COLORS, STATUS_LABELS, tickets } from '@/shared/consts';
import { TicketStatus } from '@/shared/types';

export function TicketCharts() {
  const statusData = Object.entries(
    tickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      {} as Record<TicketStatus, number>,
    ),
  ).map(([name, value]) => ({
    name: STATUS_LABELS[name as TicketStatus] || name,
    value,
    fill: STATUS_COLORS[name as TicketStatus],
  }));

  const categoryData = Object.entries(
    tickets.reduce(
      (acc, t) => {
        const category = getCategoryById(t.categoryId);
        const name = category?.name || 'Без категории';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }));

  const topicData = Object.entries(
    tickets.reduce(
      (acc, t) => {
        const category = getCategoryById(t.categoryId);
        const topic = category ? getTopicById(category.topicId) : null;
        const name = topic?.name || 'Без темы';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value], index) => ({
    name,
    value,
    fill: [
      'oklch(0.65 0.19 250)',
      'oklch(0.72 0.16 165)',
      'oklch(0.68 0.19 45)',
    ][index % 3],
  }));

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
                {item.name} ({item.value})
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
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
