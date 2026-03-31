import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birthday Blossom",
  description: "For Ratcha, with all my heart",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}