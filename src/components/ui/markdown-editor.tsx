'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownContent } from './markdown-content';

type MarkdownEditorProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  heightClassName?: string;
  minHeightClassName?: string;
};

export function MarkdownEditor({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  heightClassName = 'h-[220px]',
  minHeightClassName,
}: MarkdownEditorProps) {
  const editorHeightClass = minHeightClassName ?? heightClassName;

  return (
    <Tabs defaultValue="Редактор" className="mt-1.5">
      <TabsList>
        <TabsTrigger value="Редактор" className="cursor-pointer">
          Редактор
        </TabsTrigger>
        <TabsTrigger value="Предпросмотр" className="cursor-pointer">
          Предпросмотр
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Редактор">
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${editorHeightClass} max-h-[50vh] bg-background`}
          disabled={disabled}
        />
      </TabsContent>

      <TabsContent value="preview">
        <div
          className={`${editorHeightClass} max-h-[50vh] overflow-y-auto rounded-md border border-input bg-background p-3 text-sm leading-relaxed`}
        >
          <MarkdownContent
            content={value}
            emptyText='Пока пусто. Напишите описание во вкладке "Редактор".'
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
