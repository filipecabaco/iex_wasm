<script lang="ts">
  import { onMount } from 'svelte';
  import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Badge } from '$lib/components/ui/badge';

  let client: SupabaseClient;
  let session = $state<Session | null>(null);
  let email = $state(''), password = $state(''), body = $state('');
  let notes = $state<{ id: number; body: string }[]>([]);
  let ready = $state(false), busy = $state(false), message = $state('Connecting to your VM…');
  async function loadNotes() {
    const { data, error } = await client.from('notes').select('id, body').order('id', { ascending: false });
    if (error) throw error;
    notes = data ?? [];
  }
  async function action(fn: () => Promise<void>) {
    busy = true; message = '';
    try { await fn(); } catch (error) { message = error instanceof Error ? error.message : String(error); }
    finally { busy = false; }
  }
  onMount(() => {
    let active = true;
    void action(async () => {
      const response = await fetch(__SNOWGLOBE_BASE__ + '/__config.json');
      if (!response.ok) throw new Error('Keep the VM tab open and use Sync & preview.');
      const { anonKey } = await response.json();
      if (!active) return;
      client = createClient(new URL(__SNOWGLOBE_BASE__ + '/supabase', location.origin).href, anonKey, {
        auth: { storageKey: 'snowglobe-svelte:' + __SNOWGLOBE_BASE__, autoRefreshToken: true, detectSessionInUrl: false }
      });
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      session = data.session;
      if (session) await loadNotes();
      ready = true;
    });
    return () => { active = false; client?.auth.stopAutoRefresh(); };
  });
  async function signIn(signup = false) {
    await action(async () => {
      const credentials = { email, password };
      const { data, error } = signup ? await client.auth.signUp(credentials) : await client.auth.signInWithPassword(credentials);
      if (error) throw error;
      session = data.session; password = '';
      if (session) await loadNotes(); else message = 'Account created. Check whether email confirmation is enabled.';
    });
  }
</script>

<svelte:head><title>Your local full-stack app</title></svelte:head>
<main class="mx-auto max-w-3xl space-y-6 px-6 py-10">
  <div class="flex flex-wrap gap-2">
    <Badge>Svelte 5</Badge><Badge variant="secondary">SvelteKit + shadcn-svelte</Badge>
    <Badge variant="outline">Supabase in your browser</Badge>
  </div>
  <header class="space-y-2">
    <h1 class="text-3xl font-bold tracking-tight">A full stack. Entirely yours.</h1>
    <p class="text-muted-foreground">Edit this project on your computer, then use Sync & preview in the VM tab.
      Auth, Postgres and the Data API run inside that tab—not on a public server.</p>
  </header>
  {#if message}<p role="status" class="rounded-lg border p-3 text-sm">{message}</p>{/if}
  {#if !session}
    <Card.Root>
      <Card.Header><Card.Title>Your account</Card.Title><Card.Description>Create a local user or sign in. The database starts empty.</Card.Description></Card.Header>
      <Card.Content>
        <form class="space-y-4" onsubmit={event => { event.preventDefault(); void signIn(); }}>
          <div class="space-y-2"><label class="text-sm font-medium" for="email">Email</label><Input id="email" type="email" bind:value={email} autocomplete="username" required /></div>
          <div class="space-y-2"><label class="text-sm font-medium" for="password">Password</label><Input id="password" type="password" bind:value={password} autocomplete="current-password" minlength={8} required /></div>
          <div class="flex gap-3"><Button type="submit" disabled={!ready || busy}>Sign in</Button>
            <Button type="button" variant="outline" disabled={!ready || busy || !email || password.length < 8} onclick={() => signIn(true)}>Create account</Button></div>
        </form>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="flex items-center justify-between gap-4"><p class="text-sm">Signed in as <strong>{session.user.email}</strong></p>
      <Button variant="outline" disabled={busy} onclick={() => action(async () => {
        const { error } = await client.auth.signOut(); if (error) throw error; session = null; notes = [];
      })}>Sign out</Button></div>
    <Card.Root>
      <Card.Header><Card.Title>Your private notes</Card.Title><Card.Description>Row-level security keeps each user's notes separate.</Card.Description></Card.Header>
      <Card.Content class="space-y-5">
        <form class="space-y-3" onsubmit={event => { event.preventDefault(); void action(async () => {
          const { error } = await client.from('notes').insert({ body: body.trim() });
          if (error) throw error; body = ''; await loadNotes();
        }); }}>
          <label class="text-sm font-medium" for="note">New note</label><Textarea id="note" bind:value={body} maxlength={500} required placeholder="What are you building?" />
          <Button type="submit" disabled={busy || !body.trim()}>Add note</Button>
        </form>
        {#each notes as note (note.id)}
          <div class="flex items-start justify-between gap-4 rounded-lg border p-4">
            <p class="whitespace-pre-wrap break-words">{note.body}</p>
            <Button size="sm" variant="ghost" disabled={busy} onclick={() => action(async () => {
              const { error } = await client.from('notes').delete().eq('id', note.id);
              if (error) throw error; await loadNotes();
            })}>Delete</Button>
          </div>
        {:else}<p class="text-sm text-muted-foreground">No notes yet. Try creating one, then sign in as another user to see the isolation.</p>{/each}
      </Card.Content>
    </Card.Root>
  {/if}
</main>
