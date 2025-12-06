import { MetadataRoute } from 'next';
import { INITIAL_TEMPLATES } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://frontenddummies.vercel.app';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic challenge detail pages
  const designPages = INITIAL_TEMPLATES.map((template) => ({
    url: `${baseUrl}/design/${template.slug}`,
    lastModified: new Date(template.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic practice pages (only for templates with starter code)
  const practicePages = INITIAL_TEMPLATES
    .filter((template) => template.starterCode)
    .map((template) => ({
      url: `${baseUrl}/practice/${template.slug}`,
      lastModified: new Date(template.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Dynamic snippet practice pages (only for templates with snippets)
  const snippetPages = INITIAL_TEMPLATES
    .filter((template) => template.snippets && template.snippets.length > 0)
    .map((template) => ({
      url: `${baseUrl}/snippet-practice/${template.slug}`,
      lastModified: new Date(template.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...designPages,
    ...practicePages,
    ...snippetPages,
  ];
}

