import { groq } from 'next-sanity'

export const blogPostsQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, excerpt, publishedAt, category,
  author->{ name, role, photo },
  division->{ name, slug, accent },
  "featuredImageUrl": featuredImage.asset->url,
}`

export const blogPostQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, publishedAt, category,
  author->{ name, role, photo },
  body,
  "relatedPosts": relatedPosts[]->{ title, slug, excerpt, publishedAt, category }
}`

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id, title, slug, client, category, description, techStack, featured,
  "thumbnailUrl": thumbnail.asset->url,
  metrics[],
  testimonial,
}`

export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id, title, slug, client, category, description,
  challenge, solution, techStack,
  "thumbnailUrl": thumbnail.asset->url,
  metrics[], testimonial,
}`

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc) {
  _id, name, role, bio, linkedin, twitter,
  "photoUrl": photo.asset->url,
}`

export const testimonialsQuery = groq`*[_type == "testimonial"] {
  _id, quote, name, role, company,
  "avatarUrl": avatar.asset->url,
  division->{ slug }
}`

export const faqsQuery = groq`*[_type == "faq" && division->slug.current == $division] | order(order asc) {
  _id, question, answer, category
}`

export const coursesQuery = groq`*[_type == "course"] | order(order asc) {
  _id, title, slug, description, duration, price, level,
  audience[], featured,
}`

export const workshopsQuery = groq`*[_type == "workshop"] | order(date asc) {
  _id, title, slug, date, time, format, price, capacity, description, soldOut
}`

export const pricingQuery = groq`*[_type == "pricing" && division->slug.current == $division] | order(order asc) {
  _id, name, price, billingPeriod, features[], highlighted, badge,
  cta { label, href }
}`
