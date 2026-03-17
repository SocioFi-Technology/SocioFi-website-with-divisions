import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value (number)', type: 'number' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'prefix', title: 'Prefix (e.g. "$")', type: 'string' }),
    defineField({ name: 'suffix', title: 'Suffix (e.g. "%", "x")', type: 'string' }),
  ],
})
