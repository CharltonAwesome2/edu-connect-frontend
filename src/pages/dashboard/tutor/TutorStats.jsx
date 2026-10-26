import { CalendarClock, Star, UserRoundCheck } from "lucide-react";
import { StatCard } from "@components/ui";

export default function TutorStats({ pendingCount, scheduledCount, subjectCount, completedCount }) {
  return (
    <div className="stats-grid">
      <StatCard icon={<CalendarClock />} label="Pending requests" value={pendingCount} tone="amber" />
      <StatCard icon={<CalendarClock />} label="Scheduled sessions" value={scheduledCount} />
      <StatCard icon={<UserRoundCheck />} label="Subjects taught" value={subjectCount} tone="violet" />
      <StatCard icon={<Star />} label="Completed sessions" value={completedCount} tone="green" />
    </div>
  );
}