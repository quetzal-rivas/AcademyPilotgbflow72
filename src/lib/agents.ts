export type Agent = {
  id: string;
  elevenLabsId: string;
  name: string;
  description: string;
  avatar: string;
  tools: string[];
};

export const agents: Agent[] = [
  {
    id: 'agent_lead_gen',
    elevenLabsId: 'agent_5101kh4k6hxvezmsa2tbwp0y6mvs',
    name: 'Lead Qualification Pro',
    description:
      'High-performance outbound agent specializing in lead qualification for martial arts academies, scheduling trials, and answering program FAQs.',
    avatar: 'agent1',
    tools: [
      'academy-briefing',
      'add-lead',
      'analytics-lead-report',
      'get-schedule',
      'schedule-trial',
      'update-crm',
    ],
  },
  {
    id: 'agent_membership',
    elevenLabsId: 'ops_agent_placeholder',
    name: 'Membership Concierge',
    description:
      'Manages existing student inquiries, processes upgrades, and handles class scheduling changes with a focus on retention.',
    avatar: 'agent2',
    tools: [
      'process-callback-queue',
      'mark-processed',
      'daily-lead-reminder',
      'update-schedule',
    ],
  },
  {
    id: 'agent_analytics',
    elevenLabsId: 'analytics_agent_placeholder',
    name: 'Strategic Growth Analyst',
    description:
      'Provides academy owners with real-time conversion insights and performance reports during commercial briefings.',
    avatar: 'agent3',
    tools: [
      'academy-briefing',
      'analytics-lead-report',
      'conversion-metrics',
      'get-schedule',
    ],
  },
];
