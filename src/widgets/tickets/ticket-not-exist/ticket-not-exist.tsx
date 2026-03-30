import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const TicketNotExist = ({ ticketId }: { ticketId: string }) => {
  const router = useRouter();
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">Тикет не найден</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Тикет {ticketId} не существует.
        </p>
        <Button className="mt-4" onClick={() => router.push('/tickets')}>
          Назад к тикетам
        </Button>
      </div>
    </div>
  );
};
