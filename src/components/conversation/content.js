export const topics = [
  { id: 'about', label: 'About Usama', prompt: 'Tell me about Usama', icon: 'person', hint: 'A quick introduction' },
  { id: 'projects', label: 'Projects', prompt: 'Show me Usama’s projects', icon: 'grid', hint: 'From ideas to working products' },
  { id: 'skills', label: 'Tech stack', prompt: 'What does he work with?', icon: 'code', hint: 'The tools behind the work' },
  { id: 'experience', label: 'Experience', prompt: 'Explore his experience', icon: 'case', hint: 'His journey so far' },
  { id: 'services', label: 'Services', prompt: 'What can he help me build?', icon: 'spark', hint: 'Frontend, backend, and design' },
  { id: 'testimonials', label: 'Kind words', prompt: 'What do clients say?', icon: 'chat', hint: 'Notes from people he’s worked with' },
  { id: 'resume', label: 'Résumé', prompt: 'Can I get his résumé?', icon: 'file', hint: 'Take a copy with you' },
  { id: 'contact', label: 'Get in touch', prompt: 'How can I contact Usama?', icon: 'mail', hint: 'Start a real conversation' },
];

export const skillGroups = [
  { title: 'Frontend', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'] },
  { title: 'Backend & data', skills: ['Node.js', 'Express', 'MongoDB'] },
  { title: 'Also familiar with', skills: ['Git', 'PHP', 'Python', 'MySQL'] },
];

export const experience = [
  { role: 'Frontend Developer', place: 'Bellmedex', period: '2024 – present' },
  { role: 'React Developer', place: 'SimplexMed', period: '2023 – 2024' },
  { role: 'Web Development', place: 'CUI Sahiwal · Software House', period: '2022 – 2023' },
];

export const education = [
  { role: 'Software Engineering', place: 'COMSATS University', period: '2019 – 2023' },
  { role: 'Intermediate', place: 'Superior College', period: '2016 – 2018' },
  { role: 'Matric', place: 'Govt School', period: '2015' },
];

// A deterministic topic lookup. No messages are sent to a server or AI service.
export function matchTopic(input) {
  const text = input.toLowerCase().replace(/[’']/g, '').trim();
  const exact = topics.find(topic => topic.prompt.toLowerCase().replace(/[’']/g, '') === text);
  if (exact) return exact.id;
  const rules = [
    ['resume', /\b(resume|résumé|cv|download)\b/],
    ['contact', /\b(contact|email|reach|hire|hiring|touch|linkedin|github|available|availability)\b/],
    ['testimonials', /\b(testimonials?|reviews?|clients?|recommendations?)\b/],
    ['experience', /\b(experience|career|education|study|studied|degree|university|qualification|bellmedex|simplexmed|journey)\b/],
    ['skills', /\b(skills?|stack|technolog\w*|tools?|react|javascript|node|python|work with|works with)\b/],
    ['projects', /\b(projects?|portfolio|built|building|apps?|websites?|work|chat app|estate|fashion)\b/],
    ['services', /\b(services?|help|build|design|offer)\b/],
    ['about', /\b(about|who|introduc\w*|hello|hi|hey|usama)\b/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'fallback';
}
