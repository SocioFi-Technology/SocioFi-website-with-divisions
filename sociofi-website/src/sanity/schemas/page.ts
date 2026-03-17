import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: r => r.required(),
    }),
    defineField({ name: 'division', title: 'Division', type: 'reference', to: [{ type: 'division' }] }),
    defineField({
      name: 'template',
      title: 'Template',
      type: 'string',
      options: {
        list: [
          'divisionOverview',
          'serviceDetail',
          'deepDive',
          'audienceLanding',
          'pricingPlans',
          'conversionForm',
          'gridListing',
          'detailPage',
          'storyPage',
          'hubRouter',
        ],
      },
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
  ],
  preview: { select: { title: 'title', subtitle: 'template' } },
})
