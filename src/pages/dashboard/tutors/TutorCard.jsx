import { Clock3, GraduationCap, Star, Users } from "lucide-react";
import { money } from "@components/ui";

export default function TutorCard({ tutor, onOpen }) {
  return (
    <article className="tutor-card">
      <div className="tutor-head">
        <div className="tutor-avatar">
          {tutor.user?.name?.[0] ?? ""}
          {tutor.user?.surname?.[0] ?? ""}
        </div>
        <div>
          <h2>
            {tutor.user?.name} {tutor.user?.surname}
          </h2>
          <span>
            <GraduationCap size={15} /> {tutor.isVerified ? "Verified tutor" : "Peer tutor"}
          </span>
        </div>
        <div className="rating">
          <Star size={16} /> {Number(tutor.averageRating ?? 0).toFixed(1)}
        </div>
      </div>
      <p>{tutor.bio}</p>
      <div className="tutor-facts">
        <span>
          <Users /> {tutor.yearsExperience ?? 0} years experience
        </span>
        <span>
          <Clock3 /> Flexible schedule
        </span>
      </div>
      <footer>
        <div>
          <strong>{money(tutor.hourlyRate)}</strong>
          <span>{Number(tutor.hourlyRate) === 0 ? "community support" : "per hour"}</span>
        </div>
        <button className="button button-secondary" onClick={() => onOpen(tutor)}>
          View & book
        </button>
      </footer>
    </article>
  );
}
