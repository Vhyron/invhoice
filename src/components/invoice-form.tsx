"use client";

import { useState, useRef } from "react";
import { InvoicePreview } from "@/components/invoice-preview";
import { type InvoiceData } from "@/types/invoice";
import { CURRENCIES, getCurrencySymbol } from "@/lib/currencies";

interface InvoiceFormProps {
  defaultData: InvoiceData;
  onSave: (data: InvoiceData) => Promise<void>;
  saveLabel?: string;
}

export function InvoiceForm({
  defaultData,
  onSave,
  saveLabel = "Save Invoice",
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxAmount;
  const sym = getCurrencySymbol(formData.currency);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${formData.invoiceNumber || "draft"}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save invoice");
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent";
  const itemInputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
        {/* Company Details */}
        <section>
          <h2 className="text-xl font-medium mb-4">Your Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                required
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <textarea
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                rows={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={formData.companyPhone}
                onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Client Details */}
        <section>
          <h2 className="text-xl font-medium mb-4">Bill To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Client Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Client Address</label>
              <textarea
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Invoice Details */}
        <section>
          <h2 className="text-xl font-medium mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={inputClass}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Invoice Number *</label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="INV-001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Invoice Date *</label>
              <input
                type="date"
                required
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-12 md:col-span-5">
                  <label className={labelClass}>Description *</label>
                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Service or product description"
                    className={itemInputClass}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className={labelClass}>Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                    }
                    className={itemInputClass}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className={labelClass}>Rate *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", parseFloat(e.target.value) || 0)
                    }
                    className={itemInputClass}
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <label className={labelClass}>Amount</label>
                  <input
                    type="text"
                    value={`${sym}${item.amount.toFixed(2)}`}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tax + Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-72 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Subtotal</span>
                <span className="font-medium">{sym}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Tax (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <span className="text-gray-600 text-sm min-w-[80px] text-right">
                    {sym}{taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-semibold pt-3 border-t border-gray-300">
                <span>Total</span>
                <span>{sym}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notes and Terms */}
        <section>
          <h2 className="text-xl font-medium mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes or payment instructions..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Terms and Conditions</label>
              <textarea
                value={formData.termsAndConditions}
                onChange={(e) =>
                  setFormData({ ...formData, termsAndConditions: e.target.value })
                }
                rows={3}
                placeholder="Payment terms, late fees, etc..."
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : saveLabel}
          </button>
        </div>
      </form>

      {/* Right: Live Preview */}
      <div className="sticky top-24">
        <h2 className="text-xl font-normal mb-4 text-gray-600">Live Preview</h2>
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-lg shadow-sm border border-gray-200">
          <div ref={previewRef}>
            <InvoicePreview data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
