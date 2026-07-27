import { toDateKey } from "./tamilCalendar";

export type MarkCategory = "holiday" | "festival" | "muhurtha" | "temple";

export type CalendarMark = {
  id: string;
  titleTa: string;
  category: MarkCategory;
  icon: string;
  color: string;
};

type RecurringMark = Omit<CalendarMark, "id"> & {
  month: number; // 1-12
  day: number;
  idBase: string;
};

/** Fixed solar / civic recurring marks every year */
const RECURRING: RecurringMark[] = [
  { idBase: "new-year", month: 1, day: 1, titleTa: "ஆங்கிலப் புத்தாண்டு", category: "holiday", icon: "🎉", color: "#4f46e5" },
  { idBase: "pongal", month: 1, day: 14, titleTa: "தை பொங்கல்", category: "festival", icon: "🥣", color: "#ea580c" },
  { idBase: "mattu-pongal", month: 1, day: 15, titleTa: "மாட்டுப் பொங்கல்", category: "festival", icon: "🐄", color: "#c2410c" },
  { idBase: "kaanum-pongal", month: 1, day: 16, titleTa: "காணும் பொங்கல்", category: "festival", icon: "🌾", color: "#b45309" },
  { idBase: "republic", month: 1, day: 26, titleTa: "குடியரசு தினம்", category: "holiday", icon: "🇮🇳", color: "#166534" },
  { idBase: "puthandu", month: 4, day: 14, titleTa: "தமிழ் புத்தாண்டு", category: "festival", icon: "🪔", color: "#b45309" },
  { idBase: "may-day", month: 5, day: 1, titleTa: "மே தினம்", category: "holiday", icon: "🛠️", color: "#1d4ed8" },
  { idBase: "aadi-perukku", month: 7, day: 18, titleTa: "ஆடிப் பெருக்கு", category: "festival", icon: "🌊", color: "#0369a1" },
  { idBase: "independence", month: 8, day: 15, titleTa: "சுதந்திர தினம்", category: "holiday", icon: "🇮🇳", color: "#166534" },
  { idBase: "teachers", month: 9, day: 5, titleTa: "ஆசிரியர் தினம்", category: "holiday", icon: "📚", color: "#7c3aed" },
  { idBase: "gandhi", month: 10, day: 2, titleTa: "காந்தி ஜெயந்தி", category: "holiday", icon: "🕊️", color: "#166534" },
  { idBase: "childrens", month: 11, day: 14, titleTa: "குழந்தைகள் தினம்", category: "holiday", icon: "🎈", color: "#db2777" },
  { idBase: "christmas", month: 12, day: 25, titleTa: "கிறிஸ்துமஸ்", category: "holiday", icon: "🎄", color: "#15803d" },
];

/**
 * Movable India holidays + Tamil festivals + selected சுப முகூர்த்தம் days
 * for the calendar window (approx 2021–2031).
 */
const YEARLY: Record<number, Array<Omit<CalendarMark, "id"> & { date: string; idBase: string }>> = {
  2021: [
    { idBase: "holi", date: "2021-03-29", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2021-04-02", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2021-05-14", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2021-07-21", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2021-09-10", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2021-11-04", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2021-02-12", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2021-05-21", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
  ],
  2022: [
    { idBase: "holi", date: "2022-03-18", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2022-04-15", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2022-05-03", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2022-07-10", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2022-08-31", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2022-10-24", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2022-02-16", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2022-06-10", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
  ],
  2023: [
    { idBase: "holi", date: "2023-03-08", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2023-04-07", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2023-04-22", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2023-06-29", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2023-09-19", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2023-11-12", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2023-02-08", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2023-05-12", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
  ],
  2024: [
    { idBase: "holi", date: "2024-03-25", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2024-03-29", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2024-04-11", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2024-06-17", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2024-09-07", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2024-10-31", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2024-02-15", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2024-05-10", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2025: [
    { idBase: "holi", date: "2025-03-14", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2025-04-18", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2025-03-31", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2025-06-07", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2025-08-27", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "navaratri", date: "2025-09-22", titleTa: "நவராத்திரி தொடக்கம்", category: "festival", icon: "🌺", color: "#be185d" },
    { idBase: "vijayadashami", date: "2025-10-02", titleTa: "விஜயதசமி", category: "festival", icon: "🏹", color: "#b45309" },
    { idBase: "duwali", date: "2025-10-20", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "karthigai", date: "2025-12-04", titleTa: "கார்த்திகை தீபம்", category: "festival", icon: "🕯️", color: "#c2410c" },
    { idBase: "muhurtha-1", date: "2025-02-07", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2025-04-30", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2026: [
    { idBase: "thai-poosam", date: "2026-02-01", titleTa: "தை பூசம்", category: "festival", icon: "🛕", color: "#b45309" },
    { idBase: "maha-sivarathri", date: "2026-02-15", titleTa: "மகா சிவராத்திரி", category: "festival", icon: "🕉️", color: "#4338ca" },
    { idBase: "holi", date: "2026-03-03", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "panguni-uthiram", date: "2026-03-28", titleTa: "பங்குனி உத்திரம்", category: "festival", icon: "🌸", color: "#db2777" },
    { idBase: "good-friday", date: "2026-04-03", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2026-03-21", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "akshaya", date: "2026-04-19", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
    { idBase: "bakrid", date: "2026-05-27", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2026-09-14", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "navaratri", date: "2026-10-11", titleTa: "நவராத்திரி தொடக்கம்", category: "festival", icon: "🌺", color: "#be185d" },
    { idBase: "vijayadashami", date: "2026-10-20", titleTa: "விஜயதசமி", category: "festival", icon: "🏹", color: "#b45309" },
    { idBase: "duwali", date: "2026-11-08", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "karthigai", date: "2026-11-24", titleTa: "கார்த்திகை தீபம்", category: "festival", icon: "🕯️", color: "#c2410c" },
    { idBase: "muhurtha-1", date: "2026-01-24", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2026-02-18", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-3", date: "2026-06-05", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-4", date: "2026-12-09", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
  ],
  2027: [
    { idBase: "holi", date: "2027-03-22", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2027-03-26", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2027-03-10", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2027-05-17", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2027-09-04", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2027-10-29", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2027-02-12", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2027-05-01", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2028: [
    { idBase: "holi", date: "2028-03-11", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2028-04-14", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2028-02-27", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2028-05-05", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2028-08-23", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2028-10-17", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2028-02-04", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2028-04-19", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2029: [
    { idBase: "holi", date: "2029-03-01", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2029-03-30", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2029-02-15", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2029-04-24", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2029-09-11", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2029-11-05", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2029-01-26", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2029-05-08", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2030: [
    { idBase: "holi", date: "2030-03-20", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2030-04-19", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2030-02-05", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2030-04-13", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2030-09-01", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2030-10-26", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2030-02-14", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2030-04-27", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
  2031: [
    { idBase: "holi", date: "2031-03-09", titleTa: "ஹோலி", category: "festival", icon: "🎨", color: "#db2777" },
    { idBase: "good-friday", date: "2031-04-11", titleTa: "நல்ல வெள்ளி", category: "holiday", icon: "✝️", color: "#334155" },
    { idBase: "eid-fitr", date: "2031-01-25", titleTa: "ரம்ஜான்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "bakrid", date: "2031-04-03", titleTa: "பக்ரீத்", category: "holiday", icon: "🌙", color: "#0f766e" },
    { idBase: "vinayagar", date: "2031-08-21", titleTa: "விநாயகர் சதுர்த்தி", category: "festival", icon: "🐘", color: "#b45309" },
    { idBase: "duwali", date: "2031-11-14", titleTa: "தீபாவளி", category: "festival", icon: "🎆", color: "#ea580c" },
    { idBase: "muhurtha-1", date: "2031-02-07", titleTa: "சுப முகூர்த்தம்", category: "muhurtha", icon: "✨", color: "#ca8a04" },
    { idBase: "muhurtha-2", date: "2031-05-16", titleTa: "அட்சய திரிதீயா", category: "muhurtha", icon: "🪙", color: "#ca8a04" },
  ],
};

export function getMarksForDate(date: Date): CalendarMark[] {
  const key = toDateKey(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const marks: CalendarMark[] = [];

  for (const item of RECURRING) {
    if (item.month === month && item.day === day) {
      marks.push({
        id: `${item.idBase}-${year}`,
        titleTa: item.titleTa,
        category: item.category,
        icon: item.icon,
        color: item.color,
      });
    }
  }

  for (const item of YEARLY[year] ?? []) {
    if (item.date === key) {
      marks.push({
        id: `${item.idBase}-${year}`,
        titleTa: item.titleTa,
        category: item.category,
        icon: item.icon,
        color: item.color,
      });
    }
  }

  return marks;
}

export const CATEGORY_LABELS: Record<MarkCategory, string> = {
  holiday: "விடுமுறை",
  festival: "திருவிழா",
  muhurtha: "சுப முகூர்த்தம்",
  temple: "கோயில்",
};
