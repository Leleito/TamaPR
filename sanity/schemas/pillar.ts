import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'number',
      title: 'Pillar Number',
      type: 'number',
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'homepageDescription',
      title: 'Homepage Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'categoryClass',
      title: 'Category CSS Class',
      type: 'string',
      options: {
        list: [
          { title: 'Ethical (olive)', value: 'cat-ethical' },
          { title: 'Hospitality (terracotta)', value: 'cat-hospitality' },
          { title: 'Lifestyle (amber)', value: 'cat-lifestyle' },
          { title: 'Community (navy)', value: 'cat-community' },
          { title: 'Corporate (amber)', value: 'cat-corporate' },
        ],
      },
    }),
    defineField({
      name: 'whatItRepresents',
      title: 'What This Pillar Represents',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'whyItMatters',
      title: 'Why It Matters',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'howWeWork',
      title: 'How We Work Within This Pillar',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'themes',
      title: 'Themes We Explore',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whoIsFor',
      title: 'Who This Is For',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      number: 'number',
    },
    prepare({ title, number }) {
      return {
        title: `${number}. ${title}`,
      };
    },
  },
  orderings: [
    {
      title: 'Pillar Number',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
});
