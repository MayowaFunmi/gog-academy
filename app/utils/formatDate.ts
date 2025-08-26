import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
  addDays,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { parseISO } from "date-fns/parseISO";

export interface CourseDateStatus {
  isCurrent: boolean
  isFuture: boolean
  isPast: boolean
}

export const calculateDuration = (startDate: string, endDate: string) => {
  if (startDate && endDate) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const hours = differenceInHours(end, start);
    const days = differenceInDays(end, start);
    const weeks = differenceInWeeks(end, start);
    const months = differenceInMonths(end, start);
    const years = differenceInYears(end, start);

    let durationText = "";
    if (years >= 1) {
      durationText = `${years} year${years > 1 ? "s" : ""}`;
    } else if (months >= 1) {
      durationText = `${months} month${months > 1 ? "s" : ""}`;
    } else if (weeks >= 1) {
      durationText = `${weeks} week${weeks > 1 ? "s" : ""}`;
    } else if (days >= 1) {
      durationText = `${days} day${days > 1 ? "s" : ""}`;
    } else {
      durationText = `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return durationText;
  }
};

export const calculateWeeks = (startDate: string, endDate: string) => {
  if (startDate && endDate) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const weeks = differenceInWeeks(end, start) + 1;
    return weeks > 0 ? `${weeks} week${weeks > 1 ? "s" : ""}` : "Less than a week";
  }
  return "Invalid date range";
};

export function getDateStatus(startDate: string, endDate: string): CourseDateStatus {
  const now = new Date();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  return {
    isCurrent: now >= start && now <= end,
    isFuture: now < start,
    isPast: now > end,
  };
}

export function formatDateRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameYear) {
    return `${format(start, "MMMM d")} – ${format(end, "MMMM d, yyyy")}`;
  }

  return `${format(start, "MMMM d, yyyy")} – ${format(end, "MMMM d, yyyy")}`;
}

/**
 * Returns a Date object for a specific day in the week with a specific time.
 * @param weekStartDate - Date object for the start of the week (e.g., Sunday midnight)
 * @param dayOfWeek - Offset from week start (0=Sunday, 1=Monday, ...)
 * @param hour - Hour of the day (0-23)
 * @param minute - Minute of the hour (0-59)
 * @param second - Second of the minute (0-59)
 * @param millisecond - Millisecond of the second (0-999)
 */
export function getDayTime(
  weekStartDate: Date,
  dayOfWeek: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  const dateForDay = addDays(weekStartDate, dayOfWeek);
  return setMilliseconds(
    setSeconds(
      setMinutes(
        setHours(dateForDay, hour),
        minute
      ),
      second
    ),
    millisecond
  );
}

// Specific helpers for start & end of day
export function getDayStartTime(
  weekStartDate: Date,
  dayOfWeek: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  return getDayTime(weekStartDate, dayOfWeek, hour, minute, second, millisecond);
}

export function getDayEndTime(
  weekStartDate: Date,
  dayOfWeek: number,
  hour = 23,
  minute = 59,
  second = 0,
  millisecond = 0
) {
  return getDayTime(weekStartDate, dayOfWeek, hour, minute, second, millisecond);
}

// const weekStart = new Date("2025-07-06T00:00:00.000Z"); // Sunday midnight

// // Tuesday midnight
// console.log(getDayStartTime(weekStart, 2).toISOString()); 
// // "2025-07-08T00:00:00.000Z"

// // Tuesday at 9:30 AM
// console.log(getDayStartTime(weekStart, 2, 9, 30).toISOString()); 
// // "2025-07-08T09:30:00.000Z"

// // Friday end time at 5:45 PM
// console.log(getDayEndTime(weekStart, 5, 17, 45).toISOString());
// // "2025-07-11T17:45:00.000Z"

export const addHour = (date: Date): Date => {
  date.setHours(date.getHours() + 1);
  return date;
};
export const removeHour = (date: Date): Date => {
  date.setHours(date.getHours() - 1);
  return date;
};