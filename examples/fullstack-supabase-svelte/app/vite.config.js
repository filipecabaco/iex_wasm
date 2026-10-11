import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';

const base = /** @type {'' | `/${string}`} */ (process.env.SNOWGLOBE_BASE ?? '');
export default defineConfig({
  define: { __SNOWGLOBE_BASE__: JSON.stringify(base) },
  // Preserve shadcn-svelte's conventional $lib imports on SvelteKit 3.
  plugins: [tailwindcss(), sveltekit({ adapter: adapter({ fallback: 'index.html' }), paths: { base }, alias: { '$lib': 'src/lib' } })]
});
