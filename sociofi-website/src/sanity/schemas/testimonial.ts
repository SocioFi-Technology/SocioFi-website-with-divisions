import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image' }),
    defineField({ name: 'division', title: 'Division', type: 'reference', to: [{ type: 'division' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: r => r.min(1).max(5),
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'company', media: 'avatar' } },
})
