import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Explore Frontend Challenges',
  description: 'Browse our complete collection of frontend coding challenges, system design problems, and interactive practice exercises. Filter by category and difficulty level.',
  keywords: ['frontend challenges', 'coding practice', 'web development', 'javascript exercises', 'react challenges', 'css problems', 'algorithm practice', "frontend-machine-coding-questions"],
  openGraph: {
    type: 'website',
    url: 'https://frontenddummies.com/explore',
    title: 'Explore Frontend Challenges - Frontend Dummies',
    description: 'Browse our complete collection of frontend coding challenges, system design problems, and interactive practice exercises.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Explore Frontend Challenges',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Frontend Challenges - Frontend Dummies',
    description: 'Browse our complete collection of frontend coding challenges, system design problems, and interactive practice exercises.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://frontenddummies.com/explore',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
