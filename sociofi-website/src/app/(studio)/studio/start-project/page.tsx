import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Check, Shield, Calendar, Code, Lock } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Start a Project — SocioFi Studio",
  description:
    "Tell us what you need to build. We respond within 4 hours, schedule a free scoping call, and send a written proposal within 48 hours. Fixed scope, fixed price.",
};

const content: ConversionFormContent = {
  badge: "Studio · Start a Project",
  headline: "Let's build something together.",
  description:
    "Tell us what you need. We respond within 4 hours with an honest assessment and a clear path forward.",
  formDefaultDivision: "studio",
  formType: 'project',
  trustItems: [
    "Response within 4 hours",
    "Free scoping call included",
    "Written proposal within 48 hours",
    "Fixed scope. Fixed price. No surprises.",
  ],
  sidebar: {
    headline: "What happens next",
    points: [
      {
        icon: <Calendar size={20} aria-hidden="true" />,
        headline: "We respond within 4 hours",
        detail:
          "A real engineer reads your submission and replies with an honest first take — whether we are a good fit and what the project might involve.",
      },
      {
        icon: <Check size={20} aria-hidden="true" />,
        headline: "Free 30-minute scoping call",
        detail:
          "We ask the questions that reveal real scope. You leave with a clear sense of what the build involves and what it might cost — before you commit to anything.",
      },
      {
        icon: <Code size={20} aria-hidden="true" />,
        headline: "Written proposal within 48 hours",
        detail:
          "A specific scope, a specific price, and a specific timeline. Not a range. You review it, ask questions, and say yes or no. Nothing starts until you are ready.",
      },
      {
        icon: <Shield size={20} aria-hidden="true" />,
        headline: "Fixed price. No surprises.",
        detail:
          "Every project is fixed scope, fixed price. Scope changes are handled in writing with your approval before any work proceeds. No hourly billing. No surprise invoices.",
      },
      {
        icon: <Lock size={20} aria-hidden="true" />,
        headline: "NDA available on request",
        detail:
          "We sign NDAs for any project involving sensitive business logic, proprietary data, or confidential product plans. Just mention it and we include it before any project details are shared.",
      },
    ],
    testimonial: {
      quote:
        "Fixed scope, fixed price — no surprises. They scoped the project clearly, hit every milestone, and the code they delivered is clean enough that I can hand it to another team.",
      author: "Layla A.",
      role: "Head of Product, DataNest",
    },
  },
};

export default function StartProjectPage() {
  return <ConversionForm content={content} />;
}
