-- Function to generate unique user IDs
create or replace function generate_user_id()
returns text
language plpgsql
as $$
declare
  new_id text;
  exists_check boolean;
begin
  loop
    -- Generate a random 8-character alphanumeric ID
    new_id := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if this ID already exists
    select exists(select 1 from public.profiles where user_id = new_id) into exists_check;
    
    -- If it doesn't exist, we can use it
    if not exists_check then
      return new_id;
    end if;
  end loop;
end;
$$;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to automatically update updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function update_updated_at_column();
