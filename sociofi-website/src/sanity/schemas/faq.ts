import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: r => r.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'division', title: 'Division', type: 'reference', to: [{ type: 'division' }] }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
})
