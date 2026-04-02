import { SupportTicketsContent } from '@/widgets/tickets/ticket-support';

export default function SupportTicketsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
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
