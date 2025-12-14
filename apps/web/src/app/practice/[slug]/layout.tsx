import type { Metadata } from "next";
import { INITIAL_TEMPLATES } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find(t => t.slug === slug);

  if (!template) {
    return {
      title: 'Practice Not Found',
      description: 'The requested practice challenge could not be found.',
    };
  }

  const title = `${template.name} - Code Practice`;
  const description = `Practice ${template.name} with our interactive code editor. ${template.shortDescription}`;
  const url = `https://frontenddummies.compractice/${slug}`;

  return {
    title,
    description,
    keywords: [...template.tags, ...template.techStack, 'code editor', 'practice', 'coding challenge', 'interactive'],
    authors: [{ name: template.author }],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [
        {
          url: template.imageUrl,
          width: 1200,
          height: 630,
          alt: `${template.name} Practice`,
        },
      ],
      publishedTime: template.createdAt,
      authors: [template.author],
      tags: [...template.tags, 'practice'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [template.imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

