import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'date', title: 'Date', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'time', title: 'Time (e.g. "2:00 PM UTC+6")', type: 'string' }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: { list: ['Live Online', 'In-Person', 'Hybrid', 'Self-paced'] },
    }),
    defineField({ name: 'price', title: 'Price (USD, 0 = free)', type: 'number', initialValue: 0 }),
    defineField({ name: 'capacity', title: 'Capacity', type: 'number' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'soldOut', title: 'Sold Out', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'title', subtitle: 'date' } },
})
