// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import readingTime from 'reading-time';
import { visit } from 'unist-util-visit';

import tailwindcss from '@tailwindcss/vite';

function remarkReadingTime() {
	return (/** @type {import('mdast').Root} */ tree, /** @type {any} */ file) => {
		/** @type {string[]} */
		const text = [];
		visit(tree, 'text', (node) => text.push(node.value));
		const stats = readingTime(text.join(' '));
		file.data.astro.frontmatter.minutesRead = Math.max(1, Math.round(stats.minutes));
	};
}

export default defineConfig({
	site: 'https://bakin.me',
	integrations: [mdx(), sitemap()],

	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Geist',
			cssVariable: '--font-geist',
			weights: [400, 500, 600, 700],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			weights: [400, 500],
		},
	],

	markdown: {
		remarkPlugins: [remarkReadingTime],
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
