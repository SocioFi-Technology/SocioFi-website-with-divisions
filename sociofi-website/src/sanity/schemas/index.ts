// Export all schema types
import division from './division'
import page from './page'
import blogPost from './blogPost'
import project from './project'
import teamMember from './teamMember'
import testimonial from './testimonial'
import faq from './faq'
import course from './course'
import workshop from './workshop'
import pricing from './pricing'
// Object schemas
import seo from './objects/seo'
import hero from './objects/hero'
import navLink from './objects/navLink'
import metric from './objects/metric'
import blockContent from './objects/blockContent'

export const schemaTypes = [
  // Documents
  division,
  page,
  blogPost,
  project,
  teamMember,
  testimonial,
  faq,
  course,
  workshop,
  pricing,
  // Objects
  seo,
  hero,
  navLink,
  metric,
  blockContent,
]
