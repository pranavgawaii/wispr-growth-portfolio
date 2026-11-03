import { useId, useState } from 'react';

const examples: Record<
  string,
  { title: string; note: string; steps: { label: string; text: string }[] }
> = {
  auren: {
    title: 'From intent to a reviewed action',
    note: 'Illustrative scenario · not a recorded execution',
    steps: [
      {
        label: 'Ask',
        text: '“Create a meeting and email the invite.” The request spans two tools, but the email depends on the calendar result.',
      },
      {
        label: 'Review',
        text: 'Inspect the proposed actions and edit their parameters before confirming. The plan remains reviewable before write actions execute.',
      },
      {
        label: 'Execute',
        text: 'The calendar action produces the event and Meet link. The email action uses that result; the execution log records each tool’s inputs, outputs, and timing.',
      },
    ],
  },
  mnemo: {
    title: 'Recall a fact. Resolve a disagreement.',
    note: 'Illustrative memory example · not a live API response',
    steps: [
      {
        label: 'Store',
        text: 'Store “I prefer morning meetings” in a namespace. Local MiniLM embeddings represent the memory as a 384-dimensional vector.',
      },
      {
        label: 'Recall',
        text: 'A query about meeting preferences searches within that namespace. Candidate memories are re-ranked using similarity, decay, and importance.',
      },
      {
        label: 'Correct',
        text: 'A later negated preference may be flagged by the similarity gate and negation heuristic. Explicit resolution selects the winning memory and soft-deletes the other, preserving its history.',
      },
    ],
  },
  travio: {
    title: 'One trip, from planning to preparation',
    note: 'Product walkthrough · describes the implemented workflow',
    steps: [
      {
        label: 'Plan',
        text: 'Create a trip, add days, and arrange timed activities. Drag-and-drop reordering changes the itinerary without rebuilding it.',
      },
      {
        label: 'Invite',
        text: 'Share the trip through an invite code. Owner, editor, and viewer roles distinguish who can change the plan from who follows it.',
      },
      {
        label: 'Prepare',
        text: 'Keep shared expenses, packing checklists, and uploaded travel documents with the same trip instead of distributing them across separate conversations.',
      },
    ],
  },
  placepro: {
    title: 'Follow an application through the portal',
    note: 'Product walkthrough · no placement outcome implied',
    steps: [
      {
        label: 'Discover',
        text: 'Students find campus opportunities and check eligibility using their student context.',
      },
      {
        label: 'Apply',
        text: 'An application connects the student record to the opportunity, giving placement teams a structured review workflow.',
      },
      {
        label: 'Track',
        text: 'Students follow application status while the placement team manages the recruitment process.',
      },
    ],
  },
};

export function WorkflowExample({ slug }: { slug: string }) {
  const [index, setIndex] = useState(0);
  const id = useId();
  const example = examples[slug];
  if (!example) return null;
  return (
    <div className="case-example">
      <h3>{example.title}</h3>
      <div className="case-example-controls" role="group" aria-label={example.title}>
        {example.steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            aria-pressed={index === i}
            aria-controls={id}
            onClick={() => setIndex(i)}
          >
            <span>0{i + 1}</span>
            {step.label}
          </button>
        ))}
      </div>
      <p id={id} aria-live="polite">
        {example.steps[index].text}
      </p>
      <small>{example.note}</small>
    </div>
  );
}
