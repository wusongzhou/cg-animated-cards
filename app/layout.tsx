import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GSAP Style - Animated Experience",
  description: "Animate Anything - The animation platform that pushes the limits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
