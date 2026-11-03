import React, { useEffect, useState, useMemo } from 'react';
import fallbackContributions from '../../data/github-contributions-fallback.json';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionsData {
  total: {
    [key: string]: number;
  };
  contributions: ContributionDay[];
}

const USERNAME = 'pranavgawaii';
const GITHUB_URL = `https://github.com/${USERNAME}`;

// Days labels matching screenshot
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const GitHubHeatmap: React.FC = () => {
  const [data, setData] = useState<ContributionsData>(
    fallbackContributions as unknown as ContributionsData,
  );
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((json: ContributionsData) => {
        if (isMounted && json && json.contributions && json.contributions.length > 0) {
          setData(json);
        }
      })
      .catch(() => {
        // Keep fallback data if fetch fails
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute total commits count for last year / 2026
  const totalCount = useMemo(() => {
    if (data?.total?.lastYear) return data.total.lastYear;
    if (data?.total?.['2026']) return data.total['2026'];
    if (data?.contributions) {
      return data.contributions.reduce((acc, curr) => acc + curr.count, 0);
    }
    return 3002;
  }, [data]);

  // Group days into 7-day columns (weeks)
  const { weeks, monthLabels } = useMemo(() => {
    if (!data?.contributions || data.contributions.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    const weeksList: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // The first day's day of week (0 = Sun, 1 = Mon, etc.)
    const firstDate = new Date(data.contributions[0].date);
    const startDayOfWeek = firstDate.getDay();

    // Pad first week if not starting on Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: '', count: -1, level: -1 });
    }

    data.contributions.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: -1, level: -1 });
      }
      weeksList.push(currentWeek);
    }

    // Determine month label positions along weeks
    const months: { label: string; weekIndex: number }[] = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let lastMonth = -1;

    weeksList.forEach((w, wIdx) => {
      const firstValid = w.find((d) => d.date);
      if (firstValid) {
        const d = new Date(firstValid.date);
        const m = d.getMonth();
        if (m !== lastMonth) {
          months.push({ label: monthNames[m], weekIndex: wIdx });
          lastMonth = m;
        }
      }
    });

    return { weeks: weeksList, monthLabels: months };
  }, [data]);

  // GitHub tile color styles
  const getCellColor = (level: number) => {
    if (level < 0) return 'transparent';
    switch (level) {
      case 1:
        return 'bg-[#c6e5d3] dark:bg-[#1b3d2b]';
      case 2:
        return 'bg-[#8dc5a4] dark:bg-[#23583a]';
      case 3:
        return 'bg-[#4f9b74] dark:bg-[#2e7d4f]';
      case 4:
        return 'bg-[#2b6644] dark:bg-[#3ba267]';
      case 0:
      default:
        return 'bg-[#e2ebe4] dark:bg-[#222725]';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section
      className="w-full pt-12 sm:pt-16 md:pt-20 pb-4 overflow-hidden"
      aria-label="GitHub activity heatmap"
    >
      {/* Expanded Container: Wider than the standard column while allowing comfortable sidebar margins */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header: Headline + Pranav Gawai link with logo & hover arrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-1">
          {/* Headline */}
          <div className="flex items-center gap-2 font-outfit">
            <span className="text-[15px] sm:text-[16px] font-normal text-stone-700 dark:text-stone-300">
              <strong className="font-semibold text-stone-900 dark:text-stone-100">
                {totalCount.toLocaleString()}
              </strong>{' '}
              GitHub contributions in the displayed period.
            </span>
          </div>

          {/* User profile link with GitHub logo that swaps to arrow on hover */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/gh inline-flex items-center gap-2 text-xs sm:text-[14px] font-semibold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 transition-colors select-none whitespace-nowrap"
          >
            <div className="relative w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 w-[18px] h-[18px] flex items-center justify-center transition-all duration-200 opacity-100 scale-100 group-hover/gh:opacity-0 group-hover/gh:scale-50 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current text-stone-900 dark:text-stone-100"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-[18px] h-[18px] flex items-center justify-center transition-all duration-200 opacity-0 scale-50 group-hover/gh:opacity-100 group-hover/gh:scale-100 pointer-events-none text-stone-900 dark:text-stone-100">
                <svg
                  className="w-3.5 h-3.5 stroke-current stroke-[2.2] fill-none transition-transform duration-200 group-hover/gh:-translate-y-0.5 group-hover/gh:translate-x-0.5"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
            <span className="group-hover/gh:underline underline-offset-4 decoration-stone-400 dark:decoration-stone-600 transition-all font-outfit font-medium text-[13px] sm:text-[14px] tracking-tight">
              @{USERNAME}
            </span>
          </a>
        </div>

        {/* Seamless Heatmap Area: NO box, directly blends with page background */}
        <div className="w-full">
          {/* Scrollable Container for Mobile / smaller screens */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex flex-col min-w-[760px] w-full select-none">
              {/* Day Labels + Columns Container */}
              <div className="flex gap-2 sm:gap-2.5">
                {/* Y-axis Day of week labels */}
                <div className="flex flex-col justify-between py-[2px] pr-1 text-[11px] font-medium w-8 select-none text-stone-400 dark:text-stone-500">
                  {DAY_LABELS.map((day) => (
                    <span
                      key={day}
                      className="h-3 sm:h-3.5 flex items-center leading-none text-left px-0.5 select-none"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Heatmap Grid (Weeks horizontally, Days vertically) */}
                <div className="flex-1 flex justify-between gap-[3px] sm:gap-1">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px] sm:gap-1 flex-1">
                      {week.map((day, dIdx) => {
                        if (day.level < 0) {
                          return (
                            <div
                              key={dIdx}
                              className="w-full aspect-square rounded-[3px] sm:rounded-sm opacity-0"
                            />
                          );
                        }

                        return (
                          <div
                            key={dIdx}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            title={
                              day.date ? `${day.count} commits on ${formatDate(day.date)}` : ''
                            }
                            className={`w-full aspect-square rounded-[3px] sm:rounded-sm transition-all duration-150 cursor-pointer ${getCellColor(
                              day.level,
                            )} hover:scale-125 hover:z-20 hover:shadow-xs hover:ring-1 hover:ring-black/20 dark:hover:ring-white/30`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Month Labels under the grid */}
              <div className="flex pl-10 pt-2.5 text-[11px] font-medium text-stone-400 dark:text-stone-500 select-none">
                <div className="flex-1 flex justify-between">
                  {monthLabels.map((m, idx) => (
                    <span key={idx} className="leading-none">
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clean status bar: Shows active commit counts seamlessly on hover, plus legend */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div className="h-5 flex items-center">
              {hoveredDay && hoveredDay.date ? (
                <span className="font-medium text-stone-800 dark:text-stone-200 transition-opacity duration-150">
                  <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {hoveredDay.count} commits
                  </strong>{' '}
                  on {formatDate(hoveredDay.date)}
                </span>
              ) : (
                <span className="text-stone-400 dark:text-stone-500">Daily developer activity</span>
              )}
            </div>

            {/* Scale legend */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e2ebe4] dark:bg-[#222725] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#c6e5d3] dark:bg-[#1b3d2b] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8dc5a4] dark:bg-[#23583a] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#4f9b74] dark:bg-[#2e7d4f] inline-block" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#2b6644] dark:bg-[#3ba267] inline-block" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
