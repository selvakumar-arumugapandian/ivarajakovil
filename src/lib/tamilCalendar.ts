/** Tamil solar calendar using traditional month lengths (matches common TN calendars). */

export const GREGORIAN_MONTHS_TA = [
  "ஜனவரி",
  "பிப்ரவரி",
  "மார்ச்",
  "ஏப்ரல்",
  "மே",
  "ஜூன்",
  "ஜூலை",
  "ஆகஸ்ட்",
  "செப்டம்பர்",
  "அக்டோபர்",
  "நவம்பர்",
  "டிசம்பர்",
] as const;

export const GREGORIAN_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const WEEKDAYS_TA = [
  "ஞாயிறு",
  "திங்கள்",
  "செவ்வாய்",
  "புதன்",
  "வியாழன்",
  "வெள்ளி",
  "சனி",
] as const;

export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const KADAISI_VELLI_LABEL = "கடைசி வெள்ளி பூஜை";

/** Order starts at சித்திரை (Tamil New Year ~ Apr 14). */
export const TAMIL_MONTH_DEFS = [
  { name: "சித்திரை", days: 31 },
  { name: "வைகாசி", days: 31 },
  { name: "ஆனி", days: 32 },
  { name: "ஆடி", days: 31 },
  { name: "ஆவணி", days: 31 },
  { name: "புரட்டாசி", days: 31 },
  { name: "ஐப்பசி", days: 30 },
  { name: "கார்த்திகை", days: 30 },
  { name: "மார்கழி", days: 29 },
  { name: "தை", days: 30 },
  { name: "மாசி", days: 29 },
  { name: "பங்குனி", days: 30 },
] as const;

function atNoon(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function dayIndex(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(a: Date, b: Date): number {
  return Math.round((dayIndex(a) - dayIndex(b)) / 86_400_000);
}

/** Tamil New Year / சித்திரை 1 for the cycle containing `date`. */
function chithiraiStartFor(date: Date): Date {
  const d = startOfDay(date);
  const candidate = atNoon(d.getFullYear(), 3, 14); // Apr 14
  if (dayIndex(d) >= dayIndex(candidate)) return candidate;
  return atNoon(d.getFullYear() - 1, 3, 14);
}

export type TamilDateParts = {
  day: number;
  monthName: string;
  monthIndex: number;
  monthStart: Date;
  monthEnd: Date; // inclusive
};

export function getTamilDateParts(date: Date): TamilDateParts {
  const d = startOfDay(date);
  let cursor = chithiraiStartFor(d);

  for (let i = 0; i < TAMIL_MONTH_DEFS.length; i += 1) {
    const def = TAMIL_MONTH_DEFS[i];
    const end = addDays(cursor, def.days - 1);
    if (dayIndex(d) >= dayIndex(cursor) && dayIndex(d) <= dayIndex(end)) {
      return {
        day: diffDays(d, cursor) + 1,
        monthName: def.name,
        monthIndex: i,
        monthStart: cursor,
        monthEnd: end,
      };
    }
    cursor = addDays(end, 1);
  }

  // After Panguni → next Chithirai (should be covered by next year's cycle)
  const next = atNoon(chithiraiStartFor(d).getFullYear() + 1, 3, 14);
  return {
    day: diffDays(d, next) + 1,
    monthName: "சித்திரை",
    monthIndex: 0,
    monthStart: next,
    monthEnd: addDays(next, 30),
  };
}

export function getTamilMonthName(date: Date): string {
  return getTamilDateParts(date).monthName;
}

export function getTamilMonthsInGregorianMonth(year: number, month: number): string[] {
  const names: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const name = getTamilDateParts(atNoon(year, month, day)).monthName;
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

export function getLastFridayOfTamilMonthContaining(date: Date): Date {
  const { monthStart, monthEnd } = getTamilDateParts(date);
  let cursor = monthEnd;
  while (dayIndex(cursor) >= dayIndex(monthStart)) {
    if (cursor.getDay() === 5) return cursor;
    cursor = addDays(cursor, -1);
  }
  return monthStart;
}

export function isKadaisiVelli(date: Date): boolean {
  if (date.getDay() !== 5) return false;
  const last = getLastFridayOfTamilMonthContaining(date);
  return dayIndex(startOfDay(date)) === dayIndex(last);
}

export type TamilMonthPooja = {
  monthIndex: number;
  monthName: string;
  monthStart: Date;
  monthEnd: Date;
  poojaDate: Date;
};

/** Twelve Tamil months for the cycle whose சித்திரை 1 is Apr 14 of `chithiraiYear`. */
export function getTamilYearPoojas(chithiraiYear: number): TamilMonthPooja[] {
  let cursor = atNoon(chithiraiYear, 3, 14);
  return TAMIL_MONTH_DEFS.map((def, monthIndex) => {
    const monthStart = cursor;
    const monthEnd = addDays(cursor, def.days - 1);
    const poojaDate = getLastFridayOfTamilMonthContaining(monthStart);
    cursor = addDays(monthEnd, 1);
    return {
      monthIndex,
      monthName: def.name,
      monthStart,
      monthEnd,
      poojaDate,
    };
  });
}

/** Tamil cycle year label, e.g. 2026 → "2026–27". */
export function tamilCycleLabel(chithiraiYear: number): string {
  const next = String(chithiraiYear + 1).slice(-2);
  return `${chithiraiYear}–${next}`;
}

/** Gregorian year of the சித்திரை 1 that starts the current Tamil cycle. */
export function currentChithiraiYear(today: Date = new Date()): number {
  const y = today.getFullYear();
  const chithirai = atNoon(y, 3, 14);
  return dayIndex(startOfDay(today)) >= dayIndex(chithirai) ? y : y - 1;
}

/** Next `count` கடைசி வெள்ளி dates from today (inclusive), auto-advancing by calendar. */
export function getUpcomingKadaisiPoojas(
  today: Date = new Date(),
  count = 2,
): TamilMonthPooja[] {
  const todayKey = toDateKey(today);
  const startYear = currentChithiraiYear(today);
  const pool: TamilMonthPooja[] = [];

  for (let offset = 0; offset < 3 && pool.length < count; offset += 1) {
    for (const month of getTamilYearPoojas(startYear + offset)) {
      if (toDateKey(month.poojaDate) >= todayKey) {
        pool.push(month);
        if (pool.length >= count) break;
      }
    }
  }

  return pool;
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1, 12, 0, 0, 0);
}

export function clampMonth(date: Date, min: Date, max: Date): Date {
  const value = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
  if (dayIndex(value) < dayIndex(min)) {
    return new Date(min.getFullYear(), min.getMonth(), 1, 12, 0, 0, 0);
  }
  if (dayIndex(value) > dayIndex(max)) {
    return new Date(max.getFullYear(), max.getMonth(), 1, 12, 0, 0, 0);
  }
  return value;
}

export function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = atNoon(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(atNoon(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
