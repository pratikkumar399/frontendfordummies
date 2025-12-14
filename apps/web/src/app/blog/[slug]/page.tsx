import React from 'react';
import { getChallengeBySlug } from '@/lib/challenges';
import { BackButton } from '@/components/design-detail/BackButton';
import { ChallengeDescription } from '@/components/design-detail/ChallengeDescription';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Category } from '@/types/types';
import styles from './page.module.css';

// Define params as a Promise for Next.js 15 compatibility
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template || template.category !== Category.BLOGS) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: template.name,
    description: template.shortDescription,
    keywords: template.tags,
    openGraph: {
      title: template.name,
      description: template.shortDescription,
      images: [template.imageUrl],
      type: 'article',
      publishedTime: template.createdAt,
      authors: [template.author],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template || template.category !== Category.BLOGS) {
    return notFound();
  }

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": template.name,
    "description": template.shortDescription,
    "image": template.imageUrl,
    "datePublished": template.createdAt,
    "dateModified": template.createdAt,
    "author": {
      "@type": "Person",
      "name": template.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Frontend For Dummies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://frontenddummies.com/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://frontenddummies.com/blog/${template.slug}`
    },
    "keywords": template.tags.join(', '),
    "articleBody": template.fullDescription
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-dark-bg pt-24 pb-12 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`${styles.glowBlob} bg-primary-600/5 w-[800px] h-[800px] top-[0] right-[-200px] blur-[120px]`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <BackButton href="/blog" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="rounded-2xl overflow-hidden border border-dark-border shadow-2xl bg-dark-card aspect-video relative group">
                <Image
                  src={template.imageUrl} 
                  alt={template.name}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain opacity-90"
                  priority
                />
              </div>
              
              <ChallengeDescription template={template} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

