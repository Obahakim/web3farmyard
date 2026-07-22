import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeePn — Your Private Emotional Vault",
  description: "A privacy-first foundation for DeePn, your private emotional vault.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
