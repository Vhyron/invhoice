import { type InvoiceData } from "@/types/invoice";
import { getCurrencySymbol } from "@/lib/currencies";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (data.taxRate / 100);
  const total = subtotal + taxAmount;
  const sym = getCurrencySymbol(data.currency);

  return (
    <div className="bg-white p-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">{data.companyName || "Your Company"}</h1>
          {data.companyAddress && (
            <p className="text-gray-600 whitespace-pre-line">{data.companyAddress}</p>
          )}
          {data.companyEmail && <p className="text-gray-600">{data.companyEmail}</p>}
          {data.companyPhone && <p className="text-gray-600">{data.companyPhone}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-semibold mb-4">INVOICE</h2>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <span className="text-gray-600">Invoice #:</span>
              <span className="font-medium">{data.invoiceNumber || "---"}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{data.invoiceDate || "---"}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{data.dueDate || "---"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Bill To
        </h3>
        <p className="font-medium text-lg">{data.clientName || "Client Name"}</p>
        {data.clientAddress && (
          <p className="text-gray-600 whitespace-pre-line">{data.clientAddress}</p>
        )}
        {data.clientEmail && <p className="text-gray-600">{data.clientEmail}</p>}
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 font-semibold">Description</th>
              <th className="text-right py-3 font-semibold">Qty</th>
              <th className="text-right py-3 font-semibold">Rate</th>
              <th className="text-right py-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">{item.description || "---"}</td>
                  <td className="text-right py-3">{item.quantity}</td>
                  <td className="text-right py-3">{sym}{item.rate.toFixed(2)}</td>
                  <td className="text-right py-3">{sym}{item.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{sym}{subtotal.toFixed(2)}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax ({data.taxRate}%):</span>
              <span className="font-medium">{sym}{taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-gray-300">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold">{sym}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{data.notes}</p>
        </div>
      )}

      {/* Terms */}
      {data.termsAndConditions && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Terms and Conditions
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">{data.termsAndConditions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        Thank you for your business!
      </div>
    </div>
  );
}
