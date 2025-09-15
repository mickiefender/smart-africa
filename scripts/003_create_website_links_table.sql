-- Create website links table
create table if not exists public.website_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.website_links enable row level security;

-- RLS policies for website links
create policy "website_links_select_own"
  on public.website_links for select
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = website_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "website_links_insert_own"
  on public.website_links for insert
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = website_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "website_links_update_own"
  on public.website_links for update
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = website_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

create policy "website_links_delete_own"
  on public.website_links for delete
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = website_links.profile_id 
      and profiles.id = auth.uid()
    )
  );

-- Allow public read access for business cards
create policy "website_links_select_public"
  on public.website_links for select
  using (true);
