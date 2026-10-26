import { Star } from "lucide-react";
import { formatDate } from "@components/ui";

export default function TutorReviewsList({ reviews }) {
  if (!reviews.length) return <p className="muted">No reviews yet.</p>;
  return (
    <div className="review-list">
      {reviews.slice(0, 5).map((r) => (
        <blockquote key={r.tutorReviewId}>
          <div>{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} />)}</div>
          <p>“{r.comment}”</p>
          {r.strengths && <small><b>Strengths:</b> {r.strengths}</small>}
          {r.improvements && <small><b>Could improve:</b> {r.improvements}</small>}
          <small>{formatDate(r.reviewedAt)}</small>
        </blockquote>
      ))}
    </div>
  );
}