import { BookOpen, CalendarCheck2, CheckCircle2, Clock3 } from "lucide-react";
import { StatCard } from "@components/ui";

export default function StudentStats({ upcoming, completed, pendingCount, subjectCount }) {
  return (
    <div className="stats-grid">
      <StatCard icon={<CalendarCheck2 />} label="Upcoming sessions" value={upcoming} tone="violet" />
      <StatCard icon={<CheckCircle2 />} label="Completed sessions" value={completed} tone="green" />
      <StatCard icon={<Clock3 />} label="Pending requests" value={pendingCount} tone="amber" />
      <StatCard icon={<BookOpen />} label="Subjects available" value={subjectCount} />
    </div>
  );
}