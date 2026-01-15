export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  termsAndConditions: string;
}

export interface DBInvoice {
  id: string;
  user_id: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  client_name: string;
  client_address: string;
  client_email: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  items: InvoiceItem[];
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  notes: string;
  terms_and_conditions: string;
  status: "draft" | "sent" | "paid" | "overdue";
  created_at: string;
  updated_at: string;
}

export const initialInvoiceData: InvoiceData = {
  companyName: "",
  companyAddress: "",
  companyEmail: "",
  companyPhone: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  taxRate: 0,
  notes: "",
  termsAndConditions: "",
};
