import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, EmptyState, Loading, Notice, PageHeader, formatDate } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { notifications as notificationApi } from "@api";

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const mine = await notificationApi.byUserId(user.userId);
      mine.sort((a, b) => String(b.notificationId).localeCompare(String(a.notificationId)));
      setItems(mine);
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); /* eslint-disable-next-line */
  }, []);

  const markRead = async (n) => {
    if (n.isRead) return;
    setBusy(true);
    try {
      await notificationApi.markRead(n.notificationId);
      setItems((list) => list.map((x) => (x.notificationId === n.notificationId ? { ...x, isRead: true } : x)));
      window.dispatchEvent(new CustomEvent("notifications:refresh"));
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  const markAllRead = async () => {
    if (!items.some((n) => !n.isRead)) return;
    setBusy(true);
    try {
      await notificationApi.markAllRead(user.userId);
      setItems((list) => list.map((n) => ({ ...n, isRead: true })));
      window.dispatchEvent(new CustomEvent("notifications:refresh"));
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Loading notifications" />;

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Notifications"
        description="Updates about your bookings, sessions, and reviews."
        action={
          unreadCount > 0 ? (
            <button className="button button-secondary" onClick={markAllRead} disabled={busy}>
              <CheckCheck size={18} /> Mark all read
            </button>
          ) : undefined
        }
      />

      {notice && (
        <Notice kind={notice.kind} onClose={() => setNotice(null)}>
          {notice.text}
        </Notice>
      )}

      {items.length === 0 ? (
        <Card>
          <EmptyState title="No notifications yet" text="Activity on your account will show up here." />
        </Card>
      ) : (
        <div className="notification-list">
          {items.map((n) => (
            <button
              key={n.notificationId}
              className={`notification-item ${n.isRead ? "" : "unread"}`}
              onClick={() => markRead(n)}
            >
              <span className="notification-dot" />
              <span>
                <strong>{n.title}</strong>
                <small>{n.message}</small>
                <time>{n.readAt ? formatDate(n.readAt) : "Unread"}</time>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
