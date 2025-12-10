import React from 'react';
import { notFound } from 'next/navigation';
import { getChallengeBySlug } from '@/lib/challenges';
import { getDemoFiles } from '@/lib/code-loader';
import { CodeViewer } from '@/components/design-detail/CodeViewer';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CodePage({ params }: PageProps) {
  const { slug } = await params;
  const template = getChallengeBySlug(slug);

  if (!template) {
    return notFound();
  }

  const files = await getDemoFiles(slug);

  return (
    <CodeViewer 
      files={files} 
      title={template.name} 
      slug={slug}
    />
  );
}

