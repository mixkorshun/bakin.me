import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const about = defineCollection({
	loader: file('./content/about/profile.yml'),
	schema: z.object({
		name: z.string(),
		fullName: z.string(),
		role: z.string(),
		location: z.string(),
		intro: z.string(),
		socials: z.object({
			github: z.string(),
			linkedin: z.string(),
		})
	}),
});

export const collections = { blog, about };
