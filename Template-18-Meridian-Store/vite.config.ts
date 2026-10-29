import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site';
import { productInputs } from './src/config/products';
import { collections } from './src/config/collections';
import { articles } from './src/config/journal';
import { legalPages } from './src/config/legal';

const siteUrl = (process.env.VITE_SITE_URL || site.url).replace(/\/$/, '');

/**
 * Generates index.html metadata, robots.txt and sitemap.xml from src/config so that
 * SEO output always matches the central configuration.
 */
function seoFiles(): Plugin {
  const routes = [
    '/', '/shop', '/collections', '/about', '/journal', '/faq', '/contact', '/demo',
    ...collections.map((c) => `/collections/${c.slug}`),
    ...productInputs.filter((p) => p.status !== 'archived').map((p) => `/products/${p.slug}`),
    ...articles.map((a) => `/journal/${a.slug}`),
    ...legalPages.map((p) => `/legal/${p.slug}`)
  ];
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'meridian-store-seo',
    transformIndexHtml(html) {
      const tags = [
        `<title>${esc(site.seo.defaultTitle)}</title>`,
        `<meta name="description" content="${esc(site.seo.defaultDescription)}" />`,
        `<meta name="theme-color" content="${site.seo.themeColor}" />`,
        `<link rel="canonical" href="${siteUrl}/" />`,
        `<link rel="icon" type="image/svg+xml" href="${site.brand.favicon}" />`,
        `<meta property="og:title" content="${esc(site.seo.defaultTitle)}" />`,
        `<meta property="og:description" content="${esc(site.seo.defaultDescription)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:url" content="${siteUrl}/" />`,
        `<meta property="og:site_name" content="${esc(site.brand.name)}" />`,
        `<meta property="og:image" content="${siteUrl}${site.seo.ogImage}" />`,
        `<meta name="twitter:card" content="${site.seo.twitterCard}" />`
      ].join('\n    ');
      return html.replace(/<title>.*?<\/title>/, tags);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = routes.map((r) => `  <url><loc>${siteUrl}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nDisallow: /orders\nDisallow: /wishlist\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
    }
  };
}

export default defineConfig({
  plugins: [react(), seoFiles()],
  server: { port: 5173 },
  build: { target: 'es2022', sourcemap: false }
});
