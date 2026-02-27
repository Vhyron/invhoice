-- Invoices table
create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Company
  company_name text not null default '',
  company_address text default '',
  company_email text not null default '',
  company_phone text default '',

  -- Client
  client_name text not null default '',
  client_address text default '',
  client_email text default '',

  -- Invoice details
  invoice_number text not null default '',
  invoice_date date not null,
  due_date date not null,

  -- Line items (stored as JSON array)
  items jsonb not null default '[]',

  -- Financials
  tax_rate numeric(5, 2) default 0,
  subtotal numeric(10, 2) default 0,
  tax_amount numeric(10, 2) default 0,
  total numeric(10, 2) default 0,

  -- Notes
  notes text default '',
  terms_and_conditions text default '',

  -- Status
  status text default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invoices_updated_at
  before update on invoices
  for each row execute function update_updated_at();

-- Row Level Security — users can only access their own invoices
alter table invoices enable row level security;

create policy "Users can manage their own invoices"
  on invoices for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
