import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris Bill — Invoice Generator",
  description:
    "Create, send, and track invoices. Built for freelancers and small agencies who want a tool that doesn't hate them.",
  openGraph: {
    title: "Solaris Bill — Invoice Generator",
    description: "Invoice generator for freelancers and small agencies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
