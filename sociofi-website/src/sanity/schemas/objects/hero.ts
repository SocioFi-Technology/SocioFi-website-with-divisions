import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge Text', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['split', 'centered', 'minimal'] },
      initialValue: 'split',
    }),
    defineField({ name: 'primaryCta', title: 'Primary CTA Label', type: 'string' }),
    defineField({ name: 'primaryCtaHref', title: 'Primary CTA URL', type: 'string' }),
    defineField({ name: 'ghostCta', title: 'Ghost CTA Label', type: 'string' }),
    defineField({ name: 'ghostCtaHref', title: 'Ghost CTA URL', type: 'string' }),
  ],
})
