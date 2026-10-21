import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { resolveMessageAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, Tag } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("messages");
  const sp = await searchParams;
  const messages = await db.contactMessage.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 100 });
  return (
    <>
      <AdminHeading title="Messages" />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="grid gap-4">
        {messages.length === 0 && <Panel><p className="text-muted">No messages yet.</p></Panel>}
        {messages.map((m) => (
          <Panel key={m.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{m.subject}</p>
                <p className="text-sm text-muted">
                  {m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a> · {formatDateTime(m.createdAt)}
                </p>
              </div>
              <Tag tone={m.status === "NEW" ? "blue" : "green"}>{m.status.toLowerCase()}</Tag>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[15px]">{m.message}</p>
            <form action={resolveMessageAction.bind(null, m.id, m.status === "NEW" ? "RESOLVED" : "NEW")} className="mt-4">
              <Button type="submit" variant="light" size="sm">{m.status === "NEW" ? "Mark resolved" : "Reopen"}</Button>
            </form>
          </Panel>
        ))}
      </div>
    </>
  );
}
