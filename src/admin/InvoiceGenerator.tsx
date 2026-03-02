import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Save, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: 'paid' | 'pending' | 'overdue';
}

const InvoiceGenerator = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 18,
    notes: '',
    status: 'pending',
  });

  const calculateAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items?.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = calculateAmount(
              Number(updatedItem.quantity),
              Number(updatedItem.rate)
            );
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
    setIsSaved(false);
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id: Date.now().toString(),
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    }));
    setIsSaved(false);
  };

  const removeItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items?.filter((item) => item.id !== id) || [],
    }));
    setIsSaved(false);
  };

  const calculateTotals = () => {
    const items = invoiceData.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const saveInvoice = () => {
    if (!invoiceData.clientName || !invoiceData.items?.length) {
      alert('Please fill in client name and add at least one item');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();
    
    const fullInvoiceData: InvoiceData = {
      id: Date.now().toString(),
      invoiceNumber: invoiceData.invoiceNumber || '',
      clientName: invoiceData.clientName || '',
      clientEmail: invoiceData.clientEmail || '',
      clientAddress: invoiceData.clientAddress || '',
      issueDate: invoiceData.issueDate || '',
      dueDate: invoiceData.dueDate || '',
      items: invoiceData.items || [],
      subtotal,
      taxAmount,
      taxRate: invoiceData.taxRate || 0,
      total,
      notes: invoiceData.notes || '',
      status: (invoiceData.status as 'paid' | 'pending' | 'overdue') || 'pending',
    };

    const existing = JSON.parse(localStorage.getItem('ojas_invoices') || '[]');
    localStorage.setItem('ojas_invoices', JSON.stringify([...existing, fullInvoiceData]));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ojas-Invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    setIsGenerating(false);
  };

  const printInvoice = () => {
    window.print();
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-offwhite mb-2">
            Invoice Generator
          </h1>
          <p className="text-offwhite/60">Create and manage client invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-offwhite mb-4">
            Invoice Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Invoice Number
              </label>
              <Input
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Status
              </label>
              <Select
                value={invoiceData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="bg-charcoal/50 border-white/10 text-offwhite focus:ring-saffron/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-white/10">
                  <SelectItem value="pending" className="text-offwhite hover:bg-white/10">Pending</SelectItem>
                  <SelectItem value="paid" className="text-offwhite hover:bg-white/10">Paid</SelectItem>
                  <SelectItem value="overdue" className="text-offwhite hover:bg-white/10">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Issue Date
              </label>
              <Input
                type="date"
                value={invoiceData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-4">
            <h3 className="font-display font-medium text-offwhite mb-3">Client Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                  Client Name *
                </label>
                <Input
                  value={invoiceData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                  Client Email
                </label>
                <Input
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                  className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                  Client Address
                </label>
                <Textarea
                  value={invoiceData.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  placeholder="Full address..."
                  rows={2}
                  className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-medium text-offwhite">Items</h3>
              <Button
                onClick={addItem}
                variant="outline"
                size="sm"
                className="border-saffron/30 text-saffron hover:bg-saffron/10 flex items-center gap-1"
              >
                <Plus size={14} />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {invoiceData.items?.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="bg-charcoal/50 border-white/10 text-offwhite text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      placeholder="Rate (₹)"
                      className="bg-charcoal/50 border-white/10 text-offwhite text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <p className="text-offwhite text-sm py-2">₹{item.amount}</p>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Notes */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                  Tax Rate (%)
                </label>
                <Input
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Notes
              </label>
              <Textarea
                value={invoiceData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes..."
                rows={2}
                className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={saveInvoice}
              className="btn-primary flex items-center gap-2"
            >
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              {isSaved ? 'Saved!' : 'Save Invoice'}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              variant="outline"
              className="border-white/20 text-offwhite hover:bg-white/10 flex items-center gap-2"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-offwhite/30 border-t-offwhite rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download PDF
            </Button>
            <Button
              onClick={printInvoice}
              variant="outline"
              className="border-white/20 text-offwhite hover:bg-white/10 flex items-center gap-2"
            >
              <Printer size={16} />
              Print
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-lg text-offwhite">
            Preview
          </h2>
          
          <div className="overflow-auto">
            <div
              ref={invoiceRef}
              className="invoice-preview bg-white w-[210mm] min-h-[297mm] relative mx-auto p-12"
              style={{
                boxShadow: '0 0 40px rgba(0,0,0,0.1)',
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-charcoal">OJAS</h1>
                  <p className="text-sm text-gray-500">Advertisement & Software Studio</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-display font-bold text-saffron">INVOICE</h2>
                  <p className="text-sm text-gray-500">{invoiceData.invoiceNumber}</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
                  <p className="font-semibold text-charcoal">{invoiceData.clientName || 'Client Name'}</p>
                  <p className="text-sm text-gray-600">{invoiceData.clientEmail}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.clientAddress}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Issue Date</p>
                    <p className="text-charcoal">
                      {invoiceData.issueDate
                        ? new Date(invoiceData.issueDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Due Date</p>
                    <p className="text-charcoal">
                      {invoiceData.dueDate
                        ? new Date(invoiceData.dueDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-saffron">
                    <th className="text-left py-2 text-sm font-semibold text-charcoal">Description</th>
                    <th className="text-center py-2 text-sm font-semibold text-charcoal">Qty</th>
                    <th className="text-right py-2 text-sm font-semibold text-charcoal">Rate</th>
                    <th className="text-right py-2 text-sm font-semibold text-charcoal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-charcoal">{item.description || '-'}</td>
                      <td className="py-3 text-center text-charcoal">{item.quantity}</td>
                      <td className="py-3 text-right text-charcoal">₹{item.rate}</td>
                      <td className="py-3 text-right text-charcoal">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-charcoal font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax ({invoiceData.taxRate}%)</span>
                    <span className="text-charcoal font-medium">₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-saffron">
                    <span className="text-lg font-semibold text-charcoal">Total</span>
                    <span className="text-lg font-bold text-saffron">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoiceData.notes && (
                <div className="mb-8">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Thank you for your business!</p>
                    <p className="text-xs text-gray-400 mt-1">
                      For queries, contact: hello@ojas.studio
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      invoiceData.status === 'paid'
                        ? 'bg-green-100 text-green-600'
                        : invoiceData.status === 'pending'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {invoiceData.status?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-preview,
          .invoice-preview * {
            visibility: visible;
          }
          .invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;
