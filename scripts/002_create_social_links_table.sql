-- Create social links table
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  platform text not null, -- 'instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'youtube', etc.
  url text not null,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.social_links enable row level security;

-- RLS policies for social links
create policy "social_links_select_own"
  on public.social_links for select
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = social_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "social_links_insert_own"
  on public.social_links for insert
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = social_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "social_links_update_own"
  on public.social_links for update
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = social_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "social_links_delete_own"
  on public.social_links for delete
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = social_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

-- Allow public read access for business cards
create policy "social_links_select_public"
  on public.social_links for select
  using (true);
