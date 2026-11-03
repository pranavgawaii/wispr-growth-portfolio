import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { ArrowUpRight, Globe, Github, Mail, Play, Folder, ArrowRight } from 'lucide-react';
type Kind = 'website' | 'source' | 'video' | 'mail' | 'collection' | 'next';
const icons = {
  website: Globe,
  source: Github,
  video: Play,
  mail: Mail,
  collection: Folder,
  next: ArrowRight,
};
export function AnimatedLink({
  kind = 'website',
  icon,
  className = '',
  children,
  ...props
}: ComponentProps<'a'> & { kind?: Kind; icon?: LucideIcon }) {
  const Icon = icon ?? icons[kind];
  return (
    <a {...props} className={`animated-link animated-link-${kind} ${className}`}>
      <span className="animated-link-icon" aria-hidden="true">
        <Icon className="link-original" size={15} />
        <ArrowUpRight className="link-arrow" size={15} />
      </span>
      <span className="animated-link-text">{children}</span>
    </a>
  );
}
