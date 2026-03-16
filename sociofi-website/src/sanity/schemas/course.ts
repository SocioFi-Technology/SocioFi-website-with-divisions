import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    defineField({ name: 'price', title: 'Price (USD)', type: 'number' }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: { list: ['Beginner', 'Intermediate', 'Advanced'] },
    }),
    defineField({ name: 'audience', title: 'Target Audience', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'syllabus', title: 'Syllabus', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'free', title: 'Free / Open Access', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'title', subtitle: 'level' } },
})
