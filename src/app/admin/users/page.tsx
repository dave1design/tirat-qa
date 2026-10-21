import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { updateUserAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, Tag, input } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; ok?: string; error?: string }> }) {
  const me = await requireCapability("users");
  const sp = await searchParams;
  const users = await db.user.findMany({
    where: sp.q ? { OR: [{ email: { contains: sp.q } }, { name: { contains: sp.q } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, _count: { select: { attempts: true } } },
  });
  const isOwner = me.role === "OWNER";

  return (
    <>
      <AdminHeading title="Users" />
      <Flash ok={sp.ok} error={sp.error} />
      <form className="mb-6 flex gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search name or email" className={`${input} max-w-xs`} aria-label="Search users" />
        <Button type="submit" variant="light" size="sm">Search</Button>
      </form>
      <Panel>
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.id} className="grid gap-3 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="font-medium">{u.name} {u.status === "SUSPENDED" && <Tag tone="red">suspended</Tag>}</p>
                <p className="text-sm text-muted">{u.email} · joined {formatDate(u.createdAt)} · {u._count.attempts} attempts</p>
              </div>
              <form action={updateUserAction.bind(null, u.id)} className="flex flex-wrap items-center gap-2">
                <select name="role" defaultValue={u.role} disabled={!isOwner} className={`${input} !w-44`} aria-label={`Role for ${u.name}`}>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ").toLowerCase()}</option>)}
                </select>
                <select name="status" defaultValue={u.status} className={`${input} !w-36`} aria-label={`Status for ${u.name}`}>
                  <option value="ACTIVE">active</option>
                  <option value="SUSPENDED">suspended</option>
                </select>
                <Button type="submit" variant="light" size="sm">Save</Button>
              </form>
            </li>
          ))}
          {users.length === 0 && <li className="py-4 text-muted">No users match.</li>}
        </ul>
      </Panel>
      {!isOwner && <p className="mt-4 text-sm text-muted">Only the owner can change roles.</p>}
    </>
  );
}
