-- Drop the table if it already exists to ensure we have the correct columns
drop table if exists public.users cascade;

-- Create users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  email text not null,
  name text,
  profile_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- We'll enable it to ensure security, but our service role key will bypass it during webhook operations.
alter table public.users enable row level security;

-- Optional: Create basic policies if you want users to be able to read their own data via the client library
create policy "Users can view their own data."
  on public.users for select
  using ( auth.uid()::text = clerk_id );

-- Create a function to auto-update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger to call the function before update
drop trigger if exists set_updated_at on public.users;
create trigger set_updated_at
  before update on public.users
  for each row
  execute procedure public.handle_updated_at();
