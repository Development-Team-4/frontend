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
        'relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg',
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="TicketFlow logo"
        fill
        sizes="48px"
        className={cn('object-cover scale-125', imageClassName)}
        priority
      />
    </div>
  );
}
