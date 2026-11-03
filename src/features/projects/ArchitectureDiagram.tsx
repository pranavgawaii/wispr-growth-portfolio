import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Code2,
  Database,
  FileText,
  GitBranch,
  Mail,
  Map,
  Search,
  ShieldCheck,
  Terminal,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { WorkProject } from './projects';
function Node({
  icon,
  children,
  detail,
}: {
  icon: ReactNode;
  children: ReactNode;
  detail?: string;
}) {
  return (
    <div className="system-node">
      <span>{icon}</span>
      <strong>{children}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
function Down() {
  return <ArrowDown className="system-down" size={19} />;
}
export function ArchitectureDiagram({ project }: { project: WorkProject }) {
  let diagram: ReactNode;
  let note = '';
  if (project.id === 'auren') {
    note =
      'Approval gates writes. Dependent actions use upstream results; tool outcomes are logged in MongoDB.';
    diagram = (
      <div className="system-approval">
        <div className="system-row">
          <Node icon={<Terminal />}>Command</Node>
          <ArrowRight />
          <Node icon={<Code2 />} detail="Structured tool actions">
            Planner
          </Node>
          <ArrowRight />
          <Node icon={<ShieldCheck />} detail="Edit parameters, then confirm">
            Human review
          </Node>
        </div>
        <Down />
        <div className="system-tools">
          <Node icon={<CalendarDays />} detail="Event + Meet link">
            Calendar
          </Node>
          <span className="system-dependency">
            Meet link <ArrowRight size={15} />
          </span>
          <Node icon={<Mail />} detail="Uses the event result">
            Gmail
          </Node>
          <Node icon={<GitBranch />} detail="Other approved actions">
            GitHub
          </Node>
        </div>
        <Down />
        <Node icon={<Database />} detail="Tool input · output · timing">
          MongoDB execution log
        </Node>
      </div>
    );
  } else if (project.id === 'travio') {
    note =
      'Trip records connect the group, itinerary, and expenses. Clerk authenticates members; Cloudinary stores attachments.';
    diagram = (
      <div className="system-trip">
        <div className="system-trip-roles">
          <Users size={18} /> Owner <span>·</span> Editor <span>·</span> Viewer
        </div>
        <Down />
        <Node icon={<Map />} detail="One shared trip record">
          Trip workspace
        </Node>
        <div className="system-branches" />
        <div className="system-trip-grid">
          <Node icon={<CalendarDays />} detail="Days & activities">
            Itinerary
          </Node>
          <Node icon={<Database />} detail="Who paid what">
            Expenses
          </Node>
          <Node icon={<Check />} detail="To-do & packing">
            Checklists
          </Node>
          <Node icon={<FileText />} detail="Cloudinary attachments">
            Documents
          </Node>
        </div>
        <p className="system-annotation">MongoDB holds trip data and member roles.</p>
      </div>
    );
  } else if (project.id === 'placepro') {
    note =
      'A role-based product flow, not a claim of measured placement outcomes or verified institutional adoption.';
    diagram = (
      <div className="system-campus">
        <div className="system-lane">
          <span>PLACEMENT TEAM</span>
          <div className="system-row">
            <Node icon={<FileText />}>Student records</Node>
            <ArrowRight />
            <Node icon={<Search />}>Opportunities & eligibility</Node>
            <ArrowRight />
            <Node icon={<Users />}>Review applications</Node>
          </div>
        </div>
        <div className="system-handoff">
          <ArrowDown size={16} /> Published opportunities{' '}
          <span>
            Application updates <ArrowRight size={14} />
          </span>
        </div>
        <div className="system-lane">
          <span>STUDENT</span>
          <div className="system-row">
            <Node icon={<Search />}>Discover roles</Node>
            <ArrowRight />
            <Node icon={<FileText />}>Apply</Node>
            <ArrowRight />
            <Node icon={<Check />}>Follow status</Node>
          </div>
        </div>
      </div>
    );
  } else if (project.id === 'mnemo') {
    note =
      'Recall filters by namespace, over-fetches candidates, and re-ranks. Contradiction detection flags a heuristic match for explicit review.';
    diagram = (
      <div className="system-memory">
        <span className="system-path-label">RECALL PATH</span>
        <div className="system-row">
          <Node icon={<Search />}>Query</Node>
          <ArrowRight />
          <Node icon={<Code2 />} detail="384-d, local">
            Embed
          </Node>
          <ArrowRight />
          <Node icon={<Database />} detail="Namespace + cosine">
            pgvector
          </Node>
          <ArrowRight />
          <Node icon={<Check />} detail="Similarity × decay × importance">
            Re-rank
          </Node>
        </div>
        <div className="system-memory-write">
          <span className="system-path-label">WRITE & REVIEW</span>
          <p>New memory → similarity gate → polarity check</p>
          <div className="system-row">
            <Node icon={<ShieldCheck />} detail="No silent overwrite">
              Flag conflict
            </Node>
            <ArrowRight />
            <Node icon={<Users />}>Choose winner</Node>
            <ArrowRight />
            <Node icon={<Database />} detail="Retain the audit trail">
              Soft-delete loser
            </Node>
          </div>
        </div>
      </div>
    );
  } else {
    note =
      'A non-zero exit triggers the configured local sound. Successful commands remain silent; playback requires a compatible system player.';
    diagram = (
      <div className="system-alert">
        <Node icon={<Terminal />} detail="VS Code shell integration">
          Command exits
        </Node>
        <Down />
        <div className="system-exit">Exit code?</div>
        <div className="system-alert-paths">
          <div>
            <span>0 / SUCCESS</span>
            <Node icon={<Check />}>Stay silent</Node>
          </div>
          <div>
            <span>NON-ZERO / FAILURE</span>
            <Node icon={<X />}>Check enabled setting</Node>
            <Down />
            <Node icon={<Volume2 />} detail="Configured file + volume">
              Play sound
            </Node>
          </div>
        </div>
      </div>
    );
  }
  return (
    <figure
      className={`architecture project-system system-${project.id}`}
      aria-label={`${project.name} system diagram`}
    >
      <div className="architecture-eyebrow">
        <GitBranch size={14} />
        {project.name}
        <span>{project.id === 'placepro' ? 'ROLE HANDOFF' : 'SYSTEM FLOW'}</span>
      </div>
      {diagram}
      <figcaption>{note}</figcaption>
    </figure>
  );
}
