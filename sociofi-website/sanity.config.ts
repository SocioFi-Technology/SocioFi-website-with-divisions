import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import type { StructureBuilder } from 'sanity/structure'

export default defineConfig({
  name: 'sociofi-website',
  title: 'SocioFi Technology',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/cms',
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost')),
            S.listItem()
              .title('Portfolio Projects')
              .schemaType('project')
              .child(S.documentTypeList('project')),
            S.listItem()
              .title('Team Members')
              .schemaType('teamMember')
              .child(S.documentTypeList('teamMember')),
            S.listItem()
              .title('Testimonials')
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial')),
            S.listItem()
              .title('FAQ Items')
              .schemaType('faq')
              .child(S.documentTypeList('faq')),
            S.listItem()
              .title('Courses')
              .schemaType('course')
              .child(S.documentTypeList('course')),
            S.listItem()
              .title('Workshops')
              .schemaType('workshop')
              .child(S.documentTypeList('workshop')),
            S.listItem()
              .title('Pricing Plans')
              .schemaType('pricing')
              .child(S.documentTypeList('pricing')),
            S.divider(),
            S.listItem()
              .title('Divisions')
              .schemaType('division')
              .child(S.documentTypeList('division')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
