"use client"

import { toast } from "sonner";

import { useEffect, useMemo, useState } from "react";

type Status = "Paid" | "Sent" | "Overdue" | "Draft";

type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  initials: string;
  gradient: string;
};

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type Invoice = {
  id: string;
  number: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: Status;
  items: LineItem[];
  notes: string;
  taxRate: number;
};

const CLIENTS: Client[] = [
  { id: "c1", name: "Maya Chen", company: "Acme Robotics", email: "maya@acmerobotics.com", initials: "MC", gradient: "from-rose-500 to-pink-600" },
  { id: "c2", name: "Daniel Okafor", company: "Northwind Labs", email: "daniel@northwindlabs.co", initials: "DO", gradient: "from-sky-500 to-indigo-600" },
  { id: "c3", name: "Priya Iyer", company: "Helio Foods", email: "priya@heliofoods.com", initials: "PI", gradient: "from-emerald-500 to-teal-600" },
  { id: "c4", name: "Sam Whittaker", company: "Vertex Logistics", email: "sam@vertexlogistics.io", initials: "SW", gradient: "from-amber-500 to-orange-600" },
  { id: "c5", name: "Lia Romero", company: "Cobalt Studio", email: "lia@cobaltstudio.design", initials: "LR", gradient: "from-fuchsia-500 to-purple-600" },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "i1",
    number: "SB-2026-0041",
    clientId: "c1",
    issueDate: "Apr 1, 2026",
    dueDate: "May 1, 2026",
    status: "Paid",
    items: [
      { id: "l1", description: "Product design — April retainer", quantity: 1, rate: 6400 },
      { id: "l2", description: "Prototype iterations", quantity: 12, rate: 180 },
    ],
    notes: "Thanks for the quick turnaround on approvals.",
    taxRate: 0,
  },
  {
    id: "i2",
    number: "SB-2026-0042",
    clientId: "c2",
    issueDate: "Apr 5, 2026",
    dueDate: "May 5, 2026",
    status: "Sent",
    items: [
      { id: "l1", description: "Backend engineering — weeks 1–2", quantity: 80, rate: 165 },
    ],
    notes: "Wire transfer preferred — ACH details in email.",
    taxRate: 0,
  },
  {
    id: "i3",
    number: "SB-2026-0043",
    clientId: "c3",
    issueDate: "Mar 18, 2026",
    dueDate: "Apr 17, 2026",
    status: "Overdue",
    items: [
      { id: "l1", description: "Brand identity package", quantity: 1, rate: 8400 },
      { id: "l2", description: "Logo variations", quantity: 4, rate: 450 },
    ],
    notes: "",
    taxRate: 6.25,
  },
  {
    id: "i4",
    number: "SB-2026-0044",
    clientId: "c4",
    issueDate: "Apr 8, 2026",
    dueDate: "May 8, 2026",
    status: "Sent",
    items: [
      { id: "l1", description: "Full-stack development — sprint 12", quantity: 75, rate: 160 },
      { id: "l2", description: "Code review & architecture session", quantity: 3, rate: 225 },
    ],
    notes: "",
    taxRate: 0,
  },
  {
    id: "i5",
    number: "SB-2026-0045",
    clientId: "c5",
    issueDate: "Apr 10, 2026",
    dueDate: "May 10, 2026",
    status: "Paid",
    items: [
      { id: "l1", description: "Marketing site redesign", quantity: 1, rate: 12000 },
    ],
    notes: "Paid via wire — thank you!",
    taxRate: 0,
  },
  {
    id: "i6",
    number: "SB-2026-0046",
    clientId: "c1",
    issueDate: "Apr 11, 2026",
    dueDate: "May 11, 2026",
    status: "Draft",
    items: [
      { id: "l1", description: "Design system — Phase 2", quantity: 1, rate: 9500 },
    ],
    notes: "",
    taxRate: 0,
  },
  {
    id: "i7",
    number: "SB-2026-0040",
    clientId: "c2",
    issueDate: "Mar 5, 2026",
    dueDate: "Apr 5, 2026",
    status: "Paid",
    items: [
      { id: "l1", description: "DevOps consulting", quantity: 40, rate: 175 },
    ],
    notes: "",
    taxRate: 0,
  },
  {
    id: "i8",
    number: "SB-2026-0047",
    clientId: "c4",
    issueDate: "Apr 9, 2026",
    dueDate: "May 9, 2026",
    status: "Draft",
    items: [
      { id: "l1", description: "API integration — Stripe + webhook handlers", quantity: 22, rate: 180 },
    ],
    notes: "",
    taxRate: 0,
  },
  {
    id: "i9",
    number: "SB-2026-0039",
    clientId: "c3",
    issueDate: "Mar 1, 2026",
    dueDate: "Apr 1, 2026",
    status: "Paid",
    items: [
      { id: "l1", description: "Website maintenance retainer — March", quantity: 1, rate: 1800 },
    ],
    notes: "",
    taxRate: 0,
  },
  {
    id: "i10",
    number: "SB-2026-0048",
    clientId: "c5",
    issueDate: "Apr 10, 2026",
    dueDate: "Apr 25, 2026",
    status: "Sent",
    items: [
      { id: "l1", description: "E-commerce integration audit", quantity: 1, rate: 3200 },
    ],
    notes: "Due in 15 days per NDA.",
    taxRate: 0,
  },
];

function invoiceTotal(inv: Invoice) {
  const subtotal = inv.items.reduce((s, l) => s + l.quantity * l.rate, 0);
  const tax = subtotal * (inv.taxRate / 100);
  return subtotal + tax;
}

const statusColor = (s: Status) =>
  s === "Paid"
    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
    : s === "Sent"
    ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
    : s === "Overdue"
    ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
    : "bg-slate-500/15 text-slate-700 dark:text-slate-300";

export default function InvoiceGenerator() {
  const [dark, setDark] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [view, setView] = useState<"dashboard" | "create" | "preview">("dashboard");
  const [selected, setSelected] = useState<Invoice | null>(null);

  // Form state
  const [formClientId, setFormClientId] = useState(CLIENTS[0].id);
  const [formItems, setFormItems] = useState<LineItem[]>([
    { id: "l1", description: "Design sprint — week 1", quantity: 1, rate: 4500 },
  ]);
  const [formNotes, setFormNotes] = useState("");
  const [formTaxRate, setFormTaxRate] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("solaris-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("solaris-theme", next ? "dark" : "light");
  };

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + invoiceTotal(i), 0);
    const outstanding = invoices
      .filter((i) => i.status === "Sent" || i.status === "Overdue")
      .reduce((s, i) => s + invoiceTotal(i), 0);
    const overdue = invoices
      .filter((i) => i.status === "Overdue")
      .reduce((s, i) => s + invoiceTotal(i), 0);
    const draft = invoices.filter((i) => i.status === "Draft").length;
    return { paid, outstanding, overdue, draft };
  }, [invoices]);

  const createInvoice = () => {
    const newInvoice: Invoice = {
      id: `i${Date.now()}`,
      number: `SB-2026-${String(50 + invoices.length).padStart(4, "0")}`,
      clientId: formClientId,
      issueDate: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Draft",
      items: formItems,
      notes: formNotes,
      taxRate: formTaxRate,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelected(newInvoice);
    setView("preview");
    setFormItems([{ id: "l1", description: "", quantity: 1, rate: 0 }]);
    setFormNotes("");
  };

  const addLineItem = () => {
    setFormItems((prev) => [
      ...prev,
      { id: `l${prev.length + 1}`, description: "", quantity: 1, rate: 0 },
    ]);
  };

  const updateLineItem = (i: number, patch: Partial<LineItem>) => {
    setFormItems((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  const removeLineItem = (i: number) => {
    setFormItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const formSubtotal = formItems.reduce((s, l) => s + l.quantity * l.rate, 0);
  const formTax = formSubtotal * (formTaxRate / 100);
  const formTotal = formSubtotal + formTax;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
            💸
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">Solaris Bill</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Invoice generator
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {view !== "dashboard" && (
            <button
              type="button"
              onClick={() => {
                setView("dashboard");
                setSelected(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              ← Dashboard
            </button>
          )}
          {view === "dashboard" && (
            <button
              type="button"
              onClick={() => setView("create")}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            >
              + New invoice
            </button>
          )}
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {view === "dashboard" && (
        <>
          <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Paid this month"
              value={`$${totals.paid.toLocaleString()}`}
              tint="from-emerald-500 to-teal-600"
            />
            <StatCard
              label="Outstanding"
              value={`$${totals.outstanding.toLocaleString()}`}
              tint="from-sky-500 to-indigo-600"
            />
            <StatCard
              label="Overdue"
              value={`$${totals.overdue.toLocaleString()}`}
              tint="from-rose-500 to-pink-600"
              alert={totals.overdue > 0}
            />
            <StatCard
              label="Drafts"
              value={totals.draft.toString()}
              tint="from-amber-500 to-orange-600"
            />
          </section>

          <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
                <h2 className="font-semibold">Recent invoices</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {invoices.length} total
                </span>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-5 py-3 text-left font-semibold">Invoice</th>
                    <th className="px-5 py-3 text-left font-semibold">Client</th>
                    <th className="px-5 py-3 text-left font-semibold">Due</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 8).map((inv) => {
                    const client = CLIENTS.find((c) => c.id === inv.clientId)!;
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => {
                          setSelected(inv);
                          setView("preview");
                        }}
                        className="cursor-pointer border-t border-slate-100 transition hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:bg-emerald-500/5"
                      >
                        <td className="px-5 py-3 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {inv.number}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${client.gradient} text-[10px] font-semibold text-white`}
                            >
                              {client.initials}
                            </div>
                            <div>
                              <div className="font-medium">{client.company}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {client.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                          {inv.dueDate}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">
                          ${invoiceTotal(inv).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColor(inv.status)}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Clients
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {CLIENTS.length}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {CLIENTS.map((c) => {
                  const count = invoices.filter((i) => i.clientId === c.id).length;
                  return (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${c.gradient} text-xs font-semibold text-white`}
                      >
                        {c.initials}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{c.company}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {c.email}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </section>
        </>
      )}

      {view === "create" && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              New invoice
            </h1>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Bill to
                </span>
                <select
                  value={formClientId}
                  onChange={(e) => setFormClientId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  {CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} — {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Line items
                </h3>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  + Add line
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {formItems.map((l, i) => (
                  <div key={l.id} className="grid grid-cols-[1fr_70px_100px_auto] gap-2">
                    <input
                      value={l.description}
                      onChange={(e) => updateLineItem(i, { description: e.target.value })}
                      placeholder="Description"
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <input
                      type="number"
                      value={l.quantity}
                      onChange={(e) =>
                        updateLineItem(i, { quantity: Number(e.target.value) })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <input
                      type="number"
                      value={l.rate}
                      onChange={(e) =>
                        updateLineItem(i, { rate: Number(e.target.value) })
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(i)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Notes
                </span>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Thanks for your business. Wire transfer preferred — ACH details in the email."
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="mt-4 flex items-center justify-between text-sm">
                <span>Tax rate</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formTaxRate}
                    onChange={(e) => setFormTaxRate(Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                  <span className="text-slate-500 dark:text-slate-400">%</span>
                </div>
              </label>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Summary
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
                <dd>${formSubtotal.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Tax ({formTaxRate}%)</dt>
                <dd>${formTax.toFixed(2)}</dd>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-semibold dark:border-slate-800">
                <dt>Total</dt>
                <dd>${formTotal.toLocaleString()}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={createInvoice}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            >
              Create invoice
            </button>
          </aside>
        </section>
      )}

      {view === "preview" && selected && (
        <section className="mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white">
                    💸
                  </span>
                  <div>
                    <div className="font-semibold">Solaris Bill</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      bill@solaris.demo
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Invoice
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {selected.number}
                </div>
                <span
                  className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColor(selected.status)}`}
                >
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Bill to
                </div>
                <div className="mt-2 font-semibold">
                  {CLIENTS.find((c) => c.id === selected.clientId)?.company}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {CLIENTS.find((c) => c.id === selected.clientId)?.name}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {CLIENTS.find((c) => c.id === selected.clientId)?.email}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Issued
                </div>
                <div className="mt-2 font-semibold">{selected.issueDate}</div>
                <div className="mt-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Due
                </div>
                <div className="mt-2 font-semibold">{selected.dueDate}</div>
              </div>
            </div>

            <table className="mt-8 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="py-3 text-left font-semibold">Description</th>
                  <th className="py-3 text-right font-semibold">Qty</th>
                  <th className="py-3 text-right font-semibold">Rate</th>
                  <th className="py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selected.items.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-4">{l.description}</td>
                    <td className="py-4 text-right">{l.quantity}</td>
                    <td className="py-4 text-right">${l.rate.toLocaleString()}</td>
                    <td className="py-4 text-right font-semibold">
                      ${(l.quantity * l.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <dl className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
                  <dd>${selected.items.reduce((s, l) => s + l.quantity * l.rate, 0).toLocaleString()}</dd>
                </div>
                {selected.taxRate > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">
                      Tax ({selected.taxRate}%)
                    </dt>
                    <dd>
                      $
                      {(
                        selected.items.reduce((s, l) => s + l.quantity * l.rate, 0) *
                        (selected.taxRate / 100)
                      ).toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-semibold dark:border-slate-800">
                  <dt>Total</dt>
                  <dd>${invoiceTotal(selected).toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            {selected.notes && (
              <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wide">Notes</span>
                <p className="mt-1">{selected.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
             onClick={() => toast("Generating PDF...")}>
              📥 Download PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setInvoices((prev) =>
                  prev.map((i) => (i.id === selected.id ? { ...i, status: "Sent" } : i))
                );
                setSelected({ ...selected, status: "Sent" });
              }}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            >
              Send invoice
            </button>
          </div>
        </section>
      )}

      <footer className="mt-16 text-center text-xs text-slate-400">
        Demo product — all client-side. © {new Date().getFullYear()} Solaris Bill.
      </footer>
    </main>
  );
}

function StatCard({
  label,
  value,
  tint,
  alert,
}: {
  label: string;
  value: string;
  tint: string;
  alert?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${tint} opacity-15`} />
      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div
          className={`mt-2 text-2xl font-bold ${alert ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
