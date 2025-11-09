import Link from 'next/link';
import { Rocket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-background/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Rocket className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for fun. © {new Date().getFullYear()} Cash-Center.fun
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
