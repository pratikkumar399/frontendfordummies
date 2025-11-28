# Frontend For Dummies

A clean and modern platform to browse, preview, and explore frontend UI templates.
This project lets developers view live demos of UI designs and quickly jump to the GitHub repository to study or practice the implementation.

## Overview

Frontend For Dummies is a Next.js-based gallery where you can publish your own frontend UI designs.
Users can:

• Browse multiple UI templates
• View detailed previews
• Open a live demo
• Redirect to GitHub to see the source code
• Filter designs using search and tags
• Switch between light and dark theme
• (Optional) Add new templates using an admin UI

The project is structured for scalability and easy content updates. Templates are stored in structured data, making it simple to add more designs.

## Features

• Fully responsive UI
• Clean and modern design using TailwindCSS
• Dynamic design detail pages
• Dedicated "View Demo" and "View Code on GitHub" actions
• Search and tag-based filtering
• Developer-friendly folder structure
• TypeScript support throughout the project
• Optional admin form to add new UI templates
• SEO-ready metadata
• Easy to deploy on Vercel

## Tech Stack

• Next.js (App Router)
• React
• TypeScript
• TailwindCSS
• Optional: Markdown rendering for template descriptions

## Project Structure

```
frontendfordummies/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                Home page
│   ├── design/
│   │   └── [slug]/
│   │       └── page.tsx       Template detail page
│   ├── admin/
│   │   └── page.tsx           Admin template creation page (optional)
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TemplateCard.tsx
│   ├── TemplateGrid.tsx
│   ├── TemplateDetail.tsx
│
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pratikkumar399/frontendfordummies.git
cd frontendfordummies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The project should now be running at:
[http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Adding a New UI Template

Templates are stored in `data/templates.json`.
Each entry looks like this:

```json
{
  "name": "Glassmorphism Dashboard",
  "slug": "glass-dashboard",
  "description": "A modern glass-style dashboard UI with smooth hover effects.",
  "image": "/images/glass-dashboard.png",
  "demoUrl": "https://your-demo-link.com",
  "githubUrl": "https://github.com/yourusername/design-repo",
  "tags": ["dashboard", "glassmorphism", "modern"]
}
```

Add a new object to this file and it will automatically appear on the website.

## Deployment

This project is ready to deploy on Vercel without configuration.

1. Push your code to GitHub
2. Import the repo in Vercel
3. Deploy

## Contributing

If you want to expand the project:

• Add pagination
• Add categories
• Add animations using Framer Motion
• Add user authentication for the admin panel
• Make templates fetched from a headless CMS instead of a JSON file

Pull requests are welcome.

## License

MIT License. Free to use and extend.

---

If you want, I can also generate:
• A README with screenshots
• A marketing-friendly README using images and sections
• A fully SEO-optimized README for GitHub search
• A developer onboarding README for collaborators
