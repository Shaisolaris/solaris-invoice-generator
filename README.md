# Solaris Bill — Invoice Generator

A small, fast invoice tool for freelancers and agencies. Dashboard with totals, sortable invoice list, create-invoice form with line items, and a clean PDF-style preview ready to print or send.

**Live demo:** https://shaisolaris.github.io/solaris-invoice-generator/

## What it shows

- **Dashboard view** with 4 KPI cards (Paid, Outstanding, Overdue, Drafts) + clients sidebar
- **10 seeded invoices** across 5 clients with realistic statuses (Paid / Sent / Overdue / Draft)
- **Create invoice flow** — client picker, dynamic line items (add/remove), tax rate, notes, live summary
- **PDF-style preview** — clean invoice layout with line items, subtotal/tax/total, client block, notes
- **Send invoice** button flips status from Draft → Sent live in the dashboard
- **Click any row** on the dashboard to jump to the preview
- **Dark mode** with localStorage persistence
- Fully responsive

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 3
- Deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## License

MIT.
