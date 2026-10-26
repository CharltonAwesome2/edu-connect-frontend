import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, EmptyState, Loading, Notice, PageHeader, formatDate, money } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { invoices as invoiceApi, payments as paymentApi } from "@api";
import { useNotice } from "@hooks/useNotice";

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notice, clear, showError } = useNotice();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // A simple view: filter all invoices whose payment.session.student is me.
        // If backend returns too many, replace with a byStudent endpoint later.
        const all = await invoiceApi.all();
        const mine = all.filter((inv) =>
          inv.payment?.session?.student?.userId === user.userId
        );
        setInvoices(mine);
      } catch (cause) { showError(cause.message); }
      finally { setLoading(false); }
    })();
  }, [user.userId, showError]);

  if (loading) return <Loading label="Loading invoices" />;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Invoices"
        description="Your billing history."
      />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

      <Card>
        {invoices.length === 0 ? (
          <EmptyState title="No invoices" text="Invoices issued for your payments will appear here." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th><th>Issued</th><th>Due</th><th>Amount</th><th />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td><b>{inv.invoiceNumber}</b></td>
                    <td>{formatDate(inv.issuedDate)}</td>
                    <td>{formatDate(inv.dueDate)}</td>
                    <td>{money(inv.totalAmount ?? inv.payment?.amount)}</td>
                    <td>
                      <button className="button button-ghost"
                        onClick={() => {
                          // Trigger a download if the backend exposes one; otherwise open the payment page.
                          window.location.href = `/api/invoice/read/${inv.invoiceId}`;
                        }}>
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
    </>
  );
}