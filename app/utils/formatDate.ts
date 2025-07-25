import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { parseISO } from "date-fns/parseISO";

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
