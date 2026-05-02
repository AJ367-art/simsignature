-- Run this script in your Supabase SQL Editor to create the necessary tables

-- Drop existing tables if they exist
drop table if exists public.shoes;
drop table if exists public.testimonials;

-- Create Shoes table
create table public.shoes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price integer not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Testimonials table
create table public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  quote text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.shoes enable row level security;
alter table public.testimonials enable row level security;

-- Create policies for public access (since the app allows anyone to read)
create policy "Allow public read access to shoes"
  on public.shoes for select
  to public
  using (true);

create policy "Allow public read access to testimonials"
  on public.testimonials for select
  to public
  using (true);

-- Create policies for writing (In a real app, this should be restricted to authenticated users, 
-- but for the current admin dashboard implementation without proper auth, we allow public inserts/updates 
-- or you can secure it later with Supabase Auth)
create policy "Allow public insert to shoes"
  on public.shoes for insert
  to public
  with check (true);

create policy "Allow public update to shoes"
  on public.shoes for update
  to public
  using (true);

create policy "Allow public delete from shoes"
  on public.shoes for delete
  to public
  using (true);

create policy "Allow public insert to testimonials"
  on public.testimonials for insert
  to public
  with check (true);

create policy "Allow public update to testimonials"
  on public.testimonials for update
  to public
  using (true);

create policy "Allow public delete from testimonials"
  on public.testimonials for delete
  to public
  using (true);
