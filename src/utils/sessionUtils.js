export const isUpcoming = (s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS";
export const isCompleted = (s) => s.status === "COMPLETED";

export const sortByStartTime = (list) =>
  [...list].sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));

export const durationMinutes = (s) =>
  Math.round((new Date(s.endTime) - new Date(s.startTime)) / 60000);