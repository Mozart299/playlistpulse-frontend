'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Clock, Users, Plus, Trash2, Search, Loader2, Music } from 'lucide-react';
import { EventSkeleton } from '@/components/ui/skeletons';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Event {
  _id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  genre: string;
  price: string;
  link: string;
  creatorEmail: string;
  creatorName: string;
  attendees: string[];
  created_at: string;
}

const GENRES = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip-Hop', 'Classical', 'R&B', 'Country', 'Indie', 'Folk', 'Metal', 'Other'];

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', venue: '', date: '', time: '', description: '', genre: '', price: 'Free', link: '',
  });

  const fetchEvents = async (q = '') => {
    try {
      const params = new URLSearchParams({ upcoming: 'true' });
      if (q) params.set('search', q);
      const res = await axios.get(`/api/events?${params}`);
      setEvents(res.data || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchEvents(e.target.value);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    setCreating(true);
    try {
      const res = await axios.post('/api/events', form);
      setEvents(prev => [res.data, ...prev]);
      setForm({ name: '', venue: '', date: '', time: '', description: '', genre: '', price: 'Free', link: '' });
      setDialogOpen(false);
      toast.success('Event created!');
    } catch {
      toast.error('Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handleRsvp = async (event: Event) => {
    setRsvpLoading(event._id);
    try {
      const res = await axios.patch('/api/events', { eventId: event._id });
      setEvents(prev =>
        prev.map(e =>
          e._id === event._id
            ? {
                ...e,
                attendees: res.data.attending
                  ? [...e.attendees, session?.user?.email!]
                  : e.attendees.filter(a => a !== session?.user?.email),
              }
            : e
        )
      );
    } catch {
      toast.error('Failed to update RSVP');
    } finally {
      setRsvpLoading(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await axios.delete(`/api/events?id=${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const myEvents = events.filter(e => e.creatorEmail === session?.user?.email);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Calendar className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Events</h1>
            </div>
            <p className="text-white/90 text-sm">Music events from the community</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus className="w-4 h-4" /> Create
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create an Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Event Name *</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jazz Night at Blue Note" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Date *</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Time</Label>
                    <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Venue</Label>
                  <Input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="Venue name & city" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Genre</Label>
                    <select
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                      value={form.genre}
                      onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
                    >
                      <option value="">Select genre</option>
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Price</Label>
                    <Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Free, $15, etc." />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Tell people what to expect…" rows={3} />
                </div>
                <div className="space-y-1">
                  <Label>Link (optional)</Label>
                  <Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://tickets.example.com" />
                </div>
                <Button type="submit" disabled={creating} className="w-full gap-2">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? 'Creating…' : 'Create Event'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search events…" className="pl-9" value={search} onChange={handleSearch} />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">Upcoming Events</TabsTrigger>
          <TabsTrigger value="mine" className="flex-1">My Events ({myEvents.length})</TabsTrigger>
        </TabsList>

        {[{ key: 'upcoming', list: events }, { key: 'mine', list: myEvents }].map(({ key, list }) => (
          <TabsContent key={key} value={key} className="mt-4 space-y-4">
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={i} />)}</div>
            ) : list.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium text-lg mb-1">No events found</p>
                {key === 'mine' && <p className="text-sm">Create your first event using the button above.</p>}
              </div>
            ) : (
              list.map(event => {
                const attending = event.attendees?.includes(session?.user?.email || '');
                const isCreator = event.creatorEmail === session?.user?.email;
                return (
                  <Card key={event._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-foreground">{event.name}</h3>
                            {event.genre && (
                              <Badge variant="secondary" className="text-xs">
                                <Music className="w-3 h-3 mr-1" />{event.genre}
                              </Badge>
                            )}
                          </div>
                          {event.venue && (
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                              {event.venue}
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {event.time}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {event.attendees?.length || 0} going
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              'text-sm font-semibold',
                              event.price === 'Free' ? 'text-green-600' : 'text-foreground'
                            )}>
                              {event.price}
                            </span>
                            {event.link && (
                              <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                View details →
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant={attending ? 'default' : 'outline'}
                            onClick={() => handleRsvp(event)}
                            disabled={rsvpLoading === event._id}
                            className={cn(attending && 'bg-green-500 hover:bg-green-600')}
                          >
                            {rsvpLoading === event._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : attending ? 'Going ✓' : 'RSVP'}
                          </Button>
                          {isCreator && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(event._id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
