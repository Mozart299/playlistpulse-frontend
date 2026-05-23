'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, ArrowLeft, Plus } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  _id: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  senderImage: string;
  recipientEmail: string;
  recipientName: string;
  recipientImage: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  _id: string;
  lastMessage: Message;
  unread: number;
}

function makeConversationId(a: string, b: string) {
  return [a, b].sort().join('__CONV__');
}

function getOtherParticipant(conv: Conversation, myEmail: string) {
  const msg = conv.lastMessage;
  if (msg.senderEmail !== myEmail) {
    return { email: msg.senderEmail, name: msg.senderName, image: msg.senderImage };
  }
  return { email: msg.recipientEmail, name: msg.recipientName, image: msg.recipientImage };
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [newChatImage, setNewChatImage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const myEmail = session?.user?.email || '';

  // Active conversation's other participant
  const activeConv = conversations.find(c => c._id === activeConvId);
  const otherParticipant = activeConv
    ? getOtherParticipant(activeConv, myEmail)
    : activeConvId
    ? { email: newChatEmail, name: newChatName, image: newChatImage }
    : null;

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await axios.get('/api/messages');
      setConversations(res.data || []);
    } catch {}
  }, []);

  // Load messages for active conversation
  const loadMessages = useCallback(async (convId: string) => {
    try {
      const res = await axios.get(`/api/messages?conversationId=${encodeURIComponent(convId)}`);
      setMessages(res.data || []);
      // Mark as read
      axios.patch('/api/messages', { conversationId: convId }).catch(() => {});
    } catch {}
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Open conversation pre-selected via query params (from matches page)
  useEffect(() => {
    const withEmail = searchParams?.get('with');
    const withName = searchParams?.get('name');
    const withImage = searchParams?.get('image');
    if (withEmail && myEmail) {
      const convId = makeConversationId(myEmail, withEmail);
      setNewChatEmail(decodeURIComponent(withEmail));
      setNewChatName(decodeURIComponent(withName || ''));
      setNewChatImage(decodeURIComponent(withImage || ''));
      setActiveConvId(convId);
      setShowChat(true);
      loadMessages(convId);
    }
  }, [searchParams, myEmail, loadMessages]);

  // Polling
  useEffect(() => {
    if (!activeConvId) return;
    pollRef.current = setInterval(() => loadMessages(activeConvId), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConvId, loadMessages]);

  // Scroll to bottom when messages load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = (conv: Conversation) => {
    setActiveConvId(conv._id);
    setShowChat(true);
    loadMessages(conv._id);
    // Update unread to 0 locally
    setConversations(prev =>
      prev.map(c => c._id === conv._id ? { ...c, unread: 0 } : c)
    );
  };

  const startNewChat = async () => {
    if (!newChatEmail.trim()) return;
    const convId = makeConversationId(myEmail, newChatEmail.trim());
    setActiveConvId(convId);
    setShowChat(true);
    setShowNewChat(false);
    loadMessages(convId);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherParticipant || sending) return;
    setSending(true);
    try {
      const res = await axios.post('/api/messages', {
        recipientEmail: otherParticipant.email,
        recipientName: otherParticipant.name,
        recipientImage: otherParticipant.image,
        content: newMessage.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      // Update conversations list
      loadConversations();
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Direct messages with music lovers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-lg overflow-hidden min-h-[500px] bg-card">
        {/* Conversation List */}
        <div className={cn('border-r bg-background', showChat && 'hidden md:block')}>
          <div className="p-3 border-b flex items-center justify-between">
            <p className="font-semibold text-sm">Conversations</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewChat(v => !v)}
              className="gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </Button>
          </div>

          {showNewChat && (
            <div className="p-3 border-b bg-muted/30 space-y-2">
              <Input
                placeholder="Recipient email…"
                value={newChatEmail}
                onChange={e => setNewChatEmail(e.target.value)}
                className="text-sm h-8"
              />
              <Button size="sm" className="w-full h-8" onClick={startNewChat} disabled={!newChatEmail.trim()}>
                Start conversation
              </Button>
            </div>
          )}

          <div className="overflow-y-auto max-h-[420px]">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground px-4">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No conversations yet. Start chatting with a music match!</p>
              </div>
            ) : (
              conversations.map(conv => {
                const other = getOtherParticipant(conv, myEmail);
                const isActive = activeConvId === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => openConversation(conv)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left',
                      isActive && 'bg-muted'
                    )}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={other.image} />
                      <AvatarFallback>{getInitials(other.name || other.email)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{other.name || other.email}</p>
                        {conv.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 ml-1">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat View */}
        <div className={cn('col-span-2 flex flex-col bg-background', !showChat && 'hidden md:flex')}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
              <div>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">or start a new one with a music match</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => setShowChat(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                {otherParticipant && (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherParticipant.image} />
                      <AvatarFallback className="text-xs">{getInitials(otherParticipant.name || otherParticipant.email)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm">{otherParticipant.name || otherParticipant.email}</p>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px]">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No messages yet. Say hi!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderEmail === myEmail;
                    return (
                      <div
                        key={msg._id}
                        className={cn('flex items-end gap-2', isMine && 'flex-row-reverse')}
                      >
                        {!isMine && (
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarImage src={msg.senderImage} />
                            <AvatarFallback className="text-xs">{getInitials(msg.senderName)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-3 py-2 text-sm',
                            isMine
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm'
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send */}
              <div className="p-3 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
