import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function CashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-primary animate-glow', props.className)}
      {...props}
    >
      <defs>
        <filter id="cash-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ filter: 'url(#cash-glow)' }}>
        <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
        <path d="M16 8h-4a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4h-4" />
        <path d="M12 4v2" />
        <path d="M12 18v2" />
      </g>
    </svg>
  );
}
