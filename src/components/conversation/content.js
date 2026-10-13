import profile from './profile.json';
export const { skillGroups, experience, education, certifications } = profile;

export const topics = [
  { id: 'about', label: 'About Usama', prompt: 'Tell me about Usama', icon: 'person', hint: 'A quick introduction' },
  { id: 'projects', label: 'Projects', prompt: 'Show me Usama’s projects', icon: 'grid', hint: 'From ideas to working products' },
  { id: 'experiments', label: 'Experiments', prompt: 'Show me Usama’s experiments', icon: 'lab', hint: 'Interactive ideas and prototypes' },
  { id: 'skills', label: 'Tech stack', prompt: 'What does he work with?', icon: 'code', hint: 'The tools behind the work' },
  { id: 'experience', label: 'Experience', prompt: 'Explore his experience', icon: 'case', hint: 'His journey so far' },
  { id: 'certifications', label: 'Certifications', prompt: 'What certifications does he have?', icon: 'file', hint: 'Learning put into practice' },
  { id: 'services', label: 'Services', prompt: 'What can he help me build?', icon: 'spark', hint: 'Frontend, backend, and design' },
  { id: 'testimonials', label: 'Kind words', prompt: 'What do clients say?', icon: 'chat', hint: 'Notes from people he’s worked with' },
  { id: 'resume', label: 'Résumé', prompt: 'Can I get his résumé?', icon: 'file', hint: 'Take a copy with you' },
  { id: 'contact', label: 'Get in touch', prompt: 'How can I contact Usama?', icon: 'mail', hint: 'Start a real conversation' },
];

export const tourSteps = [
  { topic: 'about', label: 'Meet Usama', prompt: 'Give me a quick introduction to Usama' },
  { topic: 'projects', label: 'Selected projects', prompt: 'Show me a few of his projects' },
  { topic: 'experience', label: 'Experience', prompt: 'Walk me through his experience' },
  { topic: 'contact', label: 'Get in touch', prompt: 'How can we work together?' },
];

// A deterministic topic lookup. No messages are sent to a server or AI service.
export function matchTopic(input) {
  const text = input.toLowerCase().replace(/[’']/g, '').trim();
  const exact = topics.find(topic => topic.prompt.toLowerCase().replace(/[’']/g, '') === text);
  if (exact) return exact.id;
  const rules = [
    ['tour', /\b(tour|walkthrough|guide me|show me around)\b/],
    ['experiment:meet-usama', /\b(meet usama|mascot)\b/],
    ['experiment:udev-technologies', /\b(udev technologies|technology agency concept)\b/],
    ['experiments', /\b(experiments?|prototypes?|pixel pong|animated developer|linkedin companion)\b/],
    ['resume', /\b(resume|résumé|cv|download)\b/],
    ['certifications', /\b(certifications?|certificates?|credentials?|courses?)\b/],
    ['contact', /\b(contact|email|phone|call|number|reach|hire|hiring|touch|linkedin|github|available|availability)\b/],
    ['testimonials', /\b(testimonials?|reviews?|clients?|recommendations?)\b/],
    ['experience', /\b(experience|career|education|study|studied|degree|university|qualification|bellmedex|simplexmed|journey)\b/],
    ['skills', /\b(skills?|stack|technolog\w*|tools?|react|native|expo|typescript|javascript)\b/],
    ['skills', /\b(node|python|redux|tailwind|work with|works with)\b/],
    ['skills', /\b(aws|docker|devops|redis|graphql|ai|llms?|agents?|learning|explor\w*|system design)\b/],
    ['projects', /\b(projects?|portfolio|built|building|apps?|websites?|work|chat app|estate|fashion|eastwinners|east winners)\b/],
    ['services', /\b(services?|help|build|design|offer)\b/],
    ['about', /\b(about|who|where|based|location|faisalabad|pakistan|introduc\w*|hello|hi|hey|usama)\b/],
  ];
  const match = rules.find(([, pattern]) => pattern.test(text));
  return match ? match[0] : 'fallback';
}
