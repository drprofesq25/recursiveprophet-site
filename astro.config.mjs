import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deliberately host-agnostic: no adapter is committed until the deploy target is
// chosen (see AGENTS.md "Stack"). Static output builds identically anywhere.
export default defineConfig({
  site: 'https://recursiveprophet.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/first-file/requested/' && path !== '/first-file/problem/';
      },
    }),
  ],
});
