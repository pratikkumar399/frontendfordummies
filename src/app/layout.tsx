import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/AppShell";
import { PWARegister } from "@/components/PWARegister";

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
  metadataBase: new URL('https://www.frontenddummies.com/'),
  title: {
    default: "Frontend Dummies - Master Frontend Development Skills",
    template: "%s | Frontend Dummies"
  },
  description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects. Learn React, JavaScript, CSS, algorithms, and ace your interviews.",
  keywords: ["frontend development", "javascript", "react", "coding challenges", "system design", "web development", "interview preparation", "algorithms", "css", "typescript"],
  authors: [{ name: "Frontend Dummies Team" }],
  creator: "pratikrai",
  publisher: "pratikrai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.frontenddummies.com/",
    siteName: "Frontend Dummies",
    title: "Frontend Dummies - Master Frontend Development Skills",
    description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Frontend Dummies Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Dummies - Master Frontend Development Skills",
    description: "A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.",
    images: ["/og-image.png"],
    creator: "@pratikrai",
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
  manifest: '/manifest.json',
  other: {
    'google-adsense-account': 'ca-pub-9139551096547240',
    'google-site-verification': 'j-b9jDccBDlDqf9PVxBp303sB2fvZXWZU1OIyoTJSbs',
    'apple-mobile-web-app-title': 'FDummy',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#22c55e', // Match manifest theme color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://placehold.co" />
        <link rel="preconnect" href="https://cdn.pixabay.com" />
      </head>
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
        <PWARegister />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
