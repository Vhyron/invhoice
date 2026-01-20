"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getInvoices, deleteInvoice, updateInvoiceStatus } from "@/lib/invoices";
import { type DBInvoice } from "@/types/invoice";

const STATUS_STYLES: Record<DBInvoice["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "---";
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<DBInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUserEmail(user.email ?? "");

      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (!confirm(`Delete invoice ${invoiceNumber || id}? This cannot be undone.`)) return;
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete invoice");
    }
  };

  const handleStatusChange = async (id: string, status: DBInvoice["status"]) => {
    try {
      await updateInvoiceStatus(id, status);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <span className="text-2xl font-light tracking-tight">InVhoice</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-normal">Invoices</h1>
          <Link
            href="/create"
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            + New Invoice
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>
        )}

        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <p className="text-gray-500 mb-4">No invoices yet.</p>
            <Link
              href="/create"
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Invoice #
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Due
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">
                      {invoice.invoice_number || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{invoice.client_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      ₱{invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusChange(invoice.id, e.target.value as DBInvoice["status"])
                        }
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-black ${STATUS_STYLES[invoice.status]}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/invoices/${invoice.id}/edit`}
                          className="text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
