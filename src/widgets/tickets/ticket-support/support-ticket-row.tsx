'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryById } from '@/entities/category/model';
import {
  useAssignTicketAssignee,
  useUpdateTicketStatus,
} from '@/entities/ticket/model';
import { useUserById } from '@/entities/user/model/use-user';
import { normalizeApiError } from '@/shared/api/errors';
import { statusLabels, statusStyles } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { Ticket } from '@/shared/types';
import { User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface SupportTicketRowProps {
  ticket: Ticket;
}

export const SupportTicketRow = ({ ticket }: SupportTicketRowProps) => {
  const { data: category } = useCategoryById(ticket.categoryId);
  const userData = useStore((state) => state.userData);
  const { mutateAsync: assignTicket, isPending: isAssigning } =
    useAssignTicketAssignee();
  const { mutateAsync: updateTicketStatus, isPending: isUpdatingStatus } =
    useUpdateTicketStatus();
  const { data: createdByUser } = useUserById(ticket.createdBy.userId || null);
  const { data: assigneeUser } = useUserById(ticket.assignee?.userId || null);

  const createdByName =
    createdByUser?.userName ||
    ticket.createdBy.userName ||
    ticket.createdBy.userId;
  const assigneeName =
    assigneeUser?.userName ||
    ticket.assignee?.userName ||
    ticket.assignee?.userId;

  const canTake = !ticket.assignee && ticket.status === 'OPEN';

  const handleTakeTicket = async () => {
    if (!userData?.userId) return;
    try {
      await assignTicket({ ticketId: ticket.id, assigneeId: userData.userId });
      await updateTicketStatus({ ticketId: ticket.id, status: 'ASSIGNED' });
      toast.success('Тикет взят в работу');
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось взять тикет в работу',
      );
      toast.error(apiError.message);
    }
  };

  return (
    <TableRow className="group">
      <TableCell className="font-mono text-xs text-muted-foreground">
        <Link href={`/tickets/${ticket.id}`} className="hover:text-primary">
          {ticket.id}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-sm text-card-foreground group-hover:text-primary transition-colors"
        >
          {ticket.subject}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          className={`border-0 text-[10px] ${statusStyles[ticket.status]}`}
        >
          {statusLabels[ticket.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {category?.name || '—'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {createdByName}
        </div>
      </TableCell>
      <TableCell className="text-xs">
        {assigneeName ? (
          <span className="text-card-foreground">{assigneeName}</span>
        ) : (
          <span className="text-muted-foreground italic">Не назначен</span>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(ticket.updatedAt), {
          addSuffix: true,
          locale: ru,
        })}
      </TableCell>
      <TableCell>
        {canTake && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={isAssigning || isUpdatingStatus || !userData?.userId}
              >
                {isAssigning || isUpdatingStatus
                  ? 'Назначение...'
                  : 'Взять в работу'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Взять тикет в работу?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы будете назначены исполнителем, а статус тикета изменится на
                  «Назначен».
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  disabled={isAssigning || isUpdatingStatus}
                >
                  Отмена
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleTakeTicket}
                  disabled={isAssigning || isUpdatingStatus}
                >
                  Подтвердить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
};
