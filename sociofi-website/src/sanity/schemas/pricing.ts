import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricing',
  title: 'Pricing Plan',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Plan Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'price', title: 'Price (USD/mo)', type: 'number', validation: r => r.required() }),
    defineField({
      name: 'billingPeriod',
      title: 'Billing Period',
      type: 'string',
      options: { list: ['month', 'year', 'one-time', 'custom'] },
      initialValue: 'month',
    }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'highlighted', title: 'Highlighted / Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'badge', title: 'Badge Text (e.g. "Most Popular")', type: 'string' }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Button Label' },
        { name: 'href', type: 'string', title: 'Button URL' },
      ],
    }),
    defineField({ name: 'division', title: 'Division', type: 'reference', to: [{ type: 'division' }] }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'name', subtitle: 'price' } },
})
