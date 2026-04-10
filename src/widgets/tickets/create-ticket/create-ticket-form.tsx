'use client';

import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
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
    control,
    handleTopicChange,
    handleCategoryChange,
    filteredCategories,
    isSubmitting,
    topicId,
    categoryId,
    canSubmit,
    topics,
    onSubmit,
    serverError,
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
          РќР°Р·Р°Рґ Рє С‚РёРєРµС‚Р°Рј
        </Button>

        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          РЎРѕР·РґР°С‚СЊ С‚РёРєРµС‚
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          РЎРѕР·РґР°Р№С‚Рµ РЅРѕРІРѕРµ РѕР±СЂР°С‰РµРЅРёРµ РІ СЃР»СѓР¶Р±Сѓ
          РїРѕРґРґРµСЂР¶РєРё
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
              Р—Р°РіРѕР»РѕРІРѕРє
            </Label>
            <Input
              id="subject"
              placeholder="РљСЂР°С‚РєРѕРµ РѕРїРёСЃР°РЅРёРµ РїСЂРѕР±Р»РµРјС‹..."
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
              РћРїРёСЃР°РЅРёРµ
            </Label>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  id="description"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Введите описание"
                />
              )}
            />

            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 text-xs">РўРµРјР°</Label>
              <Select value={topicId} onValueChange={handleTopicChange}>
                <SelectTrigger
                  className="bg-background"
                  aria-invalid={Boolean(errors.topicId)}
                >
                  <SelectValue placeholder="Р’С‹Р±РµСЂРёС‚Рµ С‚РµРјСѓ" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex flex-col">
                        <span>{topic.name}</span>
                        {topic.description && (
                          <MarkdownContent
                            content={topic.description}
                            className="text-xs text-muted-foreground"
                          />
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
              <Label className="mb-1.5 text-xs">РљР°С‚РµРіРѕСЂРёСЏ</Label>
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
                      topicId
                        ? 'Р’С‹Р±РµСЂРёС‚Рµ РєР°С‚РµРіРѕСЂРёСЋ'
                        : 'РЎРЅР°С‡Р°Р»Р° РІС‹Р±РµСЂРёС‚Рµ С‚РµРјСѓ'
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
              РџРѕСЃР»Рµ СЃРѕР·РґР°РЅРёСЏ С‚РёРєРµС‚Р° СЃРѕС‚СЂСѓРґРЅРёРєРё
              РїРѕРґРґРµСЂР¶РєРё РїРѕР»СѓС‡Р°С‚ СѓРІРµРґРѕРјР»РµРЅРёРµ Рё
              СЃРјРѕРіСѓС‚ РІР·СЏС‚СЊ Р·Р°РїСЂРѕСЃ РІ СЂР°Р±РѕС‚Сѓ. Р’С‹
              РїРѕР»СѓС‡РёС‚Рµ СѓРІРµРґРѕРјР»РµРЅРёРµ РїСЂРё РёР·РјРµРЅРµРЅРёРё
              СЃС‚Р°С‚СѓСЃР° РёР»Рё РґРѕР±Р°РІР»РµРЅРёРё РєРѕРјРјРµРЅС‚Р°СЂРёСЏ.
            </p>
          </div>

          {serverError && (
            <p className="text-xs text-destructive">{serverError}</p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push('/tickets')}
            >
              РћС‚РјРµРЅР°
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting
                ? 'РЎРѕР·РґР°РЅРёРµ...'
                : 'РЎРѕР·РґР°С‚СЊ С‚РёРєРµС‚'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
