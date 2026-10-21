import { describe, expect, it } from "vitest";
import { sites } from "../../../prisma/seed-data";
import { matchReport, type RegistryBug } from "./match";
import { maxScoreFor, scoreAttempt, scoreQuality, scoreSeverity, countSteps, type ScorableReport } from "./score";
import { parseKeywordText, formatKeywordGroups, isValidBug } from "../keywords";
import { signUpSchema, bugReportSchema, loginSchema } from "../validation";
import { safeNext } from "../utils";

const registry = (slug: string): RegistryBug[] =>
  sites.find((s) => s.slug === slug)!.bugs.map((b) => ({ id: b.code, code: b.code, points: b.points, severity: b.severity, keywordGroups: b.keywordGroups }));

const report = (title: string, steps: string, expected: string, actual: string) => ({ title, steps, expected, actual, description: "" });

describe("matching against the seeded registries", () => {
  it("auto-matches a clear empty-password report", () => {
    const r = matchReport(
      report(
        "Login succeeds with an empty password",
        "1. Open the sign in page\n2. Enter demo@northwind.test\n3. Leave the password blank\n4. Click Sign in",
        "An error should say the password is required",
        "The user is logged in and sees the account page",
      ),
      registry("login-and-account-access"),
    );
    expect(r.verdict).toBe("MATCHED");
    expect(r.bug?.code).toBe("BUG-01");
  });

  it("matches the price-sort bug on the product listing", () => {
    const r = matchReport(
      report(
        "Sorting by price low to high gives the wrong order",
        "1. Open the products page\n2. Choose Price: Low to high",
        "Prices should be in numeric order, cheapest first",
        "$1,299 appears before $15 and $249 - looks sorted alphabetically instead of numerically",
      ),
      registry("product-listing"),
    );
    expect(r.verdict).toBe("MATCHED");
    expect(r.bug?.code).toBe("BUG-01");
  });

  it("matches the duplicate-email bug on registration", () => {
    const r = matchReport(
      report(
        "Duplicate email address is accepted",
        "1. Fill the form using taken@example.com\n2. Submit",
        "An error should say this email is already registered",
        "The account is created and a success message appears",
      ),
      registry("registration-form"),
    );
    expect(r.verdict).toBe("MATCHED");
    expect(r.bug?.code).toBe("BUG-05");
  });

  it("does not match an unrelated report", () => {
    const r = matchReport(
      report("The company logo looks a bit blurry", "1. Look at the logo", "It should be sharp", "It is slightly soft on my monitor"),
      registry("login-and-account-access"),
    );
    expect(r.verdict).toBe("UNSUPPORTED");
    expect(r.bug).toBeNull();
  });

  it("sends partial matches to human review", () => {
    const r = matchReport(
      report("Password field behaves oddly", "1. Open the login page\n2. Look at the password field", "It should work properly", "Something seems off with it"),
      registry("login-and-account-access"),
    );
    expect(["NEEDS_REVIEW", "UNSUPPORTED"]).toContain(r.verdict);
  });

  it("every seeded bug is publishable", () => {
    for (const s of sites) for (const b of s.bugs) expect(isValidBug(b)).toBe(true);
  });
});

describe("report quality rubric", () => {
  const base = { title: "Form accepts an invalid email address", steps: "1. Open form\n2. Type abc\n3. Submit", expected: "A validation message should appear", actual: "The form is submitted without any message", hasEvidence: true };
  it("gives full marks for a complete report", () => expect(scoreQuality(base).points).toBe(5));
  it("loses points for thin reports and explains why", () => {
    const q = scoreQuality({ ...base, title: "Bug", steps: "click it", hasEvidence: false });
    expect(q.points).toBeLessThan(3);
    expect(q.notes.length).toBeGreaterThan(1);
  });
  it("counts steps in numbered and line formats", () => {
    expect(countSteps("1. one\n2. two\n3. three")).toBe(3);
    expect(countSteps("open page, then click")).toBe(1);
  });
});

describe("severity accuracy", () => {
  it("scores exact, near and far", () => {
    expect(scoreSeverity("HIGH", "HIGH").points).toBe(2);
    expect(scoreSeverity("MEDIUM", "HIGH").points).toBe(1);
    expect(scoreSeverity("LOW", "CRITICAL").points).toBe(0);
    expect(scoreSeverity(null, "HIGH").points).toBe(0);
  });
});

describe("attempt scoring", () => {
  const matched = (pts: number): ScorableReport => ({ status: "MATCHED", matchedBugId: "x", bugPoints: pts, qualityPoints: 5, severityPoints: 2, pointsOverride: null });
  const max = maxScoreFor(Array(3).fill({ points: 10 }), true); // 3 * 17

  it("computes max score from the registry", () => expect(max).toBe(51));
  it("passes at 70% or more", () => {
    const s = scoreAttempt([matched(10), matched(10)], max); // 34/51 = 66.7%
    expect(s.passed).toBe(false);
    const t = scoreAttempt([matched(10), matched(10), matched(10)], max);
    expect(t.passed).toBe(true);
  });
  it("applies the published penalty only to unmatched reports and never goes below zero", () => {
    const s = scoreAttempt([{ status: "UNSUPPORTED", matchedBugId: null, bugPoints: 0, qualityPoints: 0, severityPoints: 0, pointsOverride: null }], max);
    expect(s.score).toBe(0);
    expect(s.penalty).toBe(1);
  });
  it("duplicates earn nothing and cost nothing", () => {
    const s = scoreAttempt([{ status: "DUPLICATE", matchedBugId: "x", bugPoints: 0, qualityPoints: 0, severityPoints: 0, pointsOverride: null }], max);
    expect(s.score).toBe(0);
    expect(s.penalty).toBe(0);
  });
  it("honours reviewer overrides and flags pending review", () => {
    const s = scoreAttempt([{ ...matched(10), pointsOverride: 3 }, { status: "NEEDS_REVIEW", matchedBugId: null, bugPoints: 0, qualityPoints: 0, severityPoints: 0, pointsOverride: null }], max);
    expect(s.score).toBe(3);
    expect(s.pendingReview).toBe(true);
  });
});

describe("registry keyword editing", () => {
  it("round-trips text and drops empty groups", () => {
    const groups = parseKeywordText("Empty | Blank\n\n  \nLogin|logged in");
    expect(groups).toEqual([["empty", "blank"], ["login", "logged in"]]);
    expect(parseKeywordText(formatKeywordGroups(groups))).toEqual(groups);
  });
});

describe("validation and redirects", () => {
  it("sign-up enforces password rules, matching confirmation and terms", () => {
    const ok = { name: "Test User", email: "A@B.com", password: "Passw0rdX", confirmPassword: "Passw0rdX", terms: "on" };
    expect(signUpSchema.safeParse(ok).success).toBe(true);
    expect(signUpSchema.safeParse({ ...ok, password: "short1", confirmPassword: "short1" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...ok, confirmPassword: "different1" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...ok, terms: "" }).success).toBe(false);
    expect(signUpSchema.parse(ok).email).toBe("a@b.com");
  });
  it("bug report requires fields and severity when configured", () => {
    const body = { title: "t", steps: "s", expected: "e", actual: "a", severity: "" };
    expect(bugReportSchema(true).safeParse(body).success).toBe(false);
    expect(bugReportSchema(false).safeParse(body).success).toBe(true);
    expect(bugReportSchema(true).safeParse({ ...body, severity: "HIGH" }).success).toBe(true);
  });
  it("login requires both fields", () => expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(false));
  it("safeNext only allows same-site relative paths", () => {
    expect(safeNext("/practice-lab")).toBe("/practice-lab");
    expect(safeNext("https://evil.com")).toBe("/dashboard");
    expect(safeNext("//evil.com")).toBe("/dashboard");
    expect(safeNext("/\\evil.com")).toBe("/dashboard");
  });
});
