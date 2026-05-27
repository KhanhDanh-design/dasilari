-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create attractions table
create table if not exists attractions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  address text,
  latitude double precision,
  longitude double precision,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create user_itineraries table
create table user_itineraries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table attractions enable row level security;
alter table user_itineraries enable row level security;

-- 4. Policies for attractions
create policy "Allow public read access to attractions"
  on attractions for select
  using (true);

create policy "Allow all access to attractions for demo"
  on attractions for all
  using (true);

-- 5. Policies for user_itineraries
create policy "Users can view their own itineraries"
  on user_itineraries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own itineraries"
  on user_itineraries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own itineraries"
  on user_itineraries for delete
  using (auth.uid() = user_id);
