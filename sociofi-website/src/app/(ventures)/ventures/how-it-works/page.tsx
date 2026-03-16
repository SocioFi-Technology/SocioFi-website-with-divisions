import type { Metadata } from 'next';
import ServiceDetail from '@/templates/ServiceDetail';
import type { ServiceDetailContent } from '@/templates/ServiceDetail';
import { Code, Brain, Rocket, Chart, Shield, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'How Ventures Works — SocioFi Technology',
  description:
    'The SocioFi Ventures co-build process: from application to deployed product. Understand what happens at each stage and what we need from you.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Ventures · How it works',
    headline: (
      <>
        From idea to product.
        <br />
        <span className="gradient-text">Built together.</span>
      </>
    ),
    description:
      'We\'ve built this process over dozens of projects. It\'s designed to move fast, stay aligned, and produce something real — not just a scope document.',
    buttons: [
      { label: 'Apply to co-build', href: '/ventures/apply', variant: 'primary' },
      { label: 'What we look for', href: '/ventures/what-we-look-for', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why most co-builds fail',
    headline: 'Misalignment kills more products than bad code',
    description:
      'Most co-build arrangements fall apart because the parties want different things at different speeds. Our process is designed to surface misalignment early — before we\'ve both invested significant time.',
    points: [
      'Founders and builders disagree on scope, timeline, and definition of done',
      'Equity structures that made sense at signing don\'t feel fair 18 months later',
      'No clear accountability when things slow down or priorities shift',
      'Dev teams build what founders say, not what the market needs',
      'Exit or buyout scenarios never discussed until they\'re urgent',
    ],
  },

  capabilitiesLabel: 'What we bring to the co-build',
  capabilitiesTitle: 'Our side of the partnership',

  capabilities: [
    {
      icon: <Code size={24} />,
      title: 'Development team',
      description:
        'Senior full-stack engineers, AI specialists, and a dedicated lead assigned to your product from kick-off.',
    },
    {
      icon: <Brain size={24} />,
      title: 'AI agent stack',
      description:
        'Our multi-agent infrastructure is pre-built. Integrating AI capability into your product doesn\'t start from zero.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Speed to MVP',
      description:
        'We\'ve shipped dozens of MVPs. We know what to cut, what to keep, and what order to build in — to get to user feedback as fast as possible.',
    },
    {
      icon: <Chart size={24} />,
      title: 'Growth engineering',
      description:
        'Post-launch, we shift from build mode to growth engineering: A/B infrastructure, conversion optimisation, performance work.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Ongoing maintenance',
      description:
        'Portfolio companies get ongoing monitoring, security updates, and engineering support — we don\'t disappear after launch.',
    },
    {
      icon: <Users size={24} />,
      title: 'Founder coaching',
      description:
        'Our CEO and CTO are available for direct conversation on product strategy, fundraising narrative, and market positioning.',
    },
  ],

  processLabel: 'The co-build process',
  processTitle: 'Six stages from application to launch',

  process: [
    {
      title: 'Application',
      description:
        'Submit the application form. We review every submission personally — no automated filters. Response within 5 business days.',
    },
    {
      title: 'Founder call',
      description:
        '60-minute call to understand your idea, market, background, and what you need from a co-build partner. We\'re assessing fit — so are you.',
    },
    {
      title: 'Term sheet',
      description:
        'If there\'s mutual interest, we issue a term sheet within 1 week. Deal structure (equity, revenue share, or hybrid), scope definition, and milestone framework.',
    },
    {
      title: 'Discovery sprint',
      description:
        '2-week paid discovery sprint to validate the core assumption, define the MVP, and confirm the technical architecture before committing to the full build.',
    },
    {
      title: 'Build phase',
      description:
        'Active development — typically 8–16 weeks to MVP depending on scope. Weekly demos, fortnightly retrospectives. You have visibility into everything.',
    },
    {
      title: 'Launch and scale',
      description:
        'MVP deployed to production. We shift to launch support, then growth engineering. You own the product, we remain the engineering partner.',
    },
  ],

  caseStudy: {
    label: 'Co-build result',
    headline: 'Idea to deployed product in 14 weeks',
    description:
      'A founder with logistics industry expertise came in with a clear problem and no technical team. 14 weeks from application to a live operations dashboard handling 200+ daily shipments.',
    result: '14 wks',
    resultLabel: 'from first conversation to live product',
  },

  faqs: [
    {
      question: 'How much equity do you take?',
      answer:
        'Equity deals are typically 15–30% depending on the scope of the build, the stage of the idea, and whether there\'s any cash component. Revenue share deals don\'t involve equity — we take a percentage of revenue until a defined cap is reached. All terms are negotiated per deal, not standardised.',
    },
    {
      question: 'What happens if the product doesn\'t get traction?',
      answer:
        'We build together, we fail together. If the product doesn\'t gain traction and the founder decides to wind down, we don\'t pursue the equity stake. If it pivots significantly, we renegotiate the terms — pivots are included in the process, not treated as breaches.',
    },
    {
      question: 'Can I buy out SocioFi\'s stake later?',
      answer:
        'Yes. All term sheets include a buyout provision. The buyout price is defined at signing based on a valuation formula — you won\'t be surprised by the number when you want to execute it.',
    },
    {
      question: 'Do you take deals outside Bangladesh?',
      answer:
        'Our engineering team is based in Bangladesh, but we co-build with founders globally. The product serves the market the founder knows — we handle the technical build regardless of geography.',
    },
  ],

  cta: {
    title: 'Apply for a co-build',
    subtitle:
      'We review every application personally. Response within 5 business days.',
    primaryCTA: { label: 'Apply now', href: '/ventures/apply' },
    note: 'No automated filters. Every submission read by a human.',
  },
};

export default function HowItWorksPage() {
  return <ServiceDetail content={content} />;
}
