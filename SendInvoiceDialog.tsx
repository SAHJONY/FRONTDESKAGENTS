'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type Invoice = {
  id?: string;
  customerName?: string;
  customerEmail?: string;
  amount?: number;
  description?: string;
};

export type SendInvoiceDialogProps = {
  open?: boolean;
  onClose?: () => void;
  onSend?: (invoice: Invoice) => void | Promise<void>;
  invoice?: Invoice;
  trigger?: ReactNode;
};

export function SendInvoiceDialog({
  open = false,
  onClose,
  onSend,
  invoice,
}: SendInvoiceDialogProps) {
  const [email, setEmail] = useState(invoice?.customerEmail ?? '');
  const [amount, setAmount] = useState(invoice?.amount?.toString() ?? '');
  const [description, setDescription] = useState(invoice?.description ?? '');
  const [sending, setSending] = useState(false);

  if (!open) return null;

  async function handleSend() {
    setSending(true);
    try {
      await onSend?.({
        ...invoice,
        customerEmail: email,
        amount: Number(amount) || 0,
        description,
      });
      onClose?.();
    } finally {
      setSending(false);
    }
  }

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={sheet}>
        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>
          Send invoice
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#666' }}>
          {invoice?.customerName
            ? `To ${invoice.customerName}`
            : 'Enter the invoice details below.'}
        </p>

        <label style={lbl}>Customer email</label>
        <input
          style={inp}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="owner@business.com"
        />

        <label style={lbl}>Amount (USD)</label>
        <input
          style={inp}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1299"
        />

        <label style={lbl}>Description</label>
        <textarea
          style={{ ...inp, minHeight: 72 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Website build + first month of care"
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button
            onClick={handleSend}
            disabled={sending}
            style={{ ...btn, background: '#111', color: '#fff', flex: 1 }}
          >
            {sending ? 'Sending…' : 'Send invoice'}
          </button>
          <button
            onClick={onClose}
            style={{ ...btn, background: '#eee', color: '#111' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.5)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 9999,
  padding: 16,
};

const sheet: CSSProperties = {
  width: '100%',
  maxWidth: 440,
  background: '#fff',
  color: '#111',
  borderRadius: 14,
  padding: 24,
  boxShadow: '0 30px 60px -20px rgba(0,0,0,.5)',
};

const lbl: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  margin: '10px 0 4px',
};

const inp: CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #ddd',
  borderRadius: 8,
  font: 'inherit',
  boxSizing: 'border-box',
};

const btn: CSSProperties = {
  padding: '10px 14px',
  borderRadius: 999,
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
};

export default SendInvoiceDialog;
