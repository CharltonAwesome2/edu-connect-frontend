import { Wallet } from "lucide-react";
import { Card, EmptyState, StatusBadge, formatDate, money } from "@components/ui";

export default function TutorEarningsCard({ payments }) {
  const paid = payments.filter((p) => p.status === "PAID");
  const pending = payments.filter((p) => p.status === "PENDING");

  const totalEarned = paid.reduce(
    (sum, p) => sum + Number(p.tutorEarnings ?? 0),
    0
  );
  const totalPending = pending.reduce(
    (sum, p) => sum + Number(p.tutorEarnings ?? 0),
    0
  );

  return (
    <Card>
      <div className="card-heading">
        <div>
          <span className="eyebrow">Earnings</span>
          <h2>Payments from students</h2>
        </div>
        <div className="earnings-summary">
          <div>
            <small>Received</small>
            <strong>{money(totalEarned)}</strong>
          </div>
          {totalPending > 0 && (
            <div>
              <small>Awaiting</small>
              <strong>{money(totalPending)}</strong>
            </div>
          )}
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          text="Payments will appear here once students settle invoices for your completed sessions."
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Your earnings</th>
                <th>Status</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentId}>
                  <td>#{p.session?.tutoringSessionId ?? "—"}</td>
                  <td>
                    {p.session?.student?.name
                      ? `${p.session.student.name} ${p.session.student.surname ?? ""}`.trim()
                      : `Student #${p.session?.student?.userId ?? "?"}`}
                  </td>
                  <td>{money(p.amount)}</td>
                  <td><b>{money(p.tutorEarnings)}</b></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{formatDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}