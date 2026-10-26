import { Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Field, Loading, Notice, PageHeader } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { users } from "@api";
import { useNotice } from "@hooks/useNotice";

export default function Profile() {
  const { user, role } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  useEffect(() => {
    (async () => {
      try {
        const fresh = await users.byId(user.userId);
        setForm({
          name: fresh.name ?? "",
          surname: fresh.surname ?? "",
          email: fresh.email ?? "",
          contactNumber: fresh.contactNumber ?? "",
          studentNumber: fresh.studentNumber ?? "",
        });
      } catch (cause) { showError(cause.message); }
      finally { setLoading(false); }
    })();
    /* eslint-disable-next-line */
  }, [user.userId]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updated = await users.update({ ...user, ...form });
      // AuthContext should refresh the local user; if it exposes a `refresh`, call it:
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:refresh", { detail: updated }));
      }
      showSuccess("Profile saved.");
    } catch (cause) { showError(cause.message); }
    finally { setBusy(false); }
  };

  if (loading || !form) return <Loading label="Loading your profile" />;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Keep your contact details up to date."
        action={
          (role === "tutor" || role === "both")
            ? <Link to="/tutor" className="button button-secondary"><UserRound size={17} /> Tutor profile</Link>
            : undefined
        }
      />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

      <Card>
        <form className="stack-form" onSubmit={save}>
          <div className="form-grid two">
            <Field label="Name">
              <input value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} required />
            </Field>
            <Field label="Surname">
              <input value={form.surname}
                onChange={(e) => setForm((c) => ({ ...c, surname: e.target.value }))} required />
            </Field>
          </div>
          <Field label="Email" hint="Email cannot be changed here">
            <input value={form.email} disabled />
          </Field>
          <div className="form-grid two">
            <Field label="Contact number">
              <input value={form.contactNumber}
                onChange={(e) => setForm((c) => ({ ...c, contactNumber: e.target.value }))} />
            </Field>
            <Field label="Student number">
              <input value={form.studentNumber}
                onChange={(e) => setForm((c) => ({ ...c, studentNumber: e.target.value }))} />
            </Field>
          </div>
          <button className="button button-primary" disabled={busy}>
            <Save size={18} /> {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      </Card>
    </>
  );
}