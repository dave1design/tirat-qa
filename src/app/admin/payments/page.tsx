import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { confirmPaymentAction, grantAccessAction, refundPaymentAction, rejectPaymentAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, Tag, input, labelCls } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Payments" };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("payments");
  const sp = await searchParams;
  const [payments, levels, sites] = await Promise.all([
    db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { name: true, email: true } } } }),
    db.level.findMany({ orderBy: { number: "asc" }, select: { id: true, name: true, number: true } }),
    db.practiceWebsite.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, levelId: true } }),
  ]);
  const targetName = (p: { levelId: string | null; websiteId: string | null }) =>
    p.websiteId ? sites.find((s) => s.id === p.websiteId)?.name : levels.find((l) => l.id === p.levelId) ? `Level ${levels.find((l) => l.id === p.levelId)!.number}` : "—";
  const pending = payments.filter((p) => p.status === "PENDING");
  const rest = payments.filter((p) => p.status !== "PENDING");

  return (
    <>
      <AdminHeading title="Payments" />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="grid gap-6">
        <Panel title={`Pending confirmation (${pending.length})`}>
          {pending.length === 0 ? (
            <p className="text-muted">No payments are waiting.</p>
          ) : (
            <ul className="divide-y divide-line">
              {pending.map((p) => (
                <li key={p.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-medium">{p.user.name} <span className="font-normal text-muted">· {p.user.email}</span></p>
                    <p className="text-sm text-muted">
                      {targetName(p)} · {p.amountEtb} {p.currency} · ref <span className="font-mono">{p.reference}</span> · {formatDateTime(p.createdAt)}
                    </p>
                    {p.note && <p className="mt-1 text-sm">“{p.note}”</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={confirmPaymentAction.bind(null, p.id)}>
                      <ConfirmButton variant="dark" message={`Confirm ${p.amountEtb} ETB from ${p.user.email} (ref ${p.reference}) and grant access?`}>Confirm &amp; grant access</ConfirmButton>
                    </form>
                    <form action={rejectPaymentAction.bind(null, p.id)} className="flex gap-2">
                      <input name="note" placeholder="Reason (optional)" className={`${input} !w-40`} aria-label="Rejection reason" />
                      <Button type="submit" variant="light" size="sm">Reject</Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Grant access manually">
          <form action={grantAccessAction} className="flex flex-wrap items-end gap-3">
            <label className={labelCls}>
              Learner email
              <input name="email" type="email" required className={input} placeholder="learner@example.com" />
            </label>
            <label className={labelCls}>
              Access to
              <select name="target" required className={input}>
                {levels.map((l) => <option key={l.id} value={`level:${l.id}`}>Level {l.number} — {l.name} (all websites)</option>)}
                {sites.map((s) => <option key={s.id} value={`website:${s.id}`}>{s.name}</option>)}
              </select>
            </label>
            <Button type="submit" size="sm">Grant access</Button>
          </form>
        </Panel>

        <Panel title="History">
          {rest.length === 0 ? (
            <p className="text-muted">No confirmed, failed or refunded payments yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {rest.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[15px]">
                  <div>
                    <p className="font-medium">{p.user.email}</p>
                    <p className="text-sm text-muted">{targetName(p)} · {p.amountEtb} {p.currency} · ref <span className="font-mono">{p.reference}</span> · {formatDateTime(p.confirmedAt ?? p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag tone={p.status === "CONFIRMED" ? "green" : p.status === "REFUNDED" ? "amber" : "red"}>{p.status.toLowerCase()}</Tag>
                    {p.status === "CONFIRMED" && (
                      <form action={refundPaymentAction.bind(null, p.id)}>
                        <ConfirmButton message={`Record a refund of ${p.amountEtb} ETB and revoke access for ${p.user.email}?`}>Refund</ConfirmButton>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
