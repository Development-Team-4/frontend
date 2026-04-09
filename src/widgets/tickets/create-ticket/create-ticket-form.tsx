'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useCreateTicketForm } from '@/features/create-ticket-form';

export function CreateTicketForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    handleTopicChange,
    handleCategoryChange,
    filteredCategories,
    isSubmitting,
    topicId,
    categoryId,
    canSubmit,
    topics,
    onSubmit,
    formState: { errors },
  } = useCreateTicketForm();

  return (
    <div className="mx-auto w-full max-w-2xl px-3 py-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          onClick={() => router.push('/tickets')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Назад к тикетам
        </Button>

        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Создать тикет
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Создайте новое обращение в службу поддержки
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div>
            <Label htmlFor="subject" className="mb-1.5 text-xs">
              Заголовок
            </Label>
            <Input
              id="subject"
              placeholder="Краткое описание проблемы..."
              className="bg-background"
              aria-invalid={Boolean(errors.subject)}
              {...register('subject')}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5 text-xs">
              Описание
            </Label>
            <Textarea
              id="description"
              placeholder="Подробно опишите проблему, шаги для воспроизведения и ожидаемое поведение..."
              className="min-h-[140px] bg-background"
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 text-xs">Тема</Label>
              <Select value={topicId} onValueChange={handleTopicChange}>
                <SelectTrigger
                  className="bg-background"
                  aria-invalid={Boolean(errors.topicId)}
                >
                  <SelectValue placeholder="Выберите тему" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex flex-col">
                        <span>{topic.name}</span>
                        {topic.description && (
                          <span className="text-xs text-muted-foreground">
                            {topic.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.topicId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.topicId.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 text-xs">Категория</Label>
              <Select
                value={categoryId}
                onValueChange={handleCategoryChange}
                disabled={!topicId}
              >
                <SelectTrigger
                  className="bg-background"
                  aria-invalid={Boolean(errors.categoryId)}
                >
                  <SelectValue
                    placeholder={
                      topicId ? 'Выберите категорию' : 'Сначала выберите тему'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              После создания тикета сотрудники поддержки получат уведомление и
              смогут взять запрос в работу. Вы получите уведомление при
              изменении статуса или добавлении комментария.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push('/tickets')}
            >
              Отмена
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Создание...' : 'Создать тикет'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
