create table bookings (
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

  status text default 'confirmed',

  created_at timestamp default now()
);