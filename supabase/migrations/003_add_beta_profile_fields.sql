alter table organisations
  add column if not exists project_funding_need text,
  add column if not exists estimated_funding_amount text,
  add column if not exists funding_category text,
  add column if not exists biggest_grant_challenge text;
