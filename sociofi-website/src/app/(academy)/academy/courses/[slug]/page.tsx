'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Course Data ──────────────────────────────────────────────────────────────
const COURSES = [
  { slug:'ai-development-for-founders', name:'AI Development for Founders', audience:'founder', category:'ai-development', duration:'6 hours', price:149, tagline:'Understand how AI builds software', gradient:'linear-gradient(135deg,rgba(232,184,77,0.3),rgba(114,196,178,0.2))' },
  { slug:'how-to-spec-a-software-product', name:'How to Spec a Software Product', audience:'founder', category:'product-management', duration:'4 hours', price:79, tagline:'Write specs dev teams can build from', gradient:'linear-gradient(135deg,rgba(232,184,77,0.25),rgba(74,108,184,0.2))' },
  { slug:'from-idea-to-mvp', name:"From Idea to MVP: The Founder's Playbook", audience:'founder', category:'product-management', duration:'3 hours', price:59, tagline:'Fastest path from idea to working prototype', gradient:'linear-gradient(135deg,rgba(232,184,77,0.2),rgba(232,184,77,0.4))' },
  { slug:'understanding-ai-agents-for-business', name:'Understanding AI Agents for Business', audience:'founder', category:'ai-agents', duration:'4 hours', price:99, tagline:'What agents are, which processes they handle', gradient:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(232,184,77,0.25))' },
  { slug:'managing-ai-powered-development', name:'Managing AI-Powered Development', audience:'leader', category:'product-management', duration:'5 hours', price:129, tagline:'Lead teams that use AI development tools', gradient:'linear-gradient(135deg,rgba(232,184,77,0.2),rgba(77,191,168,0.2))' },
  { slug:'saas-to-aaas-transition', name:'The SaaS to AaaS Transition', audience:'leader', category:'business-strategy', duration:'3 hours', price:79, tagline:'What the shift means for your business', gradient:'linear-gradient(135deg,rgba(74,108,184,0.2),rgba(232,184,77,0.3))' },
  { slug:'build-vs-buy-vs-agent', name:'Build vs Buy vs Agent: The Decision Framework', audience:'leader', category:'business-strategy', duration:'2 hours', price:49, tagline:'Decision framework with real cost analysis', gradient:'linear-gradient(135deg,rgba(232,184,77,0.35),rgba(58,88,158,0.15))' },
  { slug:'technical-literacy-for-teams', name:'Technical Literacy for Non-Technical Teams', audience:'team', category:'ai-development', duration:'6 hours', price:149, tagline:'Software, APIs, databases, AI basics', gradient:'linear-gradient(135deg,rgba(77,191,168,0.2),rgba(232,184,77,0.25))' },
  { slug:'working-with-ai-agents', name:'Working with AI Agents in Your Organization', audience:'team', category:'ai-agents', duration:'3 hours', price:79, tagline:'Collaborate with AI agents at work', gradient:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(232,184,77,0.2))' },
  { slug:'reading-technical-documentation', name:'Reading Technical Documentation (Without Panicking)', audience:'team', category:'product-management', duration:'2 hours', price:39, tagline:'Understand what developers write', gradient:'linear-gradient(135deg,rgba(232,184,77,0.15),rgba(91,181,224,0.2))' },
];

const AUDIENCE_LABEL: Record<string, string> = { founder: 'For Founders', leader: 'For Leaders', team: 'For Teams' };

// ── Extended course metadata ─────────────────────────────────────────────────
type CourseDetail = {
  description: string;
  outcomes: string[];
  personas: { icon: string; role: string; situation: string }[];
  modules: { title: string; duration: string; lessons: string[] }[];
  testimonials: { quote: string; name: string; role: string }[];
};

const COURSE_DETAILS: Record<string, CourseDetail> = {
  'ai-development-for-founders': {
    description: "AI coding tools can generate a lot of code fast. But most founders don't know what to do with it — or what to check before handing it to a dev team. This course closes that gap. You'll learn how AI-generated software actually works, where it breaks, and what a good development process looks like when AI is in the loop.",
    outcomes: [
      'How AI coding tools generate software — what they do and what they miss',
      'What software engineers actually do (and why you still need them)',
      'How to evaluate a technical proposal without being technical',
      'The real cost of software development — and how to avoid overpaying',
      'When AI development is the right approach — and when it is not',
      'How to communicate your vision to a development team effectively',
    ],
    personas: [
      { icon: '01', role: 'First-Time Founder', situation: 'Built a prototype with AI tools, needs to know what comes next' },
      { icon: '02', role: 'Non-Technical CEO', situation: 'Working with a dev team but can\'t evaluate their work' },
      { icon: '03', role: 'Product Manager', situation: 'Bridging business requirements and engineering delivery' },
    ],
    modules: [
      { title: 'How AI builds software (and what it misses)', duration: '60 min', lessons: ['The AI development stack explained', 'What AI tools generate vs what they understand', 'Where AI code breaks in production', 'Lesson recap: what to watch for'] },
      { title: 'What developers actually do', duration: '50 min', lessons: ['Architecture decisions — why they matter', 'Debugging: what takes real skill', 'Deployment, security, and maintenance', 'Human vs AI division of labour'] },
      { title: 'Evaluating technical proposals', duration: '55 min', lessons: ['Reading a technical spec like a founder', 'Questions that expose weak proposals', 'Scope creep and how to prevent it', 'Exercise: evaluate a real proposal'] },
      { title: 'The real cost of software', duration: '45 min', lessons: ['Why most estimates are wrong', 'Hidden costs of cheap development', 'AI development cost models', 'Build vs hire vs agency'] },
      { title: 'When to use AI development', duration: '40 min', lessons: ['Best fits for AI-assisted builds', 'When traditional is better', 'Hybrid workflows that work', 'Red flags in AI-heavy proposals'] },
      { title: 'Communicating with dev teams', duration: '50 min', lessons: ['Writing requirements that get built right', 'Giving useful feedback on code', 'Running a productive technical meeting', 'Final exercise: write your own spec'] },
    ],
    testimonials: [
      { quote: "Before this course I had no idea how to evaluate the quotes I was getting. Now I know exactly what to ask and what to push back on.", name: 'Dilnoza M.', role: 'Founder, Tashkent' },
      { quote: "The section on hidden costs alone saved me from making a very expensive mistake with my first hire.", name: 'Ahmed K.', role: 'Solo founder, SaaS product' },
    ],
  },
  'how-to-spec-a-software-product': {
    description: "A software spec that a dev team can actually build from is a rare thing. Most founders either write too little (\"make it like Airbnb but for X\") or too much (50-page documents nobody reads). This course shows you a practical spec format that communicates intent, constraints, and success criteria — without requiring you to know how to code.",
    outcomes: [
      'The anatomy of a good software spec — what goes in, what stays out',
      'User stories vs functional requirements vs technical specs — and when to use each',
      'How to describe UI/UX to developers without wireframes',
      'Writing acceptance criteria that prevent scope disputes',
      'How to prioritise features without losing your vision',
      'Getting useful feedback on a spec before development starts',
    ],
    personas: [
      { icon: '01', role: 'Early-Stage Founder', situation: 'Has an idea and needs to communicate it to a dev team' },
      { icon: '02', role: 'Product Owner', situation: 'Responsible for the backlog but lacks a consistent spec format' },
      { icon: '03', role: 'Non-Technical Co-Founder', situation: 'Working alongside a technical co-founder who needs clear input' },
    ],
    modules: [
      { title: 'What makes a spec useful', duration: '40 min', lessons: ['Why most specs fail', 'The one-page spec format', 'What developers actually need', 'Exercise: critique a bad spec'] },
      { title: 'User stories and requirements', duration: '55 min', lessons: ['Writing user stories that work', 'Functional vs non-functional requirements', 'Mapping flows without wireframes', 'Edge cases and error states'] },
      { title: 'Scope and prioritisation', duration: '45 min', lessons: ['MoSCoW prioritisation explained', 'How to say no to your own ideas', 'Phased delivery approach', 'Protecting the MVP'] },
      { title: 'Acceptance criteria and sign-off', duration: '40 min', lessons: ['Writing testable acceptance criteria', 'Definition of done', 'How to review and approve work', 'The spec feedback loop'] },
    ],
    testimonials: [
      { quote: "My developer said it was the clearest brief he'd ever received from a non-technical founder. That's a direct quote.", name: 'Priya S.', role: 'Founder, EdTech startup' },
      { quote: "Saved at least two weeks of back-and-forth on our first build. The acceptance criteria template alone is worth the price.", name: 'James T.', role: 'Product owner' },
    ],
  },
  'from-idea-to-mvp': {
    description: "The gap between 'I have an idea' and 'I have something I can show people' is where most founders get stuck. This course gives you a step-by-step playbook for that gap — from validating your idea to scoping your MVP to getting something real in front of your first users as fast as possible.",
    outcomes: [
      'A repeatable framework for validating product ideas before building',
      'How to define an MVP that proves your hypothesis without over-building',
      'The fastest technical paths to a working prototype',
      'How to find and brief your first development team or freelancer',
      'Common MVP mistakes and how to avoid them',
      'What to measure in your first 30 days after launch',
    ],
    personas: [
      { icon: '01', role: 'Idea-Stage Founder', situation: 'Has a clear problem and wants to build the solution fast' },
      { icon: '02', role: 'Career Changer', situation: 'Moving from corporate to startup, needs a structured approach' },
      { icon: '03', role: 'Side Project Builder', situation: 'Limited time — needs maximum efficiency from every hour' },
    ],
    modules: [
      { title: 'Idea validation without building', duration: '45 min', lessons: ['The validation hierarchy', 'Fastest ways to test demand', 'Reading the signals correctly', 'When to stop validating and start building'] },
      { title: 'Scoping your MVP', duration: '50 min', lessons: ['What MVP actually means', 'The core hypothesis test', 'Feature triage: brutal prioritisation', 'Scope control under pressure'] },
      { title: 'The fastest build paths', duration: '40 min', lessons: ['No-code vs low-code vs full code', 'AI-assisted development options', 'When to hire vs when to DIY', 'Timeline reality check'] },
      { title: 'Launch and first metrics', duration: '45 min', lessons: ['Launching with zero audience', 'The first 10 users playbook', 'What to measure on day one', 'Interpreting early feedback correctly'] },
    ],
    testimonials: [
      { quote: "I went from idea to first paying customer in 6 weeks following this playbook. It keeps you from wasting time on the wrong things.", name: 'Carlos R.', role: 'Founder, B2B SaaS' },
      { quote: "The validation framework in module one is something I now use for every new feature, not just new products.", name: 'Amara B.', role: 'Product manager turned founder' },
    ],
  },
  'understanding-ai-agents-for-business': {
    description: "AI agents are not chatbots. They are software systems that take actions, make decisions, and complete multi-step tasks without being told exactly how. This course explains what agents actually are, which business processes they're well-suited for, and how to think about deploying them — without requiring any technical background.",
    outcomes: [
      'The difference between AI assistants, AI tools, and AI agents',
      'How agents make decisions and what keeps them on track',
      'Which business processes are best suited to agent automation',
      'How to evaluate an agent proposal from a vendor or dev team',
      'The real cost and timeline for deploying an agent in your business',
      'Common failure modes — and how responsible businesses prevent them',
    ],
    personas: [
      { icon: '01', role: 'Business Owner', situation: 'Exploring automation options and hearing a lot of AI agent hype' },
      { icon: '02', role: 'Operations Leader', situation: 'Running repetitive processes that feel ready for automation' },
      { icon: '03', role: 'Digital Transformation Lead', situation: 'Responsible for evaluating and adopting new technology' },
    ],
    modules: [
      { title: 'What agents actually are', duration: '50 min', lessons: ['Chatbots vs copilots vs agents', 'How agents reason and take action', 'The role of tools and memory', 'Agent taxonomy for business'] },
      { title: 'Business process suitability', duration: '55 min', lessons: ['Criteria for agent-ready processes', 'High-value use cases by industry', 'Processes that are NOT ready', 'Exercise: audit your own processes'] },
      { title: 'Evaluating agent proposals', duration: '45 min', lessons: ['Questions every buyer should ask', 'Understanding the architecture', 'Data privacy and security basics', 'Red flags in vendor proposals'] },
      { title: 'Deploying and maintaining agents', duration: '50 min', lessons: ['The realistic timeline', 'Human-in-the-loop design', 'Monitoring agent behaviour', 'When agents fail — and what to do'] },
    ],
    testimonials: [
      { quote: "I finally understand what everyone is selling me. This course gave me a framework for evaluating proposals that is worth far more than the price.", name: 'Sarah L.', role: 'Head of Operations, mid-size firm' },
      { quote: "Went into three vendor meetings after this course and the vendors were visibly surprised by the questions I was asking.", name: 'Michael O.', role: 'SME owner' },
    ],
  },
  'managing-ai-powered-development': {
    description: "Your team is using AI coding tools. That is good news — but it changes how you manage delivery, review code, estimate timelines, and measure quality. This course teaches non-technical managers and technical leads how to run effective AI-assisted development without flying blind.",
    outcomes: [
      'How AI coding tools change the speed and shape of software delivery',
      'What good code review looks like when AI wrote most of the code',
      'How to set realistic timelines when AI is in the loop',
      'Managing quality when velocity increases dramatically',
      'Keeping human engineers engaged and growing in an AI-first team',
      'How to communicate AI-powered development to stakeholders',
    ],
    personas: [
      { icon: '01', role: 'Engineering Manager', situation: 'Team has adopted AI tools but processes haven\'t caught up' },
      { icon: '02', role: 'Technical Lead', situation: 'Responsible for code quality with growing use of AI generation' },
      { icon: '03', role: 'Non-Technical PM', situation: 'Managing a development team and needs to understand the new landscape' },
    ],
    modules: [
      { title: 'How AI changes development velocity', duration: '55 min', lessons: ['The real productivity numbers', 'Where AI speeds things up', 'Where AI creates new bottlenecks', 'Adjusting your mental model'] },
      { title: 'Code review in the AI era', duration: '60 min', lessons: ['What to review — and what to skip', 'Security review for AI-generated code', 'Review checklists that scale', 'Building team review culture'] },
      { title: 'Estimation and planning', duration: '50 min', lessons: ['Why old estimates break', 'New estimation frameworks', 'Managing stakeholder expectations', 'The sprint model for AI teams'] },
      { title: 'Team health and growth', duration: '45 min', lessons: ['Keeping engineers learning', 'Avoiding AI dependency traps', 'Career paths in AI-first teams', 'Hiring for the hybrid model'] },
      { title: 'Stakeholder communication', duration: '35 min', lessons: ['Explaining AI-assisted delivery', 'Managing expectations on quality', 'Reporting on AI-generated metrics', 'When to slow down'] },
    ],
    testimonials: [
      { quote: "My team doubled output but I had no idea how to manage it. This course gave me the frameworks I needed to stay in control.", name: 'Tom W.', role: 'Engineering Manager, SaaS company' },
      { quote: "The code review module alone changed how we handle quality. We were reviewing the wrong things before.", name: 'Nadia P.', role: 'Technical Lead' },
    ],
  },
  'saas-to-aaas-transition': {
    description: "Software-as-a-Service worked for the last decade. AI-as-a-Service is what comes next — and it changes the economics, the product model, and the customer relationship in fundamental ways. This course explains what the transition means, who will win, and what businesses need to do now to stay on the right side of it.",
    outcomes: [
      'What AaaS actually means and how it differs from SaaS',
      'Why the SaaS pricing model breaks down in an AI-native world',
      'How to identify which parts of your business are exposure to disruption',
      'The three business models that emerge from this transition',
      'What a successful AaaS product looks like in your category',
      'A framework for deciding where to invest now',
    ],
    personas: [
      { icon: '01', role: 'SaaS Founder', situation: 'Running a SaaS product and wondering how long the current model holds' },
      { icon: '02', role: 'Product Strategist', situation: 'Responsible for long-term product direction and competitive positioning' },
      { icon: '03', role: 'Investor or Advisor', situation: 'Evaluating businesses in the context of the AI transition' },
    ],
    modules: [
      { title: 'The AaaS model explained', duration: '40 min', lessons: ['SaaS vs AaaS: the core differences', 'Value delivery in an agent world', 'New pricing architectures', 'Who is doing this well right now'] },
      { title: 'Business exposure analysis', duration: '45 min', lessons: ['Mapping your product to agent capabilities', 'Where disruption hits first', 'Moats that survive the transition', 'Exercise: assess your own exposure'] },
      { title: 'Strategic response options', duration: '35 min', lessons: ['The three strategic positions', 'When to pivot vs when to evolve', 'Building new moats', 'Capital and timeline implications'] },
    ],
    testimonials: [
      { quote: "Clearest explanation of the SaaS disruption I've seen. I made a major product pivot decision based on the framework in module two.", name: 'Rachel K.', role: 'SaaS Founder' },
      { quote: "I now use the exposure analysis framework with every portfolio company. It's that good.", name: 'David C.', role: 'Early-stage investor' },
    ],
  },
  'build-vs-buy-vs-agent': {
    description: "Every business reaches the same crossroads: do we build it ourselves, buy a tool off the shelf, or use an AI agent to handle it? The wrong answer wastes months and thousands. This course gives you a decision framework grounded in real cost analysis — not vendor hype.",
    outcomes: [
      'A repeatable framework for build vs buy vs agent decisions',
      'How to calculate the true total cost of each option',
      'When custom software is worth the investment and when it is not',
      'How to evaluate off-the-shelf tools for your specific situation',
      'When an AI agent is genuinely better than software',
      'How to avoid the most expensive decision-making mistakes',
    ],
    personas: [
      { icon: '01', role: 'Business Owner', situation: 'Facing a process problem and evaluating solutions' },
      { icon: '02', role: 'Operations Director', situation: 'Responsible for tooling decisions across the organisation' },
      { icon: '03', role: 'CFO or Finance Lead', situation: 'Needs to evaluate technology investment proposals' },
    ],
    modules: [
      { title: 'The decision framework', duration: '40 min', lessons: ['The three-option model', 'Decision criteria by business context', 'Common decision biases', 'Running a structured evaluation'] },
      { title: 'True cost analysis', duration: '50 min', lessons: ['Total cost of custom development', 'SaaS true cost over 3 years', 'Agent deployment and running costs', 'The cost of switching later'] },
    ],
    testimonials: [
      { quote: "We were about to spend $80k on custom software. The TCO analysis in this course showed a SaaS tool would do 90% of the job at 10% of the cost.", name: 'Ian S.', role: 'Operations Director' },
      { quote: "Short, dense, and immediately useful. I now run every tooling decision through this framework.", name: 'Mei L.', role: 'COO, professional services firm' },
    ],
  },
  'technical-literacy-for-teams': {
    description: "You work with software every day, but nobody explained how it actually works — what a database is, why APIs matter, what \"the backend\" means, or how AI fits into all of it. This course fixes that gap for non-technical people who work alongside engineers, talk to vendors, or evaluate technology decisions.",
    outcomes: [
      'How software is structured — frontend, backend, database, and how they connect',
      'What APIs are and why everything depends on them',
      'How databases store and retrieve information (and why that matters)',
      'The basics of how AI models work and where they fit in software',
      'How to read and understand technical documentation without panicking',
      'Vocabulary that makes you credible in technical conversations',
    ],
    personas: [
      { icon: '01', role: 'Operations Staff', situation: 'Working daily with software tools and escalating to IT for everything' },
      { icon: '02', role: 'Marketing or Sales Professional', situation: 'Building business cases that need to reference technical capability' },
      { icon: '03', role: 'Non-Technical Manager', situation: 'Responsible for a team that includes developers or data analysts' },
    ],
    modules: [
      { title: 'How software is built', duration: '70 min', lessons: ['Frontend vs backend vs database', 'How a web request works', 'What a tech stack is', 'Monoliths vs microservices — simplified'] },
      { title: 'APIs and integrations', duration: '65 min', lessons: ['What an API actually is', 'Why APIs break and what happens', 'Reading API documentation', 'Webhooks, polling, and real-time data'] },
      { title: 'Databases explained', duration: '55 min', lessons: ['Relational vs document databases', 'What SQL is (no, you don\'t need to write it)', 'Data modelling for non-engineers', 'Why database design matters for your product'] },
      { title: 'AI in the software stack', duration: '60 min', lessons: ['Where AI models sit in architecture', 'Training vs inference — the key distinction', 'Vector databases and why they exist', 'AI APIs and how software uses them'] },
      { title: 'Reading technical docs', duration: '45 min', lessons: ['Anatomy of a technical spec', 'Error messages and what they mean', 'GitHub and version control basics', 'Exercise: read and annotate a real doc'] },
      { title: 'Technical conversations at work', duration: '45 min', lessons: ['Vocabulary by role and context', 'Asking good questions without exposing gaps', 'Writing technical requirements', 'Standing up in tech meetings'] },
    ],
    testimonials: [
      { quote: "I've worked in SaaS for five years and finally understand what my engineering team talks about. Should have done this in year one.", name: 'Sophie A.', role: 'Marketing Director, SaaS company' },
      { quote: "The APIs module alone changed how I communicate with our integration partners. I now speak their language.", name: 'Kevin B.', role: 'Account Manager, tech firm' },
    ],
  },
  'working-with-ai-agents': {
    description: "AI agents are showing up in workplaces fast — handling emails, processing data, running reports, managing workflows. Most employees have no framework for working alongside them effectively. This course gives your team a practical mental model for AI agents: how to collaborate with them, when to trust them, and when to override them.",
    outcomes: [
      'What AI agents can and cannot do reliably in a work context',
      'How to give an agent clear, effective instructions',
      'How to review and verify agent-produced outputs',
      'When to override agent decisions — and how to do it correctly',
      'How to spot when an agent is drifting from its intended task',
      'Your personal responsibility when working alongside AI',
    ],
    personas: [
      { icon: '01', role: 'Knowledge Worker', situation: 'Agent tools are being rolled out in their organisation' },
      { icon: '02', role: 'Team Lead', situation: 'Responsible for a team that will adopt AI agent workflows' },
      { icon: '03', role: 'Executive', situation: 'Wants to understand what their teams are being asked to work with' },
    ],
    modules: [
      { title: 'Understanding your AI colleague', duration: '40 min', lessons: ['How agents differ from software tools', 'What agents know vs what they infer', 'Task types: suited vs unsuited', 'Setting accurate expectations'] },
      { title: 'Working effectively with agents', duration: '45 min', lessons: ['Writing clear task instructions', 'Giving feedback to improve outputs', 'Knowing when the output is good enough', 'Human-in-the-loop workflows'] },
      { title: 'Responsibility and override', duration: '35 min', lessons: ['Your legal and professional responsibility', 'Override protocols in practice', 'Escalation paths when agents fail', 'Documenting agent decisions'] },
    ],
    testimonials: [
      { quote: "Our team resisted the agent rollout at first. After this course, they had a framework and the confidence to use it. Adoption went from 30% to 80%.", name: 'Lisa H.', role: 'Head of People, tech company' },
      { quote: "I understood theoretically how agents work before. Now I know how to actually work alongside one without second-guessing everything.", name: 'Omar F.', role: 'Senior analyst' },
    ],
  },
  'reading-technical-documentation': {
    description: "Technical documentation is written by engineers for engineers — which means if you\'re not an engineer, it can feel like reading a foreign language. This short course teaches you a practical approach to reading docs: how to find what you need, what to skip, and how to extract the information you actually came for.",
    outcomes: [
      'A reliable method for navigating unfamiliar technical documentation',
      'How to identify which parts of a doc are relevant to your situation',
      'Common patterns in technical writing and what they mean',
      'How to read error messages and trace them back to the cause',
      'How to ask better questions when you can\'t find the answer in docs',
      'Confidence when reading anything technical — specs, tickets, changelogs',
    ],
    personas: [
      { icon: '01', role: 'Non-Technical Employee', situation: 'Expected to understand technical materials at work' },
      { icon: '02', role: 'Business Analyst', situation: 'Working on software projects and needs to interpret specifications' },
      { icon: '03', role: 'Founder or PM', situation: 'Reviews technical output and needs to evaluate it critically' },
    ],
    modules: [
      { title: 'How technical documentation is structured', duration: '35 min', lessons: ['The anatomy of a tech doc', 'Quickstart vs reference vs tutorial', 'How engineers write — and why it reads the way it does', 'What to read first'] },
      { title: 'Reading strategies for non-engineers', duration: '40 min', lessons: ['Top-down scanning technique', 'Working with examples', 'When to read vs when to search', 'Exercise: navigate a real API doc'] },
    ],
    testimonials: [
      { quote: "I used to hand technical docs straight to our developer. Now I can read them myself and filter out the 80% that isn't relevant before escalating.", name: 'Anna R.', role: 'Project Manager' },
      { quote: "Short, focused, and immediately practical. My relationship with technical docs completely changed after this course.", name: 'Bruno K.', role: 'Business Analyst' },
    ],
  },
};

const COURSE_FAQ = [
  { q: 'How long do I have access?', a: 'Lifetime. Once you enrol, the course is yours forever — including any updates we make to the content.' },
  { q: 'Do I need technical skills?', a: 'No. Every course in the Academy is designed for people without a technical background. No coding, no setup, no prerequisites.' },
  { q: 'Is there a certificate?', a: 'Yes. You receive a digital certificate of completion when you finish the course. It includes your name, course title, and completion date.' },
  { q: 'Can I get a refund?', a: 'Yes. We offer a 30-day money-back guarantee, no questions asked. If the course isn\'t right for you, email us within 30 days for a full refund.' },
  { q: 'Can my team take this?', a: 'Yes. We have team and corporate pricing for groups of 5 or more. See our corporate training page or contact us directly.' },
  { q: 'Is this live or self-paced?', a: 'All courses are self-paced. Watch at your own speed, pause, rewind, revisit. For live instruction, see our workshops page.' },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.acd-page { min-height: 100vh; }
.acd-hero {
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.acd-hero::before {
  content: '';
  position: absolute;
  top: -300px; right: -300px;
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.acd-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 60px;
  align-items: start;
}
@media (max-width: 900px) { .acd-hero-inner { grid-template-columns: 1fr; } }
.acd-audience-tag {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.acd-audience-tag::before {
  content: '';
  width: 16px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.acd-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem,4vw,2.6rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.acd-hero-desc {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 24px;
  max-width: 560px;
}
.acd-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}
.acd-meta-pill {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-secondary);
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 5px 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.acd-hero-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.acd-btn-enroll {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, ${A}, rgba(232,184,77,0.8));
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 800;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(232,184,77,0.3);
}
.acd-btn-enroll:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.acd-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent;
  cursor: pointer;
}
.acd-btn-ghost:hover { border-color: rgba(232,184,77,0.4); color: ${A}; }
.acd-thumb-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 80px rgba(232,184,77,0.08);
}
.acd-thumb-visual {
  height: 200px;
  position: relative;
}
.acd-thumb-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 80%, rgba(232,184,77,0.2) 0%, transparent 70%);
}
.acd-course-stats {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.acd-stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.acd-stat-value {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
}
.acd-stat-label {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.acd-section {
  padding: 80px 0;
  border-top: 1px solid var(--border);
}
.acd-section.alt { background: var(--bg-2); }
.acd-section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.acd-section-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.acd-section-label::before {
  content: '';
  width: 16px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.acd-section-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem,2.5vw,1.9rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 36px;
}
.acd-outcomes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) { .acd-outcomes-grid { grid-template-columns: 1fr; } }
.acd-outcome-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.acd-check-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: rgba(232,184,77,0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.acd-outcome-text {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.acd-personas-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
}
@media (max-width: 640px) { .acd-personas-grid { grid-template-columns: 1fr; } }
.acd-persona-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.acd-persona-icon {
  width: 36px;
  height: 36px;
  background: rgba(232,184,77,0.1);
  border: 1px solid rgba(232,184,77,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  font-weight: 600;
}
.acd-persona-role {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}
.acd-persona-sit {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.acd-module-list { display: flex; flex-direction: column; gap: 8px; }
.acd-module-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.acd-module-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
}
.acd-module-header:hover { background: var(--bg-card-hover); }
.acd-module-num {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  font-weight: 600;
  flex-shrink: 0;
}
.acd-module-title {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}
.acd-module-dur {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  flex-shrink: 0;
}
.acd-module-chevron {
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  color: var(--text-muted);
}
.acd-module-chevron.open { transform: rotate(180deg); }
.acd-module-body {
  overflow: hidden;
  border-top: 1px solid var(--border);
}
.acd-lesson-list {
  padding: 12px 20px 16px 52px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 0;
}
.acd-lesson-item {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.acd-lesson-item::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${A};
  flex-shrink: 0;
  opacity: 0.5;
}
.acd-instructor-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
}
@media (max-width: 600px) { .acd-instructor-card { flex-direction: column; } }
.acd-instructor-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${A}, rgba(232,184,77,0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
  flex-shrink: 0;
}
.acd-instructor-name {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.acd-instructor-title {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.acd-instructor-bio {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}
.acd-instructor-link {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-decoration: none;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.acd-instructor-link:hover { opacity: 0.75; }
.acd-testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) { .acd-testimonials-grid { grid-template-columns: 1fr; } }
.acd-testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
}
.acd-quote-mark {
  font-family: Georgia, serif;
  font-size: 2.5rem;
  color: ${A};
  opacity: 0.4;
  line-height: 1;
  margin-bottom: 8px;
}
.acd-quote-text {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 16px;
  font-style: italic;
}
.acd-quote-name {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
}
.acd-quote-role {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
}
.acd-related-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
}
@media (max-width: 768px) { .acd-related-grid { grid-template-columns: 1fr; } }
.acd-related-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
}
.acd-related-card:hover { border-color: rgba(232,184,77,0.35); transform: translateY(-3px); }
.acd-related-thumb { height: 80px; }
.acd-related-body { padding: 14px; }
.acd-related-tag {
  font-family: ${F.m};
  font-size: 0.55rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}
.acd-related-title {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
}
.acd-related-price {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  font-weight: 600;
}
.acd-faq-list { display: flex; flex-direction: column; gap: 8px; }
.acd-faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.acd-faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: background 0.2s ease;
  user-select: none;
  gap: 12px;
}
.acd-faq-question:hover { background: var(--bg-card-hover); }
.acd-faq-answer {
  overflow: hidden;
  border-top: 1px solid var(--border);
}
.acd-faq-answer-inner {
  padding: 14px 20px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
.acd-mobile-cta-bar {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 200;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 12px 20px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
@media (max-width: 900px) { .acd-mobile-cta-bar { display: flex; } }
.acd-mobile-price {
  font-family: ${F.h};
  font-size: 1.2rem;
  font-weight: 800;
  color: ${A};
}
.acd-mobile-enroll {
  padding: 10px 24px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 800;
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
}
.acd-sidebar-card {
  background: var(--bg-card);
  border: 1px solid rgba(232,184,77,0.2);
  border-radius: 16px;
  padding: 24px;
  position: sticky;
  top: 100px;
}
.acd-sidebar-name {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  line-height: 1.4;
}
.acd-sidebar-price {
  font-family: ${F.h};
  font-size: 2rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 20px;
}
.acd-sidebar-features {
  list-style: none;
  margin: 0 0 20px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.acd-sidebar-feature {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.acd-sidebar-enroll {
  display: block;
  width: 100%;
  padding: 13px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 800;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}
.acd-sidebar-enroll:hover { opacity: 0.88; transform: translateY(-1px); }
.acd-sidebar-bundle-note {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
}
.acd-sidebar-bundle-note a { color: ${A}; text-decoration: none; }
.acd-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 80px 32px;
}
`;

// ── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke={A} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Module accordion ─────────────────────────────────────────────────────────
function ModuleItem({ mod, index }: { mod: CourseDetail['modules'][0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="acd-module-item">
      <div className="acd-module-header" onClick={() => setOpen(o => !o)} role="button" aria-expanded={open}>
        <span className="acd-module-num">0{index + 1}</span>
        <span className="acd-module-title">{mod.title}</span>
        <span className="acd-module-dur">{mod.duration}</span>
        <span className={`acd-module-chevron${open ? ' open' : ''}`}><ChevronDown size={15} /></span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="acd-module-body" key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}>
            <ul className="acd-lesson-list">
              {mod.lessons.map((l, i) => <li key={i} className="acd-lesson-item">{l}</li>)}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── FAQ accordion ────────────────────────────────────────────────────────────
function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acd-faq-item">
      <div className="acd-faq-question" onClick={() => setOpen(o => !o)} role="button" aria-expanded={open}>
        <span>{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
          <ChevronDown size={15} />
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="acd-faq-answer" key="a"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <div className="acd-faq-answer-inner">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';

  const course = COURSES.find(c => c.slug === slug);
  const detail = COURSE_DETAILS[slug];

  if (!course || !detail) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="acd-not-found">
          <div style={{ fontFamily: F.h, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Course not found</div>
          <Link href="/academy/courses" style={{ fontFamily: F.m, fontSize: '0.75rem', color: A, textDecoration: 'none' }}>
            Back to catalog
          </Link>
        </div>
      </>
    );
  }

  const related = COURSES.filter(c => c.slug !== slug && (c.audience === course.audience || c.category === course.category)).slice(0, 3);
  const moduleCount = detail.modules.length;
  const lessonCount = detail.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <>
      <style>{STYLES}</style>
      <div className="acd-page">

        {/* ── Hero ── */}
        <section className="acd-hero">
          <div className="acd-hero-inner">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="acd-audience-tag">{AUDIENCE_LABEL[course.audience]}</div>
              <h1 className="acd-hero-title">{course.name}</h1>
              <p className="acd-hero-desc">{detail.description}</p>
              <div className="acd-meta-row">
                <span className="acd-meta-pill">{course.duration}</span>
                <span className="acd-meta-pill">${course.price}</span>
                <span className="acd-meta-pill">Self-paced</span>
                <span className="acd-meta-pill">Lifetime access</span>
              </div>
              <div className="acd-hero-btns">
                <a href="#enroll" className="acd-btn-enroll">Enroll for ${course.price} <ArrowRight /></a>
                <button className="acd-btn-ghost" onClick={() => document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' })}>
                  See Syllabus
                </button>
              </div>
            </motion.div>

            {/* Sidebar / Thumb on hero */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="acd-thumb-card">
                <div className="acd-thumb-visual" style={{ background: course.gradient, position: 'relative', overflow: 'hidden' }}>
                  <img src={`/images/courses/${course.category}.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="acd-thumb-glow" style={{ position: 'relative', zIndex: 1 }} />
                </div>
                <div className="acd-course-stats">
                  <div className="acd-stat-item"><span className="acd-stat-value">{moduleCount}</span><span className="acd-stat-label">Modules</span></div>
                  <div className="acd-stat-item"><span className="acd-stat-value">{lessonCount}</span><span className="acd-stat-label">Lessons</span></div>
                  <div className="acd-stat-item"><span className="acd-stat-value">{course.duration}</span><span className="acd-stat-label">Total time</span></div>
                  <div className="acd-stat-item"><span className="acd-stat-value">Yes</span><span className="acd-stat-label">Certificate</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Outcomes ── */}
        <section className="acd-section alt">
          <div className="acd-section-inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="acd-section-label">Outcomes</div>
              <h2 className="acd-section-title">What you'll learn</h2>
              <div className="acd-outcomes-grid">
                {detail.outcomes.map((o, i) => (
                  <motion.div key={i} className="acd-outcome-item" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}>
                    <div className="acd-check-icon"><CheckIcon /></div>
                    <span className="acd-outcome-text">{o}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Who It's For ── */}
        <section className="acd-section">
          <div className="acd-section-inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="acd-section-label">Who this is for</div>
              <h2 className="acd-section-title">This course is for you if...</h2>
              <div className="acd-personas-grid">
                {detail.personas.map((p, i) => (
                  <div key={i} className="acd-persona-card">
                    <div className="acd-persona-icon">{p.icon}</div>
                    <div className="acd-persona-role">{p.role}</div>
                    <div className="acd-persona-sit">{p.situation}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Syllabus ── */}
        <section className="acd-section alt" id="syllabus">
          <div className="acd-section-inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="acd-section-label">Curriculum</div>
              <h2 className="acd-section-title">Course syllabus</h2>
              <div className="acd-module-list">
                {detail.modules.map((mod, i) => <ModuleItem key={i} mod={mod} index={i} />)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Instructor ── */}
        <section className="acd-section">
          <div className="acd-section-inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="acd-section-label">Your instructor</div>
              <h2 className="acd-section-title" style={{ marginBottom: 24 }}>Taught by the people who build this</h2>
              <div className="acd-instructor-card">
                <div className="acd-instructor-avatar">AR</div>
                <div>
                  <div className="acd-instructor-name">Arifur Rahman</div>
                  <div className="acd-instructor-title">CEO & Co-Founder, SocioFi Technology</div>
                  <p className="acd-instructor-bio">
                    Arifur is a BUET graduate and co-founder of SocioFi Technology. He has spent the last several years building AI-native software systems and working directly with founders and SMEs to take products from prototype to production. He teaches what he has learned from doing it — not from theory.
                  </p>
                  <Link href="/about" className="acd-instructor-link">See all instructors <ArrowRight size={10} /></Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Enroll (anchor) + Sidebar layout ── */}
        <section className="acd-section alt" id="enroll">
          <div className="acd-section-inner">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
              {/* Testimonials */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="acd-section-label">Reviews</div>
                <h2 className="acd-section-title">What students say</h2>
                <div className="acd-testimonials-grid">
                  {detail.testimonials.map((t, i) => (
                    <div key={i} className="acd-testimonial-card">
                      <div className="acd-quote-mark">"</div>
                      <p className="acd-quote-text">{t.quote}</p>
                      <div className="acd-quote-name">{t.name}</div>
                      <div className="acd-quote-role">{t.role}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Sticky sidebar */}
              <div className="acd-sidebar-card" style={{ display: 'none' }}
                // desktop only — show via CSS; mobile uses bottom bar
                ref={(el) => { if (el) el.style.display = 'block'; }}>
                <div className="acd-sidebar-name">{course.name}</div>
                <div className="acd-sidebar-price">${course.price}</div>
                <ul className="acd-sidebar-features">
                  {[`${moduleCount} modules · ${lessonCount} lessons`, course.duration + ' total', 'Self-paced', 'Lifetime access', 'Certificate of completion', '30-day money-back guarantee'].map((f, i) => (
                    <li key={i} className="acd-sidebar-feature"><CheckIcon /> {f}</li>
                  ))}
                </ul>
                <a href="#enroll" className="acd-sidebar-enroll">Enroll Now</a>
                <p className="acd-sidebar-bundle-note">
                  Part of a bundle? <Link href="/academy/courses">See bundle pricing</Link> and save up to 34%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Courses ── */}
        {related.length > 0 && (
          <section className="acd-section">
            <div className="acd-section-inner">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="acd-section-label">Keep learning</div>
                <h2 className="acd-section-title">You might also like</h2>
                <div className="acd-related-grid">
                  {related.map(r => (
                    <Link key={r.slug} href={`/academy/courses/${r.slug}`} className="acd-related-card">
                      <div className="acd-related-thumb" style={{ background: r.gradient, position: 'relative', overflow: 'hidden' }}>
                        <img src={`/images/courses/${r.category}.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="acd-related-body">
                        <div className="acd-related-tag">{AUDIENCE_LABEL[r.audience]}</div>
                        <div className="acd-related-title">{r.name}</div>
                        <div className="acd-related-price">${r.price} · {r.duration}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section className="acd-section alt">
          <div className="acd-section-inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="acd-section-label">FAQ</div>
              <h2 className="acd-section-title">Common questions</h2>
              <div className="acd-faq-list">
                {COURSE_FAQ.map((item, i) => <FAQItem key={i} item={item} />)}
              </div>
            </motion.div>
          </div>
        </section>

      </div>

      {/* Mobile sticky CTA */}
      <div className="acd-mobile-cta-bar">
        <div>
          <div style={{ fontFamily: F.m, fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Enroll today</div>
          <div className="acd-mobile-price">${course.price}</div>
        </div>
        <a href="#enroll" className="acd-mobile-enroll">Enroll Now</a>
      </div>
    </>
  );
}
