import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'frontendDummy',
        short_name: 'Fdummy',
        description: 'A comprehensive platform for mastering frontend coding skills, system design, and building real-world projects.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f0f10',
        theme_color: '#22c55e',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            }
        ],
        screenshots: [
            {
                src: '/screenshots/home-wide.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide'
            },
            {
                src: '/screenshots/home-mobile.png',
                sizes: '720x1280',
                type: 'image/png',
                form_factor: 'narrow'
            }
        ]
    }
}