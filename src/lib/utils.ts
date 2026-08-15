import { formatDistanceToNowStrict, format } from "date-fns";

export function timeAgo(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

export function longDate(date: Date | string) {
  return format(new Date(date), "d MMMM yyyy, h:mm a");
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
