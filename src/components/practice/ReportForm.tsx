"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitReportAction } from "@/actions/practice";
import { FormMessage, SelectField, SubmitButton, TextArea, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { SEVERITIES, SEVERITY_HELP, EVIDENCE } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";

const initial: FormState = {};
const FIELDS = ["title", "description", "steps", "expected", "actual", "severity", "environment"] as const;

function detectEnvironment() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "";
  return `${browser}${os ? ` on ${os}` : ""}`;
}

export function ReportForm(props: { attemptId: string; requireSeverity: boolean }) {
  const [round, setRound] = useState(0);
  return <ReportFormInner key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function ReportFormInner({ attemptId, requireSeverity, onReset }: { attemptId: string; requireSeverity: boolean; onReset: () => void }) {
  const t = useT();
  const [state, action] = useActionState(submitReportAction, initial);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [formKey, setFormKey] = useState(0);
  const storeKey = `tirat-draft-${attemptId}`;

  // Restore a saved draft (survives validation errors, refreshes and dropped connections).
  useEffect(() => {
    let saved: Record<string, string> = {};
    try {
      saved = JSON.parse(localStorage.getItem(storeKey) ?? "{}");
    } catch {}
    setDraft({ environment: detectEnvironment(), ...saved });
    setFormKey((k) => k + 1);
  }, [storeKey]);

  useEffect(() => {
    if (state.ok) {
      try {
        localStorage.removeItem(storeKey);
      } catch {}
    }
  }, [state.ok, storeKey]);

  function saveDraft(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const f of FIELDS) next[f] = String(fd.get(f) ?? "");
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch {}
  }

  if (state.ok) {
    return (
      <div className="rounded-[28px] bg-ok-soft p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-ok" aria-hidden />
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{t("Your bug report has been submitted.")}</h3>
        <p className="mt-2 text-ink-2">{t("Your findings have been saved for review.")}</p>
        <p className="mt-3 text-sm text-muted">
          {t("Report ID")}: <span className="font-mono font-medium text-ink">TQ-{state.data?.id}</span>
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={onReset}>{t("Continue Testing")}</Button>
        </div>
      </div>
    );
  }

  const e = state.errors ?? {};
  const v = { ...draft, ...(state.values ?? {}) };

  return (
    <form key={formKey} action={action} onChange={saveDraft} noValidate className="grid gap-5">
      <input type="hidden" name="attemptId" value={attemptId} />
      <FormMessage state={state} />
      <TextField label="Bug Title" name="title" placeholder="Describe the problem in one specific sentence" defaultValue={v.title} error={e.title} maxLength={150} />
      <TextArea label="Description" name="description" placeholder="Optional context that helps explain the issue" defaultValue={v.description} className="min-h-24" />
      <TextArea
        label="Steps to Reproduce"
        name="steps"
        placeholder={"1. Open the page\n2. Enter …\n3. Click …"}
        hint="Put each action on its own line so anyone can repeat it."
        defaultValue={v.steps}
        error={e.steps}
        className="min-h-36"
      />
      <TextArea label="Expected Result" name="expected" placeholder="What should have happened?" defaultValue={v.expected} error={e.expected} className="min-h-24" />
      <TextArea label="Actual Result" name="actual" placeholder="What actually happened?" defaultValue={v.actual} error={e.actual} className="min-h-24" />
      {requireSeverity ? (
        <SelectField
          label="Severity"
          name="severity"
          defaultValue={v.severity ?? ""}
          error={e.severity}
          hint="Pick the level that matches the impact on the user."
        >
          <option value="">{t("Select severity…")}</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {t(s[0] + s.slice(1).toLowerCase())} — {t(SEVERITY_HELP[s])}
            </option>
          ))}
        </SelectField>
      ) : null}
      <TextField label="Environment" name="environment" defaultValue={v.environment} hint="Browser and device where you saw the problem." maxLength={200} />
      <TextField
        label="Screenshot or Evidence"
        name="evidence"
        type="file"
        accept={Object.keys(EVIDENCE.types).join(",")}
        hint="Optional. PNG, JPG or WebP, up to 2 MB."
        error={e.evidence}
        className="file:mr-3 file:rounded-full file:border-0 file:bg-chip file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      <SubmitButton pendingText="Submitting…" className="w-full sm:w-auto sm:self-start">
        Submit Bug Report
      </SubmitButton>
    </form>
  );
}
