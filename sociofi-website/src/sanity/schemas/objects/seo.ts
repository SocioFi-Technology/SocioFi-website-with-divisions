import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Meta Title', type: 'string', validation: r => r.max(60) }),
    defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 2, validation: r => r.max(160) }),
    defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
  ],
})
