import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
};

export function SiteLogo({ className, imageClassName }: SiteLogoProps) {
  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10',
        className,
      )}
    >
      <Image
        src="/logo.svg"
        alt="TicketFlow logo"
        width={32}
        height={32}
        className={cn('h-full w-full object-contain', imageClassName)}
        priority
      />
    </div>
  );
}
