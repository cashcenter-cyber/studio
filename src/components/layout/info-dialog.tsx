'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

interface InfoDialogProps {
  title: string;
  content: string;
}

export function InfoDialog({ title, content }: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary transition-colors text-left">{title}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert">
            <p>{content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}