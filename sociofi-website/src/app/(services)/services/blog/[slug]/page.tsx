import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#4DBFA8';

// ── Types ──────────────────────────────────────────────────────────────────────

type Category = 'Maintenance' | 'Security' | 'Plans' | 'Case Study' | 'Agents';

interface ArticleSection {
  type: 'h2' | 'p' | 'ul' | 'callout';
  content?: string;
  items?: string[];
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  readTime: number;
  date: string;
  author: 'arifur' | 'kamrul';
  sections: ArticleSection[];
  takeaways: string[];
  related: Array<{ slug: string; title: string; category: Category; readTime: number }>;
}

// ── Authors ────────────────────────────────────────────────────────────────────

const AUTHORS = {
  arifur: { name: 'Arifur Rahman', role: 'CEO, SocioFi Technology · BUET' },
  kamrul: { name: 'Kamrul Hasan', role: 'CTO, SocioFi Technology · BUET' },
};

// ── Article data ───────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  {
    slug: 'the-true-cost-of-not-maintaining-your-software',
    title: 'The True Cost of Not Maintaining Your Software',
    excerpt: 'Zero is not what software maintenance costs when you do nothing — it is just deferred. Year one looks fine. Year two, an incident. Year three, a breach. The math on ignoring maintenance is not kind.',
    category: 'Maintenance',
    readTime: 8,
    date: '2026-03-10',
    author: 'arifur',
    takeaways: [
      'The average cost of a single production incident for a small SaaS product is $12,000–40,000 in lost revenue, emergency developer time, and customer churn',
      'Unpatched dependencies are the leading cause of security breaches in small business software — and they are entirely preventable with weekly audits',
      'Doing nothing is not free maintenance — it is a payment plan with compounding interest and an unpredictable due date',
      'Professional maintenance at $499–1,999/month is cheaper than a single P1 incident at almost every business stage',
    ],
    sections: [
      {
        type: 'p',
        content: 'Every founder we talk to understands, in theory, that software needs maintenance. Servers need patching. Dependencies get vulnerabilities. Things break. But in practice, maintenance is the line item that gets cut first — because the cost is invisible until it is not.',
      },
      {
        type: 'h2',
        content: 'The Illusion of "Free" Maintenance',
      },
      {
        type: 'p',
        content: 'When you launch a product and stop paying for active maintenance, the software does not cost you nothing to maintain — the costs become deferred and hidden. Dependencies continue to accumulate CVEs. Your Node.js version reaches end-of-life. Your database connection pool settings become misconfigured as traffic patterns change. None of this throws an error today. It just makes the eventual incident more severe.',
      },
      {
        type: 'p',
        content: 'This is why "it works fine" is such a dangerous sentence in software. Fine today, in this traffic profile, with this set of third-party dependencies, with no active exploit for your current vulnerability surface. Fine is not stable. Fine is just the quiet phase before things stop being fine.',
      },
      {
        type: 'h2',
        content: 'The Hidden Costs',
      },
      {
        type: 'p',
        content: 'When we ask founders what their software maintenance costs, they often say zero or close to it. What they are not counting:',
      },
      {
        type: 'ul',
        items: [
          'Emergency developer time when something breaks — typically 2–5x the normal hourly rate because it is urgent, unscheduled, and requires someone to re-learn a codebase they have not touched in months',
          'Revenue lost during downtime — even one hour of downtime at $500/hour in transaction volume is $500 that does not come back',
          'Customer support overhead during incidents — team time explaining outages, issuing refunds, managing churn',
          'Reputation damage — particularly acute in B2B products where reliability is a purchasing criterion',
          'Time cost to the founder — every hour spent dealing with a production crisis is an hour not spent on sales, product, or anything else',
        ],
      },
      {
        type: 'h2',
        content: 'The Year 1–3 Scenario',
      },
      {
        type: 'p',
        content: 'Here is a typical trajectory for a small SaaS product with no maintenance plan, based on patterns we see repeatedly.',
      },
      {
        type: 'p',
        content: 'Year one: Nothing visible. The product works. Dependencies age. One or two low-severity CVEs go unpatched because nobody is running audits. The founder feels good about the launch.',
      },
      {
        type: 'p',
        content: 'Year two: A cascading failure. A dependency update in a transitive package breaks the authentication flow on a Tuesday evening. Users cannot log in. The original developer is unavailable. A freelancer is found, emergency-engaged, spends eight hours figuring out a codebase they have never seen. Total cost: $3,000 developer time, $8,000 estimated lost revenue from six hours of downtime, $2,000 in refunds and goodwill credits. The founder handles customer support personally for three days.',
      },
      {
        type: 'p',
        content: 'Year three: A security incident. A year-old CVE in an unpatched library gets exploited. Data is accessed. Depending on the type of data and the jurisdiction, this triggers notification obligations, potential regulatory fines, and mandatory security audit requirements. Conservative cleanup cost: $20,000–50,000. Customer trust: severely damaged.',
      },
      {
        type: 'h2',
        content: 'What Professional Maintenance Costs',
      },
      {
        type: 'p',
        content: 'A Services Essential plan starts at $499/month. Over three years, that is $17,964. A Growth plan at $999/month: $35,964. Both of these numbers are less than the cost of a single serious incident in Year two of the "do nothing" scenario above — before accounting for the Year three breach.',
      },
      {
        type: 'p',
        content: 'More importantly, with professional maintenance, the Year two incident probably does not happen. The dependency that caused it would have been audited weekly. The CVE would have been patched within 24 hours of publication. The authentication flow would have had uptime monitoring that caught the error rate spike before users noticed.',
      },
      {
        type: 'h2',
        content: 'The ROI Calculation',
      },
      {
        type: 'p',
        content: 'Maintenance ROI is not really about getting something for your money. It is about avoiding losses. The question is not "what does maintenance give me?" — it is "what does one prevented incident save me?"',
      },
      {
        type: 'p',
        content: 'If your product generates $5,000/month in revenue, a single six-hour outage costs you $41 in direct revenue loss. Not meaningful. But the emergency developer time, the customer churn from frustrated users, the refunds, the support overhead — that number is $5,000–15,000 for a typical incident. You could pay for a year of Essential plan with a single prevented incident.',
      },
      {
        type: 'p',
        content: 'If your product generates $50,000/month, the calculus is clearer. Every month without an incident is a month where your maintenance cost is the best-spent money in your budget.',
      },
      {
        type: 'callout',
        content: 'Not sure if your product needs active maintenance yet? Our free audit gives you a clear picture of your current vulnerability surface and what it would take to address it — before anything breaks.',
      },
    ],
    related: [
      { slug: '5-security-vulnerabilities-every-small-business-should-check-for', title: '5 Security Vulnerabilities Every Small Business Should Check For', category: 'Security', readTime: 6 },
      { slug: 'when-to-upgrade-your-maintenance-plan-warning-signs', title: 'When to Upgrade Your Maintenance Plan: Warning Signs', category: 'Plans', readTime: 5 },
    ],
  },

  {
    slug: '5-security-vulnerabilities-every-small-business-should-check-for',
    title: '5 Security Vulnerabilities Every Small Business Should Check For',
    excerpt: 'You do not need to be a security expert to protect your software. You need to know which five things kill the most small business products — and what to do about each one.',
    category: 'Security',
    readTime: 6,
    date: '2026-02-24',
    author: 'kamrul',
    takeaways: [
      'Unpatched third-party dependencies account for the majority of exploitable vulnerabilities in small business software',
      'Exposed credentials in environment files or version control are found in the first five minutes of any competent security audit',
      'SQL injection vulnerabilities still account for a significant portion of breaches in products built with AI coding tools',
      'A missing HTTPS redirect is not just a security issue — it is a trust signal that actively drives away users and harms SEO',
      'The absence of a backup strategy is not a vulnerability in the traditional sense, but it converts every incident into a potentially catastrophic one',
    ],
    sections: [
      {
        type: 'p',
        content: 'Security audits at the enterprise level involve penetration testing, red team exercises, and specialist firms charging tens of thousands of dollars. For a small business product, that is overkill — and the things that actually compromise small business software are far more basic. These five vulnerabilities appear in the majority of the products we audit.',
      },
      {
        type: 'h2',
        content: '1. Unpatched Dependencies',
      },
      {
        type: 'p',
        content: 'Modern software is not written from scratch — it is assembled from libraries, packages, and frameworks. Your product probably depends on hundreds of them, many of which depend on hundreds more. Each of these dependencies has a maintenance lifecycle. When a vulnerability is discovered, the package maintainer publishes a fix and the CVE is registered in public databases. If you are not running regular audits, you will not know.',
      },
      {
        type: 'p',
        content: 'This is the most common vulnerability we find, and the most preventable. Automated dependency scanning (npm audit, pip check, GitHub Dependabot) takes minutes to set up and runs continuously. On a managed maintenance plan, this is part of every weekly cycle. If you are managing this yourself, schedule an audit for today and add it to your weekly calendar.',
      },
      {
        type: 'h2',
        content: '2. Exposed Credentials',
      },
      {
        type: 'p',
        content: 'Database connection strings, API keys, webhook secrets, and service account tokens are commonly committed to version control in early-stage products. This happens for a simple reason: the developer building the MVP is moving fast and not thinking about operational security. The problem is that once a secret is in version control, it is there forever — including in every clone, fork, and CI/CD pipeline that checks out the repository.',
      },
      {
        type: 'p',
        content: 'We find exposed credentials in roughly 30% of the codebases we audit for the first time. The fix is straightforward — rotate the exposed credentials immediately, remove them from the repository using git history rewriting, and implement proper secrets management (environment variables, a secrets manager like AWS Secrets Manager or HashiCorp Vault). But the exposed period may have already caused damage — check your access logs.',
      },
      {
        type: 'h2',
        content: '3. SQL Injection',
      },
      {
        type: 'p',
        content: 'SQL injection vulnerabilities appear when user input is concatenated directly into database queries rather than using parameterized queries or prepared statements. It is one of the oldest known vulnerability classes and one that appears with surprising frequency in software built with AI coding assistance — the generated code often takes a shortcut that looks fine in isolation but opens a significant vulnerability.',
      },
      {
        type: 'p',
        content: 'A successful SQL injection attack can extract your entire database, modify or delete records, and in some configurations execute commands on the underlying server. The fix is consistently using parameterized queries and an ORM with proper escaping. If your product accepts any user input that reaches a database query, this needs to be audited systematically, not spot-checked.',
      },
      {
        type: 'h2',
        content: '4. Missing HTTPS',
      },
      {
        type: 'p',
        content: 'Running without HTTPS or with an invalid SSL certificate is less common than it was, but we still encounter it — particularly on internal tools and admin panels where "it is just internal" becomes a justification for skipping security fundamentals. HTTPS is not optional. Without it, any data transmitted between your users and your servers — including login credentials — can be intercepted in transit.',
      },
      {
        type: 'p',
        content: 'Beyond the direct security issue, modern browsers display "Not Secure" warnings for HTTP pages, which actively drives users away and signals to search engines that your site cannot be trusted. SSL certificates are free via Let\'s Encrypt and most hosting platforms configure them automatically. If yours is not set up, that is a same-day fix.',
      },
      {
        type: 'h2',
        content: '5. No Backup Strategy',
      },
      {
        type: 'p',
        content: 'The absence of a tested backup strategy is not a vulnerability in the traditional sense — it does not give attackers a way in. But it converts every other incident into a potentially catastrophic one. A data corruption bug, a ransomware attack, an accidental database migration, a botched deployment that writes bad data — any of these is recoverable with a good backup strategy. Without one, they are potentially terminal.',
      },
      {
        type: 'p',
        content: 'The key word is tested. Many products have backups configured but never verify they can actually restore from them. A backup strategy that fails during recovery is worse than no backup strategy — it creates false confidence. Test your restoration process quarterly. If you cannot restore from backup in under an hour, your backup strategy needs work.',
      },
      {
        type: 'h2',
        content: 'What To Do',
      },
      {
        type: 'p',
        content: 'These five checks are the starting point, not the complete picture. But they are the five things that we find most often and that cause the most damage when exploited. Start here:',
      },
      {
        type: 'ul',
        items: [
          'Run npm audit or equivalent for your stack today — fix critical and high severity issues immediately',
          'Search your repository history for strings that look like API keys or database passwords — rotate anything you find',
          'Review your database query layer for concatenated strings — convert to parameterized queries',
          'Verify your SSL certificate is valid and HTTPS is enforced with proper redirects',
          'Confirm your backup process, its retention period, and when you last successfully tested a restore',
        ],
      },
      {
        type: 'callout',
        content: 'If you want a systematic security assessment of your product, our free audit covers all five of these and documents the findings clearly. We tell you what we found, what it means, and what to do — no obligation to sign up for anything.',
      },
    ],
    related: [
      { slug: 'the-true-cost-of-not-maintaining-your-software', title: 'The True Cost of Not Maintaining Your Software', category: 'Maintenance', readTime: 8 },
      { slug: 'how-we-reduced-a-clients-downtime-to-zero-in-6-months', title: 'How We Reduced a Client\'s Downtime to Zero in 6 Months', category: 'Case Study', readTime: 9 },
    ],
  },

  {
    slug: 'when-to-upgrade-your-maintenance-plan-warning-signs',
    title: 'When to Upgrade Your Maintenance Plan: Warning Signs',
    excerpt: 'Starting on Essential is smart. Staying on Essential while your product outgrows it is expensive. Five signs it is time to move to Growth or Scale — and what you are risking if you wait.',
    category: 'Plans',
    readTime: 5,
    date: '2026-02-08',
    author: 'arifur',
    takeaways: [
      'Essential is designed for stable products with low change velocity — it starts to break down when traffic grows significantly or active development resumes',
      'Adding AI agents to a product that is on Essential coverage is a clear trigger for upgrading to Growth or Scale',
      'A pattern of incidents getting worse over time — longer resolution, more complex causes — is a sign your product is outgrowing its current tier',
      'Consistent need for feature development time is more cost-effective on Growth than as add-ons to Essential',
    ],
    sections: [
      {
        type: 'p',
        content: 'Essential plan is designed for a specific scenario: a stable product with low change velocity that needs a watchful eye, security patching, and limited bug fixes. Most clients start here. It is the right decision. But products are not static — they grow, they change, new components get added, traffic increases. At some point, Essential starts to show its seams.',
      },
      {
        type: 'p',
        content: 'These are the five warning signs that your product has outgrown your current plan. We tell you these proactively — if we see them in your monthly report, we will flag them. But it is worth understanding the criteria so you can spot them yourself.',
      },
      {
        type: 'h2',
        content: 'You\'re Getting More Traffic',
      },
      {
        type: 'p',
        content: 'Traffic growth is good. But it changes the failure modes of your software. A bug that only triggered for 1% of users when you had 500 monthly active users now triggers for 1% of 50,000 — that is 500 affected users per month. Database query performance that was acceptable at low load starts to become a bottleneck. Memory usage that was fine starts to spike.',
      },
      {
        type: 'p',
        content: 'When we see traffic growth of 3x or more within a six-month window, we typically recommend reviewing your plan tier. Growth plan includes performance monitoring that is specifically designed for this scenario — query analysis, resource utilization trending, and capacity planning recommendations.',
      },
      {
        type: 'h2',
        content: 'You Added AI Agents',
      },
      {
        type: 'p',
        content: 'If your product now includes AI agents — automated workflows, AI-powered features, ML-based classification or recommendation — Essential is no longer sufficient. AI agents fail differently from traditional software. They do not throw exceptions when accuracy degrades. They produce outputs that look valid but are wrong in ways that can only be detected by systematic quality monitoring.',
      },
      {
        type: 'p',
        content: 'Growth and Scale plans include agent accuracy monitoring, output quality scoring, and drift detection. If you have agents in production on an Essential plan, you are flying blind. The question is not whether accuracy drift will happen — it will, especially if any upstream model or input data changes. The question is whether you will know before your users do.',
      },
      {
        type: 'h2',
        content: 'Incidents Are Getting Worse',
      },
      {
        type: 'p',
        content: 'A pattern we see in maturing products: early incidents are simple. A third-party API changes its response format. A dependency update introduces a bug. These are self-contained, easy to reproduce, quick to fix. But as codebases grow and accumulate complexity, incidents become harder to diagnose. The root cause is multiple layers deep. Reproducing it requires understanding three interconnected systems.',
      },
      {
        type: 'p',
        content: 'If your incident resolution time has been trending upward over the past three months, that is a signal. Growth plan includes deeper monitoring instrumentation and a more senior engineer assigned to your account — someone who builds up context on your specific architecture over time, not someone triage-ing from scratch each incident.',
      },
      {
        type: 'h2',
        content: 'You Need Feature Work Regularly',
      },
      {
        type: 'p',
        content: 'Essential includes no feature development hours. If you have used out-of-scope feature add-ons three or more months in a row, you are paying more than a Growth plan would cost. Growth includes up to 8 hours of feature development per month. Do the math on your last three invoices — if add-ons have pushed you over the Growth price, you are on the wrong plan.',
      },
      {
        type: 'h2',
        content: 'Your Business Depends on This',
      },
      {
        type: 'p',
        content: 'This one is less quantitative but often more important. If your product is now the primary revenue source for your business — if downtime means immediate revenue loss, if a breach would be existential — the risk profile of Essential plan response times may no longer match your business requirements.',
      },
      {
        type: 'p',
        content: 'Growth plan has a 4-hour incident response SLA. Scale has a 1-hour SLA with a dedicated engineer. The difference between a 24-hour and 1-hour SLA when your business is down is not a number — it is the difference between a bad day and a catastrophe.',
      },
      {
        type: 'callout',
        content: 'Not sure which plan fits where you are now? Tell us about your product and we will recommend honestly — including whether you actually need an upgrade or whether Essential is still right for your stage.',
      },
    ],
    related: [
      { slug: 'the-true-cost-of-not-maintaining-your-software', title: 'The True Cost of Not Maintaining Your Software', category: 'Maintenance', readTime: 8 },
      { slug: 'ai-agents-in-production-why-monitoring-is-non-negotiable', title: 'AI Agents in Production: Why Monitoring Is Non-Negotiable', category: 'Agents', readTime: 7 },
    ],
  },

  {
    slug: 'how-we-reduced-a-clients-downtime-to-zero-in-6-months',
    title: 'How We Reduced a Client\'s Downtime to Zero in 6 Months',
    excerpt: 'When we took over this e-commerce platform, it had averaged 14 hours of unplanned downtime per month for 18 months. Six months later: zero. A detailed case study of what we found, what we fixed, and how.',
    category: 'Case Study',
    readTime: 9,
    date: '2026-01-20',
    author: 'kamrul',
    takeaways: [
      'The root cause of most chronic downtime is not a single bug — it is accumulated architectural debt that creates a fragile system with multiple failure modes',
      'Unmanaged database connection pools are one of the most common causes of production instability in small products under growing load',
      'Comprehensive monitoring is not just about detecting incidents — it is about understanding the system well enough to prevent them',
      'Six months of systematic maintenance can eliminate years of accumulated instability',
    ],
    sections: [
      {
        type: 'p',
        content: 'The client came to us after 18 months of chronic downtime. Their e-commerce platform — built by an agency that had since dissolved — was generating roughly $80,000/month in revenue on a good month. It was also averaging 14 hours of unplanned downtime per month over the previous 6-month period. Every incident was different. Every incident was expensive.',
      },
      {
        type: 'h2',
        content: 'The Problem',
      },
      {
        type: 'p',
        content: 'When a product has recurring downtime with apparently different root causes each time, that is usually not bad luck. It is a sign of systemic fragility — a codebase with multiple failure modes, poor error handling, and insufficient visibility into what is happening. The incidents look different on the surface but share a common cause: the system was never built to be resilient, and nobody had ever made it resilient.',
      },
      {
        type: 'p',
        content: 'The client had tried several approaches. They had engaged three different freelancers to investigate specific incidents, each of whom fixed the immediate problem but did not address the underlying architecture. They had hired a part-time developer who was available two days a week and could not respond to weekend incidents. They had considered migrating to a completely new platform, but the migration cost was estimated at $40,000–60,000.',
      },
      {
        type: 'h2',
        content: 'What We Found',
      },
      {
        type: 'p',
        content: 'Our initial audit took 48 hours and produced a 22-page health report. The headline findings:',
      },
      {
        type: 'ul',
        items: [
          'Database connection pool misconfiguration: the pool was set to allow unlimited connections, meaning traffic spikes caused connection exhaustion that starved legitimate requests and produced cascading failures throughout the application',
          '47 unpatched dependency vulnerabilities, including 3 critical severity CVEs that were over six months old',
          'No error monitoring or exception tracking — the team was discovering incidents from customer emails, not from logs',
          'Session storage using the database rather than a dedicated cache, which meant any database slowdown produced authentication failures across all users simultaneously',
          'A cron job that ran a full table scan on a 2M-row table every 15 minutes, producing predictable performance degradation during business hours',
          'Zero automated testing — every deployment was a manual process with no pre-deployment validation',
        ],
      },
      {
        type: 'p',
        content: 'None of these individually would have produced chronic 14-hour monthly downtime. Together, they created a system where any non-trivial load would trigger multiple concurrent failure modes, each of which made the others worse.',
      },
      {
        type: 'h2',
        content: 'What We Fixed',
      },
      {
        type: 'p',
        content: 'Month one: monitoring and immediate critical fixes. We deployed comprehensive monitoring (uptime, error rate, database performance, connection pool utilization) and fixed the three critical CVEs. We also fixed the database connection pool configuration — setting appropriate limits and implementing connection timeout logic.',
      },
      {
        type: 'p',
        content: 'Month two: session storage migration. We moved session storage from the database to Redis. This took four hours of engineering time and eliminated an entire class of incidents — the ones where database slowdown caused simultaneous authentication failures across all active users.',
      },
      {
        type: 'p',
        content: 'Month three: the cron job. We rewrote the full table scan as an incremental query operating on an indexed subset. What had been a 15-minute query running every 15 minutes became a 0.3-second query. Database load during business hours dropped significantly.',
      },
      {
        type: 'p',
        content: 'Month four onward: systematic dependency remediation, deployment process improvements (adding staging environment, automated testing baseline), and ongoing monitoring refinement.',
      },
      {
        type: 'h2',
        content: 'The Result',
      },
      {
        type: 'p',
        content: 'Month one: 3 hours downtime (one incident, resolved in 3 hours — the last incident in the dataset). Month two: 0. Month three: 0. Month four: 0. Month five: 0. Month six: 0.',
      },
      {
        type: 'p',
        content: 'The client is now on our Growth plan at $999/month. They previously estimated their downtime was costing them $8,000–12,000/month in lost revenue and emergency developer time. The ROI calculation is straightforward.',
      },
      {
        type: 'p',
        content: 'The more significant outcome, in the client\'s own words: "I used to spend every Monday morning dealing with whatever broke over the weekend. I have not done that in four months. I am a better CEO because of it."',
      },
      {
        type: 'callout',
        content: 'If your product has recurring downtime and you have not been able to get to the root cause, our audit process is specifically designed to find the systemic causes — not just the most recent symptom. Start with an audit.',
      },
    ],
    related: [
      { slug: 'the-true-cost-of-not-maintaining-your-software', title: 'The True Cost of Not Maintaining Your Software', category: 'Maintenance', readTime: 8 },
      { slug: '5-security-vulnerabilities-every-small-business-should-check-for', title: '5 Security Vulnerabilities Every Small Business Should Check For', category: 'Security', readTime: 6 },
    ],
  },

  {
    slug: 'ai-agents-in-production-why-monitoring-is-non-negotiable',
    title: 'AI Agents in Production: Why Monitoring Is Non-Negotiable',
    excerpt: 'AI agents fail differently from traditional software. They do not throw exceptions — they quietly drift. Understanding accuracy decay, edge case accumulation, and what good production monitoring actually looks like.',
    category: 'Agents',
    readTime: 7,
    date: '2026-01-05',
    author: 'kamrul',
    takeaways: [
      'AI agents do not fail loudly — they fail silently, producing outputs that look valid but are increasingly wrong',
      'Accuracy drift often begins within 30 days of deployment as real-world input distribution diverges from training distribution',
      'Upstream model changes from providers can silently change agent behavior without any error being thrown',
      'Good agent monitoring requires evaluating output quality, not just whether the agent completed its task',
      'The minimum viable monitoring setup for any production agent includes accuracy sampling, latency tracking, and upstream model change detection',
    ],
    sections: [
      {
        type: 'p',
        content: 'Traditional software fails loudly. A database query returns an error. An API call times out. An unhandled exception crashes the process. These failures are uncomfortable, but they are visible. Your monitoring picks them up, your alert fires, someone gets paged.',
      },
      {
        type: 'p',
        content: 'AI agents fail quietly. The agent completes its task. No exceptions are thrown. No timeouts occur. The response looks syntactically valid. But the output is wrong — increasingly, systematically wrong — in ways that only become apparent over time or through careful evaluation of results.',
      },
      {
        type: 'h2',
        content: 'The Set-And-Forget Myth',
      },
      {
        type: 'p',
        content: 'There is a widespread assumption in how people think about deploying AI agents: that once the agent is working well in testing, it will continue working well in production. This assumption is wrong, and understanding why is essential to running agents reliably.',
      },
      {
        type: 'p',
        content: 'Testing typically uses a curated dataset that represents the happy path — inputs that are well-formatted, in the expected range, covering the use cases the developer thought to include. Production inputs are different. They include edge cases that were not anticipated. They include malformed inputs. They include use patterns that emerge only when real users interact with the system. They include inputs that the agent was never trained to handle well.',
      },
      {
        type: 'p',
        content: 'The gap between testing accuracy and production accuracy is not a failure of the agent — it is an inherent property of deploying AI systems into the real world. The question is whether you are measuring it.',
      },
      {
        type: 'h2',
        content: 'Accuracy Drift',
      },
      {
        type: 'p',
        content: 'Accuracy drift describes the gradual decline in agent performance over time as the distribution of real-world inputs diverges from the distribution the agent was optimized for. This happens for several reasons: user behavior changes, the types of requests evolve, edge cases accumulate, and the world changes in ways that affect the context the agent operates in.',
      },
      {
        type: 'p',
        content: 'In one logistics automation client we work with, an agent responsible for classifying shipment exceptions began with 94% accuracy on internal evaluation. At the six-month mark, our monitoring flagged that accuracy on a sampled subset had dropped to 81%. Investigation revealed that the client had expanded into a new market category with different shipment patterns — inputs the agent had never seen. Without monitoring, this drift would have continued undetected until someone noticed that exception handling was producing systematically wrong outcomes.',
      },
      {
        type: 'h2',
        content: 'The Edge Case Problem',
      },
      {
        type: 'p',
        content: 'Edge cases do not appear in testing. By definition, they are inputs that were not anticipated during development. In production, they accumulate. An input format that was never expected. A request that combines two features in a way nobody planned for. A query that hits the boundary of the context window in a way that produces degraded output without an error.',
      },
      {
        type: 'p',
        content: 'The problem with edge cases is not that they are rare — at sufficient scale, they become common. If 0.1% of inputs trigger an edge case and you process 10,000 inputs per month, that is 10 edge cases per month. If the agent handles them badly, that is 10 bad outputs per month that you may not know about.',
      },
      {
        type: 'h2',
        content: 'What Good Monitoring Looks Like',
      },
      {
        type: 'p',
        content: 'Minimum viable monitoring for a production AI agent includes four components:',
      },
      {
        type: 'ul',
        items: [
          'Accuracy sampling: a regular automated evaluation of a random sample of outputs against a ground truth or rubric. Not every output — a statistically meaningful sample evaluated on a defined quality metric',
          'Latency tracking: response time distribution over time. Significant latency increases often indicate upstream model changes or infrastructure issues before they become visible quality problems',
          'Upstream model change detection: if you are using a third-party model provider, they make changes — sometimes without announcement. Tracking model versions and testing against a fixed evaluation set after any detected change catches silent regression',
          'Anomaly detection on output distribution: if the distribution of agent outputs suddenly shifts — more refusals, different response lengths, different classification distributions — that is a signal worth investigating',
        ],
      },
      {
        type: 'h2',
        content: 'Setting Up Your Monitoring',
      },
      {
        type: 'p',
        content: 'The hardest part of agent monitoring is defining what good means for your specific use case. Accuracy monitoring requires a rubric — a definition of what a correct or high-quality output looks like that can be evaluated systematically. This work is worth doing carefully before deployment, not after.',
      },
      {
        type: 'p',
        content: 'The technical infrastructure for monitoring is straightforward: logging all agent interactions, sampling a subset for evaluation, running evaluation on the sample, and alerting when metrics fall outside defined thresholds. What requires care is the evaluation methodology — what you are measuring and how.',
      },
      {
        type: 'p',
        content: 'We build agent monitoring as part of the deployment process for every client who runs agents in production. The monitoring setup is documented, the evaluation rubric is agreed with the client, and the alert thresholds are calibrated against the baseline accuracy at launch. When something drifts, you know about it within a week — not after a client complaint months later.',
      },
      {
        type: 'callout',
        content: 'Running AI agents in production without monitoring? Our Growth and Scale plans include agent accuracy monitoring, weekly reports, and drift detection. We can set this up for existing deployments — contact us to discuss your specific setup.',
      },
    ],
    related: [
      { slug: 'when-to-upgrade-your-maintenance-plan-warning-signs', title: 'When to Upgrade Your Maintenance Plan: Warning Signs', category: 'Plans', readTime: 5 },
      { slug: 'how-we-reduced-a-clients-downtime-to-zero-in-6-months', title: 'How We Reduced a Client\'s Downtime to Zero in 6 Months', category: 'Case Study', readTime: 9 },
    ],
  },
];

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  .art-page {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 80px;
  }

  /* ── Article header ───────────────────────────────────────── */
  .art-header {
    max-width: 760px;
    margin: 0 auto;
    padding: 80px 32px 60px;
    text-align: center;
  }
  .art-category {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    padding: 6px 14px;
    background: rgba(77,191,168,0.1);
    border: 1px solid rgba(77,191,168,0.2);
    border-radius: var(--radius-full);
    margin-bottom: 24px;
  }
  .art-title {
    font-family: var(--font-headline);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 0 28px;
  }
  .art-meta-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .art-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }
  .art-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--text-muted);
    flex-shrink: 0;
  }
  .art-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .art-author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(77,191,168,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-headline);
    font-size: 0.75rem;
    font-weight: 700;
    color: ${A};
    flex-shrink: 0;
  }
  .art-author-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
  }
  .art-author-name {
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  .art-author-role {
    font-family: var(--font-body);
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  /* ── Divider ──────────────────────────────────────────────── */
  .art-divider {
    max-width: 760px;
    margin: 0 auto 60px;
    padding: 0 32px;
  }
  .art-divider hr {
    border: none;
    border-top: 1px solid var(--border);
  }

  /* ── Article body ─────────────────────────────────────────── */
  .art-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .art-body h2 {
    font-family: var(--font-headline);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.015em;
    line-height: 1.25;
    margin: 48px 0 18px;
  }
  .art-body p {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin: 0 0 20px;
  }
  .art-body ul {
    margin: 0 0 24px;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .art-body ul li {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    padding-left: 24px;
    position: relative;
  }
  .art-body ul li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
  }
  .art-callout {
    background: rgba(77,191,168,0.06);
    border: 1px solid rgba(77,191,168,0.15);
    border-left: 3px solid ${A};
    border-radius: var(--radius-md);
    padding: 20px 24px;
    margin: 36px 0;
  }
  .art-callout p {
    font-family: var(--font-body);
    font-size: 0.93rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Takeaways ────────────────────────────────────────────── */
  .art-takeaways {
    max-width: 760px;
    margin: 60px auto 0;
    padding: 0 32px;
  }
  .art-takeaways-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-top: 3px solid ${A};
    border-radius: var(--radius-lg);
    padding: 32px;
  }
  .art-takeaways-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .art-takeaways-label::before {
    content: '';
    width: 14px;
    height: 1.5px;
    background: ${A};
  }
  .art-takeaways-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    margin: 0 0 18px;
  }
  .art-takeaways-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .art-takeaways-item {
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--text-secondary);
    padding-left: 20px;
    position: relative;
  }
  .art-takeaways-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
  }

  /* ── Related ──────────────────────────────────────────────── */
  .art-related {
    max-width: 760px;
    margin: 60px auto 0;
    padding: 0 32px 100px;
  }
  .art-related-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .art-related-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
  }
  .art-related-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 600px) {
    .art-related-grid { grid-template-columns: 1fr; }
  }
  .art-related-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.3s var(--ease), border-color 0.3s;
  }
  .art-related-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-hover);
  }
  .art-related-cat {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
  }
  .art-related-title {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin: 0;
  }
  .art-related-read {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    margin-top: auto;
  }

  /* ── Newsletter CTA ───────────────────────────────────────── */
  .art-nl-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 80px 32px;
    text-align: center;
  }
  .art-nl-inner {
    max-width: 480px;
    margin: 0 auto;
  }
  .art-nl-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: ${A};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .art-nl-title {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }
  .art-nl-desc {
    font-family: var(--font-body);
    font-size: 0.93rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0 0 28px;
  }
  .art-nl-form {
    display: flex;
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }
  .art-nl-input {
    flex: 1;
    min-width: 200px;
    padding: 12px 16px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    background: var(--bg-card);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .art-nl-input:focus { border-color: ${A}; }
  .art-nl-input::placeholder { color: var(--text-muted); }
  .art-nl-btn {
    padding: 12px 22px;
    background: ${A};
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.86rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
    white-space: nowrap;
  }
  .art-nl-btn:hover { opacity: 0.88; }
  .art-nl-note {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 12px;
  }

  /* ── Back link ────────────────────────────────────────────── */
  .art-back {
    max-width: 760px;
    margin: 0 auto;
    padding: 40px 32px 0;
  }
  .art-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }
  .art-back-link:hover { color: ${A}; }
  .art-back-link svg { transition: transform 0.2s; }
  .art-back-link:hover svg { transform: translateX(-3px); }

  @media (max-width: 768px) {
    .art-header { padding: 60px 20px 40px; }
    .art-body { padding: 0 20px; }
    .art-divider { padding: 0 20px; }
    .art-takeaways { padding: 0 20px; }
    .art-related { padding: 0 20px 80px; }
    .art-nl-cta { padding: 80px 20px; }
    .art-back { padding: 40px 20px 0; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2);
}

// ── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'Not Found — SocioFi Services' };
  return {
    title: `${article.title} — SocioFi Services`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — SocioFi Services`,
      description: article.excerpt,
      type: 'article',
    },
  };
}

// ── Newsletter form (client) ───────────────────────────────────────────────────
// Because this is a server component we inline a simple HTML form without JS.
// The newsletter form below degrades gracefully.

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ServicesBlogArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const author = AUTHORS[article.author];

  return (
    <>
      <style>{STYLES}</style>
      <main className="art-page">

        {/* ── Back link ── */}
        <div className="art-back">
          <Link href="/services/blog" className="art-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to blog
          </Link>
        </div>

        {/* ── Article header ── */}
        <header className="art-header">
          <span className="art-category">{article.category}</span>
          <h1 className="art-title">{article.title}</h1>
          <div className="art-meta-row">
            <div className="art-author">
              <div className="art-author-avatar" aria-hidden="true">{getInitials(author.name)}</div>
              <div className="art-author-info">
                <span className="art-author-name">{author.name}</span>
                <span className="art-author-role">{author.role}</span>
              </div>
            </div>
            <span className="art-meta-dot" aria-hidden="true" />
            <span className="art-meta-item">{formatDate(article.date)}</span>
            <span className="art-meta-dot" aria-hidden="true" />
            <span className="art-meta-item">{article.readTime} min read</span>
          </div>
        </header>

        {/* ── Divider ── */}
        <div className="art-divider"><hr /></div>

        {/* ── Article body ── */}
        <article className="art-body">
          {article.sections.map((section, i) => {
            if (section.type === 'h2') {
              return <h2 key={i}>{section.content}</h2>;
            }
            if (section.type === 'p') {
              return <p key={i}>{section.content}</p>;
            }
            if (section.type === 'ul') {
              return (
                <ul key={i}>
                  {section.items!.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (section.type === 'callout') {
              return (
                <div key={i} className="art-callout">
                  <p>{section.content}</p>
                </div>
              );
            }
            return null;
          })}
        </article>

        {/* ── Key takeaways ── */}
        <div className="art-takeaways">
          <div className="art-takeaways-card">
            <div className="art-takeaways-label">Key takeaways</div>
            <h3 className="art-takeaways-title">What to remember from this article</h3>
            <ul className="art-takeaways-list">
              {article.takeaways.map((t) => (
                <li key={t} className="art-takeaways-item">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Related ── */}
        {article.related.length > 0 && (
          <div className="art-related">
            <div className="art-related-label">Continue reading</div>
            <div className="art-related-grid">
              {article.related.map((r) => (
                <Link key={r.slug} href={`/services/blog/${r.slug}`} className="art-related-card">
                  <span className="art-related-cat">{r.category}</span>
                  <h3 className="art-related-title">{r.title}</h3>
                  <span className="art-related-read">{r.readTime} min read</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Newsletter CTA ── */}
        <section className="art-nl-cta">
          <div className="art-nl-inner">
            <p className="art-nl-label">Newsletter</p>
            <h2 className="art-nl-title">Get maintenance tips monthly.</h2>
            <p className="art-nl-desc">
              One email per month. Security alerts, maintenance guides, and case studies from our team.
            </p>
            <form className="art-nl-form" action="#" method="post">
              <input
                type="email"
                name="email"
                className="art-nl-input"
                placeholder="you@company.com"
                required
                aria-label="Email address"
              />
              <button type="submit" className="art-nl-btn">Subscribe</button>
            </form>
            <p className="art-nl-note">Monthly only. Unsubscribe any time.</p>
          </div>
        </section>

      </main>
    </>
  );
}
