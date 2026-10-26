import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, EmptyState, Loading, Modal, Notice, PageHeader, StatusBadge, formatDate, money } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { invoices as invoiceApi } from "@api";
import { useNotice } from "@hooks/useNotice";

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notice, clear, showError } = useNotice();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const mine = await invoiceApi.byStudentId(user.userId);
        setInvoices(mine);
      } catch (cause) {
        showError(cause.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.userId]);

  if (loading) return <Loading label="Loading invoices" />;

  return (
    <>
      <PageHeader eyebrow="Account" title="Invoices" description="Your billing history." />
      {notice && (
        <Notice kind={notice.kind} onClose={clear}>
          {notice.text}
        </Notice>
      )}

      <Card>
        {invoices.length === 0 ? (
          <EmptyState title="No invoices" text="Invoices appear here once a tutor marks a session complete." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td>
                      <b>{inv.invoiceNumber}</b>
                    </td>
                    <td>{formatDate(inv.issuedDate)}</td>
                    <td>{formatDate(inv.dueDate)}</td>
                    <td>{money(inv.totalAmount)}</td>
                    <td>
                      <StatusBadge status={inv.payment?.status ?? "ISSUED"} />
                    </td>
                    <td>
                      <button className="button button-ghost" onClick={() => setSelected(inv)}>
                        <FileText size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <Modal title={`Invoice ${selected.invoiceNumber}`} onClose={() => setSelected(null)}>
          <div className="stack-form">
            <div className="invoice-meta">
              <div>
                <span className="eyebrow">Issued</span>
                <p>{formatDate(selected.issuedDate)}</p>
              </div>
              <div>
                <span className="eyebrow">Due</span>
                <p>{formatDate(selected.dueDate)}</p>
              </div>
              <div>
                <span className="eyebrow">Status</span>
                <p>
                  <StatusBadge status={selected.payment?.status ?? "ISSUED"} />
                </p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Tutoring session #{selected.payment?.session?.tutoringSessionId ?? "—"}
                    {selected.payment?.session?.startTime && (
                      <>
                        <br />
                        <small>{formatDate(selected.payment.session.startTime)}</small>
                      </>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>{money(selected.payment?.amount ?? selected.totalAmount)}</td>
                </tr>
                <tr>
                  <td>
                    <small>Tax</small>
                  </td>
                  <td style={{ textAlign: "right" }}>{money(selected.taxAmount ?? 0)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th style={{ textAlign: "right" }}>{money(selected.totalAmount)}</th>
                </tr>
              </tfoot>
            </table>

            {selected.payment?.status === "PAID" && (
              <p className="muted">
                Paid on {formatDate(selected.payment.paidAt)} via {selected.payment.paymentMethod ?? "—"}.
                {selected.payment.transactionReference && <> Reference: {selected.payment.transactionReference}.</>}
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
