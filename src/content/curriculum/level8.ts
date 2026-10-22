import { q, type Level } from "./types";

export const level8: Level = {
  n: 8,
  slug: "ci-cd-capstone-and-sdet",
  title: "CI/CD, Automation Capstone, and SDET Readiness",
  track: "Automation QA",
  goal: "Deliver a reproducible automation project and explain its design professionally.",
  prerequisites: "Level 7 completed.",
  outcome: "Run tests in CI, create reports, submit a maintainable codebase for expert review, and prepare for automation interviews.",
  deliverable: "A CI-enabled automation repository reviewed by experts.",
  milestone:
    "Open the starter project in a local IDE, implement the required tests, run them, include a README and evidence, and upload the repository URL or ZIP. A human expert runs or inspects the code in a controlled environment and returns criterion-level feedback.",
  interview: [
    "How do you choose what to automate?",
    "What belongs in a CI pipeline?",
    "How do you protect credentials in automation?",
    "Describe debugging a flaky test.",
    "Walk through your capstone architecture and trade-offs.",
  ],
  lessons: [
    {
      slug: "automation-strategy-and-api-tests",
      n: "8.1",
      title: "Automation strategy, API testing in code, and coverage design",
      minutes: 30,
      objectives: [
        "Choose automation targets based on risk, repeatability, stability, and cost.",
        "Test API contracts and business rules in code.",
        "Balance UI automation, API automation, and manual exploration.",
      ],
      notes:
        "Automation strategy starts with risk and value, not script count. Stable, repeated regression paths often suit automation. Rapidly changing, subjective, or one-time exploratory work may be more effective manually. API tests can cover business rules, authorization, error handling, and data validation quickly. UI tests verify important end-to-end journeys but often cost more to maintain. A balanced strategy uses the right layer for each risk. Automating a weak test case does not make it good: review test intent, isolation, data setup, assertions, diagnostics, and requirement coverage. Avoid duplicate coverage unless duplication protects an explicit risk or a distinct integration boundary.",
      example:
        "For a coupon, API tests cover discount rules and boundaries; a smaller UI suite verifies the shopper sees the correct amount and order confirmation.",
      diagram: {
        title: "Balanced test automation strategy",
        caption: "API checks, selected UI journeys, manual exploration, and coverage links to risk. Illustrative only.",
        alt: "Four connected boxes: API, UI, manual, coverage.",
        boxes: [
          { t: "API", d: "Fast contract and business-rule checks" },
          { t: "UI", d: "Selected high-value user journeys" },
          { t: "Manual", d: "Exploration and subjective checks" },
          { t: "Coverage", d: "Link each test to risk and requirement" },
        ],
      },
      lab: {
        title: "Automation-strategy lab",
        task: "Assign each scenario to the layer where it is most efficiently tested.",
        categories: ["Automate at API level", "Automate as a UI journey", "Keep manual / exploratory"],
        items: [
          { t: "Coupon discount rules and boundaries", c: 0 },
          { t: "The shopper sees the correct amount and order confirmation", c: 1 },
          { t: "A subjective first look at a brand-new design", c: 2 },
          { t: "Authorization and error responses", c: 0 },
          { t: "A key checkout journey run every release", c: 1 },
          { t: "A one-time exploratory investigation", c: 2 },
        ],
        takeaway: "Pick the cheapest layer that still protects the risk. UI automation is valuable but costly to maintain.",
        reflection: "Pick one scenario and justify the layer you chose by risk, frequency, stability and maintenance cost.",
      },
      video: {
        id: "0kWTkqEdSwU",
        title: "Playwright and TypeScript: updated supplementary tutorial",
        summary: "Automate by risk and value: API tests for rules, a smaller set of UI journeys, and manual exploration where judgment matters.",
      },
      quiz: [
        q("A strong automation candidate is:", ["A repeatable high-value regression with stable assertions", "A subjective one-time interview", "A frequently changing flow with no requirements", "Every action regardless of value"], 0, "Automation should justify its maintenance cost."),
        q("Why keep API tests alongside UI tests?", ["API tests cover rules efficiently while UI tests cover journeys", "To eliminate all manual testing", "API tests prove the UI is correct", "All APIs have the same contract"], 0, "Different layers cover different risks."),
        q("A suite with only end-to-end UI tests may be:", ["Slow and harder to isolate failures", "Always useless", "Unable to use assertions", "Unable to test workflows"], 0, "UI-only suites can be costly to diagnose and maintain."),
        q("API tests should check beyond status:", ["Schema, values, permissions, errors, and side effects", "Response color", "Request name only", "Nothing else"], 0, "The API contract and business behavior matter."),
        q("Risk-based automation selection prioritizes:", ["Expected value against important risks", "Shortest titles", "Tests authored by managers only", "Most functions per test"], 0, "Choose by risk, repeatability, stability, and cost."),
      ],
    },
    {
      slug: "ci-cd-and-github-actions",
      n: "8.2",
      title: "CI/CD, GitHub Actions, safe configuration, and artifacts",
      minutes: 30,
      objectives: [
        "Explain CI triggers and a basic automated workflow.",
        "Keep local and CI commands reproducible.",
        "Protect credentials and publish useful reports.",
      ],
      notes:
        "Continuous Integration runs checks automatically after code changes, commonly on pushes and pull requests. A basic pipeline checks out code, installs a documented runtime and dependencies, installs browser binaries, executes checks, and uploads reports/traces. Keep local and CI commands aligned. Store credentials in scoped environment/secrets configuration, never in source code. A failed pipeline should preserve evidence a reviewer can inspect. A green run only means configured checks passed for that run; it does not prove every behavior is correct. Start simple, verify reliability, then add complexity. Document how a reviewer can run the same tests locally.",
      example: "On each pull request, run the documented Playwright test command and upload the HTML report and trace files when tests fail.",
      diagram: {
        title: "CI pipeline and artifacts",
        caption: "Commit or pull request, install and check, execute, artifacts, review. Illustrative only.",
        alt: "Five connected boxes: commit or PR, install and check, execute, artifacts, review.",
        boxes: [
          { t: "Commit/PR", d: "Start the workflow" },
          { t: "Install/check", d: "Reproducible dependencies" },
          { t: "Execute", d: "Run required tests" },
          { t: "Artifacts", d: "Reports and trace on failure" },
          { t: "Review", d: "Decide next step from evidence" },
        ],
      },
      lab: {
        title: "CI challenge",
        task: "Decide which items belong in a CI workflow, and which must never be there.",
        categories: ["Belongs in the CI workflow", "Never in CI config"],
        items: [
          { t: "Check out code and install dependencies", c: 0 },
          { t: "Install browser binaries", c: 0 },
          { t: "Plaintext passwords in the workflow file", c: 1 },
          { t: "Upload the HTML report and traces as artifacts", c: 0 },
          { t: "Run the documented test command", c: 0 },
          { t: "A live token written in source code", c: 1 },
        ],
        takeaway: "Credentials belong in scoped secrets, evidence belongs in artifacts, and the CI command should match the local one.",
        reflection: "Explain why a green CI run does not prove the product is defect-free.",
      },
      video: {
        id: "0kWTkqEdSwU",
        title: "Playwright and TypeScript: updated supplementary tutorial",
        summary: "CI runs the same documented commands on every change and keeps reports and traces so failures can be diagnosed after the job ends.",
      },
      quiz: [
        q("A common CI trigger is:", ["A code push or pull request", "A tester birthday", "A browser theme change", "Manual database deletion"], 0, "CI commonly runs on code changes."),
        q("Why upload reports and traces as artifacts?", ["They help diagnose failures after the job ends", "They replace source code", "They make every test pass", "They are useless"], 0, "Artifacts preserve debugging evidence."),
        q("CI credentials belong in:", ["Source test files", "Scoped secrets/environment configuration", "Public screenshots", "Application title"], 1, "Credentials need protection and controlled access."),
        q("A green CI run means:", ["Every possible behavior is defect-free", "Configured checks passed for that execution", "Manual testing is unnecessary", "Code cannot regress"], 1, "The result covers the checks configured for that run."),
        q("Why align local and CI run commands?", ["Reproducibility and easier debugging", "Prevent documentation", "Remove package files", "Hide configuration"], 0, "Consistent commands reduce environment surprises."),
      ],
    },
    {
      slug: "capstone-code-review-and-interviews",
      n: "8.3",
      title: "Capstone submission, expert code review, portfolio, and interviews",
      minutes: 35,
      objectives: [
        "Deliver a runnable project with code, setup instructions, and evidence.",
        "Respond to code-review feedback and revise.",
        "Explain architecture, coverage, and limitations in an interview.",
      ],
      notes:
        "The capstone resembles a small QA engineering assignment. Learners receive a brief, BRD, Figma, deployed practice app, supported browser list, and acceptance criteria. They choose valuable scenarios, implement Playwright tests locally, run them, inspect failures, and upload a repository URL or ZIP with report artifacts. Experts review correctness, coverage, locators, assertions, isolation, readability, duplication, debugging evidence, CI, and security hygiene. Feedback should explain each deduction and the next step. Do not reward code volume alone. Learners should explain why each test exists, which risk it protects, how it fails, and what remains untested.",
      example:
        "Capstone example: automate sign-in validation, product search, cart quantity changes, coupon validation, and order summary. Include README, assumptions, coverage map, known limits, and a CI report.",
      diagram: {
        title: "Automation capstone submission",
        caption: "Brief, IDE, code, run and debug, submit, expert review. Illustrative only.",
        alt: "Six connected boxes: brief, IDE, code, run and debug, submit, expert review.",
        boxes: [
          { t: "Brief", d: "BRD, Figma, target application" },
          { t: "IDE", d: "Open starter repository" },
          { t: "Code", d: "Write maintainable tests" },
          { t: "Run/debug", d: "Inspect assertions and traces" },
          { t: "Submit", d: "Code, README, report" },
          { t: "Expert review", d: "Human feedback and revision" },
        ],
      },
      lab: {
        title: "Capstone submission checklist",
        task: "Decide what a capstone submission should include, and what must be left out.",
        categories: ["Should be included", "Do not include"],
        items: [
          { t: "README with setup, commands and limits", c: 0 },
          { t: "Coverage map and known limitations", c: 0 },
          { t: "Real credentials or tokens", c: 1 },
          { t: "Report and trace evidence", c: 0 },
          { t: "node_modules, unless explicitly required", c: 1 },
          { t: "Personal data or unrelated files", c: 1 },
        ],
        takeaway: "A reviewer needs reproducible code and honest evidence, never secrets or unrelated files.",
        reflection: "Explain why one of your tests exists, which risk it protects, and what it leaves untested.",
      },
      video: {
        id: "788GvvcfwTY",
        title: "Playwright TypeScript Full Course",
        summary: "Submit a runnable project with a README, evidence and honest limits, then explain every test's purpose and the risk it protects.",
      },
      quiz: [
        q("A submission README should include:", ["Setup, commands, scope, assumptions, and limitations", "Motivational quote only", "Credentials and tokens", "Claim that every test is perfect"], 0, "A README makes the work reproducible."),
        q("A strong code-review criterion is:", ["Number of lines", "Correctness, assertions, isolation, maintainability, and evidence", "Number of colors", "Same editor as reviewer"], 1, "Code quality is more than code volume."),
        q("When an expert requests revisions, the learner should:", ["Ignore feedback", "Make changes, explain them, and resubmit if allowed", "Delete the repository", "Remove failing tests"], 1, "Revision is part of the learning cycle."),
        q("Explain a flaky-test fix by describing:", ["Only that retries were added", "Evidence, root cause, fix, and stability verification", "Browser blame without evidence", "That flakiness is inevitable"], 1, "Reasoned explanation demonstrates engineering judgment."),
        q("Never include in a public repository:", ["README", "Sanitized report", "Real credentials or private data", "Package lockfile"], 2, "Public repositories must not expose secrets."),
      ],
    },
  ],
};
