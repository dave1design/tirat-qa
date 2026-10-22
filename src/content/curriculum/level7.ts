import { q, type Level } from "./types";

export const level7: Level = {
  n: 7,
  slug: "automation-engineering",
  title: "Automation Engineering and Maintainable Frameworks",
  track: "Automation QA",
  goal: "Build reliable suites with reusable setup, isolated data, and effective debugging evidence.",
  prerequisites: "Level 6 completed.",
  outcome: "Use fixtures, page objects where helpful, controlled workflows, traces, reporting, and flaky-test diagnosis.",
  deliverable: "Maintainable, isolated workflow tests and debugging evidence.",
  milestone:
    "Open the starter project in a local IDE, implement the required tests, run them, include a README and evidence, and upload the repository URL or ZIP. A human expert runs or inspects the code in a controlled environment and returns criterion-level feedback.",
  interview: [
    "How do fixtures help?",
    "When is a page object useful and when can it be overengineering?",
    "What causes flaky tests?",
    "How do you isolate test data?",
    "How do traces and reports help debugging?",
  ],
  lessons: [
    {
      slug: "isolation-fixtures-and-page-objects",
      n: "7.1",
      title: "Test isolation, fixtures, hooks, and Page Object Model",
      minutes: 30,
      objectives: [
        "Keep tests independent and control setup/cleanup.",
        "Use fixtures/hooks where they simplify common preparation.",
        "Apply Page Object Model when shared UI behavior merits encapsulation.",
      ],
      notes:
        "A reliable test should pass or fail based on its own target behavior, not on another test's execution order. Isolation means independent data, repeatable preconditions, safe cleanup, and no hidden dependency on a previous case. Fixtures provide reusable setup such as authenticated browser state or a prepared test customer. Hooks run setup/cleanup at defined points, but excessive global setup can hide dependencies. Page Object Model (POM) puts repeated page locators/actions behind a clear interface. It is useful when shared interactions need maintenance; it is not a requirement to wrap every trivial line in a class. Keep assertions and test intent readable. A good structure makes tests easier to understand, not merely more abstract.",
      example:
        'Instead of relying on "the last test created a product," create or seed the needed product in the current test, give it a unique identifier, and clean it up when appropriate. This reduces order dependence and parallel collisions.',
      diagram: {
        title: "Independent test execution",
        caption: "Each test arranges unique data, executes one path, asserts and cleans up its own state. Illustrative only.",
        alt: "Four connected boxes: arrange unique controlled data, execute one test path, assert the relevant result, clean up test-owned state.",
        boxes: [
          { t: "Arrange", d: "Unique controlled data" },
          { t: "Execute", d: "Run one test path" },
          { t: "Assert", d: "Check relevant result" },
          { t: "Cleanup", d: "Remove only test-owned state" },
        ],
      },
      lab: {
        title: "Isolation lab",
        task: "Classify each practice as isolated and reliable, or order-dependent and fragile.",
        categories: ["Isolated practice", "Order-dependent / fragile"],
        items: [
          { t: "Create a unique product inside the test", c: 0 },
          { t: 'Rely on "the last test created a product"', c: 1 },
          { t: "Use a fixture to prepare a signed-in user", c: 0 },
          { t: "Share mutable data across parallel tests", c: 1 },
          { t: "Clean up only resources the test owns", c: 0 },
          { t: "Delete all environment data blindly", c: 1 },
        ],
        takeaway: "Tests should establish their own preconditions and clean up only what they own.",
        reflection: "Which fixture or page object would most improve readability in your suite, and why?",
      },
      video: {
        id: "788GvvcfwTY",
        title: "Playwright TypeScript Full Course",
        summary: "Independent tests with unique data and explicit fixtures are easier to run in parallel and to diagnose.",
      },
      quiz: [
        q("A test that requires a previous test to pass is:", ["Well isolated", "Order-dependent and fragile", "Automatically faster", "A Page Object"], 1, "Tests should establish their own needed preconditions."),
        q("A fixture is useful for:", ["Reusable controlled test setup", "Hiding the expected behavior", "Removing assertions", "Storing production passwords in code"], 0, "Fixtures package repeatable preparation and resources."),
        q("POM is most useful when:", ["Repeated page behavior deserves a clear reusable interface", "Every test must have 40 classes", "Assertions should be hidden completely", "The app has no pages"], 0, "Use abstraction where it reduces duplication and clarifies intent."),
        q("Parallel tests may fail unexpectedly because of:", ["Shared mutable data and collisions", "Too much requirement traceability", "Clear assertions", "Unique test records"], 0, "Isolation problems often surface under parallel execution."),
        q("A cleanup step should:", ["Delete all environment data blindly", "Remove only resources owned by the test under a controlled policy", "Expose credentials", "Run regardless of authorization"], 1, "Cleanup must be bounded and safe."),
      ],
    },
    {
      slug: "end-to-end-workflows-and-api-setup",
      n: "7.2",
      title: "End-to-end workflows, authentication, uploads, and API-assisted setup",
      minutes: 35,
      objectives: [
        "Automate realistic user journeys with explicit checkpoints.",
        "Handle authenticated state and file upload/download safely.",
        "Use APIs for setup where reliable and permitted while preserving meaningful UI coverage.",
      ],
      notes:
        "End-to-end tests validate important journeys across integrated components. They should remain focused: one test may create a user, perform a workflow, and verify the core result without asserting every decorative element. Authentication can be prepared through a documented storage state or sign-in workflow depending on the assignment. Never publish or upload real session tokens. File upload tests should verify accepted file type/size, rejection behavior, and persisted result; downloads should verify meaningful file properties rather than only that a click happened. API-assisted setup can create stable test data faster, while the UI test still verifies the user-facing journey. Setup shortcuts must not bypass the behavior that the case is intended to evaluate.",
      example:
        "For an LMS assignment upload, an API may seed the course and student, but the learner must use the UI to upload the assignment and verify the submitted status, displayed filename, and any required confirmation.",
      diagram: {
        title: "End-to-end workflow with setup shortcuts",
        caption: "Setup may use a permitted API; the target action stays in the UI. Illustrative only.",
        alt: "Four connected boxes: setup, user action, verify, protect.",
        boxes: [
          { t: "Setup", d: "Fixture or permitted API data" },
          { t: "User action", d: "Perform target action in UI" },
          { t: "Verify", d: "Check state and confirmation" },
          { t: "Protect", d: "Reset and sanitize artefacts" },
        ],
      },
      lab: {
        title: "Workflow lab",
        task: "Decide which steps may use an API shortcut and which must stay in the UI test.",
        categories: ["Safe API-assisted setup", "Keep in the UI test"],
        items: [
          { t: "Seed the course and student through an API", c: 0 },
          { t: "Upload the assignment file through the page", c: 1 },
          { t: "Create the test user through a permitted API", c: 0 },
          { t: "Verify the submitted status and filename on screen", c: 1 },
          { t: "Prepare authenticated storage state", c: 0 },
          { t: "Click Submit as the learner", c: 1 },
        ],
        takeaway: "Shortcuts speed up preconditions, but the behavior under test must still be exercised through the user-facing path.",
        reflection: "For an upload feature, list one accepted-file case and one rejected-file case and what each should assert.",
      },
      video: {
        id: "788GvvcfwTY",
        title: "Playwright TypeScript Full Course",
        summary: "Keep end-to-end tests focused on important journeys, treat auth state as sensitive, and use API setup only where it does not bypass the target behavior.",
      },
      quiz: [
        q("API-assisted setup is appropriate when it:", ["Creates preconditions efficiently without bypassing the target behavior under test", "Replaces all UI assertions", "Uses production data", "Makes a test depend on order"], 0, "The target journey remains explicitly tested."),
        q("An upload test should verify:", ["Only that the button was clicked", "Accepted/rejected rules and resulting state", "The developer's username", "Only the page title"], 1, "Upload rules and final behavior are the requirements."),
        q("Authentication state files should be:", ["Committed with live tokens", "Handled as sensitive artifacts and kept out of public code", "Posted in bug reports", "Shared among all learners publicly"], 1, "Authenticated state can grant account access."),
        q("A strong end-to-end test should:", ["Assert every pixel in all pages", "Focus on an important user journey and meaningful checkpoints", "Avoid verifying outcomes", "Always test unrelated features too"], 1, "Focused end-to-end tests are easier to diagnose and maintain."),
        q("A rejected upload should be tested for:", ["Clear error, no unintended submission, and preserved expected state", "A successful submission anyway", "Removal of all records", "Hidden failure"], 0, "Negative paths require both understandable feedback and correct state."),
      ],
    },
    {
      slug: "debugging-traces-and-flaky-tests",
      n: "7.3",
      title: "Debugging, traces, flaky tests, cross-browser checks, and reports",
      minutes: 35,
      objectives: [
        "Distinguish product defects, automation defects, environment failures, and bad test data.",
        "Diagnose flakiness using traces and controlled experiments.",
        "Produce actionable reports across supported browsers.",
      ],
      notes:
        "A failure is not automatically a product defect. It may be a genuine behavior mismatch, a faulty selector/assertion, shared data, test environment issue, authentication expiry, browser-specific behavior, or timing race. Compare the failure with the requirement and inspect the trace, screenshot, console/network details, and test data. Replace arbitrary fixed sleeps with condition-based waits/assertions. Do not immediately add retries: retries can conceal instability. Use retries only when the policy helps collect evidence and the underlying issue is being investigated. Cross-browser testing should follow supported-platform expectations. Reports should show test names, outcome, duration, error, and links to retained evidence. Diagnose root cause, fix it, then verify stability across repeated runs.",
      example:
        "A test checks the old cart total immediately after clicking Save. Replace a fixed sleep with an assertion that waits for the expected total, isolate data, and inspect a trace to confirm the sequence.",
      diagram: {
        title: "Diagnose an unstable test",
        caption: "Classify, inspect, fix, verify. Illustrative only.",
        alt: "Four connected boxes: classify, inspect, fix, verify.",
        boxes: [
          { t: "Classify", d: "Product, code, data, environment" },
          { t: "Inspect", d: "Trace, timing and network evidence" },
          { t: "Fix", d: "Address root cause" },
          { t: "Verify", d: "Repeat and compare outcomes" },
        ],
      },
      lab: {
        title: "Flaky-test clinic",
        task: "For each failure, decide whether it is most likely a product defect, an automation defect, or an environment/data issue.",
        categories: ["Product defect", "Automation defect", "Environment / data issue"],
        items: [
          { t: "The app returns the wrong total and the trace confirms it", c: 0 },
          { t: "A fixed sleep ends before the total updates", c: 1 },
          { t: "A shared test account was changed by another run", c: 2 },
          { t: "A brittle selector no longer matches after a refactor", c: 1 },
          { t: "The service was unavailable during the run", c: 2 },
          { t: "The requirement says one order but two are created", c: 0 },
        ],
        takeaway: "A failure is evidence that needs diagnosis, not automatic proof the app is broken or that retries are the cure.",
        reflection: "Describe the evidence you would collect to decide whether a failure is a timing race or a product defect.",
      },
      video: {
        id: "0kWTkqEdSwU",
        title: "Playwright and TypeScript: updated supplementary tutorial",
        summary: "Use traces and reports to find root causes. Replace fixed sleeps with condition-based assertions rather than hiding instability behind retries.",
      },
      quiz: [
        q("A flaky test:", ["Always fails in the same verified way", "Changes outcome intermittently under similar conditions", "Has no title", "Uses TypeScript"], 1, "Flakiness is inconsistent behavior under similar conditions."),
        q("Best first response to an intermittent failure:", ["Add retries and stop investigating", "Inspect timing, data, selectors, environment, and traces", "Delete the test", "Mark passed without rerun"], 1, "Diagnose before masking symptoms."),
        q("Parallel execution can expose:", ["Shared state/data and isolation problems", "Need for no assertions", "That databases are never used", "Font issues only"], 0, "Concurrent work can collide when data is shared."),
        q("Which artifact helps reconstruct browser actions?", ["Playwright trace", "Project logo", "Salary spreadsheet", "Unrelated text file"], 0, "Traces preserve action and page-state evidence."),
        q("Why remove test.only before a full suite submission?", ["It may cause other tests to be skipped", "It increases coverage", "It has no effect on suite execution", "It is required in CI"], 0, "A focused local run should not accidentally replace the suite."),
      ],
    },
  ],
};
