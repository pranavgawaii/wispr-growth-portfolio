export interface SocialPage {
  path: string;
  title: string;
  description: string;
  image: string;
  lines: string[];
  product: boolean;
}
export const defaultOrigin: string;
export const socialPages: SocialPage[];
export const projectSectionPages: SocialPage[];
export function getSocialPage(input?: string): SocialPage;
export function renderSocialHead(input: string, origin?: string): string;
export function injectSocialHead(html: string, input: string, origin?: string): string;
