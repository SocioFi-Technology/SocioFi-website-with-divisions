// src/lib/academy.ts

export interface AcademyCourse {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  audience: 'founder' | 'leader' | 'team';
  category: 'ai-development' | 'ai-agents' | 'product-management' | 'business-strategy';
  duration: string;
  durationMinutes: number;
  price: number;
  outcomes: string[];
  modules: { number: number; title: string; duration: string; lessons: string[] }[];
  thumbnailGradient: string;
  forWho: { title: string; situation: string }[];
  relatedCourses: string[];
}

export interface AcademyWorkshop {
  slug: string;
  name: string;
  format: 'webinar' | 'workshop' | 'sprint' | 'corporate';
  date: string;
  time: string;
  duration: string;
  price: number;
  maxSeats: number;
  seatsRemaining: number;
  description: string;
  isRecordingAvailable: boolean;
}

export const courses: AcademyCourse[] = [
  {
    slug: 'ai-development-for-founders',
    name: 'AI Development for Founders',
    tagline: 'Understand how AI builds software',
    description:
      'The complete non-technical guide to AI-powered software development. Understand what AI coding tools actually do, where they fall short, and how to work with development teams to ship real products.',
    audience: 'founder',
    category: 'ai-development',
    duration: '6 hours',
    durationMinutes: 360,
    price: 149,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.3) 0%, rgba(114,196,178,0.2) 100%)',
    outcomes: [
      'How AI coding tools generate software — what they do and what they miss',
      'What software engineers actually do (and why you still need them)',
      'How to evaluate a technical proposal without being technical',
      'The real cost of software development — and how to avoid overpaying',
      'When AI development is the right approach — and when it is not',
      'How to communicate your vision to a development team effectively',
    ],
    modules: [
      {
        number: 1,
        title: 'How AI Builds Software',
        duration: '60 min',
        lessons: [
          'What AI coding tools actually do under the hood',
          'The gap between generated code and production code',
          'Why AI needs human engineers to succeed',
          'A plain-English glossary of technical terms',
        ],
      },
      {
        number: 2,
        title: 'The Role of Engineers',
        duration: '55 min',
        lessons: [
          'Architecture: designing before building',
          'Code review: catching what AI misses',
          'Debugging: solving problems AI cannot see',
          'Deployment: getting code to real users',
        ],
      },
      {
        number: 3,
        title: 'Reading Technical Proposals',
        duration: '50 min',
        lessons: [
          'What to look for in a technical proposal',
          'Red flags that signal overengineering or underscoping',
          'Questions every founder should ask a dev team',
          'How to spot a realistic timeline vs. a sales pitch',
        ],
      },
      {
        number: 4,
        title: 'Understanding Software Costs',
        duration: '60 min',
        lessons: [
          'Why software costs what it does',
          'Fixed-price vs. time-and-materials contracts',
          'Hidden costs: hosting, maintenance, scaling',
          'How to build a realistic budget for your product',
        ],
      },
      {
        number: 5,
        title: 'When to Use AI Development',
        duration: '55 min',
        lessons: [
          'Project types where AI excels',
          'Where human engineering is non-negotiable',
          'Prototyping vs. production: different rules',
          'Making the build-vs-buy-vs-agent decision',
        ],
      },
      {
        number: 6,
        title: 'Communicating with Developers',
        duration: '60 min',
        lessons: [
          'Writing briefs that developers can act on',
          'How to give feedback on technical work',
          'Running effective sprint reviews as a non-technical founder',
          'Building a working relationship with your dev team',
        ],
      },
    ],
    forWho: [
      {
        title: 'First-time founders',
        situation: 'You have a business idea but no technical background',
      },
      {
        title: 'Business owners evaluating dev teams',
        situation: 'You need to understand proposals and costs',
      },
      {
        title: 'Anyone about to commission a software project',
        situation: 'You want to be an informed buyer',
      },
    ],
    relatedCourses: ['how-to-spec-a-software-product', 'understanding-ai-agents-for-business'],
  },

  {
    slug: 'how-to-spec-a-software-product',
    name: 'How to Spec a Software Product',
    tagline: 'Write specs dev teams can build from',
    description:
      'Learn to write product specifications that development teams can actually use. From user stories to technical requirements — without needing to write a single line of code.',
    audience: 'founder',
    category: 'product-management',
    duration: '4 hours',
    durationMinutes: 240,
    price: 79,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.25) 0%, rgba(74,108,184,0.2) 100%)',
    outcomes: [
      'The anatomy of a spec that engineers will actually follow',
      'How to write user stories that capture real behavior',
      'Defining scope — what is in, what is out, and why it matters',
      'Describing edge cases and error states non-technically',
      'How to version and update specs without losing context',
      'Review process: how to sign off before work starts',
    ],
    modules: [
      {
        number: 1,
        title: 'What Makes a Good Spec',
        duration: '45 min',
        lessons: [
          'The difference between a spec and a wishlist',
          'Anatomy of a production-ready spec',
          'Common spec mistakes and how to avoid them',
        ],
      },
      {
        number: 2,
        title: 'User Stories That Work',
        duration: '50 min',
        lessons: [
          'User story format: as a / I want / so that',
          'Writing acceptance criteria',
          'Prioritizing stories with MoSCoW method',
        ],
      },
      {
        number: 3,
        title: 'Scope Definition',
        duration: '45 min',
        lessons: [
          'Drawing the scope boundary',
          'Out-of-scope documentation',
          'Handling feature creep before it happens',
        ],
      },
      {
        number: 4,
        title: 'Edge Cases and Error States',
        duration: '40 min',
        lessons: [
          'Thinking through the unhappy path',
          'Describing error messages and recovery flows',
          'What happens when the internet is down?',
        ],
      },
    ],
    forWho: [
      {
        title: 'Founders commissioning their first product',
        situation: 'You are about to hand a project to a development team',
      },
      {
        title: 'Product managers transitioning into AI projects',
        situation: 'You need to adapt your spec process for AI-built software',
      },
      {
        title: 'Business owners with an internal tool vision',
        situation: 'You can describe what you want but not how to build it',
      },
    ],
    relatedCourses: ['ai-development-for-founders', 'from-idea-to-mvp'],
  },

  {
    slug: 'from-idea-to-mvp',
    name: 'From Idea to MVP',
    tagline: 'Fastest path from idea to working prototype',
    description:
      'The practical framework for turning a business idea into a minimum viable product — even without a technical background. Learn to scope, prioritize, and ship the fastest possible version of your idea.',
    audience: 'founder',
    category: 'product-management',
    duration: '3 hours',
    durationMinutes: 180,
    price: 59,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.2) 0%, rgba(232,184,77,0.4) 100%)',
    outcomes: [
      'How to define your MVP ruthlessly — and what to leave out',
      'The lean validation approach: test before you build',
      'How to choose the right technical approach for your idea',
      'Timelines and budgets for real MVP projects',
      'How to evaluate what you built and decide what comes next',
      'Common MVP mistakes that cost founders months and thousands',
    ],
    modules: [
      {
        number: 1,
        title: 'Defining Your MVP',
        duration: '45 min',
        lessons: [
          'What an MVP is (and what it is not)',
          'The one-sentence product definition',
          'Cutting features without cutting value',
        ],
      },
      {
        number: 2,
        title: 'Validating Before Building',
        duration: '40 min',
        lessons: [
          'Validation methods that do not require code',
          'Landing page tests',
          'Talking to users: what to ask',
        ],
      },
      {
        number: 3,
        title: 'Choosing Your Build Approach',
        duration: '45 min',
        lessons: [
          'No-code, AI-build, or custom development?',
          'Matching approach to your timeline and budget',
          'When to hire vs. when to use AI tools',
        ],
      },
      {
        number: 4,
        title: 'Scoping, Budgeting, and Shipping',
        duration: '30 min',
        lessons: [
          'Writing the brief for your MVP',
          'Realistic timelines for different project types',
          'How to review and approve the delivered MVP',
        ],
      },
    ],
    forWho: [
      {
        title: 'First-time founders with a business idea',
        situation: 'You need the fastest path from concept to something real',
      },
      {
        title: 'Entrepreneurs who have over-specced their product',
        situation: 'You want to reset and ship something smaller first',
      },
      {
        title: 'Business owners testing a new product line',
        situation: 'You want to validate before investing in a full build',
      },
    ],
    relatedCourses: ['how-to-spec-a-software-product', 'ai-development-for-founders'],
  },

  {
    slug: 'understanding-ai-agents-for-business',
    name: 'Understanding AI Agents for Business',
    tagline: 'What agents are, what they do',
    description:
      'A practical introduction to AI agents for business leaders and founders. Understand how agents work, what they can automate, and how to evaluate whether an agent is right for your use case.',
    audience: 'founder',
    category: 'ai-agents',
    duration: '4 hours',
    durationMinutes: 240,
    price: 99,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(232,184,77,0.25) 100%)',
    outcomes: [
      'What an AI agent is — in plain English, no technical jargon',
      'The difference between a chatbot, an assistant, and an agent',
      'What agents can realistically automate in your business today',
      'How to evaluate an agent use case before you build',
      'The costs, risks, and failure modes of agent deployments',
      'How to brief a technical team on an agent project',
    ],
    modules: [
      {
        number: 1,
        title: 'What Is an AI Agent?',
        duration: '55 min',
        lessons: [
          'Agents vs. assistants vs. chatbots: the real difference',
          'How agents use tools to take action',
          'A plain-English model of how agents make decisions',
          'Real examples from real businesses',
        ],
      },
      {
        number: 2,
        title: 'What Agents Can Automate',
        duration: '60 min',
        lessons: [
          'The automation sweet spot: structured, repetitive, high-volume',
          'Agent use cases by business function',
          'What agents cannot do (yet)',
          'Evaluating your own automation opportunities',
        ],
      },
      {
        number: 3,
        title: 'Evaluating an Agent Use Case',
        duration: '55 min',
        lessons: [
          'The agent feasibility checklist',
          'ROI estimation for agent projects',
          'Build vs. subscribe vs. wait',
          'Questions to ask before commissioning an agent',
        ],
      },
      {
        number: 4,
        title: 'Running Agent Projects',
        duration: '50 min',
        lessons: [
          'How to brief a technical team on an agent project',
          'What good agent monitoring looks like',
          'Failure modes and how to handle them',
          'Scaling from one agent to a pipeline',
        ],
      },
    ],
    forWho: [
      {
        title: 'Founders exploring automation',
        situation: 'You have heard about AI agents and want to understand what they can do for you',
      },
      {
        title: 'Business owners with repetitive workflows',
        situation: 'You are wondering if an agent could take over a task your team does manually',
      },
      {
        title: 'Leaders evaluating AI vendor proposals',
        situation: 'You need to assess agent pitches without a technical background',
      },
    ],
    relatedCourses: ['ai-development-for-founders', 'working-with-ai-agents'],
  },

  {
    slug: 'managing-ai-powered-development',
    name: 'Managing AI-Powered Development',
    tagline: 'Lead teams that use AI tools',
    description:
      'For product managers, engineering leads, and business leaders overseeing development teams that use AI tools. Learn how to set expectations, review AI-assisted work, and run effective build cycles.',
    audience: 'leader',
    category: 'product-management',
    duration: '5 hours',
    durationMinutes: 300,
    price: 129,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.2) 0%, rgba(77,191,168,0.2) 100%)',
    outcomes: [
      'How AI-assisted development changes the engineering process',
      'How to set realistic timelines and expectations for AI-accelerated projects',
      'What good code review looks like for AI-generated code',
      'How to measure quality and progress on AI-powered teams',
      'Managing the human side: morale, ownership, and skill development',
      'When to trust AI output — and when to demand human review',
    ],
    modules: [
      {
        number: 1,
        title: 'AI-Assisted Development in Practice',
        duration: '55 min',
        lessons: [
          'How modern development teams use AI tools',
          'What changes and what stays the same',
          'Realistic velocity expectations',
          'Where AI introduces new risk',
        ],
      },
      {
        number: 2,
        title: 'Planning and Scoping AI Projects',
        duration: '65 min',
        lessons: [
          'Sprint planning for AI-accelerated teams',
          'How to estimate AI-assisted work',
          'Defining done for AI-generated features',
          'Risk management in AI development cycles',
        ],
      },
      {
        number: 3,
        title: 'Quality and Review',
        duration: '60 min',
        lessons: [
          'Code review criteria for AI-generated code',
          'Test coverage requirements when AI writes tests',
          'Security review checklist for AI output',
          'What to escalate vs. what to accept',
        ],
      },
      {
        number: 4,
        title: 'Team Dynamics',
        duration: '55 min',
        lessons: [
          'Maintaining engineering ownership on AI-assisted teams',
          'Upskilling engineers alongside AI tools',
          'Managing morale and identity concerns',
          'Hiring for AI-native development teams',
        ],
      },
      {
        number: 5,
        title: 'Metrics and Reporting',
        duration: '45 min',
        lessons: [
          'KPIs for AI-powered development teams',
          'How to report progress to non-technical stakeholders',
          'Post-launch evaluation: did the AI-assisted build hold up?',
        ],
      },
    ],
    forWho: [
      {
        title: 'Product managers overseeing AI-assisted teams',
        situation: 'Your engineering team uses AI tools and you need to manage the output',
      },
      {
        title: 'Engineering leads transitioning their teams',
        situation: 'You are introducing AI tools and need a management framework',
      },
      {
        title: 'Business leaders with outsourced AI development',
        situation: 'You are paying for AI-powered development and want to hold vendors accountable',
      },
    ],
    relatedCourses: ['saas-to-aaas-transition', 'build-vs-buy-vs-agent'],
  },

  {
    slug: 'saas-to-aaas-transition',
    name: 'SaaS to AaaS Transition',
    tagline: 'What the shift means for your business',
    description:
      'Software businesses are shifting from SaaS models to Agent-as-a-Service. Understand what this means for product strategy, pricing, customer success, and how to position your business in the new landscape.',
    audience: 'leader',
    category: 'business-strategy',
    duration: '3 hours',
    durationMinutes: 180,
    price: 79,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(74,108,184,0.2) 0%, rgba(232,184,77,0.3) 100%)',
    outcomes: [
      'What AaaS is and why it is replacing traditional SaaS models',
      'How to assess whether your product is a candidate for AaaS',
      'Pricing model changes: from seats to outcomes',
      'How customer success changes when agents do the work',
      'The competitive implications: who wins and who loses',
      'A 90-day roadmap for evaluating and planning your transition',
    ],
    modules: [
      {
        number: 1,
        title: 'The SaaS to AaaS Shift',
        duration: '55 min',
        lessons: [
          'What changed and why it happened now',
          'AaaS business models explained',
          'Who is winning and how they are doing it',
        ],
      },
      {
        number: 2,
        title: 'Is Your Product a Candidate?',
        duration: '50 min',
        lessons: [
          'The AaaS readiness assessment',
          'Workflow automation vs. intelligent decision-making',
          'Build your own or integrate existing agents',
        ],
      },
      {
        number: 3,
        title: 'Pricing and Positioning',
        duration: '55 min',
        lessons: [
          'Moving from per-seat to outcome-based pricing',
          'How to communicate value without features',
          'Positioning against incumbents',
        ],
      },
    ],
    forWho: [
      {
        title: 'SaaS founders and CEOs',
        situation: 'You are wondering what AI agents mean for your product roadmap',
      },
      {
        title: 'Product strategy leads',
        situation: 'You need a framework for evaluating the AaaS opportunity',
      },
      {
        title: 'Investors and board members',
        situation: 'You want to understand the strategic implications of this shift',
      },
    ],
    relatedCourses: ['build-vs-buy-vs-agent', 'understanding-ai-agents-for-business'],
  },

  {
    slug: 'build-vs-buy-vs-agent',
    name: 'Build vs. Buy vs. Agent',
    tagline: 'Decision framework with real cost analysis',
    description:
      'A practical decision framework for business leaders facing software decisions. When should you build custom software? When should you buy an off-the-shelf tool? And when does an AI agent make more sense than either?',
    audience: 'leader',
    category: 'business-strategy',
    duration: '2 hours',
    durationMinutes: 120,
    price: 49,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.35) 0%, rgba(58,88,158,0.15) 100%)',
    outcomes: [
      'The build vs. buy vs. agent decision framework in full',
      'True cost analysis: total cost of ownership for each option',
      'How to evaluate vendor lock-in risk across options',
      'When customisation matters — and when it does not',
      'How to present the decision to stakeholders with numbers',
      'Real case studies: when each option won and why',
    ],
    modules: [
      {
        number: 1,
        title: 'The Decision Framework',
        duration: '40 min',
        lessons: [
          'The three options explained',
          'Decision criteria: speed, cost, fit, risk',
          'The scoring matrix',
        ],
      },
      {
        number: 2,
        title: 'True Cost Analysis',
        duration: '45 min',
        lessons: [
          'TCO for custom builds',
          'TCO for SaaS tools',
          'TCO for agent subscriptions',
          'Hidden costs everyone forgets',
        ],
      },
      {
        number: 3,
        title: 'Making the Call',
        duration: '35 min',
        lessons: [
          'Case studies: 5 real decisions, 5 different outcomes',
          'How to present the recommendation',
          'Revisiting the decision over time',
        ],
      },
    ],
    forWho: [
      {
        title: 'Operations leaders evaluating tools',
        situation: 'You have a workflow problem and three different vendor pitches on your desk',
      },
      {
        title: 'Founders planning their tech stack',
        situation: 'You are making foundational technology decisions for your business',
      },
      {
        title: 'Consultants and advisors',
        situation: 'You need a rigorous framework to recommend to clients',
      },
    ],
    relatedCourses: ['saas-to-aaas-transition', 'managing-ai-powered-development'],
  },

  {
    slug: 'technical-literacy-for-teams',
    name: 'Technical Literacy for Non-Technical Teams',
    tagline: 'Software, APIs, databases, AI basics',
    description:
      'The complete technical literacy course for business teams. Understand how software, databases, APIs, and AI systems work — well enough to collaborate effectively with engineers and make informed decisions.',
    audience: 'team',
    category: 'ai-development',
    duration: '6 hours',
    durationMinutes: 360,
    price: 149,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(77,191,168,0.2) 0%, rgba(232,184,77,0.25) 100%)',
    outcomes: [
      'How software systems are structured — front end, back end, database',
      'What an API is and how businesses use them every day',
      'How databases store and retrieve information',
      'What cloud hosting means and why it matters',
      'How AI systems like language models and agents work at a high level',
      'How to read and understand basic technical documentation',
    ],
    modules: [
      {
        number: 1,
        title: 'How Software Works',
        duration: '60 min',
        lessons: [
          'Front end, back end, and database — a plain-English tour',
          'How a request travels from your screen to a server and back',
          'The software stack: what it is and why it matters',
        ],
      },
      {
        number: 2,
        title: 'APIs and Integrations',
        duration: '55 min',
        lessons: [
          'What an API is, with real examples',
          'How tools connect to each other via APIs',
          'REST vs. webhooks: what your team needs to know',
          'Reading basic API documentation',
        ],
      },
      {
        number: 3,
        title: 'Databases and Data',
        duration: '60 min',
        lessons: [
          'Relational vs. document databases',
          'How your CRM, ERP, and analytics tools store data',
          'Data ownership, backups, and portability',
          'Why data structure matters before you build',
        ],
      },
      {
        number: 4,
        title: 'Cloud and Hosting',
        duration: '50 min',
        lessons: [
          'What the cloud actually is',
          'AWS, Google Cloud, and Azure in plain English',
          'Uptime, latency, and why your app is slow sometimes',
          'Managed hosting vs. DIY infrastructure',
        ],
      },
      {
        number: 5,
        title: 'AI Systems Explained',
        duration: '55 min',
        lessons: [
          'How language models work — no maths required',
          'The difference between AI tools, assistants, and agents',
          'Training data, fine-tuning, and why context matters',
          'What AI can and cannot do reliably',
        ],
      },
      {
        number: 6,
        title: 'Reading Technical Documentation',
        duration: '40 min',
        lessons: [
          'Anatomy of a technical spec',
          'How to read an API reference',
          'What to look for in a pull request description',
          'Asking better questions of your technical team',
        ],
      },
    ],
    forWho: [
      {
        title: 'Non-technical team members',
        situation: 'You work alongside engineers and want to contribute more confidently',
      },
      {
        title: 'Operations, marketing, and sales teams',
        situation: 'Your role increasingly touches software tools, integrations, and data',
      },
      {
        title: 'New managers of technical teams',
        situation: 'You need enough technical literacy to lead effectively',
      },
    ],
    relatedCourses: ['reading-technical-documentation', 'working-with-ai-agents'],
  },

  {
    slug: 'working-with-ai-agents',
    name: 'Working with AI Agents',
    tagline: 'Collaborate with AI agents at work',
    description:
      'A practical course for team members who work alongside AI agents. Learn to write effective prompts, understand agent outputs, catch errors, and escalate when agents get it wrong.',
    audience: 'team',
    category: 'ai-agents',
    duration: '3 hours',
    durationMinutes: 180,
    price: 79,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(232,184,77,0.2) 100%)',
    outcomes: [
      'How AI agents make decisions — what happens inside the black box',
      'How to write prompts that get consistent, useful results',
      'Common agent failure modes — and how to catch them early',
      'When to trust agent output and when to verify manually',
      'How to escalate agent errors to your technical team',
      'Building your own review checklist for agent-generated work',
    ],
    modules: [
      {
        number: 1,
        title: 'How Agents Make Decisions',
        duration: '45 min',
        lessons: [
          'Inside the black box: a plain-English model',
          'Context, instructions, and outputs',
          'Why agents sometimes get it wrong',
        ],
      },
      {
        number: 2,
        title: 'Prompting for Consistency',
        duration: '50 min',
        lessons: [
          'The anatomy of a good prompt',
          'System instructions vs. user instructions',
          'Iterating and refining prompts',
          'Prompt templates for common tasks',
        ],
      },
      {
        number: 3,
        title: 'Reviewing and Escalating',
        duration: '45 min',
        lessons: [
          'Building your review checklist',
          'Red flags in agent output',
          'How to escalate clearly to a technical team',
          'Feedback loops: helping agents improve',
        ],
      },
    ],
    forWho: [
      {
        title: 'Team members with AI agents in their workflow',
        situation: 'An agent handles part of your job and you want to work with it effectively',
      },
      {
        title: 'Customer success and support teams',
        situation: 'You review or rely on AI-drafted responses and need quality checks',
      },
      {
        title: 'Operations teams running agent pipelines',
        situation: 'You need to monitor agent output without writing code',
      },
    ],
    relatedCourses: ['understanding-ai-agents-for-business', 'technical-literacy-for-teams'],
  },

  {
    slug: 'reading-technical-documentation',
    name: 'Reading Technical Documentation',
    tagline: 'Understand what developers write',
    description:
      'A focused course for non-technical team members who need to understand technical documentation — from API references to product specs to pull request descriptions.',
    audience: 'team',
    category: 'product-management',
    duration: '2 hours',
    durationMinutes: 120,
    price: 39,
    thumbnailGradient:
      'linear-gradient(135deg, rgba(232,184,77,0.15) 0%, rgba(91,181,224,0.2) 100%)',
    outcomes: [
      'How to read an API reference without engineering experience',
      'Understanding product requirement documents (PRDs)',
      'What pull request descriptions should tell you',
      'Reading error messages and logs without panicking',
      'How to ask better questions when documentation is unclear',
      'A glossary of 50 technical terms every non-technical person should know',
    ],
    modules: [
      {
        number: 1,
        title: 'API References',
        duration: '35 min',
        lessons: [
          'Anatomy of an API reference page',
          'Endpoints, parameters, and responses',
          'Authentication and rate limits explained',
        ],
      },
      {
        number: 2,
        title: 'Product and Technical Specs',
        duration: '40 min',
        lessons: [
          'Reading a PRD: what to focus on',
          'User stories, acceptance criteria, and edge cases',
          'How to give feedback on a spec',
        ],
      },
      {
        number: 3,
        title: 'Code Changes and Logs',
        duration: '45 min',
        lessons: [
          'What a pull request description tells you',
          'Reading an error log without writing code',
          'Release notes: what matters to non-technical stakeholders',
          'The technical glossary: 50 terms explained',
        ],
      },
    ],
    forWho: [
      {
        title: 'Project managers and team leads',
        situation: 'You receive technical documentation regularly and need to understand it',
      },
      {
        title: 'Customer-facing team members',
        situation: 'You need to explain technical features to customers without engineering help',
      },
      {
        title: 'Anyone joining a technical organisation',
        situation: 'You want to read the room when engineers discuss their work',
      },
    ],
    relatedCourses: ['technical-literacy-for-teams', 'working-with-ai-agents'],
  },
];

export const workshops: AcademyWorkshop[] = [
  {
    slug: 'ai-development-101-q-a',
    name: 'AI Development 101: Live Q&A',
    format: 'webinar',
    date: '2026-04-08',
    time: '2:00 PM – 3:30 PM BST',
    duration: '90 minutes',
    price: 0,
    maxSeats: 100,
    seatsRemaining: 67,
    description:
      'Monthly live Q&A where SocioFi engineers answer your questions about AI development.',
    isRecordingAvailable: false,
  },
  {
    slug: 'spec-writing-workshop',
    name: 'Spec Writing Workshop',
    format: 'workshop',
    date: '2026-04-22',
    time: '10:00 AM – 1:00 PM BST',
    duration: '3 hours',
    price: 99,
    maxSeats: 30,
    seatsRemaining: 12,
    description: 'Hands-on workshop: write a real product spec with expert feedback.',
    isRecordingAvailable: false,
  },
  {
    slug: 'agent-deployment-walkthrough',
    name: 'Agent Deployment Walkthrough',
    format: 'workshop',
    date: '2026-05-06',
    time: '3:00 PM – 5:00 PM BST',
    duration: '2 hours',
    price: 79,
    maxSeats: 40,
    seatsRemaining: 28,
    description: 'Live demo of deploying AI agents into real business workflows.',
    isRecordingAvailable: false,
  },
  {
    slug: 'founders-build-sprint',
    name: "Founder's Build Sprint",
    format: 'sprint',
    date: '2026-05-19',
    time: '9:00 AM – 11:00 AM BST (3 days)',
    duration: '3 × 2 hours',
    price: 249,
    maxSeats: 20,
    seatsRemaining: 8,
    description:
      '3-day intensive: go from idea to scoped project brief with engineer coaching.',
    isRecordingAvailable: false,
  },
  {
    slug: 'technical-literacy-bootcamp',
    name: 'Technical Literacy Bootcamp',
    format: 'workshop',
    date: '2026-06-03',
    time: '9:00 AM – 3:00 PM BST',
    duration: 'Full day (6 hours)',
    price: 199,
    maxSeats: 25,
    seatsRemaining: 19,
    description: 'Full-day immersive bootcamp covering the complete technical literacy curriculum.',
    isRecordingAvailable: false,
  },
  {
    slug: 'corporate-ai-readiness',
    name: 'Corporate AI Readiness Assessment',
    format: 'corporate',
    date: '2026-06-17',
    time: '10:00 AM – 2:00 PM BST',
    duration: 'Half day (4 hours)',
    price: 499,
    maxSeats: 15,
    seatsRemaining: 15,
    description:
      'Private half-day session for your team to assess AI readiness and plan adoption.',
    isRecordingAvailable: false,
  },
];

export function getCourse(slug: string): AcademyCourse | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getWorkshop(slug: string): AcademyWorkshop | undefined {
  return workshops.find((w) => w.slug === slug);
}

export function getCoursesByAudience(audience: AcademyCourse['audience']): AcademyCourse[] {
  return courses.filter((c) => c.audience === audience);
}

export function getCoursesByCategory(category: AcademyCourse['category']): AcademyCourse[] {
  return courses.filter((c) => c.category === category);
}

