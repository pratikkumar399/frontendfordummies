import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://frontendfordummies-tonv.vercel.app/'),
  title: {
    default: "Frontend For Dummies - Master Frontend Development Skills",
    template: "%s | Frontend For Dummies"
  },
  description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects. Learn React, JavaScript, CSS, algorithms, and ace your interviews.",
  keywords: ["frontend development", "javascript", "react", "coding challenges", "system design", "web development", "interview preparation", "algorithms", "css", "typescript"],
  authors: [{ name: "Frontend For Dummies Team" }],
  creator: "Frontend For Dummies",
  publisher: "Frontend For Dummies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://frontendfordummies-tonv.vercel.app/",
    siteName: "Frontend For Dummies",
    title: "Frontend For Dummies - Master Frontend Development Skills",
    description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Frontend For Dummies Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend For Dummies - Master Frontend Development Skills",
    description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.",
    images: ["/og-image.png"],
    creator: "@frontendfordummies",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f10' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${firaCode.variable} antialiased bg-dark-bg text-dark-text`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J9C1KGRP3Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J9C1KGRP3Z');
          `}
        </Script>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
