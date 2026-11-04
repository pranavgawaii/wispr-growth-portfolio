/** Public share routes. Query parameters containing player data are never reflected. */
export const defaultOrigin = 'https://growth.pranavx.in';
const page = (path, title, description, image, lines, product = false) => ({
  path,
  title,
  description,
  image,
  lines,
  product,
});
export const socialPages = [
  page(
    '/',
    'Pranav Gawai | Engineer and AI builder',
    'AI products, developer tools and a growth proposal built with Wispr in mind.',
    'portfolio',
    ['Pranav Gawai.', 'Built with intent.'],
  ),
  page(
    '/setup/',
    'The $3,000 question | Pranav Gawai',
    'A practical setup proposal: a dependable laptop, AI tools and room to build useful experiments.',
    'setup-question',
    ['The $3,000 question.', 'A setup for useful experiments.'],
  ),
  page(
    '/projects/',
    'Selected projects | Pranav Gawai',
    'Explore the AI products and developer tools I have built, with workflows and architecture.',
    'projects',
    ['Ideas into', 'working products.'],
  ),
  page(
    '/experiment/',
    'My experiment: One Breath | Pranav Gawai',
    'A voice practice game built to turn a first try into a useful result.',
    'experiment',
    ['A small experiment.', 'A first useful win.'],
  ),
  page(
    '/voice-lab/',
    'The Voice Lab | Pranav Gawai',
    'Hear a recorded example, try browser dictation or use your installed Wispr Flow app.',
    'voice-lab',
    ['Think out loud.', 'Try the voice lab.'],
  ),
  page(
    '/tech-stack/',
    'Tech stack | Pranav Gawai',
    'The tools I use to build AI products, from interface to infrastructure.',
    'tech-stack',
    ['From interface', 'to infrastructure.'],
  ),
  page(
    '/growth-plan/',
    'My proposed first month at Wispr | Pranav Gawai',
    'One campus, one useful task and a small experiment with a clear next decision. A proposal, not measured results.',
    'growth-plan',
    ['From a first try', 'to a daily habit.'],
  ),
  page(
    '/contact/',
    'Let’s build at Wispr | Pranav Gawai',
    'An independent portfolio for a growth opportunity at Wispr. Start a conversation with Pranav.',
    'contact',
    ['Let’s make voice', 'an everyday habit.'],
  ),
  page(
    '/footer/',
    'Get in touch | Pranav Gawai',
    'Explore my work and get in touch about building useful products.',
    'footer',
    ['A little more flow.', 'Let’s build.'],
  ),
  page(
    '/main/',
    'Explore my portfolio | Pranav Gawai',
    'Projects, voice experiments and a proposal for my first month at Wispr.',
    'main',
    ['A builder’s work.', 'A growth mindset.'],
  ),
  page(
    '/one-breath/',
    'One Breath | The voice practice game',
    'Pick a task. Speak for 30 to 120 seconds. Review your words and challenge a friend. Use Flow, your browser mic or keyboard.',
    'one-breath',
    ['A small round.', 'A stronger voice.'],
    true,
  ),
  page(
    '/one-breath/challenge/',
    'Start a challenge | One Breath',
    'Choose a team update, interview introduction or read-back mission. Practise your message in a timed round.',
    'one-breath-challenge',
    ['One round.', 'Your own words.'],
    true,
  ),
  page(
    '/one-breath/leaderboard/',
    'Leaderboard | One Breath',
    'Compare submitted practice scores for the same mission, duration and input method. An honor-system board.',
    'one-breath-leaderboard',
    ['Your next', 'personal best.'],
    true,
  ),
  page(
    '/one-breath/how-to-play/',
    'How to play | One Breath',
    'Choose a nickname, pick a mission, practise, review your words and share a challenge.',
    'one-breath-how-to-play',
    ['Pick. Speak.', 'Review. Repeat.'],
    true,
  ),
  page(
    '/one-breath/settings/',
    'Your preferences | One Breath',
    'Set your local nickname, profile photo, theme, motion and round preferences.',
    'one-breath-settings',
    ['Your practice.', 'Your preferences.'],
    true,
  ),
];
const aliases = { '/hero/': '/' };
const projects = {
  auren: 'Auren',
  travio: 'Travio',
  placepro: 'PlacePro',
  mnemo: 'Mnemo',
  'fahh-alert': 'fahh alert',
};
const projectSections = ['overview', 'problem', 'solution', 'contribution', 'design', 'impact'];
socialPages.push(
  page(
    '/projects/all/',
    'All projects | Pranav Gawai',
    'Explore my AI products and developer tools.',
    'projects-all',
    ['Selected work.', 'Built by Pranav.'],
  ),
);
for (const [slug, name] of Object.entries(projects)) {
  socialPages.push(
    page(
      `/projects/${slug}/`,
      `${name} | Pranav Gawai`,
      `Explore ${name}, a project by Pranav Gawai.`,
      `project-${slug}`,
      [name, 'Built by Pranav.'],
    ),
  );
}
export const projectSectionPages = socialPages
  .filter((item) => /^\/projects\/(?!all)[^/]+\/$/.test(item.path))
  .flatMap((item) =>
    projectSections.map((section) => ({
      ...item,
      path: `${item.path}${section}/`,
      title: `${item.title.split(' | ')[0]}: ${section} | Pranav Gawai`,
    })),
  );
export function getSocialPage(input = '/') {
  const url = new URL(input, defaultOrigin);
  let path = url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`;
  if (url.searchParams.has('product') || url.searchParams.has('studio')) path = '/one-breath/';
  const legacyProject = url.searchParams.get('work');
  if (legacyProject === 'all' || projects[legacyProject]) path = `/projects/${legacyProject}/`;
  path = aliases[path] || path;
  return (
    [...socialPages, ...projectSectionPages].find((item) => item.path === path) || socialPages[0]
  );
}
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export function renderSocialHead(input, origin = defaultOrigin) {
  const meta = getSocialPage(input);
  const base = new URL(origin);
  if (!['https:', 'http:'].includes(base.protocol))
    throw new Error('SITE_URL must use HTTP or HTTPS.');
  const canonical = new URL(meta.path, base.origin).href;
  const image = new URL(`/social/${meta.image}.webp?v=6`, base.origin).href;
  const tag = (key, value, kind = 'property') =>
    `<meta ${kind}="${key}" content="${escape(value)}" />`;
  return [
    `<title>${escape(meta.title)}</title>`,
    tag('description', meta.description, 'name'),
    `<link rel="canonical" href="${escape(canonical)}" />`,
    tag('og:type', 'website'),
    tag('og:site_name', meta.path.startsWith('/one-breath/') ? 'One Breath' : 'Pranav Gawai'),
    tag('og:locale', 'en_IN'),
    tag('og:url', canonical),
    tag('og:title', meta.title),
    tag('og:description', meta.description),
    tag('og:image', image),
    tag('og:image:type', 'image/webp'),
    tag('og:image:width', '1200'),
    tag('og:image:height', '630'),
    tag('og:image:alt', meta.lines.join(' ')),
    tag('twitter:card', 'summary_large_image', 'name'),
    tag('twitter:creator', '@pranavgawai_', 'name'),
    tag('twitter:title', meta.title, 'name'),
    tag('twitter:description', meta.description, 'name'),
    tag('twitter:image', image, 'name'),
    tag('twitter:image:alt', meta.lines.join(' '), 'name'),
    `<link rel="icon" type="${meta.path.startsWith('/one-breath/') ? 'image/svg+xml' : 'image/png'}" href="${meta.path.startsWith('/one-breath/') ? '/one-breath-icon.svg' : '/favicon.png'}" />`,
  ].join('\n');
}
export function injectSocialHead(html, input, origin) {
  const cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(
      /<meta\b[^>]*(?:property|name)=["'](?:og:[^"']*|twitter:[^"']*|description)["'][^>]*>/gi,
      '',
    )
    .replace(/<link\b[^>]*rel=["'](?:canonical|icon|shortcut icon)["'][^>]*>/gi, '');
  return cleaned.replace('</head>', `${renderSocialHead(input, origin)}\n</head>`);
}
