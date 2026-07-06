import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSamjho — GitHub Repo ko aasaan bhasha mein samjho",
  description:
    "Koi bhi GitHub repo URL daalo aur samjho project kaise kaam karta hai — folder by folder, code-wise, beginner-friendly Hinglish mein.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
