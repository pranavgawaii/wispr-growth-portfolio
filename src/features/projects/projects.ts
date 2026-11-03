export interface WorkProject {
  id: string;
  name: string;
  category: string;
  title: string;
  summary: string;
  role: string;
  scope: string;
  stack: string;
  problem: string;
  built: string[];
  decision: string;
  outcome: string;
  next: string;
  flow: string[];
  links: { label: string; href: string }[];
}
const projects: WorkProject[] = [
  {
    id: 'auren',
    name: 'Auren',
    category: 'AI workflows',
    title: 'One command. A plan you can trust.',
    summary:
      'An AI workflow product connecting email, calendar, and GitHub, with human approval before every write action.',
    role: 'Independent builder',
    scope: 'AI orchestration · Approval flows · Tool integration',
    stack: 'Next.js · TypeScript · MongoDB · Corsair · LLM APIs',
    problem:
      'Work is spread across inboxes, calendars, and repositories. Giving an agent access to all three is useful only if the person using it can understand and control what happens next.',
    built: [
      'A natural-language interface for actions across Gmail, Google Calendar, and GitHub.',
      'A review step that gates write actions behind human approval.',
      'Email priority classification and inbox search, with an execution audit log.',
    ],
    decision:
      'Keep approval in the loop. An extra review step is a deliberate tradeoff when an action can send a message or change someone’s calendar.',
    outcome: 'Live product and source code are available above.',
    next: 'Observe where people edit or reject a proposed plan, then use those moments to improve the clarity of the review step.',
    flow: ['Express intent', 'Review the plan', 'Approve actions', 'Check the result'],
    links: [
      { label: 'Visit Auren', href: 'https://tryauren.in/' },
      { label: 'Source code', href: 'https://github.com/pranavgawaii/Auren' },
    ],
  },
  {
    id: 'travio',
    name: 'Travio',
    category: 'Collaborative travel',
    title: 'One trip. Everyone on the same page.',
    summary:
      'A collaborative trip planner bringing day-wise itineraries, shared expenses, packing lists, and travel documents into one workspace.',
    role: 'Full-stack engineer & designer',
    scope: 'Itinerary builder · Group collaboration · Expense tracking · Document organisation',
    stack: 'Next.js · React · TypeScript · MongoDB · Clerk · Cloudinary',
    problem:
      'A group trip gets scattered across chat messages, spreadsheets, tickets, and separate expense lists. People need a shared place to organise the plan and its practical details.',
    built: [
      'Day-wise itineraries with timed activities and drag-and-drop reordering.',
      'Invite codes and owner, editor, and viewer permissions for group planning.',
      'A shared expense ledger, packing checklists, and document attachments.',
    ],
    decision:
      'Keep the itinerary, people, costs, and essentials connected to the same trip. Role-based access distinguishes who can change the plan from who only needs to follow it.',
    outcome: 'The implementation is public, with the live site and source code linked above.',
    next: 'Observe a group planning a real trip and find which decisions still escape into chat.',
    flow: ['Create a trip', 'Invite the group', 'Build the itinerary', 'Organise the essentials'],
    links: [
      { label: 'Visit Travio', href: 'https://travio.fun' },
      { label: 'Source code', href: 'https://github.com/pranavgawaii/Travio' },
    ],
  },
  {
    id: 'placepro',
    name: 'PlacePro',
    category: 'Campus infrastructure',
    title: 'A placement journey with one place to begin.',
    summary:
      'A campus placement portal I built independently, connecting job discovery, applications, and student placement workflows.',
    role: 'Independent builder',
    scope: 'Student experience · Placement workflows · Full-stack development',
    stack: 'Next.js · TypeScript · PostgreSQL',
    problem:
      'Campus placement activity needs a coherent home. Students need to find opportunities and follow their applications, while placement teams need a way to manage the process.',
    built: [
      'A live campus placement portal.',
      'Job listings and application tracking in a shared student journey.',
      'Placement workflows brought together in one web product.',
    ],
    decision:
      'Build around the campus workflow rather than a general-purpose job board. The useful unit is the student’s placement journey.',
    outcome:
      'A publicly accessible campus portal and product website demonstrate the placement journey.',
    next: 'Test the journey from finding an opportunity to checking an application with students, and identify where they still need to ask for help.',
    flow: ['Find an opportunity', 'Check eligibility', 'Apply', 'Track progress'],
    links: [
      { label: 'Visit PlacePro', href: 'https://www.placepro.in/' },
      { label: 'Source code', href: 'https://github.com/pranavgawaii/PlacePro' },
    ],
  },
  {
    id: 'mnemo',
    name: 'Mnemo',
    category: 'Memory for AI agents',
    title: 'Memory that can be recalled. And corrected.',
    summary:
      'A memory API for AI agents, combining vector retrieval, time-decay ranking, deterministic contradiction detection, and an audit trail.',
    role: 'Independent builder',
    scope: 'Retrieval · Ranking · Contradiction detection · API design',
    stack: 'Python · FastAPI · PostgreSQL · pgvector · REST APIs',
    problem:
      'An agent’s memory needs more than storage. It must retrieve useful context, handle conflicting facts, and retain a way to understand what changed.',
    built: [
      'Cosine-similarity retrieval over PostgreSQL and pgvector.',
      'Time-decay ranking to balance relevance and recency.',
      'Deterministic contradiction detection with a soft-delete audit trail.',
    ],
    decision:
      'A wrong decay configuration flattened relevance scores without crashing anything. I caught it before shipping. That made inspecting ranking behavior as important as checking whether the API returned successfully.',
    outcome:
      'Reported 89% top-three retrieval on a 50-query benchmark. This is a small project benchmark, not a production-scale evaluation or an external validation.',
    next: 'Expand the query set and inspect failures by type before drawing broader conclusions about retrieval quality.',
    flow: ['Store a memory', 'Embed & index', 'Rank relevant context', 'Correct with a trail'],
    links: [
      { label: 'Visit Mnemo', href: 'https://trymnemo.vercel.app/' },
      { label: 'Source code', href: 'https://github.com/pranavgawaii/mnemo' },
    ],
  },
  {
    id: 'fahh-alert',
    name: 'fahh alert',
    category: 'Developer tools',
    title: 'A little personality in the editor.',
    summary: 'A VS Code extension that plays a configurable sound when a terminal command fails.',
    role: 'Independent builder',
    scope: 'VS Code extension · Sound interaction · Distribution',
    stack: 'VS Code extension',
    problem:
      'A long-running terminal command can fail while a developer is focused elsewhere. An audio cue makes the failure noticeable without repeatedly checking the terminal.',
    built: [
      'An alert triggered by failed terminal commands and non-zero exit codes.',
      'A public VS Code Marketplace listing for installation.',
      'Configurable sound files, volume, an enable toggle, and a test-sound command.',
    ],
    decision:
      'Keep the idea small enough to ship. The extension’s identity comes from doing one playful thing inside an existing workflow.',
    outcome:
      'Published on the VS Code Marketplace with thousands of installs. The listing is linked above.',
    next: 'Investigate discovery sources and reviews before claiming a distribution strategy or deciding which feature to add.',
    flow: ['Discover the extension', 'Install in VS Code', 'Try the sound', 'Make it your own'],
    links: [
      {
        label: 'Visit fahh alert',
        href: 'https://marketplace.visualstudio.com/items?itemName=pranavdev.fahh-alert',
      },
      { label: 'Source code', href: 'https://github.com/pranavgawaii/fahh-alert' },
    ],
  },
];

// Featured order is shared by the carousel, collection, and next-project links.
export const workProjects = ['auren', 'mnemo', 'travio', 'placepro', 'fahh-alert'].map((id) =>
  projects.find((project) => project.id === id)!,
);
