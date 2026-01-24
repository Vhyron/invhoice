-- Run this if you already created the invoices table from schema.sql
alter table invoices
  add column if not exists currency text not null default 'PHP';
