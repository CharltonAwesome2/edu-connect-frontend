import { useState } from "react";
import { Star } from "lucide-react";
import { Field, Modal } from "@components/ui";

export default function ReviewTutorModal({ session, busy, onClose, onSubmit }) {
  const [review, setReview] = useState({
    rating: 5, comment: "", strengths: "", improvements: "", isPublic: true,
  });
  const submit = (e) => {
    e.preventDefault();
    onSubmit(review);
  };

  return (
    <Modal title="Review your tutor" onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Rating">
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                type="button"
                key={v}
                className={v <= review.rating ? "active" : ""}
                onClick={() => setReview((c) => ({ ...c, rating: v }))}
              >
                <Star />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Your review">
          <textarea
            rows={3}
            required
            value={review.comment}
            onChange={(e) => setReview((c) => ({ ...c, comment: e.target.value }))}
          />
        </Field>
        <Field label="Strengths">
          <input
            value={review.strengths}
            onChange={(e) => setReview((c) => ({ ...c, strengths: e.target.value }))}
          />
        </Field>
        <Field label="Could improve">
          <input
            value={review.improvements}
            onChange={(e) => setReview((c) => ({ ...c, improvements: e.target.value }))}
          />
        </Field>
        <label className="check-row">
          <input
            type="checkbox"
            checked={review.isPublic}
            onChange={(e) => setReview((c) => ({ ...c, isPublic: e.target.checked }))}
          />
          <span>Share this review publicly</span>
        </label>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </Modal>
  );
}