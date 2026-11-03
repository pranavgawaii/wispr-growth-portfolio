export interface CaseDetails {
  status: string;
  solution: string;
  implementation: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  result: string;
  architecture: boolean;
}

export const caseDetails: Record<string, CaseDetails> = {
  auren: {
    status: 'Public site & source',
    solution:
      'A command becomes an editable execution plan across Gmail, Calendar, and GitHub. After approval, the product runs the actions and records each tool’s result.',
    implementation: [
      {
        title: 'Planning and execution',
        body: 'A Next.js server action passes the command and context to the planner, which returns structured tool actions. Corsair connects the external tools; direct Google Calendar OAuth supports Meet-link generation.',
      },
      {
        title: 'Results that carry forward',
        body: 'The calendar-to-email flow passes the generated Meet link into the message. MongoDB stores tool inputs, outputs, and timing; email priority classification and inbox search sit alongside the execution workflow.',
      },
    ],
    decisions: [
      {
        title: 'Approval before writes',
        body: 'A review step adds friction, but sending a message or changing a calendar deserves an explicit decision. Action parameters remain editable before confirmation.',
      },
      {
        title: 'Dependencies before parallelism',
        body: 'Independent actions can run together. An email that needs a newly generated Meet link must wait for the calendar result, so execution cannot treat every action as independent.',
      },
    ],
    result:
      'Implemented a reviewable multi-tool workflow, editable action parameters, connected calendar-to-email execution, and per-tool audit records. The live site and implementation are available below.',
    architecture: true,
  },
  travio: {
    status: 'Public site & source',
    solution:
      'A shared trip workspace connects daily itineraries, invited members, expenses, checklists, and attachments. The group can organise the plan and its practical details in one place.',
    implementation: [
      {
        title: 'A trip-centred data model',
        body: 'MongoDB connects each trip to its members, days, activities, and expenses. Activities carry time, location, and estimated cost, with drag-and-drop reordering in the itinerary.',
      },
      {
        title: 'Identity and attachments',
        body: 'Clerk handles authentication, while owner, editor, and viewer roles describe member access. Cloudinary stores uploaded travel documents separately from the trip’s structured records.',
      },
    ],
    decisions: [
      {
        title: 'One shared trip context',
        body: 'Itineraries, costs, and preparation belong to the same trip. Keeping them connected reduces the need to reconstruct decisions from separate chat threads and spreadsheets.',
      },
      {
        title: 'Participation is not editing',
        body: 'A viewer can follow a plan without having the same role as its editor or owner. Explicit roles distinguish access to the trip from responsibility for changing it.',
      },
    ],
    result:
      'Implemented group invitations, role-based trip planning, day-wise activity reordering, shared expenses, checklists, and document attachments. The live site and source are available below.',
    architecture: true,
  },
  placepro: {
    status: 'Public site · proposed to TPO',
    solution:
      'A campus-focused portal connects student records, job opportunities, eligibility, and applications. Separate student and placement-team journeys support the same recruitment process.',
    implementation: [
      {
        title: 'Placement records and applications',
        body: 'The web application uses student context to support opportunity discovery, eligibility, applications, and status tracking. Student, TPO, and recruiter roles have different responsibilities within that process.',
      },
      {
        title: 'From data to assessment logistics',
        body: 'The repository also documents a seat-allocation engine that parses student data, maps candidates to labs, and generates physical seat documents.',
      },
    ],
    decisions: [
      {
        title: 'Campus workflow over a general job board',
        body: 'The useful unit is a student’s placement journey, including eligibility and institutional operations|not just a list of vacancies.',
      },
      {
        title: 'Role-specific responsibilities',
        body: 'Students need a clear application journey; placement teams need structured records and review workflows. Keeping those roles distinct makes the same process easier to understand.',
      },
    ],
    result:
      'Built the placement portal and product website, with application workflows and documented assessment operations. The repository describes a TPO proposal and a target audience; these are not verified adoption or placement-success figures.',
    architecture: false,
  },
  mnemo: {
    status: 'Open-source API & playground',
    solution:
      'A memory API stores facts, recalls relevant context, and flags conflicting writes. Memory can be corrected explicitly while retaining a soft-delete audit trail.',
    implementation: [
      {
        title: 'Local embeddings and retrieval',
        body: 'FastAPI embeds content with 384-dimensional MiniLM vectors. Recall filters by namespace, searches a cosine index, over-fetches candidates by 4×, then re-ranks in Python using similarity × decay × importance.',
      },
      {
        title: 'Conflict detection and resolution',
        body: 'A similarity gate followed by a negation heuristic flags possible contradictions. Resolution names a winner and soft-deletes the losing memory. Detection is deterministic; it does not understand every kind of semantic contradiction.',
      },
    ],
    decisions: [
      {
        title: 'Bound recency rather than prioritise it blindly',
        body: 'A decay floor prevents age alone from burying a clearly relevant fact. A misconfigured decay setting once flattened relevance scores without raising an error, making ranking inspection essential.',
      },
      {
        title: 'Flag disagreement; preserve history',
        body: 'Conflicting facts are reviewed rather than silently overwritten. Soft deletion keeps a trail of what changed instead of erasing the previous memory.',
      },
    ],
    result:
      'Implemented local embeddings, ranked recall, namespace filtering, contradiction flags, and explicit resolution. Reported 89% top-three retrieval on a 50-query project benchmark; this is a small internal evaluation, not external or production-scale validation.',
    architecture: true,
  },
  'fahh-alert': {
    status: 'Published on VS Code Marketplace',
    solution:
      'The extension listens for failed terminal commands and plays a configured local sound. Successful commands remain silent; users can change the file, adjust volume, disable alerts, or run Test Sound.',
    implementation: [
      {
        title: 'Editor events to local playback',
        body: 'VS Code shell integration supplies command execution events. A non-zero exit code triggers playback through a system audio player, using the configured sound file and volume. Linux requires a compatible player.',
      },
    ],
    decisions: [
      {
        title: 'Use an exit code, not terminal-text guessing',
        body: 'The command result is the failure signal. This avoids trying to infer success or failure from arbitrary output text.',
      },
      {
        title: 'Keep audio controllable and testable',
        body: 'An alert should fit the workspace rather than interrupt it indiscriminately. Enable and volume settings provide control; Test Sound verifies playback without waiting for a real failure.',
      },
    ],
    result:
      'Published a configurable failure-alert extension on the VS Code Marketplace with thousands of installs. The listing provides installation and settings documentation; the source is available below.',
    architecture: false,
  },
};
