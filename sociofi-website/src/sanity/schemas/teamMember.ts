import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Role / Title', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitter', title: 'Twitter/X URL', type: 'url' }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})
