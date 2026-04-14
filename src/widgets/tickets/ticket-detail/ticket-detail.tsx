'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Clock,
  User,
  MessageSquare,
  Send,
  ChevronRight,
  Trash2,
  Edit3,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
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
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { useCategoryById } from '@/entities/category/model';
import { useUserById, useUsers } from '@/entities/user/model/use-user';
import {
  useAssignTicketAssignee,
  useDeleteTicket,
  useUpdateTicket,
  useUpdateTicketStatus,
} from '@/entities/ticket/model';
import { useTopics } from '@/entities/topic/model';
import {
  useCreateTicketComment,
  useTicketComments,
} from '@/entities/comment/model';

import { useStore } from '@/shared/store/store';
import { statusLabels, statusStyles } from '@/shared/consts';
import { TicketStatus } from '@/shared/types';
import { normalizeApiError } from '@/shared/api/errors';
import { cn } from '@/shared/lib/utils';

import { useTicketDetail } from '@/features/ticket-detail';
import { LoadingOverlay } from '@/components/loading-overlay';
import { TicketNotExist } from '../ticket-not-exist';

type TransitionAction = {
  to: TicketStatus;
  label: string;
};

const COMMENTS_PER_PAGE = 5;
const ASSIGNEE_VISIBLE_LIMIT = 200;

const STATUS_TRANSITIONS: Record<TicketStatus, TransitionAction[]> = {
  OPEN: [
    { to: 'ASSIGNED', label: 'Начать обработку' },
    { to: 'CLOSED', label: 'Закрыть без обработки' },
  ],
  ASSIGNED: [
    { to: 'IN_PROGRESS', label: 'Взять в активную работу' },
    { to: 'CLOSED', label: 'Прекратить работу и закрыть' },
  ],
  IN_PROGRESS: [
    { to: 'RESOLVED', label: 'Отметить как решённый' },
    { to: 'ASSIGNED', label: 'Вернуть в назначенные' },
  ],
  RESOLVED: [
    { to: 'CLOSED', label: 'Подтвердить решение и закрыть' },
    { to: 'ASSIGNED', label: 'Вернуть на доработку' },
  ],
  CLOSED: [],
};

const getStatusLabel = (status: string) =>
  statusLabels[status as TicketStatus] ?? status;

const getStatusStyle = (status: string) =>
  statusStyles[status as TicketStatus] ?? 'bg-muted text-muted-foreground';

export function TicketDetail() {
  const router = useRouter();
  useTopics();
  useUsers();

  const userData = useStore((state) => state.userData);
  const topics = useStore((state) => state.topics);
  const getStaffForCategory = useStore((state) => state.getStaffForCategory);
  const users = useStore((state) => state.users);

  const { ticketId, data: ticket, isLoading } = useTicketDetail();
  const { data: ticketComments = [], isLoading: isCommentsLoading } =
    useTicketComments(ticketId || null);
  const { mutateAsync: createComment, isPending: isSendingComment } =
    useCreateTicketComment(ticketId || null);
  const { mutateAsync: updateTicketStatus, isPending: isUpdatingStatus } =
    useUpdateTicketStatus();
  const { mutateAsync: assignTicketAssignee, isPending: isAssigningAssignee } =
    useAssignTicketAssignee();
  const { mutateAsync: updateTicket, isPending: isUpdatingTicket } =
    useUpdateTicket();
  const { mutateAsync: deleteTicket, isPending: isDeletingTicket } =
    useDeleteTicket();

  const [newComment, setNewComment] = useState('');
  const [statusValue, setStatusValue] = useState<TicketStatus>('OPEN');
  const [assigneeValue, setAssigneeValue] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  const { data: category } = useCategoryById(ticket?.categoryId || null);
  const { data: createdByUser } = useUserById(ticket?.createdBy.userId || null);
  const { data: assigneeUser } = useUserById(ticket?.assignee?.userId || null);

  const topic = useMemo(
    () =>
      category ? topics.find((item) => item.id === category.topicId) : null,
    [category, topics],
  );

  const categoryStaff = ticket ? getStaffForCategory(ticket.categoryId) : [];
  const createdByName = createdByUser?.userName || ticket?.createdBy.userName;
  const assigneeName = assigneeUser?.userName || ticket?.assignee?.userName;
  const currentAssigneeId = ticket?.assignee?.userId || '';

  useEffect(() => {
    if (!ticket) return;
    setStatusValue(ticket.status);
    setAssigneeValue(ticket.assignee?.userId || '');
    setEditSubject(ticket.subject);
    setEditDescription(ticket.description);
  }, [ticket]);

  const currentUserId = userData?.userId;
  const currentUserRole = userData?.userRole;

  const isOwner = ticket?.createdBy.userId === currentUserId;
  const isAssignee = ticket?.assignee?.userId === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';
  const isSupport = currentUserRole === 'SUPPORT';
  const isUser = currentUserRole === 'USER';
  const allSupportUsers = useMemo(
    () => users.filter((user) => user.userRole === 'SUPPORT'),
    [users],
  );
  const assignableStaff = useMemo(() => {
    if (isAdmin) return allSupportUsers;
    return categoryStaff.filter((user) => user.userRole === 'SUPPORT');
  }, [allSupportUsers, categoryStaff, isAdmin]);
  const sortedAssignableStaff = useMemo(
    () =>
      [...assignableStaff].sort((a, b) =>
        a.userName.localeCompare(b.userName, 'ru', { sensitivity: 'base' }),
      ),
    [assignableStaff],
  );
  const filteredAssignableStaff = useMemo(() => {
    const normalizedSearch = assigneeSearch.trim().toLowerCase();
    if (!normalizedSearch) return sortedAssignableStaff;

    return sortedAssignableStaff.filter((staff) =>
      staff.userName.toLowerCase().includes(normalizedSearch),
    );
  }, [assigneeSearch, sortedAssignableStaff]);
  const visibleAssignableStaff = useMemo(
    () => filteredAssignableStaff.slice(0, ASSIGNEE_VISIBLE_LIMIT),
    [filteredAssignableStaff],
  );
  const hasAssigneeOverflow =
    filteredAssignableStaff.length > ASSIGNEE_VISIBLE_LIMIT;
  const isSupportAssignedToCategory = Boolean(
    currentUserId &&
    ticket &&
    (category?.assignedStaff?.includes(currentUserId) ||
      userData?.categoryIds?.includes(ticket.categoryId)),
  );

  const canEdit = Boolean(
    ticket &&
    ticket.status !== 'CLOSED' &&
    (isAdmin || (isSupport && isAssignee) || (isUser && isOwner)),
  );
  const canDelete = Boolean(
    ticket &&
    ((isAdmin && ticket.status === 'OPEN') ||
      (isSupport && ticket.status === 'OPEN' && isSupportAssignedToCategory) ||
      (isUser && isOwner && ticket.status === 'OPEN')),
  );
  const canChangeStatus = isAssignee || isAdmin;
  const canAssign = Boolean(
    ticket &&
    (isAdmin || (isSupport && !ticket.assignee && isSupportAssignedToCategory)),
  );
  const canComment = isOwner || isAssignee || isAdmin;
  const canSendComment =
    canComment && ticket?.status !== 'CLOSED' && Boolean(newComment.trim());
  const selectedAssigneeName = assignableStaff.find(
    (staff) => staff.userId === assigneeValue,
  )?.userName;

  const allowedNextStatuses =
    canChangeStatus && ticket ? (STATUS_TRANSITIONS[statusValue] ?? []) : [];
  const totalCommentsPages = Math.max(
    1,
    Math.ceil(ticketComments.length / COMMENTS_PER_PAGE),
  );
  const paginatedComments = useMemo(() => {
    const start = (commentsPage - 1) * COMMENTS_PER_PAGE;
    return ticketComments.slice(start, start + COMMENTS_PER_PAGE);
  }, [commentsPage, ticketComments]);

  const scrollCommentsToBottom = () => {
    commentsEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  useEffect(() => {
    setCommentsPage((currentPage) => Math.min(currentPage, totalCommentsPages));
  }, [totalCommentsPages]);

  const handleSendComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    try {
      await createComment(content);
      setNewComment('');
      const nextPage = Math.max(
        1,
        Math.ceil((ticketComments.length + 1) / COMMENTS_PER_PAGE),
      );
      setCommentsPage(nextPage);
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollCommentsToBottom);
      });
      toast.success('Комментарий отправлен');
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось отправить комментарий',
      );
      toast.error(apiError.message);
    }
  };

  const handleCommentKeyDown = async (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();

    if (!canSendComment || isSendingComment) return;
    await handleSendComment();
  };

  const handleStatusChange = async (nextStatus: TicketStatus) => {
    if (!ticket || nextStatus === statusValue) return;
    try {
      await updateTicketStatus({ ticketId: ticket.id, status: nextStatus });
      setStatusValue(nextStatus);
      toast.success(`Статус обновлен: ${getStatusLabel(nextStatus)}`);
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось обновить статус тикета',
      );
      toast.error(apiError.message);
    }
  };

  const handleAssignAssignee = async () => {
    if (!ticket || !canAssign || !assigneeValue) return;
    if (assigneeValue === currentAssigneeId) return;

    try {
      await assignTicketAssignee({
        ticketId: ticket.id,
        assigneeId: assigneeValue,
      });

      if (ticket.status !== 'ASSIGNED') {
        await updateTicketStatus({ ticketId: ticket.id, status: 'ASSIGNED' });
        setStatusValue('ASSIGNED');
      }

      toast.success(
        selectedAssigneeName
          ? `Исполнитель назначен: ${selectedAssigneeName}`
          : 'Исполнитель назначен',
      );
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось назначить сотрудника',
      );
      toast.error(apiError.message);
    }
  };

  const handleTakeInWork = async () => {
    if (!ticket || !currentUserId || !canAssign) return;

    try {
      await assignTicketAssignee({
        ticketId: ticket.id,
        assigneeId: currentUserId,
      });
      setAssigneeValue(currentUserId);

      if (ticket.status !== 'ASSIGNED') {
        await updateTicketStatus({ ticketId: ticket.id, status: 'ASSIGNED' });
        setStatusValue('ASSIGNED');
      }

      toast.success('Тикет взят в работу');
    } catch (error) {
      const apiError = normalizeApiError(
        error,
        'Не удалось взять тикет в работу',
      );
      toast.error(apiError.message);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket || !canDelete) return;
    try {
      await deleteTicket({ ticketId: ticket.id });
      toast.success('Тикет удален');

      if (currentUserRole === 'SUPPORT') {
        router.push('/support/tickets');
        return;
      }

      router.push('/tickets');
    } catch (error) {
      const apiError = normalizeApiError(error, 'Не удалось удалить тикет');
      toast.error(apiError.message);
    }
  };

  const canSaveTicketChanges = Boolean(
    editSubject.trim() && editDescription.trim() && !isUpdatingTicket,
  );

  const handleUpdateTicket = async () => {
    if (!ticket || !canEdit) return;

    try {
      await updateTicket({
        ticketId: ticket.id,
        subject: editSubject.trim(),
        description: editDescription.trim(),
      });

      setIsEditDialogOpen(false);
      toast.success('Тикет обновлен');
    } catch (error) {
      const apiError = normalizeApiError(error, 'Не удалось обновить тикет');
      toast.error(apiError.message);
    }
  };

  if (isLoading) return <LoadingOverlay />;
  if (!ticket) return <TicketNotExist ticketId={ticketId} />;

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/tickets"
            className="hover:text-foreground transition-colors"
          >
            Тикеты
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{ticket.id}</span>
        </div>

        <div className="mb-5 sm:mb-6">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="mt-0.5 shrink-0"
              onClick={() => router.push('/tickets')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="break-all font-mono text-xs text-muted-foreground">
                  {ticket.id}
                </span>
                <Badge
                  className={`border-0 text-[10px] ${getStatusStyle(ticket.status)}`}
                >
                  {getStatusLabel(ticket.status)}
                </Badge>
                {category && (
                  <Badge variant="outline" className="text-[10px]">
                    {category.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-balance text-lg font-semibold text-foreground sm:text-xl">
                {ticket.subject}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="break-words">{createdByName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(ticket.createdAt), 'd MMM yyyy, HH:mm', {
                    locale: ru,
                  })}
                </div>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex flex-wrap justify-end gap-2">
                {canEdit && (
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm cursor-pointer"
                      >
                        <Edit3 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        Редактировать
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Редактирование тикета</DialogTitle>
                        <DialogDescription>
                          Можно изменить только тему и описание тикета.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">
                            Тема
                          </label>
                          <Input
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            placeholder="Введите тему"
                            disabled={isUpdatingTicket}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">
                            Описание
                          </label>
                          <MarkdownEditor
                            id="ticket-edit-description"
                            value={editDescription}
                            onChange={setEditDescription}
                            placeholder="Введите описание в Markdown"
                            heightClassName="h-[180px]"
                            disabled={isUpdatingTicket}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          disabled={isUpdatingTicket}
                          className="cursor-pointer"
                        >
                          Отмена
                        </Button>
                        <Button
                          type="button"
                          onClick={handleUpdateTicket}
                          disabled={!canSaveTicketChanges}
                          className="cursor-pointer"
                        >
                          {isUpdatingTicket ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 sm:h-9 sm:px-3 sm:text-sm cursor-pointer"
                        disabled={isDeletingTicket}
                      >
                        <Trash2 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="cursor-pointer">
                          Удалить тикет?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие необратимо. Тикет и связанные комментарии
                          будут удалены без возможности восстановления.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isDeletingTicket}
                          className="cursor-pointer"
                        >
                          Отмена
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteTicket}
                          disabled={isDeletingTicket}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                          {isDeletingTicket ? 'Удаление...' : 'Удалить тикет'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </div>

        <Card className="mb-6 p-4">
          <MarkdownContent
            content={ticket.description}
            className="text-sm leading-relaxed text-card-foreground"
          />
        </Card>

        <Tabs defaultValue="comments" className="w-full">
          <TabsList>
            <TabsTrigger value="comments" className="gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Комментарии ({ticketComments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="mt-4">
            <div className="flex flex-col gap-3">
              {isCommentsLoading && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Загрузка комментариев...
                </p>
              )}

              {!isCommentsLoading && ticketComments.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Комментариев пока нет
                </p>
              )}

              {paginatedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary">
                        {comment.author.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-xs font-medium text-card-foreground">
                        {comment.author.userName}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {comment.author.userRole === 'ADMIN'
                          ? 'Админ'
                          : comment.author.userRole === 'SUPPORT'
                            ? 'Поддержка'
                            : 'Пользователь'}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <MarkdownContent
                    content={comment.content}
                    className="text-sm leading-relaxed text-card-foreground"
                  />
                </div>
              ))}

              {!isCommentsLoading &&
                ticketComments.length > COMMENTS_PER_PAGE && (
                  <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      Страница {commentsPage} из {totalCommentsPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setCommentsPage(1)}
                        disabled={commentsPage === 1}
                      >
                        В начало
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCommentsPage((page) => Math.max(1, page - 1))
                        }
                        disabled={commentsPage === 1}
                      >
                        Назад
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCommentsPage((page) =>
                            Math.min(totalCommentsPages, page + 1),
                          )
                        }
                        disabled={commentsPage === totalCommentsPages}
                      >
                        Вперед
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setCommentsPage(totalCommentsPages)}
                        disabled={commentsPage === totalCommentsPages}
                      >
                        В конец
                      </Button>
                    </div>
                  </div>
                )}

              {canComment && ticket.status !== 'CLOSED' && (
                <div className="mt-2">
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="mt-2">
                      <Textarea
                        placeholder="Написать комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleCommentKeyDown}
                        className="h-[110px] bg-card"
                        disabled={isSendingComment}
                      />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-2">
                      <div className="h-[110px] overflow-y-auto rounded-md border border-input bg-card p-3">
                        <MarkdownContent
                          content={newComment}
                          className="text-sm leading-relaxed text-card-foreground"
                          emptyText='Пока пусто. Начните писать комментарий во вкладке "Editor".'
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSendComment}
                      disabled={!canSendComment || isSendingComment}
                      className="cursor-pointer"
                    >
                      <Send className="mr-1 h-3.5 w-3.5" />
                      {isSendingComment ? 'Отправка...' : 'Отправить'}
                    </Button>
                  </div>
                </div>
              )}

              {ticket.status === 'CLOSED' && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Тикет закрыт. Комментарии недоступны.
                </p>
              )}

              <div ref={commentsEndRef} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full border-t border-border bg-card p-3 sm:p-4 lg:w-80 lg:border-l lg:border-t-0 lg:p-6">
        <h3 className="mb-4 text-sm font-medium text-card-foreground">
          Детали
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Статус
            </label>
            {canChangeStatus ? (
              <div className="space-y-2 rounded-md border border-border bg-background p-2">
                <Badge
                  className={`border-0 text-[10px] ${getStatusStyle(statusValue)}`}
                >
                  {getStatusLabel(statusValue)}
                </Badge>

                <div className="rounded-md border border-dashed border-border/70 bg-muted/20 p-2">
                  <p className="mb-2 text-[11px] text-muted-foreground">
                    Доступные переходы для текущего статуса
                  </p>

                  {allowedNextStatuses.length > 0 ? (
                    <div className="grid gap-1.5">
                      {allowedNextStatuses.map((transition) => (
                        <div
                          key={transition.to}
                          className="flex flex-col gap-2 rounded-md border border-border bg-background px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium leading-tight break-words text-card-foreground">
                              {transition.label}
                            </p>
                            <p className="text-[11px] leading-tight break-words text-muted-foreground">
                              {getStatusLabel(statusValue)}
                              {' -> '}
                              {getStatusLabel(transition.to)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 w-full text-xs sm:w-auto sm:shrink-0 cursor-pointer"
                            onClick={() => handleStatusChange(transition.to)}
                            disabled={isUpdatingStatus}
                          >
                            {isUpdatingStatus ? 'Обновление...' : 'Применить'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Для текущего статуса переходы недоступны
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-border bg-background px-3 py-2">
                <Badge
                  className={`border-0 text-[10px] ${getStatusStyle(ticket.status)}`}
                >
                  {getStatusLabel(ticket.status)}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Тема / Категория
            </label>
            <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="break-words">
                  {topic?.name || 'Без темы'} /{' '}
                  {category?.name || 'Без категории'}
                </span>
                {topic?.description && (
                  <MarkdownContent
                    content={topic.description}
                    className="text-xs text-muted-foreground"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Исполнитель
            </label>
            {canAssign ? (
              <>
                <Popover
                  open={isAssigneePopoverOpen}
                  onOpenChange={setIsAssigneePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isAssigneePopoverOpen}
                      className="w-full justify-between bg-background font-normal"
                      disabled={assignableStaff.length === 0}
                    >
                      <span className="truncate text-left">
                        {selectedAssigneeName || 'Не назначен'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Поиск по имени сотрудника..."
                        value={assigneeSearch}
                        onValueChange={setAssigneeSearch}
                      />
                      <CommandList className="max-h-[280px]">
                        <CommandEmpty>
                          {assignableStaff.length === 0
                            ? 'Нет доступных сотрудников'
                            : 'Сотрудник не найден'}
                        </CommandEmpty>
                        {visibleAssignableStaff.map((staff) => (
                          <CommandItem
                            key={staff.userId}
                            value={staff.userName}
                            onSelect={() => {
                              setAssigneeValue(staff.userId);
                              setIsAssigneePopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                assigneeValue === staff.userId
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="truncate">{staff.userName}</span>
                          </CommandItem>
                        ))}
                      </CommandList>
                      {hasAssigneeOverflow && (
                        <p className="border-t px-3 py-2 text-[11px] text-muted-foreground">
                          Показаны первые {ASSIGNEE_VISIBLE_LIMIT} сотрудников.
                          Уточните поиск.
                        </p>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full text-xs cursor-pointer"
                        disabled={
                          !assigneeValue ||
                          assigneeValue === currentAssigneeId ||
                          isAssigningAssignee ||
                          isUpdatingStatus ||
                          ticket.status === 'CLOSED'
                        }
                      >
                        {isAssigningAssignee || isUpdatingStatus
                          ? 'Назначение...'
                          : 'Назначить исполнителя'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Подтвердите назначение
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Назначить сотрудника{' '}
                          {selectedAssigneeName || 'без имени'} исполнителем
                          этого тикета?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="cursor-pointer"
                          disabled={isAssigningAssignee || isUpdatingStatus}
                        >
                          Отмена
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAssignAssignee}
                          disabled={isAssigningAssignee || isUpdatingStatus}
                          className="cursor-pointer"
                        >
                          Подтвердить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {isSupport && !ticket.assignee && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full text-xs"
                        disabled={
                          isAssigningAssignee ||
                          isUpdatingStatus ||
                          ticket.status === 'CLOSED'
                        }
                      >
                        {isAssigningAssignee || isUpdatingStatus
                          ? 'Назначение...'
                          : 'Взять в работу'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Взять тикет в работу?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          После подтверждения вы станете исполнителем этого
                          тикета, а статус изменится на «Назначен».
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isAssigningAssignee || isUpdatingStatus}
                          className="cursor-pointer"
                        >
                          Отмена
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleTakeInWork}
                          disabled={isAssigningAssignee || isUpdatingStatus}
                          className="cursor-pointer"
                        >
                          Подтвердить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {assigneeName && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Текущий исполнитель: {assigneeName}
                  </p>
                )}
                {isAdmin &&
                  assigneeValue &&
                  assigneeValue === currentAssigneeId && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Этот сотрудник уже назначен на тикет
                    </p>
                  )}
              </>
            ) : (
              <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                {assigneeName || (
                  <span className="italic text-muted-foreground">
                    Не назначен
                  </span>
                )}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground">Автор</span>
              <span className="max-w-[60%] break-words text-right text-card-foreground">
                {createdByName}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground">Создан</span>
              <span className="text-right text-card-foreground">
                {format(new Date(ticket.createdAt), 'd MMM, HH:mm', {
                  locale: ru,
                })}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground">Обновлен</span>
              <span className="text-right text-card-foreground">
                {formatDistanceToNow(new Date(ticket.updatedAt), {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
