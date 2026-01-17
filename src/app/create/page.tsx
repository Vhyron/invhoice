"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createInvoice } from "@/lib/invoices";
import { InvoiceForm } from "@/components/invoice-form";
import { initialInvoiceData } from "@/types/invoice";

export default function CreateInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
      else setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
        <h1 className="text-3xl font-normal mb-8">Create New Invoice</h1>
        <InvoiceForm
          defaultData={{
            ...initialInvoiceData,
            invoiceDate: new Date().toISOString().split("T")[0],
          }}
          onSave={async (data) => {
            await createInvoice(data);
            router.push("/dashboard");
          }}
          saveLabel="Save Invoice"
        />
      </main>
    </div>
  );
}
