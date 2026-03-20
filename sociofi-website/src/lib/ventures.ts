export interface DealTermRow {
  term: string;
  range: string;
  notes: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface DealModel {
  slug: 'equity' | 'revenue-share' | 'hybrid';
  name: string;
  tagline: string;
  keyTerms: string;
  bestFor: string;
  terms: DealTermRow[];
  whenItFits: string[];
  faq: FAQ[];
}

export interface PortfolioCompany {
  slug: string;
  name: string;
  logo?: string;
  industry: string;
  description: string;
  dealModel: 'equity' | 'revenue-share' | 'hybrid';
  stage: 'pre-launch' | 'live' | 'growing' | 'revenue';
  metric?: string;
  launchDate?: string;
  story?: string;
}

export interface SelectionCriteriaScore {
  score: number;
  label: string;
  description: string;
}

export interface SelectionCriteria {
  name: string;
  weight: number;
  description: string;
  scores: SelectionCriteriaScore[];
  exampleFiveAnswer: string;
}

export const dealModels: DealModel[] = [
  {
    slug: 'equity',
    name: 'Equity',
    tagline: 'We build. You share ownership.',
    keyTerms: '5-20% equity · 4-year vesting · No upfront cost',
    bestFor: 'Pre-revenue startups with high growth potential',
    terms: [
      { term: 'Equity %', range: '5-20%', notes: 'Based on project scope and market potential' },
      { term: 'Vesting schedule', range: '2-year cliff, 4-year total', notes: 'Standard — protects both sides' },
      { term: 'Anti-dilution', range: 'None (standard dilution)', notes: 'We dilute alongside founders in future rounds' },
      { term: 'Board seat', range: 'No', notes: "We're builders, not board members" },
      { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality as $8K-$20K Studio project' },
      { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included at no additional cost' },
      { term: 'Code ownership', range: '100% founder', notes: 'Regardless of equity arrangement' },
    ],
    whenItFits: [
      'Pre-revenue startup with validated idea',
      'Founder cannot afford any upfront cost',
      'High growth potential (we are betting on upside)',
      'Founder committed full-time to growth post-launch',
    ],
    faq: [
      { question: 'What if I raise a funding round?', answer: 'We dilute alongside you. Standard.' },
      { question: 'Can I buy back the equity?', answer: 'Negotiable. Discuss on the call.' },
      { question: 'What if the company fails?', answer: "Our equity is worth nothing. That's our risk." },
      { question: 'Do you take a board seat?', answer: "No. We build. We don't govern." },
      { question: 'What kind of equity — common or preferred?', answer: 'Typically common stock with standard protections.' },
    ],
  },
  {
    slug: 'revenue-share',
    name: 'Revenue Share',
    tagline: 'We build. You pay from profits.',
    keyTerms: '8-15% of revenue · 2-3x cap · Payments stop when cap is hit',
    bestFor: 'Products with clear, near-term revenue',
    terms: [
      { term: 'Revenue share %', range: '8-15% of monthly revenue', notes: 'Higher % = lower cap (faster payoff)' },
      { term: 'Cap', range: '2-3x estimated project cost', notes: 'e.g., $20K project → $40-60K cap' },
      { term: 'Payment start', range: 'Revenue > $1,000/month', notes: 'Grace period for early traction' },
      { term: 'Duration limit', range: '36 months maximum', notes: 'Payments stop regardless at 36mo' },
      { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality as Studio' },
      { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included' },
      { term: 'Code ownership', range: '100% founder', notes: 'Always' },
    ],
    whenItFits: [
      'Product has clear revenue model',
      'Founder wants to retain 100% equity',
      'Revenue is somewhat predictable (subscription, transactions, recurring)',
      'Founder cannot afford full upfront cost but does not want to give up equity',
    ],
    faq: [
      { question: 'What if my revenue is seasonal?', answer: 'Payments are based on actual monthly revenue. Slow months = smaller payments.' },
      { question: 'What counts as revenue?', answer: 'Gross revenue from the product. Defined in the agreement.' },
      { question: 'Can I pay the cap off early?', answer: 'Yes. Lump-sum payoff is always available.' },
      { question: 'What if I pivot the product?', answer: 'Revenue from the new direction still counts toward the cap.' },
      { question: 'What happens at 36 months?', answer: 'Payments stop, regardless of whether the cap was reached.' },
    ],
  },
  {
    slug: 'hybrid',
    name: 'Hybrid',
    tagline: 'You pay some upfront. We take less equity or revenue.',
    keyTerms: '30-50% upfront · 3-8% equity OR 5-10% revenue share',
    bestFor: 'Founders with some budget who want to minimize dilution',
    terms: [
      { term: 'Upfront payment', range: '30-50% of Studio cost', notes: "Founder's available budget" },
      { term: 'Equity option', range: '3-8%', notes: 'Smaller because of upfront payment' },
      { term: 'Revenue option', range: '5-10%, 1.5-2x cap', notes: 'Lower % and lower cap than pure model' },
      { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality' },
      { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included' },
    ],
    whenItFits: [
      'Founder has some budget but not enough for full Studio pricing',
      'Lower risk tolerance on both sides',
      'Founder wants to minimize equity dilution but cannot pay full cost',
      'Product has moderate (not explosive) growth potential',
    ],
    faq: [
      { question: 'How is the upfront amount calculated?', answer: 'Based on your available budget and the estimated Studio cost. We find a number that works for both sides.' },
      { question: 'Can I choose equity or revenue share for the back-end portion?', answer: 'Yes. Discuss on the call — we will recommend based on your situation.' },
      { question: 'What if I can pay more than 50%?', answer: 'At that point, Studio may be the cleaner option. We will be honest with you.' },
      { question: 'Is hybrid available for all project types?', answer: 'Yes, as long as the economics make sense for both sides.' },
    ],
  },
];

export const selectionCriteria: SelectionCriteria[] = [
  {
    name: 'Founder-Market Fit',
    weight: 25,
    description: 'Do you deeply understand the market you are building for?',
    scores: [
      { score: 5, label: 'Exceptional', description: '10+ years in the industry, extensive network, has experienced the problem firsthand as a practitioner' },
      { score: 4, label: 'Strong', description: '5+ years, good understanding, some industry connections, has seen the problem up close' },
      { score: 3, label: 'Adequate', description: '2+ years, or adjacent industry experience with demonstrated research and customer conversations' },
      { score: 2, label: 'Weak', description: 'Less than 1 year, mostly research-based knowledge, limited direct exposure to the problem' },
      { score: 1, label: 'Not ready', description: 'No industry experience. "I just think it is a good idea."' },
    ],
    exampleFiveAnswer: 'I have managed restaurant operations for 8 years across 3 cities. I have dealt with reservation chaos personally at every restaurant I have run.',
  },
  {
    name: 'Demand Validation',
    weight: 25,
    description: 'Has anyone told you they want this — with their wallet or at least their commitment?',
    scores: [
      { score: 5, label: 'Exceptional', description: 'Paying customers or pre-orders. Money has changed hands.' },
      { score: 4, label: 'Strong', description: 'Waitlist of 100+, letters of intent, or signed pilot agreements' },
      { score: 3, label: 'Adequate', description: '10+ customer conversations with clear positive signals and documented interest' },
      { score: 2, label: 'Weak', description: 'A few conversations, mixed signals, or survey responses only' },
      { score: 1, label: 'Not ready', description: 'Zero validation. "I believe the demand exists."' },
    ],
    exampleFiveAnswer: '47 restaurants have pre-paid $99/year for early access. We have a waitlist of 200 more.',
  },
  {
    name: 'Revenue Model Clarity',
    weight: 20,
    description: 'Do you know exactly how this makes money?',
    scores: [
      { score: 5, label: 'Exceptional', description: 'Clear pricing, identified customers, concrete path to $10K MRR in 12 months with named prospects' },
      { score: 4, label: 'Strong', description: 'Clear pricing model, realistic revenue projections backed by market research' },
      { score: 3, label: 'Adequate', description: 'Business model defined, rough projections, some uncertainty in pricing' },
      { score: 2, label: 'Weak', description: 'Vague monetization — "we will charge for premium features eventually"' },
      { score: 1, label: 'Not ready', description: '"We will figure out monetization later."' },
    ],
    exampleFiveAnswer: '$49/month per restaurant location. 47 pre-paying at $99/year. Target: 200 locations in year 1 = $117K ARR.',
  },
  {
    name: 'Technical Feasibility',
    weight: 15,
    description: 'Can SocioFi build this within our capabilities and timeline?',
    scores: [
      { score: 5, label: 'Exceptional', description: 'Clear scope, fits our tech stack perfectly, buildable in 3-5 weeks, well-defined MVP boundaries' },
      { score: 4, label: 'Strong', description: 'Good scope, mostly fits our stack, 5-8 week build estimate' },
      { score: 3, label: 'Adequate', description: 'Reasonable scope, some unknowns, 6-10 week estimate' },
      { score: 2, label: 'Weak', description: 'Scope creep risk, some technology we are less familiar with' },
      { score: 1, label: 'Not ready', description: 'Requires hardware, blockchain, complex gaming, or technology outside our capabilities' },
    ],
    exampleFiveAnswer: 'Web app (Next.js), PostgreSQL database, simple reservation management and SMS notifications. No hardware.',
  },
  {
    name: 'Founder Commitment',
    weight: 15,
    description: 'Will you be working full-time on growth once the product is built?',
    scores: [
      { score: 5, label: 'Exceptional', description: 'Full-time on this, has a concrete growth plan, has already started sales/marketing, will handle all non-build activities' },
      { score: 4, label: 'Strong', description: 'Full-time or transitioning to full-time within 30 days, clear growth plan' },
      { score: 3, label: 'Adequate', description: 'Part-time transitioning to full-time, growth plan exists but early stage' },
      { score: 2, label: 'Weak', description: 'Part-time with no clear transition plan, vague growth strategy' },
      { score: 1, label: 'Not ready', description: 'Hobby project, no growth plan, expects SocioFi to also do marketing and sales' },
    ],
    exampleFiveAnswer: 'I have already signed up to speak at 3 restaurant industry conferences. I am resigning from my current role when we sign the term sheet.',
  },
];

export const portfolioCompanies: PortfolioCompany[] = [];
// Portfolio will be populated as Ventures projects complete
