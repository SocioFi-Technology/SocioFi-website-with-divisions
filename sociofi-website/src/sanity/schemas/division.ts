import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'division',
  title: 'Division',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: r => r.required(),
    }),
    defineField({ name: 'accent', title: 'Accent Color (hex)', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'CTA Button Label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA Button URL', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 3 }),
    defineField({ name: 'heroBadge', title: 'Hero Badge Text', type: 'string' }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [{ type: 'navLink' }],
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'accent' } },
})
