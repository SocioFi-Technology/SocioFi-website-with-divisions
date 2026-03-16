import AudienceLanding, { type AudienceLandingContent } from '@/templates/AudienceLanding';
import { Globe, Users, Zap, Target } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partnerships — SocioFi Technology',
  description:
    'Refer clients to SocioFi Technology and earn commission. For no-code consultants, design agencies, business coaches, and accelerators.',
};

const content: AudienceLandingContent = {
  hero: {
    badge: 'Partner programme',
    headline: (
      <>
        Refer Clients.{' '}
        <span className="gradient-text">Earn Commission.</span>
      </>
    ),
    description:
      "Your clients need technical help building and shipping software. You know us. We make the introduction easy — and we make it worth your while.",
    buttons: [
      { label: 'Apply to partner', href: '/contact', variant: 'primary' },
      { label: 'See commission structure', href: '#commission', variant: 'ghost' },
    ],
  },

  painPoints: {
    label: 'Who this is for',
    title: "You work with people who have software needs you can't fill",
    intro:
      "If you regularly talk to founders, SMEs, or teams who want to build or fix software — and you don't do that work yourself — you're leaving value on the table. Every referral you make to SocioFi Technology earns you commission. No extra work. No liability.",
    points: [
      {
        title: 'No-code consultants',
        description:
          'Your clients hit the ceiling of what no-code can do. They need custom development. You need somewhere to send them.',
      },
      {
        title: 'Design agencies',
        description:
          "You design it. They want it built. You don't want to hire developers. We build it — and your client never has to go elsewhere.",
      },
      {
        title: 'Business coaches and advisors',
        description:
          "Your clients are building businesses that need software. When the technical question comes up — and it always does — you have a trusted answer.",
      },
      {
        title: 'Startup accelerators and incubators',
        description:
          "Your cohort companies need technical execution partners. We fit into their build cycles without competing with your value-add.",
      },
    ],
    closing:
      "If your audience is building something — and they need engineers — we should be talking.",
  },

  process: [
    {
      title: 'Apply to the programme',
      description:
        "Fill in the partner application. We review within 48 hours. Not everyone is a fit — we work best with partners who have warm, qualified audiences.",
      duration: 'Day 1',
    },
    {
      title: 'Get your referral link and materials',
      description:
        "You get a unique referral link, a one-page partner brief you can share, and direct access to our team for questions about whether a client is a good fit.",
      duration: 'Day 2–3',
    },
    {
      title: 'Make the introduction',
      description:
        "You introduce us to your client. We take it from there. A senior engineer handles the scoping call and the proposal. You don't need to be involved.",
      duration: 'Your timeline',
    },
    {
      title: 'Client signs. You earn.',
      description:
        "When a referred client signs a contract, your commission is calculated and paid within 30 days. No chasing, no minimums, no expiry.",
      duration: 'Paid within 30 days',
    },
  ],
  processLabel: 'How it works',
  processTitle: 'From introduction to commission in four steps',
  processSubtitle: 'No complicated tracking. No minimum quotas. You refer, we deliver, you earn.',

  deliverables: [
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: '10% commission on first contract',
      description:
        'Earn 10% of the value of the first contract signed by each client you refer. No ceiling — a $20,000 project = $2,000 to you.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: '5% on all subsequent contracts',
      description:
        'For 12 months after the first referral, you earn 5% on every additional contract the same client signs. Ongoing relationship, ongoing commission.',
    },
    {
      icon: <Users size={22} aria-hidden="true" />,
      title: 'Priority access for your clients',
      description:
        "Partner-referred clients go to the front of our queue. Your client gets a faster response and a dedicated scoping call — no waiting.",
    },
    {
      icon: <Globe size={22} aria-hidden="true" />,
      title: 'Direct line to our team',
      description:
        "You get a private Slack channel or WhatsApp thread with our partnerships team. Ask whether a client is a fit before you make the intro.",
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Co-marketing opportunities',
      description:
        "We feature strong partners on our website, in our newsletter, and on social media. We want your audience to trust us before they ever need us.",
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'No minimums. No exclusivity.',
      description:
        "You can refer one client or fifty. You can also work with other development partners. We ask only that you don't misrepresent us or send unqualified leads.",
    },
  ],
  deliverablesLabel: 'What you get',
  deliverablesTitle: 'Commission structure and partner benefits',

  metrics: [
    { numeric: 10, suffix: '%', label: 'Commission on first contract' },
    { numeric: 5,  suffix: '%', label: 'On repeat contracts for 12 months' },
    { numeric: 30, label: 'Day payment window' },
    { numeric: 0,  label: 'Minimums or exclusivity requirements' },
  ],

  testimonials: [
    {
      quote:
        "I refer two or three clients to SocioFi every quarter. The commission is consistent, my clients get looked after properly, and I've never had a complaint. It's the cleanest referral arrangement I've been part of.",
      author: 'Sarah M.',
      role: 'No-code consultant',
      company: 'Independent',
    },
    {
      quote:
        "We're a branding and UX agency. We don't do development. SocioFi handles everything after the designs leave our hands — and our clients never need to find their own dev team.",
      author: 'James O.',
      role: 'Co-founder',
      company: 'Branding & UX Studio',
    },
    {
      quote:
        "Three of my coaching clients have built products with SocioFi. I recommend them because I know they'll do exactly what they say — and that protects my reputation too.",
      author: 'Priya R.',
      role: 'Startup coach',
      company: 'Independent',
    },
  ],

  pricingTeaser: {
    headline: 'What are you referring your clients into?',
    description:
      "SocioFi Studio projects start from $4,500 for an MVP Sprint and go up based on scope. Fixed price, fixed scope — your clients always know what they're paying before they sign.",
    href: '/studio/pricing',
    cta: 'See Studio pricing',
  },

  faqs: [
    {
      question: 'How do I track my referrals?',
      answer:
        "You get a unique referral link. We track clicks and conversions, and send you a monthly summary. You can also ask us at any time — we're transparent about the numbers.",
    },
    {
      question: 'What counts as a qualifying referral?',
      answer:
        "Any client you introduce who signs a contract worth $1,000 or more. The client needs to mention you or use your referral link at the time of first contact.",
    },
    {
      question: 'When do I get paid?',
      answer:
        "Within 30 days of the referred client's first payment to us. We pay via bank transfer, Wise, or PayPal — whichever works for you.",
    },
    {
      question: "What if my client doesn't sign straight away?",
      answer:
        "Referral credit lasts 90 days from first contact. If they sign within 90 days of your introduction, you earn commission.",
    },
    {
      question: "Can I be a partner if I'm outside Bangladesh?",
      answer:
        "Yes — most of our partners are outside Bangladesh. We work with consultants, agencies, and coaches in Europe, Southeast Asia, the Middle East, and North America.",
    },
  ],

  cta: {
    title: 'Ready to start referring?',
    subtitle:
      "Fill in the contact form and mention 'Partner programme'. We'll get back to you within 24 hours with everything you need to start.",
    primaryCTA: { label: 'Apply to the programme', href: '/contact' },
    ghostCTA: { label: 'Learn more about Studio', href: '/studio' },
    note: 'No minimums. No exclusivity. Cancel any time.',
  },
};

export default function PartnershipsPage() {
  return <AudienceLanding content={content} />;
}
