'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    axios
      .get(`/api/user-profile?email=${encodeURIComponent(session.user.email)}`)
      .then(res => {
        setDisplayName(res.data.displayName || session.user?.name || '');
        setBio(res.data.bio || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/user-profile', { displayName, bio });
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-white/90 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>This information is visible to other users on PlaylistPulse</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Spotify Avatar (read-only) */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
              <AvatarFallback className="text-xl font-bold">
                {getInitials(session?.user?.name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Profile photo synced from Spotify</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={session?.user?.name || 'Your display name'}
                disabled={loading}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">Override your Spotify name with a custom display name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell people about your music taste…"
                disabled={loading}
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">{bio.length}/200 characters</p>
            </div>

            <Button type="submit" disabled={saving || loading} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Spotify account</span>
            <span className="font-medium">{session?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Authentication</span>
            <span className="font-medium">Spotify OAuth</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
