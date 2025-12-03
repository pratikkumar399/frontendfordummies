import type { Metadata } from "next";
import { INITIAL_TEMPLATES } from '@/lib/contants';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = INITIAL_TEMPLATES.find(t => t.slug === slug);

  if (!template) {
    return {
      title: 'Snippet Practice Not Found',
      description: 'The requested snippet practice could not be found.',
    };
  }

  const title = `${template.name} - Snippet Practice`;
  const description = `Master ${template.name} with interactive code snippets. ${template.shortDescription}`;
  const url = `https://frontendfordummies-tonv.vercel.app//snippet-practice/${slug}`;

  return {
    title,
    description,
    keywords: [...template.tags, ...template.techStack, 'code snippets', 'javascript quiz', 'output prediction', 'coding practice'],
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
          alt: `${template.name} Snippets`,
        },
      ],
      publishedTime: template.createdAt,
      authors: [template.author],
      tags: [...template.tags, 'snippets', 'quiz'],
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

export default function SnippetPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

