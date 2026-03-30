'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  currentUser,
  getCategoryById,
  getTopicById,
  getStaffForCategory,
} from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Send,
  ChevronRight,
  Trash2,
  Edit3,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import Link from 'next/link';
import { comments, statusLabels, statusStyles, tickets } from '@/shared/consts';
import { TicketNotExist } from '../ticket-not-exist';
import { TicketStatus } from '@/shared/types';

export function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const ticket = tickets.find((t) => t.id === ticketId);
  const ticketComments = comments[ticketId] || [];
  const [newComment, setNewComment] = useState('');
  const [statusValue, setStatusValue] = useState(ticket?.status || 'CREATED');
  const [assigneeValue, setAssigneeValue] = useState(
    ticket?.assignee?.id || '',
  );

  const category = ticket ? getCategoryById(ticket.categoryId) : null;
  const topic = category ? getTopicById(category.topicId) : null;
  const categoryStaff = ticket ? getStaffForCategory(ticket.categoryId) : [];

  const isOwner = ticket?.createdBy.id === currentUser.id;
  const isAssignee = ticket?.assignee?.id === currentUser.id;
  const isAdmin = currentUser.role === 'ADMIN';
  const isSupport = currentUser.role === 'SUPPORT';

  const canEdit = isOwner && ticket?.status !== 'CLOSED' && !ticket?.assignee;
  const canDelete =
    isOwner && ticket?.status === 'CREATED' && !ticket?.assignee;
  const canChangeStatus = isAssignee || isAdmin;
  const canAssign = isAdmin || (isSupport && !ticket?.assignee);
  const canComment = isOwner || isAssignee || isAdmin;

  if (!ticket) {
    return <TicketNotExist ticketId={ticketId} />;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/tickets"
            className="hover:text-foreground transition-colors"
          >
            Тикеты
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{ticket.id}</span>
        </div>

        <div className="mb-6">
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {ticket.id}
                </span>
                <Badge
                  className={`border-0 text-[10px] ${statusStyles[ticket.status]}`}
                >
                  {statusLabels[ticket.status]}
                </Badge>
                {category && (
                  <Badge variant="outline" className="text-[10px]">
                    {category.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-xl font-semibold text-foreground text-balance">
                {ticket.subject}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ticket.createdBy.name}
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
              <div className="flex gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm">
                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                    Редактировать
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Удалить
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Card className="mb-6 p-4">
          <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
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
              {ticketComments.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Комментариев пока нет
                </p>
              )}
              {ticketComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary">
                        {comment.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-xs font-medium text-card-foreground">
                        {comment.author.name}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {comment.author.role === 'ADMIN'
                          ? 'Админ'
                          : comment.author.role === 'SUPPORT'
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
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}

              {canComment && ticket.status !== 'CLOSED' && (
                <div className="mt-2">
                  <Textarea
                    placeholder="Написать комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] bg-card"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" disabled={!newComment.trim()}>
                      <Send className="mr-1 h-3.5 w-3.5" />
                      Отправить
                    </Button>
                  </div>
                </div>
              )}

              {ticket.status === 'CLOSED' && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Тикет закрыт. Комментарии недоступны.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full border-t border-border bg-card p-6 lg:w-80 lg:border-t-0 lg:border-l">
        <h3 className="mb-4 text-sm font-medium text-card-foreground">
          Детали
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Статус
            </label>
            {canChangeStatus ? (
              <Select
                value={statusValue}
                onValueChange={(v) => setStatusValue(v as TicketStatus)}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATED">Создан</SelectItem>
                  <SelectItem value="IN_WORK">В работе</SelectItem>
                  <SelectItem value="RESOLVED">Решён</SelectItem>
                  {(isAdmin || (isAssignee && statusValue === 'RESOLVED')) && (
                    <SelectItem value="CLOSED">Закрыт</SelectItem>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-border bg-background px-3 py-2">
                <Badge
                  className={`border-0 text-[10px] ${statusStyles[ticket.status]}`}
                >
                  {statusLabels[ticket.status]}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Тема / Категория
            </label>
            <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              {topic?.name} / {category?.name}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Исполнитель
            </label>
            {canAssign ? (
              <>
                <Select value={assigneeValue} onValueChange={setAssigneeValue}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Не назначен" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryStaff.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isSupport && !ticket.assignee && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-xs"
                  >
                    Взять в работу
                  </Button>
                )}
              </>
            ) : (
              <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                {ticket.assignee?.name || (
                  <span className="text-muted-foreground italic">
                    Не назначен
                  </span>
                )}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Автор</span>
              <span className="text-card-foreground">
                {ticket.createdBy.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Создан</span>
              <span className="text-card-foreground">
                {format(new Date(ticket.createdAt), 'd MMM, HH:mm', {
                  locale: ru,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Обновлён</span>
              <span className="text-card-foreground">
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
