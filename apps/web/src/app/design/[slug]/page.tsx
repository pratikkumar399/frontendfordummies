import React from 'react';
import { getChallengeBySlug } from '@/lib/challenges';
import { BackButton } from '@/components/design-detail/BackButton';
import { ChallengeActions } from '@/components/design-detail/ChallengeActions';
import { ChallengeDescriptionServer } from '@/components/design-detail/ChallengeDescriptionServer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import styles from './page.module.css';

// Define params as a Promise for Next.js 15 compatibility
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template) {
    return {
      title: 'Challenge Not Found',
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
    },
  };
}

export default async function DetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template) {
    return notFound();
  }

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": template.name,
    "description": template.shortDescription,
    "provider": {
      "@type": "Organization",
      "name": "Frontend Dummies",
      "sameAs": "https://frontenddummies.com/"
    },
    "educationalLevel": template.tags.find(t => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Intermediate',
    "teaches": template.techStack,
    "keywords": template.tags.join(', '),
    "datePublished": template.createdAt,
    "author": {
      "@type": "Person",
      "name": template.author
    },
    "image": template.imageUrl,
    "url": `https://frontenddummies.com/design/${template.slug}`,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT45M"
    }
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          

          <div className="mb-8">
            <BackButton />
          </div>

          {/* Single-column layout inspired by article page */}
          <div className="space-y-10 lg:space-y-12">
            {/* Header section */}
            <header className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-400 uppercase tracking-[0.2em]">
                <span className="text-primary-400">Starter</span>
                {template.tags
                  .filter(tag => !['Easy', 'Medium', 'Hard'].includes(tag))
                  .slice(0, 2)
                  .map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-dark-bg/60 border border-dark-border text-[10px] normal-case tracking-normal text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>

              {/* Title + subtitle full width */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  {template.name}
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base">
                  {template.shortDescription}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-300">
                    By {template.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span>{template.createdAt}</span>
                  {template.tags.find(tag => ['Easy', 'Medium', 'Hard'].includes(tag)) && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="uppercase tracking-[0.18em] text-zinc-400">
                        {template.tags.find(tag => ['Easy', 'Medium', 'Hard'].includes(tag))}
                      </span>
                    </>
                  )}
                </div>

                <div className="w-full max-w-sm sm:w-auto sm:flex-1 sm:max-w-xs">
                  <ChallengeActions template={template} />
                </div>
              </div>
            </header>

            <div className="overflow-hidden ">
              <div className="aspect-video relative group">
                <Image
                  src={template.imageUrl} 
                  alt={template.name}
                  width={1000}
                  height={1000}
                  className="w-full h-full rounded-[12px]  lg:object-cover opacity-90"
                  priority
                />
              </div>

              <div className="pt-6 ">
                <ChallengeDescriptionServer template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
