create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null,
  goal text not null,
  location text not null,
  booking_date date not null,
  booking_time time not null,
  contact text not null,
  special_request text,
  google_event_id text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

grant select, insert, update, delete
  on table public.bookings
  to service_role;
