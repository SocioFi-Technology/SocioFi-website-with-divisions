import type { Division } from './types'

export interface DivisionConfig {
  id: Division
  name: string
  accent: string
  accentLight: string
  description: string
  contentTypes: string[]
  url: string
}

export const DIVISIONS: DivisionConfig[] = [
  {
    id: 'studio',
    name: 'Studio',
    accent: '#72C4B2',
    accentLight: '#A3DFD2',
    description: 'Custom software development, AI builds, rescue ship',
    contentTypes: ['portfolio', 'posts', 'testimonials'],
    url: '/studio',
  },
  {
    id: 'services',
    name: 'Services',
    accent: '#4DBFA8',
    accentLight: '#7DD4C0',
    description: 'Ongoing software maintenance and support',
    contentTypes: ['pricing', 'faqs', 'testimonials'],
    url: '/services',
  },
  {
    id: 'labs',
    name: 'Labs',
    accent: '#7B6FE8',
    accentLight: '#A59BF0',
    description: 'Research, open source, experiments',
    contentTypes: ['posts', 'portfolio'],
    url: '/labs',
  },
  {
    id: 'academy',
    name: 'Academy',
    accent: '#E8B84D',
    accentLight: '#F0D080',
    description: 'Courses, workshops, SCARL cohort accelerator',
    contentTypes: ['courses', 'workshops'],
    url: '/academy',
  },
  {
    id: 'ventures',
    name: 'Ventures',
    accent: '#6BA3E8',
    accentLight: '#9BC0F0',
    description: 'Equity investments in AI-first startups',
    contentTypes: ['portfolio'],
    url: '/ventures',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    accent: '#5BB5E0',
    accentLight: '#8CD0F0',
    description: 'Managed hosting, cloud migration, DevOps',
    contentTypes: ['pricing', 'faqs'],
    url: '/cloud',
  },
  {
    id: 'products',
    name: 'Products',
    accent: '#E8916F',
    accentLight: '#F0B49A',
    description: 'FabricxAI, NEXUS ARIA, DevBridge',
    contentTypes: ['posts', 'testimonials'],
    url: '/products',
  },
]

export const DIVISION_MAP = Object.fromEntries(
  DIVISIONS.map((d) => [d.id, d])
) as Record<Division, DivisionConfig>

export function getDivisionColor(division?: Division | null): string {
  if (!division) return '#59A392'
  return DIVISION_MAP[division]?.accent ?? '#59A392'
}

export const STATUS_COLORS: Record<string, string> = {
  draft: '#7C8DB0',
  review: '#E8B84D',
  published: '#59A392',
  archived: '#4A5578',
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'In Review',
  published: 'Published',
  archived: 'Archived',
}
