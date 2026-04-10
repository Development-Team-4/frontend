import { cn } from '@/shared/lib/utils';
import { markdownToHtml } from '@/shared/lib/markdown';

type MarkdownContentProps = {
  content?: string | null;
  className?: string;
  emptyText?: string;
};

export function MarkdownContent({
  content,
  className,
  emptyText,
}: MarkdownContentProps) {
  const value = content?.trim();

  if (!value) {
    return emptyText ? (
      <span className={cn('text-muted-foreground', className)}>
        {emptyText}
      </span>
    ) : null;
  }

  return (
    <div
      className={cn('prose prose-sm max-w-none dark:prose-invert', className)}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
    />
  );
}
