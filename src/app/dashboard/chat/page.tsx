import { ChatView } from "@/components/chat/chat-view";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">General Chat</h1>
        <p className="text-muted-foreground">
          Talk with other members of the community in real-time.
        </p>
      </div>
      <ChatView />
    </div>
  );
}
