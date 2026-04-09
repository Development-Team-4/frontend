import { SupportTicketsContent } from '@/widgets/tickets/ticket-support';

export default function SupportTicketsPage() {
  return (
    <div className="px-3 py-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Тикеты моих категорий
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Тикеты в категориях, к которым вы назначены
        </p>
      </div>

      <SupportTicketsContent />
    </div>
  );
}
