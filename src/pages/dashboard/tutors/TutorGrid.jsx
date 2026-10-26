import { EmptyState, Loading } from "@components/ui";
import TutorCard from "./TutorCard";

export default function TutorGrid({ loading, tutors, onOpen }) {
  if (loading) return <Loading label="Finding tutors" />;
  if (tutors.length === 0) {
    return <EmptyState title="No tutors match these filters" text="Try another subject or a higher maximum rate." />;
  }
  return (
    <div className="tutor-grid">
      {tutors.map((t) => <TutorCard key={t.tutorProfileId} tutor={t} onOpen={onOpen} />)}
    </div>
  );
}