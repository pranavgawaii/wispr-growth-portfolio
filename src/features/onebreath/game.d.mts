export type Method = 'flow' | 'mic' | 'type';
export interface Mission {
  id: string;
  name: string;
  category: string;
  seconds: number;
  minWords: number;
  maxWords: number;
  title: string;
  prompt: string;
  facts: string[];
  context: string;
  message: string;
  response: string;
  reference?: string;
  checks: { label: string; terms: string[][]; reject?: string[] }[];
}
export interface RoundResult {
  score: number;
  words: number;
  elapsed: number;
  checked: { label: string; passed: boolean }[];
  coverage: number;
  budget: number;
  withinBudget: boolean;
  reference: null | {
    tokens: { word: string; matched: boolean }[];
    matched: number;
    total: number;
    extra: number;
    percent: number;
  };
  outputRate: number | null;
  badge: string;
}
export const missions: Mission[];
export const durations: number[];
export const methods: Method[];
export function words(text: string): string[];
export function matchReference(
  reference: string,
  text: string,
): NonNullable<RoundResult['reference']>;
export function scoreRound(missionId: string, text: string, elapsed: number): RoundResult;
