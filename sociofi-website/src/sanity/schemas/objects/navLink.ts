import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navLink',
  title: 'Nav Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: r => r.required() }),
  ],
})
