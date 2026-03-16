import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Portfolio Project',
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
    defineField({ name: 'client', title: 'Client Name', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Custom Software', 'AI Systems', 'Automation', 'Internal Tools', 'Rescue'] },
    }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({ name: 'challenge', title: 'Challenge', type: 'blockContent' }),
    defineField({ name: 'solution', title: 'Solution', type: 'blockContent' }),
    defineField({ name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'metrics', title: 'Metrics', type: 'array', of: [{ type: 'metric' }] }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        { name: 'quote', type: 'string', title: 'Quote' },
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'role', type: 'string', title: 'Role' },
        { name: 'company', type: 'string', title: 'Company' },
      ],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'accentColor', title: 'Accent Color (hex)', type: 'string' }),
    defineField({ name: 'accentColor2', title: 'Accent Color 2 (hex)', type: 'string' }),
  ],
  preview: { select: { title: 'title', subtitle: 'client', media: 'thumbnail' } },
})
