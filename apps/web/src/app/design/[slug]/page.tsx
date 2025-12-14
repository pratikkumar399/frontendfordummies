import React from 'react';
import { getChallengeBySlug } from '@/lib/challenges';
import { BackButton } from '@/components/design-detail/BackButton';
import { ChallengeActions } from '@/components/design-detail/ChallengeActions';
import { ChallengeStats } from '@/components/design-detail/ChallengeStats';
import { ChallengeDescription } from '@/components/design-detail/ChallengeDescription';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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
      "name": "Frontend For Dummies",
      "sameAs": "https://frontenddummies.com"
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
    "url": `https://frontenddummies.comdesign/${template.slug}`,
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
          <div className="glow-blob bg-primary-600/5 w-[800px] h-[800px] top-[0] right-[-200px] blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          

          <div className="mb-8">
            <BackButton />
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
              
              <ChallengeActions template={template} />
              <ChallengeDescription template={template} />
            </div>

            {/* Right Column: Meta Info Card */}
            {/* <div className="space-y-6">
              <ChallengeStats template={template} />
            </div> */}

          </div>
        </div>
      </div>
    </>
  );
}
