import type { Metadata } from "next";
import { INITIAL_TEMPLATES } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find(t => t.slug === slug);

  if (!template) {
    return {
      title: 'Challenge Not Found',
      description: 'The requested challenge could not be found.',
    };
  }

  const title = `${template.name} - ${template.category}`;
  const description = template.shortDescription;
  const url = `https://frontenddummies.vercel.app/design/${slug}`;

  return {
    title,
    description,
    keywords: [...template.tags, ...template.techStack, template.category, 'frontend challenge', 'coding practice'],
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
          alt: template.name,
        },
      ],
      publishedTime: template.createdAt,
      authors: [template.author],
      tags: template.tags,
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

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

