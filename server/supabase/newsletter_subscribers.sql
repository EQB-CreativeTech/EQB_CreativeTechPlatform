-- Run once in Supabase → SQL Editor (free tier is fine).

create table if not exists public.newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_key unique (email)
);

create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers (email);

alter table public.newsletter_subscribers enable row level security;

-- No public policies: only the API uses the service role key (server-side).
