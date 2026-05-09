create table project_ideas (
  id         uuid        primary key default uuid_generate_v4(),
  org_id     uuid        not null references organisations(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  raw_idea   text        not null,
  brief      jsonb,
  status     text        not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_ideas_updated_at
  before update on project_ideas
  for each row execute function set_updated_at();

alter table project_ideas enable row level security;

create policy "Users can view their own project ideas"
  on project_ideas for select
  using (auth.uid() = user_id);

create policy "Users can insert their own project ideas"
  on project_ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own project ideas"
  on project_ideas for update
  using (auth.uid() = user_id);

create policy "Users can delete their own project ideas"
  on project_ideas for delete
  using (auth.uid() = user_id);
