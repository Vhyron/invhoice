"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getInvoice, updateInvoice, dbToFormData } from "@/lib/invoices";
import { InvoiceForm } from "@/components/invoice-form";
import { type InvoiceData } from "@/types/invoice";

export default function EditInvoice() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const row = await getInvoice(id);
        setInvoiceData(dbToFormData(row));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (notFound || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Invoice not found.</p>
        <Link href="/dashboard" className="text-sm text-black font-medium hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
          <Link href="/dashboard" className="text-2xl font-light tracking-tight">
            InVhoice
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-12">
        <h1 className="text-3xl font-normal mb-8">Edit Invoice</h1>
        <InvoiceForm
          defaultData={invoiceData}
          onSave={async (data) => {
            await updateInvoice(id, data);
            router.push("/dashboard");
          }}
          saveLabel="Update Invoice"
        />
      </main>
    </div>
  );
}
