import { Analytics } from '@vercel/analytics/react';

/** Never send player names, invitation scores, query strings or transcripts to analytics. */
export function SiteAnalytics() {
  if (!import.meta.env.PROD || import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') return null;
  const sanitize = <T extends { url: string }>(event: T): T => {
    const url = new URL(event.url, window.location.origin);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.href };
  };
  return <Analytics beforeSend={sanitize} />;
}
