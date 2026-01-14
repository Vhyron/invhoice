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
  notes: string;
  termsAndConditions: string;
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
  notes: "",
  termsAndConditions: "",
};
