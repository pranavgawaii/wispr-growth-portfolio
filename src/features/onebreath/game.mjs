export const missions = [
  {
    id: 'signal',
    name: 'Save the launch',
    category: 'TEAM CHAT',
    seconds: 30,
    minWords: 25,
    maxWords: 65,
    title: 'The team needs your update.',
    prompt: 'Turn these three facts into one useful message. Speak naturally. Keep the meaning.',
    facts: [
      'Mobile login is stuck on the loading screen.',
      'Desktop login still works.',
      'The fix is expected tomorrow.',
    ],
    context: 'Maya · Product team',
    message: 'Quick update before standup? What’s broken, what still works, and when is the fix?',
    response:
      'Got it. We can keep desktop available and set expectations for tomorrow. Thanks for the clear update.',
    checks: [
      {
        label: 'Mobile login issue',
        terms: [
          ['mobile', 'phone'],
          ['login', 'log in', 'sign in'],
          ['stuck', 'load', 'broken', 'not working', 'fails', 'failing'],
        ],
      },
      {
        label: 'Desktop still works',
        terms: [
          ['desktop', 'laptop', 'computer'],
          ['works', 'working', 'available', 'fine', 'functional'],
        ],
        reject: [
          'desktop is not working',
          'desktop not working',
          'desktop login is not working',
          'desktop doesnt work',
          'desktop does not work',
          'desktop login doesnt work',
          'laptop is not working',
        ],
      },
      {
        label: 'Fix expected tomorrow',
        terms: [
          ['fix', 'resolve', 'repair', 'patch'],
          ['tomorrow', 'next day'],
        ],
      },
    ],
  },
  {
    id: 'interview',
    name: 'Make your introduction',
    category: 'INTERVIEW WARMUP',
    seconds: 60,
    minWords: 55,
    maxWords: 130,
    title: 'You have a minute. Be yourself.',
    prompt:
      'Introduce your role, something you built, and one thing you learned. A small real story beats a list of buzzwords.',
    facts: [
      'Say what you do.',
      'Describe one thing you built or owned.',
      'Share one thing you learned.',
    ],
    context: 'Alex · Practice interviewer',
    message: 'Tell me a little about yourself and something you enjoyed building.',
    response:
      'Nice starting point. Now read it aloud once more: does it sound like you, and is the example specific?',
    checks: [
      {
        label: 'Your role',
        terms: [
          [
            'engineer',
            'student',
            'developer',
            'designer',
            'marketer',
            'builder',
            'founder',
            'researcher',
            'analyst',
            'manager',
            'graduate',
          ],
        ],
      },
      {
        label: 'Something you owned',
        terms: [
          [
            'built',
            'created',
            'shipped',
            'designed',
            'developed',
            'led',
            'launched',
            'organized',
            'organised',
            'made',
          ],
        ],
      },
      {
        label: 'A learning',
        terms: [
          ['learned', 'learnt', 'taught', 'realized', 'realised', 'discovered', 'understood'],
        ],
      },
    ],
  },
  {
    id: 'readback',
    name: 'Keep the meaning',
    category: 'READ-BACK CHALLENGE',
    seconds: 30,
    minWords: 20,
    maxWords: 30,
    title: 'One message. Every important word.',
    prompt:
      'Read the message into your field. Compare the captured text with the reference. This checks words, not pronunciation.',
    facts: [
      'Read naturally, without racing.',
      'Keep the details in the same order.',
      'Review what arrived in the field.',
    ],
    reference:
      'The mobile login is stuck. Desktop works. The fix is expected tomorrow. Please send a short update to the team.',
    context: 'Sam · Your teammate',
    message: 'Can you pass this message on without losing the details?',
    response:
      'That’s the handoff. Check the highlighted words to see what matched and what still needs a second try.',
    checks: [],
  },
];
export const durations = [30, 60, 120];
export const methods = ['flow', 'mic', 'type'];
export function words(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize('NFKC')
      .replace(/[’']/g, '')
      .match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu) || []
  );
}
function contains(textWords, phrase) {
  const needle = words(phrase);
  return textWords.some((_, start) =>
    needle.every((word, index) => textWords[start + index] === word),
  );
}
export function matchReference(reference, text) {
  const expected = words(reference),
    actual = words(text);
  const table = Array.from(
    { length: expected.length + 1 },
    () => new Uint16Array(actual.length + 1),
  );
  for (let i = expected.length - 1; i >= 0; i--)
    for (let j = actual.length - 1; j >= 0; j--)
      table[i][j] =
        expected[i] === actual[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
  const matched = new Set();
  let i = 0,
    j = 0;
  while (i < expected.length && j < actual.length) {
    if (expected[i] === actual[j]) {
      matched.add(i);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return {
    tokens: expected.map((word, index) => ({ word, matched: matched.has(index) })),
    matched: matched.size,
    total: expected.length,
    extra: actual.length - matched.size,
    percent: actual.length
      ? Math.round((100 * matched.size) / Math.max(expected.length, actual.length))
      : 0,
  };
}
export function scoreRound(missionId, text, elapsed) {
  const mission = missions.find((item) => item.id === missionId);
  if (!mission) throw new Error('Unknown mission');
  const tokens = words(text),
    count = tokens.length;
  const checked = mission.checks.map((check) => ({
    label: check.label,
    passed:
      check.terms.every((group) => group.some((term) => contains(tokens, term))) &&
      !(check.reject || []).some((term) => contains(tokens, term)),
  }));
  const coverage = checked.length
    ? Math.round((75 * checked.filter((check) => check.passed).length) / checked.length)
    : 0;
  const withinBudget = count >= mission.minWords && count <= mission.maxWords;
  const budget =
    count === 0
      ? 0
      : withinBudget
        ? 25
        : count < mission.minWords
          ? Math.round((25 * count) / mission.minWords)
          : Math.round((25 * mission.maxWords) / count);
  const reference = mission.reference ? matchReference(mission.reference, text) : null;
  const score = count === 0 ? 0 : reference ? reference.percent : coverage + budget;
  return {
    score,
    words: count,
    elapsed: Math.round(Math.max(0, elapsed)),
    checked,
    coverage,
    budget,
    withinBudget,
    reference,
    outputRate: elapsed >= 5 ? Math.round((count * 60) / elapsed) : null,
    badge:
      score >= 90 ? 'Message landed' : score >= 65 ? 'On the right track' : 'A good place to start',
  };
}
