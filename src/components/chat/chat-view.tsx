'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import type { ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { GlassCard } from '../ui/glass-card';
import { ScrollArea } from '../ui/scroll-area';

const chatSchema = z.object({
  message: z.string().min(1).max(280),
});

export function ChatView() {
  const { user, userProfile } = useUser();
  const db = useFirestore();
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  const messagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
        collection(db, 'chat_messages'), 
        orderBy('createdAt', 'desc'), 
        limit(50)
    );
  }, [db]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);
  const reversedMessages = messages ? [...messages].reverse() : [];


  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    if (!user || !userProfile || !db) return;
    setIsSending(true);
    
    try {
      const messagesRef = collection(db, 'chat_messages');
      await addDoc(messagesRef, {
        text: values.message,
        createdAt: serverTimestamp(),
        userId: user.uid,
        username: userProfile.username,
        profilePicture: user.photoURL || '',
      });
      form.reset();
    } catch (error) {
      console.error("Error sending message: ", error);
      // Optionally show a toast notification
    } finally {
      setIsSending(false);
    }
  };

  return (
    <GlassCard className="flex flex-col flex-grow">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {reversedMessages?.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarImage src={msg.profilePicture} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {msg.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-primary">{msg.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : ''}
                  </p>
                </div>
                <p className="text-white">{msg.text}</p>
              </div>
            </div>
          ))}
           {messages && messages.length === 0 && !isLoading && (
             <div className="text-center text-muted-foreground py-16">
                <p>No messages yet. Be the first to say something!</p>
             </div>
           )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSending}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </div>
    </GlassCard>
  );
}
