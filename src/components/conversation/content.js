export const topics = [
  { id: 'about', label: 'About Usama', prompt: 'Tell me about Usama', icon: 'person', hint: 'A quick introduction' },
  { id: 'projects', label: 'Projects', prompt: 'Show me Usama’s projects', icon: 'grid', hint: 'From ideas to working products' },
  { id: 'skills', label: 'Tech stack', prompt: 'What does he work with?', icon: 'code', hint: 'The tools behind the work' },
  { id: 'experience', label: 'Experience', prompt: 'Explore his experience', icon: 'case', hint: 'His journey so far' },
  { id: 'certifications', label: 'Certifications', prompt: 'What certifications does he have?', icon: 'file', hint: 'Learning put into practice' },
  { id: 'services', label: 'Services', prompt: 'What can he help me build?', icon: 'spark', hint: 'Frontend, backend, and design' },
  { id: 'testimonials', label: 'Kind words', prompt: 'What do clients say?', icon: 'chat', hint: 'Notes from people he’s worked with' },
  { id: 'resume', label: 'Résumé', prompt: 'Can I get his résumé?', icon: 'file', hint: 'Take a copy with you' },
  { id: 'contact', label: 'Get in touch', prompt: 'How can I contact Usama?', icon: 'mail', hint: 'Start a real conversation' },
];

export const skillGroups = [
  { title: 'Frontend', skills: ['React', 'JavaScript', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'HTML', 'CSS', 'Bootstrap'] },
  { title: 'Mobile', skills: ['React Native', 'Expo', 'Mobile applications'] },
  { title: 'Backend & data', skills: ['Node.js', 'Express', 'MongoDB'] },
  { title: 'Architecture & delivery', skills: ['RESTful APIs', 'Authentication & authorization', 'Micro Frontends', 'Reusable components', 'Agile collaboration'] },
  { title: 'AI-assisted development', skills: ['GitHub Copilot', 'ChatGPT', 'Claude'] },
  { title: 'Also familiar with', skills: ['Git', 'PHP', 'Python', 'MySQL'] },
  { title: 'Currently exploring', skills: ['AWS', 'Docker', 'DevOps', 'Cloud architecture', 'Distributed systems', 'System design', 'Redis', 'GraphQL', 'Scalable deployments', 'AI', 'LLMs', 'AI agents'] },
];

export const experience = [
  {
    role: 'Frontend Developer', place: 'Bellmedex Pakistan', period: 'Dec 2024 – present', location: 'Rawalpindi',
    description: 'Building healthcare web and mobile applications with React, React Native, and TypeScript.',
    highlights: [
      'Deliver end-to-end features, from user interfaces to API integration.',
      'Design reusable components and Micro Frontend modules for a modular, maintainable frontend.',
      'Build and consume RESTful APIs, including authentication and authorization workflows.',
      'Use GitHub Copilot, ChatGPT, and Claude in daily development, collaborating with backend engineers, QA, and product in an Agile team.',
    ],
  },
  {
    role: 'React Js Developer', place: 'SimplexMed', period: 'Jul 2023 – Dec 2024', location: 'Abbottabad District',
    description: 'Built React healthcare applications, translating clinical workflows into user-friendly interfaces.',
    highlights: [
      'Developed reusable component libraries across product modules.',
      'Integrated internal and third-party APIs for core product features.',
      'Improved application performance and user experience while working with clinical and product requirements.',
    ],
  },
  {
    role: 'Trainee MERN Stack Developer', place: 'CUI Sahiwal Software House', period: 'Dec 2022 – Jun 2023', location: 'Sahiwal, Punjab, Pakistan',
    description: 'Started my professional journey building full-stack MERN applications in an Agile team.',
    highlights: ['Contributed to frontend interfaces and backend API layers.', 'Built REST APIs and authentication systems, learning production development workflows and best practices.'],
  },
];

export const education = [
  { role: 'Bachelor’s degree in Computer Software Engineering', place: 'COMSATS University Islamabad', period: 'Sep 2019 – Jun 2023' },
  { role: 'Intermediate', place: 'Superior College', period: '2016 – 2018' },
  { role: 'Matric', place: 'Govt School', period: '2015' },
];

export const certifications = [
  'Introduction to Web Development with HTML, CSS, JavaScript',
  'Developing Front-End Apps with React',
  'Developing Back-End Apps with Node.js and Express',
  'Building RESTful APIs with Node.js and Express',
];

// A deterministic topic lookup. No messages are sent to a server or AI service.
export function matchTopic(input) {
  const text = input.toLowerCase().replace(/[’']/g, '').trim();
  const exact = topics.find(topic => topic.prompt.toLowerCase().replace(/[’']/g, '') === text);
  if (exact) return exact.id;
  const rules = [
    ['resume', /\b(resume|résumé|cv|download)\b/],
    ['certifications', /\b(certifications?|certificates?|credentials?|courses?)\b/],
    ['contact', /\b(contact|email|phone|call|number|reach|hire|hiring|touch|linkedin|github|available|availability)\b/],
    ['testimonials', /\b(testimonials?|reviews?|clients?|recommendations?)\b/],
    ['experience', /\b(experience|career|education|study|studied|degree|university|qualification|bellmedex|simplexmed|journey)\b/],
    ['skills', /\b(skills?|stack|technolog\w*|tools?|react|native|expo|typescript|javascript|node|python|redux|tailwind|aws|docker|devops|redis|graphql|ai|llms?|agents?|learning|explor\w*|system design|work with|works with)\b/],
    ['projects', /\b(projects?|portfolio|built|building|apps?|websites?|work|chat app|estate|fashion)\b/],
    ['services', /\b(services?|help|build|design|offer)\b/],
    ['about', /\b(about|who|where|based|location|faisalabad|pakistan|introduc\w*|hello|hi|hey|usama)\b/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'fallback';
}
