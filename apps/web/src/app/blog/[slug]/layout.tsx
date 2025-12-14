import type { Metadata } from "next";
import { INITIAL_TEMPLATES } from '@/lib/constants';
import { Category } from '@/types/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find(t => t.slug === slug && t.category === Category.BLOGS);

  if (!template) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog could not be found.',
    };
  }

  const title = `${template.name} - Blog`;
  const description = template.shortDescription;
  const url = `https://frontenddummies.comblog/${slug}`;

  return {
    title,
    description,
    keywords: [...template.tags, ...template.techStack, 'blog', 'frontend development', 'tutorial'],
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

