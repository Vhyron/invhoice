import { supabase } from "@/lib/supabase";
import { type InvoiceData, type DBInvoice } from "@/types/invoice";

function formToRow(data: InvoiceData, userId: string) {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    user_id: userId,
    company_name: data.companyName,
    company_address: data.companyAddress,
    company_email: data.companyEmail,
    company_phone: data.companyPhone,
    client_name: data.clientName,
    client_address: data.clientAddress,
    client_email: data.clientEmail,
    invoice_number: data.invoiceNumber,
    invoice_date: data.invoiceDate,
    due_date: data.dueDate,
    items: data.items,
    tax_rate: data.taxRate,
    subtotal,
    tax_amount: taxAmount,
    total,
    notes: data.notes,
    terms_and_conditions: data.termsAndConditions,
  };
}

export function dbToFormData(row: DBInvoice): InvoiceData {
  return {
    companyName: row.company_name,
    companyAddress: row.company_address,
    companyEmail: row.company_email,
    companyPhone: row.company_phone,
    clientName: row.client_name,
    clientAddress: row.client_address,
    clientEmail: row.client_email,
    invoiceNumber: row.invoice_number,
    invoiceDate: row.invoice_date,
    dueDate: row.due_date,
    items: row.items,
    taxRate: row.tax_rate,
    notes: row.notes,
    termsAndConditions: row.terms_and_conditions,
  };
}

export async function getInvoices(): Promise<DBInvoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as DBInvoice[];
}

export async function getInvoice(id: string): Promise<DBInvoice> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DBInvoice;
}

export async function createInvoice(formData: InvoiceData): Promise<DBInvoice> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const row = formToRow(formData, user.id);
  const { data, error } = await supabase
    .from("invoices")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data as DBInvoice;
}

export async function updateInvoice(id: string, formData: InvoiceData): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { user_id: _, ...row } = formToRow(formData, user.id);
  const { error } = await supabase
    .from("invoices")
    .update(row)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function updateInvoiceStatus(
  id: string,
  status: DBInvoice["status"]
): Promise<void> {
  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteInvoice(id: string): Promise<void> {
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
}
