import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { FontaineTransform } from 'fontaine';

// Deliberately host-agnostic: no adapter is committed until the deploy target is
// chosen (see AGENTS.md "Stack"). Static output builds identically anywhere.
export default defineConfig({
  site: 'https://recursiveprophet.com',
  trailingSlash: 'ignore',
  server: {
    allowedHosts: ['terminal.local'],
  },
  redirects: {
    '/first-file/requested': '/chapter-one/requested',
    '/first-file/problem': '/chapter-one/problem',
  },
  vite: {
    plugins: [
      FontaineTransform.vite({
        fallbacks: {
          'Cormorant Garamond': ['Georgia'],
          'Libre Baskerville': ['Georgia'],
          'DM Mono': ['Consolas', 'Courier New'],
        },
        resolvePath: (id) => new URL(`./public${id}`, import.meta.url),
      }),
    ],
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return ![
          '/first-file/requested/',
          '/first-file/problem/',
          '/chapter-one/requested/',
          '/chapter-one/problem/',
          '/chapter-one/confirmed/',
          '/404/',
        ].includes(path);
      },
    }),
  ],
});
