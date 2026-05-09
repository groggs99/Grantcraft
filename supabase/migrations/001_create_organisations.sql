-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type org_type as enum (
  'clg',
  'cic',
  'unincorporated',
  'charitable-trust',
  'cooperative',
  'registered-charity',
  'social-enterprise',
  'friendly-society',
  'other'
);

create type org_setting as enum ('urban', 'suburban', 'rural', 'mixed');

create type budget_range as enum (
  'under-10k',
  '10k-50k',
  '50k-100k',
  '100k-250k',
  '250k-500k',
  '500k-1m',
  'over-1m'
);

create type geographic_reach as enum ('local', 'county', 'regional', 'national', 'international');

create type activity_area as enum (
  'arts-culture',
  'sports-recreation',
  'community-development',
  'education-training',
  'health-wellbeing',
  'environment',
  'climate-action',
  'just-transition',
  'heritage-conservation',
  'coastal-marine',
  'dsgbv',
  'lgbtiq-plus',
  'disability',
  'mental-health',
  'children-young-people',
  'older-people',
  'housing-homelessness',
  'social-inclusion',
  'rural-development',
  'urban-regeneration',
  'volunteering',
  'international-development',
  'animal-welfare',
  'food-agriculture',
  'technology-digital',
  'tourism',
  'employment-enterprise',
  'irish-language'
);

create type demographic as enum (
  'children-0-11',
  'young-people-12-24',
  'older-people-65-plus',
  'people-with-disabilities',
  'experiencing-homelessness',
  'migrants-refugees',
  'traveller-roma',
  'lgbtiq-plus',
  'women-girls',
  'men-boys',
  'lone-parents',
  'long-term-unemployed',
  'people-in-recovery',
  'rural-communities',
  'coastal-communities',
  'general-public'
);

create type county as enum (
  'carlow', 'cavan', 'clare', 'cork', 'donegal', 'dublin',
  'galway', 'kerry', 'kildare', 'kilkenny', 'laois', 'leitrim',
  'limerick', 'longford', 'louth', 'mayo', 'meath', 'monaghan',
  'offaly', 'roscommon', 'sligo', 'tipperary', 'waterford',
  'westmeath', 'wexford', 'wicklow'
);

create type grant_writing_capacity as enum ('none', 'some', 'experienced');

-- Organisations table
create table organisations (
  id                      uuid              primary key default uuid_generate_v4(),
  user_id                 uuid              not null references auth.users(id) on delete cascade,

  -- Identity
  name                    text              not null,
  legal_name              text,
  org_type                org_type          not null,
  charity_number          text,
  company_number          text,
  tax_exemption_ref       text,
  year_founded            integer           not null check (year_founded between 1800 and 2100),
  description             text              not null,
  mission                 text              not null,
  website                 text,

  -- Location
  address_line1           text              not null,
  address_line2           text,
  town                    text              not null,
  county                  county            not null,
  eircode                 text,
  setting                 org_setting       not null,
  geographic_reach        geographic_reach  not null,

  -- Contact
  contact_name            text              not null,
  contact_role            text              not null,
  contact_email           text              not null,
  contact_phone           text,

  -- Capacity
  staff_count             integer           not null check (staff_count >= 0),
  volunteer_count         integer           not null check (volunteer_count >= 0),
  budget_range            budget_range      not null,

  -- Activities
  activity_areas          activity_area[]   not null default '{}',
  target_demographics     demographic[]     not null default '{}',

  -- Grant experience
  has_grant_experience    boolean           not null default false,
  previous_grants_detail  text,
  largest_grant_received  text,
  grant_writing_capacity  grant_writing_capacity not null,

  -- Timestamps
  created_at              timestamptz       not null default now(),
  updated_at              timestamptz       not null default now()
);

-- Auto-update updated_at on row change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organisations_updated_at
  before update on organisations
  for each row execute function set_updated_at();

-- Row-Level Security
alter table organisations enable row level security;

create policy "Users can view their own organisations"
  on organisations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own organisations"
  on organisations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own organisations"
  on organisations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own organisations"
  on organisations for delete
  using (auth.uid() = user_id);
