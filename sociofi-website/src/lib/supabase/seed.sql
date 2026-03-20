-- ============================================================
-- SocioFi Technology — CMS Seed Data
-- Safe to run multiple times (ON CONFLICT DO NOTHING)
-- ============================================================


-- ============================================================
-- SECTION 1: Blog Posts (cms_posts)
-- ============================================================

INSERT INTO cms_posts (title, slug, body, excerpt, status, division, author, tags, cover_image, published_at)
VALUES
(
  'How AI Agents Are Replacing Dev Teams',
  'how-ai-agents-are-replacing-dev-teams',
  E'## The Shift Is Already Happening\n\nAI agents are no longer a novelty in software development — they are a real part of the production workflow. Companies are deploying agents to write boilerplate, generate tests, review pull requests, and even deploy code. The question is no longer *if* this is happening. It''s *how fast*.\n\n## What Changes for Engineers\n\nThe role is shifting from *writing code* to *directing code*. Engineers who understand how to architect systems, review AI output critically, debug failures at the infrastructure level, and ensure production stability — those engineers are more valuable than ever.\n\nWhat''s disappearing is the middle layer: the junior developer writing CRUD endpoints from a spec, the contractor spinning up boilerplate projects, the team of five doing what one engineer with the right tools can now do in a third of the time.\n\n## What Stays the Same\n\nDebug a production outage at 2am? Still a human job. Design an architecture that will survive 10x growth? Human. Understand that a customer''s "slow app" is actually a N+1 query problem buried three layers deep? Human.\n\nAI agents are extraordinarily good at generation. They are not yet good at *understanding* — the kind of contextual, high-stakes reasoning that separates a codebase that scales from one that collapses under pressure.\n\n## The New Stack\n\nThe winning formula isn''t "AI instead of engineers." It''s AI agents doing the generation work — fast, tireless, consistent — while human engineers handle architecture, oversight, debugging, and the kind of judgment calls that require actually understanding what you''re building and why.\n\nAt SocioFi, this is exactly how we operate. AI agents write. Humans architect, review, and ship.\n\n## The Bottom Line\n\nIf you''re a non-technical founder or a business without an engineering team, this shift is good news. The cost of building software is falling. The expertise required to build it *well* is not. That gap is where we live.',
  'The shift is already happening. Companies are deploying AI agents to write, test, and deploy code — with human engineers moving into architecture and oversight roles.',
  'published',
  'labs',
  'Kamrul Hasan',
  '["ai-agents","engineering","future-of-work"]',
  NULL,
  '2026-01-15T10:00:00Z'
),
(
  'From Broken MVP to Production: The Founder''s Guide',
  'from-broken-mvp-to-production',
  E'## It Works in Demo. It Breaks Everywhere Else.\n\nYou''ve seen it happen. The app works beautifully in the demo — clean UI, fast responses, no errors. You hand it off to five real users and it falls apart. Slow load times. Mysterious 500 errors. Data that saves in one session and disappears in the next.\n\nThis is not a bug. This is what happens when a prototype meets reality.\n\n## What ''Production Ready'' Actually Means\n\nProduction-ready code isn''t just code that works. It''s code that works under pressure, recovers from failure, scales when traffic spikes, and can be debugged when something goes wrong at 3am.\n\nThat means:\n- A database with proper indexes and connection pooling\n- Error handling that logs failures *and* recovers gracefully\n- Environment configuration that doesn''t expose secrets\n- A deployment pipeline that tests before it ships\n- Monitoring that tells you something broke before your customers do\n\n## The Five Things Most MVPs Miss\n\n**1. Error boundaries.** Most MVPs have no global error handling. One uncaught exception brings the whole thing down.\n\n**2. Database hygiene.** No indexes on the columns you''re querying. Works fine with 50 rows. Grinds to a halt with 5,000.\n\n**3. Authentication edge cases.** Token expiry, concurrent sessions, password reset flows — they''re an afterthought in most prototypes.\n\n**4. Rate limiting.** Your app has no protection against a single user making 10,000 API calls in a minute. That user will exist.\n\n**5. Environment parity.** It works locally. It works in staging. Production has different environment variables, different database URLs, different secrets — and nobody documented the differences.\n\n## The Path Forward\n\nProduction hardening is not glamorous work. It doesn''t add features — it makes the features you have actually reliable. At SocioFi Studio, this is often the first thing we do with a new client: a systematic audit of every layer of the stack before we write a single new line of code.\n\nStart there. Fix what''s broken before you build what''s next.',
  'Your MVP works in your demo. It breaks in production. Here''s what actually needs to happen between "it works on my machine" and "it works for your customers".',
  'published',
  'studio',
  'Arifur Rahman',
  '["mvp","production","founders"]',
  NULL,
  '2026-01-22T10:00:00Z'
),
(
  'SocioFi Technology: Our Story and Why We Built This',
  'sociofii-technology-our-story',
  E'## The Problem We Kept Seeing\n\nBefore SocioFi, both Arifur and I spent years in software engineering — building products, leading teams, consulting for startups. And over and over, we saw the same thing.\n\nFounders with real ideas, real potential, and genuine ambition — stuck. Not because they lacked vision. Not because their market was wrong. But because they couldn''t ship.\n\nThey had prototypes. Sometimes good ones. Built with the latest AI coding tools, moving fast, looking great in demos. But they couldn''t get from prototype to product. They didn''t know what they didn''t know about deployment, scaling, security, maintenance. And they couldn''t afford a full engineering team.\n\n## What We Decided to Do About It\n\nWe built SocioFi to be the engineering team they couldn''t hire.\n\nNot a consulting firm. Not a dev shop that takes a brief and disappears. An embedded technical partner — one that knows how to use AI agents to move fast, but has the human expertise to build things that actually last.\n\nArifur handles the business architecture: client relationships, project scoping, the hard conversations about what''s realistic on a given timeline and budget. I focus on the technical architecture: how systems are built, how they scale, how they survive when things go wrong.\n\n## Why Bangladesh, Why BUET\n\nWe both graduated from BUET — Bangladesh University of Engineering and Technology. Engineering rigor is in the DNA of this company. We are not order-takers. We push back when something won''t work. We tell clients the truth about their codebase, even when it''s uncomfortable.\n\nOperating from Dhaka lets us offer a calibre of engineering talent at a price point that makes sense for founders and SMBs — without the corners that cheaper options cut.\n\n## What We''re Building Toward\n\nSocioFi is not a freelance marketplace or an outsourcing platform. We are building an AI-native engineering firm — one where every division is a product in itself, serving a specific customer need with a specific team and a specific set of tools.\n\nStudio builds. Services maintains. Academy teaches. Cloud hosts. Ventures backs. Labs researches. And the whole thing is powered by AI agents directed by engineers who actually know what they''re doing.\n\nThat''s the bet. And we''re just getting started.',
  'We started SocioFi because we kept seeing the same problem: brilliant founders with AI-generated prototypes that couldn''t ship. We are the team that ships them.',
  'published',
  'parent',
  'Arifur Rahman',
  '["company","story","founders"]',
  NULL,
  '2026-02-01T10:00:00Z'
),
(
  'The Real Cost of AI-Powered Development',
  'real-cost-of-ai-powered-development',
  E'## Generation Is Only 20% of the Work\n\nAI coding tools have made one part of software development dramatically cheaper: generating code. You can describe a feature, watch the AI write it, iterate on it, and have working code in minutes instead of days.\n\nThat part is real. The cost savings in that 20% are real.\n\nBut code generation is only one fifth of what it actually takes to ship software. Here is where the rest of the cost lives.\n\n## The Real Cost Breakdown\n\n**Architecture decisions (15%)** — Choosing the right data model, the right infrastructure, the right framework. AI can suggest. It cannot weigh your specific tradeoffs.\n\n**Testing and QA (15%)** — Automated tests catch regressions. Manual QA catches the edge cases automated tests miss. Neither is free.\n\n**Integration and deployment (15%)** — Connecting your app to payment providers, third-party APIs, authentication systems, storage. Getting it deployed to an actual server with proper environment configuration.\n\n**Debugging and incident response (20%)** — Something will go wrong in production. Finding the cause, fixing it, making sure it doesn''t happen again. This is where experienced engineers earn their salary.\n\n**Maintenance (15%)** — Dependencies go out of date. Security vulnerabilities are discovered. The framework you chose releases a breaking version. This work never stops.\n\n## What This Means for Founders\n\nIf you''re evaluating AI-powered development options, the right question isn''t "how fast can they generate code?" It''s "who handles everything else?"\n\nAt SocioFi, we are transparent about this because it''s important: AI tools make us faster in generation. The human expertise we apply to the other 80% is what makes the difference between a prototype and a product.\n\n## The Bottom Line\n\nAI development is genuinely cheaper than traditional development. But it is not free, and it is not magic. The best outcomes come from teams that understand exactly where AI adds value — and where humans still need to be in the loop.',
  'AI makes code generation fast and cheap. But generation is only 20% of the work. Here''s a breakdown of where the real costs are in AI-native development.',
  'published',
  'labs',
  'Kamrul Hasan',
  '["costs","ai-development","transparency"]',
  NULL,
  '2026-02-10T10:00:00Z'
),
(
  'Understanding Managed Cloud Hosting',
  'understanding-managed-cloud-hosting',
  E'## More Than Just Uptime\n\nWhen people hear "managed hosting," they usually think of uptime guarantees and SLA percentages. And yes, those matter. But managed hosting is really about something more specific: having a team that knows your codebase, your infrastructure, and your business — and is on call when things go wrong.\n\n## What Self-Managed Looks Like at 3am\n\nYour app is down. Traffic spike, database connection limit hit, memory leak finally consumed everything. You are not a DevOps engineer. You don''t have one. You''re on Slack trying to find someone who might know what to do, while customers tweet at you and your co-founder stares at the ceiling.\n\nThis is not hypothetical. This is what happens.\n\n## What Managed Hosting Actually Includes\n\nGood managed hosting is not just a server with someone watching a dashboard. It includes:\n\n**Monitoring with context.** Knowing that your error rate spiked 400% is useful. Knowing it''s because a third-party API your auth flow depends on is returning 503s — and automatically routing around it — is the difference between a 5-minute incident and a 4-hour outage.\n\n**Proactive maintenance.** Dependencies updated before they''re vulnerable. Security patches applied before you''re in a CVE advisory. Database vacuums running on schedule.\n\n**Incident response with institutional knowledge.** A team that has already read your codebase, understands your data model, and can make decisions quickly without starting from zero every time.\n\n**Scaling when it matters.** Your product gets featured somewhere big. Traffic 10x''s in 20 minutes. Managed hosting means someone saw that coming and the infrastructure scaled before your users felt it.\n\n## Is It Worth It?\n\nFor any product with real users and real revenue, the cost of downtime — in lost revenue, in customer trust, in founder stress — almost always exceeds the cost of good managed hosting. The math is not complicated.\n\nAt SocioFi Cloud, we manage the infrastructure so you can focus on the product.',
  'Managed hosting isn''t just about keeping your app running. It''s about having someone who knows your codebase on call when your traffic spikes at 3am.',
  'published',
  'cloud',
  'Kamrul Hasan',
  '["cloud","hosting","devops"]',
  NULL,
  '2026-02-20T10:00:00Z'
),
(
  'Introducing SocioFi Ventures: Backing AI-Native Founders',
  'introducing-sociofii-ventures',
  E'## Why We''re Doing This\n\nAt SocioFi, we spend every day working with founders who are building AI-native software companies. We see their products before almost anyone else. We understand their technical architecture, their team, their market assumptions, and the specific things that will make or break their trajectory.\n\nWe decided to stop just building for them and start backing them.\n\n## What We Look For\n\nSocioFi Ventures is not a generalist fund. We invest specifically in AI-native software companies — products where AI is not a feature but a core part of how the product works.\n\nThe founders we back share certain characteristics:\n\n- They have a clear thesis about *why* AI changes the economics or capabilities in their market\n- They understand the technical risks of their approach — or are honest about what they don''t know\n- They are building for a specific customer with a specific problem, not a trend\n- They want a technical partner, not just capital\n\n## What We Offer\n\nBeyond investment, portfolio companies get access to the SocioFi engineering bench. That means production hardening, infrastructure support, and technical advisory from the same team that has shipped dozens of AI-native products.\n\nWe''re not a firm that writes a check and shows up for board meetings. We get in the code with you.\n\n## How to Apply\n\nApplications are open year-round. We review every application personally and respond to every founder who applies — even if the answer is no.\n\nIf you''re building an AI-native software company and want a technical partner who has seen this before, we''d like to hear from you.\n\nThe application takes about 15 minutes. We''ll get back to you within 5 business days.',
  'We are launching a dedicated program to invest in and accelerate AI-native software companies. Here is what we look for and how to apply.',
  'draft',
  'ventures',
  'Arifur Rahman',
  '["ventures","investment","founders"]',
  NULL,
  NULL
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- SECTION 2: FAQs (cms_faqs)
-- ============================================================

-- Studio FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('studio', 'How long does a typical project take?', 'Most projects take 4–12 weeks depending on complexity. We give you a realistic timeline in the free consultation before any work begins.', 1),
('studio', 'Do I need to be technical to work with SocioFi Studio?', 'Not at all. We work with non-technical founders every day. You describe what you need — we handle all the technical decisions.', 2),
('studio', 'What''s included in the project brief?', 'Scope, timeline, milestones, deliverables, tech stack, and pricing. Everything fixed upfront so there are no surprises.', 3),
('studio', 'Who owns the code when you''re done?', 'You do. 100%. We deliver the full codebase, documentation, and deployment access on day one of handoff.', 4),
('studio', 'What if the build doesn''t match what I expected?', 'We do weekly demos throughout the project. You review and give feedback at each stage — so there are no surprises at the end.', 5)
ON CONFLICT DO NOTHING;

-- Services FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('services', 'What happens when I report a bug?', 'You submit a ticket via your Slack channel or our portal. We acknowledge within the response time for your plan and keep you updated throughout resolution.', 1),
('services', 'What''s covered under "bug fixes"?', 'Any defect in existing functionality — errors, crashes, broken features, incorrect behavior. New feature development is covered under your feature hours allowance.', 2),
('services', 'Can I upgrade or downgrade my plan?', 'Yes, at any time. Upgrades take effect immediately. Downgrades take effect at your next billing cycle.', 3),
('services', 'What''s your uptime SLA based on?', 'Our SLA covers application availability as measured by our monitoring infrastructure — not the uptime of any third-party services your app depends on.', 4),
('services', 'Do you work with any tech stack?', 'We work primarily with Node.js, Python, Next.js, React, PostgreSQL, and major cloud providers. If your stack is different, tell us in your intake call — we''ll be honest about whether we''re the right fit.', 5)
ON CONFLICT DO NOTHING;

-- Academy FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('academy', 'Do I need a technical background to take these courses?', 'No. Our courses are built for non-technical founders, team leads, and business owners. We explain the concepts clearly without assuming prior engineering knowledge.', 1),
('academy', 'How long do I have access to course content?', 'Lifetime access. Pay once, access forever — including any future updates to the course material.', 2),
('academy', 'Are the courses live or self-paced?', 'Most courses are self-paced video content you can watch on your own schedule. Workshops are live sessions with limited seats.', 3),
('academy', 'Do I get a certificate?', 'Yes. Every paid course and workshop includes a certificate of completion that you can share on LinkedIn or include in a portfolio.', 4),
('academy', 'Can my team take courses together?', 'Yes. We offer corporate packages for teams — custom curriculum, live facilitation, group exercises, and team-specific certificates. Contact us for pricing.', 5)
ON CONFLICT DO NOTHING;

-- Ventures FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('ventures', 'What stage do you invest in?', 'We invest from pre-seed through Series A. Most of our investments are at the pre-seed and seed stage, where technical partnership creates the most leverage.', 1),
('ventures', 'What does your investment include beyond capital?', 'Access to the SocioFi engineering bench, infrastructure support, technical advisory, and introductions to our network of founders and operators.', 2),
('ventures', 'How long does the application process take?', 'We review every application and respond within 5 business days. If we''re interested, we''ll schedule a call within a week of that.', 3),
('ventures', 'Do you invest in companies outside Bangladesh?', 'Yes. We are location-agnostic for investment. Engineering support is delivered remotely.', 4),
('ventures', 'What sectors do you focus on?', 'AI-native software companies across any vertical. We care more about whether AI is genuinely core to the product than which industry you''re in.', 5)
ON CONFLICT DO NOTHING;

-- Cloud FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('cloud', 'Which cloud providers do you work with?', 'AWS, Google Cloud, and DigitalOcean. We recommend based on your app''s requirements and your budget — not our preference.', 1),
('cloud', 'Will there be downtime during migration?', 'For most migrations, no. We plan zero-downtime migrations as the standard. If any downtime is unavoidable, we schedule it in advance and keep it under 5 minutes.', 2),
('cloud', 'What''s included in infrastructure management?', 'Server provisioning, configuration, monitoring, alerting, backups, security patching, and incident response. You get a fully managed environment.', 3),
('cloud', 'Do I still have access to my own infrastructure?', 'Yes. You retain full access and ownership of your cloud accounts and infrastructure. We manage it — we don''t own it.', 4),
('cloud', 'How quickly do you respond to production incidents?', 'Our response time depends on your plan — from 15 minutes for P1 incidents on our top tier to 4 hours on entry level. All incidents are acknowledged and tracked.', 5)
ON CONFLICT DO NOTHING;

-- Labs FAQs
INSERT INTO cms_faqs (division, question, answer, order_index)
VALUES
('labs', 'What does SocioFi Labs actually do?', 'Labs is our research and open-source arm. We publish findings on AI-native development, release open-source tools, and explore what the next generation of software engineering looks like.', 1),
('labs', 'Can I contribute to SocioFi Labs projects?', 'Yes. Our open-source projects are on GitHub and welcome contributions. See the contributing guide in each repo.', 2),
('labs', 'How often do you publish new research?', 'We publish 1–2 research posts or technical deep-dives per month. Subscribe to our newsletter to get them in your inbox.', 3),
('labs', 'Are Labs projects production-ready?', 'Some are. Some are experiments. Each project''s README clearly states its maturity level and recommended use cases.', 4),
('labs', 'Can I collaborate with Labs on a research project?', 'If your work aligns with our research focus, reach out via the Labs contact page. We do selective academic and industry collaborations.', 5)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION 3: Testimonials (cms_testimonials)
-- ============================================================

INSERT INTO cms_testimonials (name, title, company, content, rating, division, avatar_url)
VALUES
(
  'James Whitfield',
  'Founder & CEO',
  'NexaFlow',
  'SocioFi took our AI prototype that kept crashing and turned it into a product our customers actually use. The team moved fast, communicated clearly, and delivered exactly what they promised. Best development partner we''ve worked with.',
  5,
  'studio',
  NULL
),
(
  'Priya Sharma',
  'Head of Operations',
  'RetailOS',
  'We had three critical bugs hit production in one week before we found SocioFi Services. Now we sleep at night. Their monitoring caught an issue before any customer reported it — that alone was worth the subscription.',
  5,
  'services',
  NULL
),
(
  'Daniel Torres',
  'Co-founder',
  'Acadex',
  'I went through the AI Development for Founders course before hiring a dev team. It completely changed how I evaluate proposals and ask questions. I probably saved myself from a terrible vendor decision.',
  5,
  'academy',
  NULL
),
(
  'Fatima Al-Rashid',
  'CTO',
  'MedTrack',
  'Migrating to SocioFi Cloud was the best infrastructure decision we made. Zero downtime during the migration, and their team responded to our first production incident in 12 minutes.',
  5,
  'cloud',
  NULL
),
(
  'Marcus Chen',
  'Founder',
  'BuildLabs',
  'The SocioFi Ventures team doesn''t just write checks — they became part of our product team. The technical mentorship and network access were worth more than the investment itself.',
  5,
  'ventures',
  NULL
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION 4: Portfolio Items (cms_portfolio)
-- ============================================================

INSERT INTO cms_portfolio (title, slug, client, division, category, description, outcomes, cover_image, status)
VALUES
(
  'FounderHQ Platform',
  'founderhq-platform',
  'FounderHQ',
  'studio',
  'SaaS Product',
  'FounderHQ came to us with an AI-generated prototype that worked in demo mode but couldn''t handle more than 5 concurrent users. We rebuilt the architecture, added proper database indexing, implemented queue-based background jobs, and deployed on a managed infrastructure. Result: 2,000+ users, 99.97% uptime, and a $2M seed round closed 3 months post-launch.',
  '["Rebuilt backend to handle 2,000+ concurrent users","99.97% uptime in first 6 months","Reduced page load time from 8s to 1.2s","Enabled $2M seed round close"]',
  NULL,
  'published'
),
(
  'RetailOS Monitoring',
  'retailos-monitoring',
  'RetailOS',
  'services',
  'Services Retainer',
  'RetailOS was experiencing random production outages every 2–3 weeks with no visibility into the cause. We set up comprehensive monitoring, traced the issue to a memory leak in their API server, deployed a fix, and have maintained 99.95% uptime since.',
  '["Zero unplanned downtime in 8 months","Identified and fixed 3 critical memory leaks","Set up alerting for 47 monitoring points","Reduced P1 incident response from hours to minutes"]',
  NULL,
  'published'
),
(
  'AcadeX Learning Platform',
  'acadex-platform',
  'AcadeX',
  'academy',
  'E-learning',
  'AcadeX needed a video-first learning platform built and deployed in 6 weeks for their Series A demo. We used AI agents for the initial build, human engineers for architecture review and production hardening. Launched on time with their key features intact.',
  '["Delivered in 5.5 weeks","Supports 10,000 concurrent video streams","99.9% uptime from day one","Passed Series A technical due diligence"]',
  NULL,
  'published'
),
(
  'MedTrack Cloud Migration',
  'medtrack-cloud-migration',
  'MedTrack',
  'cloud',
  'Cloud Migration',
  'MedTrack needed to migrate a HIPAA-regulated application from a self-managed VPS to managed cloud infrastructure without any downtime. We executed a zero-downtime migration over a weekend, updated their infrastructure-as-code, and now manage their cloud environment.',
  '["Zero-downtime migration","HIPAA compliance maintained throughout","40% reduction in infrastructure costs","Automated backups every 6 hours"]',
  NULL,
  'published'
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- SECTION 5: Pricing Plans (cms_pricing)
-- ============================================================

-- Services Plans
INSERT INTO cms_pricing (division, tier, name, price, billing_period, tagline, features, metadata, is_featured)
VALUES
(
  'services',
  'essential',
  'Essential',
  499,
  'month',
  'Monitoring + rapid response for teams that need a safety net.',
  '["24/7 uptime + error-rate monitoring","Monthly dependency & CVE security scan","Up to 3 bug fixes per month","2 hours of feature work per month","Monthly written health report","Shared Slack channel"]',
  '{"uptime_sla":"99.9%","response_p1":"4 hours","response_p2":"8 hours","response_p3":"24 hours","response_p4":"72 hours","best_for":"Solo founders and early-stage products with stable codebases.","customer_range":"100–2,000 monthly active users"}',
  false
),
(
  'services',
  'growth',
  'Growth',
  999,
  'month',
  'Full-coverage support for products with real traction.',
  '["Everything in Essential","Proactive performance profiling","Weekly security patch deployment","Up to 8 bug fixes per month","4 hours of feature work per month","Bi-weekly video sync with your team","Dedicated Slack channel + named engineer","Incident post-mortem after every P1"]',
  '{"uptime_sla":"99.95%","response_p1":"1 hour","response_p2":"4 hours","response_p3":"8 hours","response_p4":"24 hours","badge":"MOST POPULAR","best_for":"Growing startups and SMBs that cannot afford downtime.","customer_range":"2,000–20,000 monthly active users"}',
  true
),
(
  'services',
  'scale',
  'Scale',
  1999,
  'month',
  'Dedicated engineering retainer for high-traffic production systems.',
  '["Everything in Growth","Unlimited bug fixes","12 hours of feature work per month","Quarterly architecture review","Load testing + capacity planning","Database optimization on request","Dedicated senior engineer (named)","Weekly written status report","Emergency on-call coverage (24/7)"]',
  '{"uptime_sla":"99.99%","response_p1":"15 minutes","response_p2":"1 hour","response_p3":"4 hours","response_p4":"8 hours","best_for":"Series A+ companies and high-traffic products where downtime = real money.","customer_range":"20,000+ monthly active users"}',
  false
)
ON CONFLICT DO NOTHING;

-- Academy Plans
INSERT INTO cms_pricing (division, tier, name, price, billing_period, tagline, features, metadata, is_featured)
VALUES
(
  'academy',
  'free',
  'Free Courses',
  0,
  'one-time',
  'Start learning at no cost. No credit card required.',
  '["Intro to AI Development (video)","Community forum access","Monthly Q&A webinar access","Certificate of completion"]',
  '{"cta":"Start for free"}',
  false
),
(
  'academy',
  'courses',
  'Individual Courses',
  39,
  'one-time',
  'Pay per course. Lifetime access included.',
  '["Full course access","Video lessons","Downloadable resources","Certificate of completion","Lifetime access"]',
  '{"price_note":"From $39 per course","cta":"Browse courses"}',
  true
),
(
  'academy',
  'corporate',
  'Corporate Training',
  0,
  'custom',
  'Custom curriculum for your team. Built around your use case.',
  '["Custom curriculum design","Live facilitation","Team exercises and workshops","Progress reporting","Certificates for all participants","Recording of all sessions"]',
  '{"price_note":"Custom pricing","cta":"Contact us"}',
  false
)
ON CONFLICT DO NOTHING;
