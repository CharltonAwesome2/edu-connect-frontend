import { useEffect, useState } from "react";
import { Card, EmptyState, Loading, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";
import { reports as reportApi } from "@api";
import { useNotice } from "@hooks/useNotice";

const STATUSES = ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"];

export default function AdminReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try { setItems(await reportApi.all()); }
    catch (cause) { showError(cause.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const setStatus = async (id, status) => {
    try {
      await reportApi.updateStatus(id, status);
      showSuccess(`Report #${id} → ${status}.`);
      await load();
    } catch (cause) { showError(cause.message); }
  };

  if (loading) return <Loading label="Loading reports" />;

  return (
    <>
      <PageHeader eyebrow="Moderation" title="Reports queue" description="Resolve user reports." />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}
      <Card>
        {items.length === 0
          ? <EmptyState title="No reports" text="All clean." />
          : <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Reporter</th><th>Against</th><th>Reason</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.reportId}>
                      <td>{r.reportId}</td>
                      <td>#{r.reporter?.userId}</td>
                      <td>#{r.reportedUser?.userId}</td>
                      <td>{r.reason}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <select
                          value={r.status}
                          onChange={(e) => setStatus(r.reportId, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </Card>
    </>
  );
}