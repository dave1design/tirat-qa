import { q, type Level } from "./types";

export const level6: Level = {
  n: 6,
  slug: "automation-foundations",
  title: "Automation QA Foundations with Playwright and TypeScript",
  track: "Automation QA",
  goal: "Transition from manual QA to local coding of reliable browser tests.",
  prerequisites: "Level 5 recommended; coding concepts are taught step by step.",
  outcome: "Set up a local IDE, understand a starter repository, and write and run Playwright tests.",
  deliverable: "A locally runnable Playwright starter project, reviewed by a human expert.",
  milestone:
    "Open the starter project in a local IDE, implement the required tests, run them, include a README and evidence, and upload the repository URL or ZIP. A human expert runs or inspects the code in a controlled environment and returns criterion-level feedback.",
  interview: [
    "What makes a test a good automation candidate?",
    "Explain locator, action, and assertion.",
    "Why use async/await in browser automation?",
    "What is the difference between a test failure and a broken test setup?",
    "How would you describe your first automation assignment?",
  ],
  lessons: [
    {
      slug: "programming-foundations",
      n: "6.1",
      title: "Programming foundations for test automation",
      minutes: 30,
      objectives: [
        "Understand variables, strings, booleans, arrays, objects, functions, and conditions.",
        "Read basic TypeScript and asynchronous code.",
        "Relate code constructs to test data and assertions.",
      ],
      notes:
        "Automation is executable test logic. Variables name values, arrays hold lists, objects group related fields, conditions express decisions, and functions package reusable behavior. A test framework supplies functions for setup, actions, assertions, and reporting. TypeScript adds type information that helps detect some mistakes before execution, although types do not prove that a test is logically correct. Browser operations are asynchronous: the script often must wait for navigation, responses, or UI state. async functions can use await to express that ordering. Avoid arbitrary sleeps when a condition-based wait/assertion expresses the intended state. Beginners should first read small tests line by line, modify one thing, run it, and inspect results before writing a framework.",
      example:
        "const quantity = 2 defines test data. A test fills a quantity field, clicks Add to cart, and asserts the cart shows two units. If the expected value is buried in unexplained code, review becomes difficult.",
      diagram: {
        title: "Automation test anatomy",
        caption: "Arrange data, act on the page, assert the result, diagnose failures. Illustrative only.",
        alt: "Four connected boxes: arrange, act, assert, diagnose.",
        boxes: [
          { t: "Arrange", d: "Data and preconditions" },
          { t: "Act", d: "Browser action" },
          { t: "Assert", d: "Check the user-visible result" },
          { t: "Diagnose", d: "Report, screenshot, and trace" },
        ],
      },
      lab: {
        title: "Code reading lab",
        task: "Match each piece of code or idea to the programming concept it shows.",
        categories: ["Variable", "Assertion", "Async/await", "Function"],
        items: [
          { t: "const quantity = 2", c: 0 },
          { t: "expect(cartCount).toHaveText('2')", c: 1 },
          { t: "await page.click(button)", c: 2 },
          { t: "A reusable helper that adds an item to the cart", c: 3 },
          { t: "A named value holding test data", c: 0 },
          { t: "Checks an observed result matches an expectation", c: 1 },
        ],
        takeaway: "Variables name data, assertions express expected behavior, await orders asynchronous steps, functions package reusable behavior.",
        reflection: "Change the test data in a small example, predict whether the assertion still passes, and explain why the assertion matters.",
      },
      video: {
        id: "788GvvcfwTY",
        title: "Playwright TypeScript Full Course",
        summary: "Automation is readable code that names its data, performs actions, waits for the right state and asserts the expected outcome.",
      },
      quiz: [
        q("A variable is used to:", ["Give a value a readable name", "Automatically fix any defect", "Replace requirements", "Guarantee correct behavior"], 0, "Variables name data used by the program."),
        q("An assertion checks:", ["Whether an observed result matches an expectation", "Only code formatting", "Whether a laptop is new", "A project's revenue"], 0, "Assertions express expected behavior."),
        q("Why is async/await common in browser tests?", ["Browser actions and waits often complete asynchronously", "It makes every assertion optional", "It prevents all bugs", "It replaces selectors"], 0, "Awaiting asynchronous work helps express correct ordering."),
        q("Which is a maintainable test name?", ["test1", "it works", "cart shows updated quantity after adding two units", "x"], 2, "A useful name communicates intent and expected behavior."),
        q("A test passes because it never checks an outcome. It is:", ["Strong evidence", "A weak test with little diagnostic value", "Automatically exhaustive", "A security test"], 1, "Execution alone does not demonstrate the requirement was checked."),
      ],
    },
    {
      slug: "local-ide-and-playwright-setup",
      n: "6.2",
      title: "Local IDE, Node.js, Git, Playwright setup, and safe workflow",
      minutes: 30,
      objectives: [
        "Install a supported Node.js version, IDE, Git, and Playwright project dependencies.",
        "Run starter tests and recognize common setup errors.",
        "Use branches/commits and keep secrets out of repositories.",
      ],
      notes:
        "Automation assignments run on the learner's own machine, not in a browser-only editor. Each assignment should provide a ZIP or repository URL, prerequisites, environment versions, the target practice URL, test accounts, task instructions, starter tests, and expected command. A typical setup initializes the Playwright project, installs dependencies and browser binaries, and runs tests from the terminal or IDE extension. Git records changes and makes review reproducible. Use .gitignore for generated reports, local environment files, and sensitive data where appropriate; never commit tokens or private credentials. Read the README before running commands. Do not run unknown install scripts or submit code containing personal data. Ask learners to commit meaningful steps so experts can see the reasoning and history.",
      example:
        "The learner downloads tiratqa-playwright-starter.zip, extracts it, opens the folder in VS Code, follows README setup, runs the baseline test, and confirms the browser version and target URL before changing a test.",
      diagram: {
        title: "Local automation setup",
        caption: "Prerequisites, install, baseline run, focused edit, run again. Illustrative only.",
        alt: "Five connected boxes: prerequisites, install, baseline, edit and commit, run again.",
        boxes: [
          { t: "Prerequisites", d: "IDE, Node.js, Git" },
          { t: "Install", d: "Dependencies and browsers" },
          { t: "Baseline", d: "Run provided tests" },
          { t: "Edit/commit", d: "Make focused changes" },
          { t: "Run again", d: "Inspect result and evidence" },
        ],
      },
      lab: {
        title: "Setup lab",
        task: "Decide which files belong in the repository you commit, and which must stay out.",
        categories: ["Commit", "Keep out (gitignore or never commit)"],
        items: [
          { t: "README with setup steps", c: 0 },
          { t: "package-lock.json", c: 0 },
          { t: "A live API token", c: 1 },
          { t: "A .env file with passwords", c: 1 },
          { t: "Test source files", c: 0 },
          { t: "The generated playwright-report folder", c: 1 },
        ],
        takeaway: "Commit source, documentation and lockfiles; keep secrets and generated output out of the repository.",
        reflection: "Write a useful commit message for a change that fixes an assertion, describing the change and its intent.",
      },
      video: {
        id: "0kWTkqEdSwU",
        title: "Playwright and TypeScript: updated supplementary tutorial",
        summary: "Open the provided project folder in an IDE, follow the README, run the baseline test first, and keep secrets out of Git.",
      },
      quiz: [
        q("Why should the learner open the provided folder in an IDE?", ["To edit, run, debug, and organize the actual test project", "To avoid running tests", "To expose credentials", "To replace the browser"], 0, "Automation coding happens in a local development environment."),
        q("A lockfile helps:", ["Record dependency versions for repeatable installs", "Hide all code", "Replace the README", "Guarantee no defects"], 0, "Lockfiles improve reproducibility."),
        q("Which file should normally not contain committed secrets?", ["A sanitized README", "A test source file containing a live token", "A package manifest", "A public licence"], 1, "Secrets should be configured safely and never hardcoded into repositories."),
        q("When a baseline test fails, the first step is to:", ["Delete the test", "Read the failure and verify setup/environment assumptions", "Assume the product is broken", "Upload nothing"], 1, "Diagnose before changing code or filing a product defect."),
        q("A useful commit message describes:", ["The change made and its intent", "A personal password", 'Only "stuff" every time', "The reviewer's private data"], 0, "Meaningful commits help reviewers understand incremental work."),
      ],
    },
    {
      slug: "first-playwright-tests",
      n: "6.3",
      title: "First Playwright tests: locators, actions, assertions, and debugging",
      minutes: 35,
      objectives: [
        "Use role, label, text, and test-id locators appropriately.",
        "Perform actions and assert user-visible outcomes.",
        "Use reports, screenshots, and traces to diagnose failures.",
      ],
      notes:
        'A Playwright test commonly navigates to a page, locates a control, performs an action, and asserts an observable result. Prefer user-facing locators such as role/name and label when they reflect the interface contract. Use stable test IDs when suitable semantics are unavailable and the application team supports them. Avoid brittle selectors tied to deep DOM structure or visual position. Assert outcomes instead of only checking that a click completed: a "save" action should lead to a persisted value or confirmation according to the requirement. Playwright supports auto-waiting for actionability and retrying web-first assertions. On failure, inspect the error, report, screenshot, and trace; do not silence failures or add arbitrary timeouts as the first remedy.',
      example:
        "After clicking Add to cart, assert the cart count or accessible confirmation matches expected quantity. A click completing proves only that the action was attempted; the resulting state must be checked.",
      diagram: {
        title: "Playwright test loop",
        caption: "Locate, act, assert, debug. Illustrative only.",
        alt: "Four connected boxes: locate, act, assert, debug.",
        boxes: [
          { t: "Locate", d: "Stable user-facing locator" },
          { t: "Act", d: "Click, fill, navigate" },
          { t: "Assert", d: "Expected condition" },
          { t: "Debug", d: "Inspect error and trace" },
        ],
      },
      lab: {
        title: "First-test lab",
        task: "Judge each locator: would it make a resilient test or a brittle one?",
        categories: ["Resilient locator", "Brittle locator"],
        items: [
          { t: "getByRole('button', { name: /add to cart/i })", c: 0 },
          { t: "The fifth div under the third div", c: 1 },
          { t: "getByLabel(/quantity/i)", c: 0 },
          { t: "A random generated class hash", c: 1 },
          { t: "getByTestId('cart-quantity') when the team supports test IDs", c: 0 },
          { t: "Absolute screen coordinates", c: 1 },
        ],
        takeaway: "Prefer user-facing locators; assert the outcome, not only that a click happened.",
        reflection: "Rewrite a click-only test so it asserts the resulting cart quantity, and say why that matters.",
      },
      video: {
        id: "788GvvcfwTY",
        title: "Playwright TypeScript Full Course",
        summary: "Locate controls the way a user finds them, act, then assert the visible result. Use reports and traces to diagnose failures.",
      },
      quiz: [
        q("Which locator is often a good first choice when supported by the UI?", ["A role and accessible name", "The fifth div under the third div", "A random class hash", "Absolute screen coordinates only"], 0, "User-facing locators are often more resilient and meaningful."),
        q("Why assert after a click?", ["A click does not prove the required outcome occurred", "Clicks always fail", "Assertions slow all tests so should be avoided", "The browser has no state"], 0, "Verify the outcome, not only the action."),
        q("A web-first assertion is useful because it:", ["Waits/retries for the expected condition within its timeout", "Ignores failures", "Makes test data private", "Replaces all setup"], 0, "Condition-based assertions reduce timing races."),
        q("A trace is useful to:", ["Inspect actions and page state leading to failure", "Change source code by itself", "Guarantee production readiness", "Replace the specification"], 0, "Trace evidence supports diagnosis."),
        q("What should be included in an automation submission?", ["Only a screenshot", "Code, README/setup notes, test run evidence, and limitations", "Live credentials", "No test names"], 1, "Reviewers need reproducible code and supporting evidence."),
      ],
    },
  ],
};
