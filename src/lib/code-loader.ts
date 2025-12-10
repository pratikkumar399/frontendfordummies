import fs from 'fs/promises';
import path from 'path';

const DEMO_PATHS: Record<string, string> = {
  'nested-comments-system': 'src/components/demos/NestedCommentsSystem',
  'infinite-scroll-component': 'src/components/demos/InfiniteScrollDemo.tsx',
};

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  language?: string;
  children?: FileNode[];
}

async function getFilesRecursively(dir: string, basePath: string): Promise<FileNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  // Sort entries: directories first, then files, alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const nodes: FileNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const children = await getFilesRecursively(fullPath, basePath);
      nodes.push({
        name: entry.name,
        type: 'directory',
        path: relativePath,
        children
      });
    } else {
      const content = await fs.readFile(fullPath, 'utf-8');
      const ext = path.extname(entry.name).toLowerCase();
      let language = 'javascript';
      
      if (ext === '.ts' || ext === '.tsx') language = 'typescript';
      else if (ext === '.css') language = 'css';
      else if (ext === '.json') language = 'json';
      
      nodes.push({
        name: entry.name,
        type: 'file',
        path: relativePath,
        content,
        language
      });
    }
  }

  return nodes;
}

export async function getDemoFiles(slug: string): Promise<FileNode[]> {
  const relativePath = DEMO_PATHS[slug];
  if (!relativePath) {
    return [];
  }

  const fullPath = path.join(process.cwd(), relativePath);
  
  try {
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      return getFilesRecursively(fullPath, fullPath);
    } else {
      const content = await fs.readFile(fullPath, 'utf-8');
      const name = path.basename(fullPath);
      const ext = path.extname(name).toLowerCase();
      let language = 'javascript';
      
      if (ext === '.ts' || ext === '.tsx') language = 'typescript';
      else if (ext === '.css') language = 'css';
      else if (ext === '.json') language = 'json';

      return [{
        name,
        type: 'file',
        path: name,
        content,
        language
      }];
    }
  } catch (error) {
    console.error(`Error reading demo files for ${slug}:`, error);
    return [];
  }
}
