import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'audience',
      title: 'Audience Segment',
      type: 'string',
      options: {
        list: [
          { title: 'Individuals & Leaders', value: 'individuals' },
          { title: 'Organizations & Brands', value: 'organizations' },
          { title: 'Hospitality Brands', value: 'hospitality' },
          { title: 'Non-Profits & Social Enterprises', value: 'nonprofits' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pillar',
      title: 'Related Pillar',
      type: 'reference',
      to: [{ type: 'pillar' }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      audience: 'audience',
    },
    prepare({ title, audience }) {
      return {
        title,
        subtitle: audience,
      };
    },
  },
});
