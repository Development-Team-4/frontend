import { RecentTickets } from '@/components/recent-tickets';
import { StatsCards } from '@/components/stats-cards';
import { TicketCharts } from '@/components/ticket-charts';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Панель управления
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Обзор системы управления тикетами
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <StatsCards />
        <TicketCharts />
        <RecentTickets />
      </div>
    </div>
  );
}
