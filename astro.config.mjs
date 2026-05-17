// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://squarlsking.github.io',
  output: 'static',
  redirects: {
    '/math-notes': '/posts',
    '/paper-thoughts': '/posts',
    '/life-travel': '/posts',
    '/tags': '/posts'
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});