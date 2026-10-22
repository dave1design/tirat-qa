import { q, type Level } from "./types";

export const level3: Level = {
  n: 3,
  slug: "web-testing-and-defects",
  title: "Web Application Testing and Defect Reporting",
  track: "Manual QA",
  goal: "Test modern web behavior, inspect evidence with browser tools, and document defects professionally.",
  prerequisites: "Level 2 completed.",
  outcome: "Test browser workflows, responsive/accessibility basics, session behavior, and write actionable bug reports.",
  deliverable: "Actionable bug reports with reproducible evidence.",
  milestone: "Complete the level's manual work sample using the requirements and evidence supplied.",
  interview: [
    "How would you test a login page?",
    "What evidence would you gather for a failed API request?",
    "Explain severity versus priority.",
    "What would you test across mobile and desktop?",
    "How do you decide whether a mismatch is a defect or requirement ambiguity?",
  ],
  lessons: [
    {
      slug: "browser-sessions-and-devtools",
      n: "3.1",
      title: "Browser basics, client/server, sessions, and DevTools",
      minutes: 25,
      objectives: [
        "Explain the browser, frontend, backend, API, and database responsibilities.",
        "Inspect console and network evidence.",
        "Test session and authentication behavior safely.",
      ],
      notes:
        "The browser renders the frontend and sends requests to backend services. The backend should enforce business rules, authorize access, and persist authoritative data. A page can look correct while sending the wrong request or displaying stale data. Browser DevTools help inspect console errors, network status, timing, request/response payloads, DOM attributes, viewport layout, cookies, and storage. Client-side validation improves feedback but cannot be the only enforcement for stock, price, permission, or other critical rules because requests can be altered or bypassed. Test login, logout, session expiry, protected routes, error states, and behavior after refresh. Gather only the evidence needed for reproduction and remove credentials, tokens, and personal information from screenshots and recordings.",
      example:
        "The UI prevents quantity zero, but stale state sends zero to the API. The server must reject the invalid quantity and return a useful response; client-side checks alone are insufficient.",
      diagram: {
        title: "Browser-to-server evidence trail",
        caption: "From user input to server response, each step leaves evidence. Illustrative only.",
        alt: "Five connected boxes: browser UI, request, server rules, data state, response.",
        boxes: [
          { t: "Browser UI", d: "User input and displayed state" },
          { t: "Request", d: "Method, URL, headers, payload" },
          { t: "Server rules", d: "Validate and authorize" },
          { t: "Data state", d: "Persist correct changes" },
          { t: "Response", d: "Status, body, side effects" },
        ],
      },
      lab: {
        title: "DevTools detective",
        task: "Choose the DevTools area where you would look first for each piece of evidence.",
        categories: ["Network panel", "Console", "Application (cookies/storage)", "Elements"],
        items: [
          { t: "Status code and payload of the failed checkout request", c: 0 },
          { t: "A JavaScript error message", c: 1 },
          { t: "The session cookie after logout", c: 2 },
          { t: "A button's label and disabled attribute", c: 3 },
          { t: "Request and response timing", c: 0 },
          { t: "A warning logged by the page", c: 1 },
        ],
        takeaway: "Network shows requests and responses, Console shows errors, Application shows cookies and storage, Elements shows the DOM.",
        reflection: "Draft a two-sentence investigation note for a failed checkout request: what you saw and what you expected.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "The browser shows the page, but evidence lives in the network, console and storage. Critical rules must be enforced by the server, not only the page.",
      },
      quiz: [
        q("What does the Network panel show?", ["Font sizes only", "Requests, statuses, timing, and payloads", "Only user roles", "Source comments only"], 1, "Network tools reveal HTTP request/response details."),
        q("Why is client-side validation insufficient for critical rules?", ["It always slows the UI", "Clients can bypass or manipulate it", "It prevents every error", "It replaces authorization"], 1, "The server must enforce authoritative rules."),
        q("A useful post-logout check is to verify:", ["Protected pages remain authorized forever", "Protected actions require authentication again", "Another user's account becomes visible", "Passwords are displayed in storage"], 1, "Logout should invalidate the session according to requirements."),
        q("HTTP 500 generally indicates:", ["A server-side error", "Every test passed", "A perfect layout", "A successful cache hit"], 0, "5xx status codes indicate server errors."),
        q("What should be removed from a bug screenshot?", ["The affected control", "Relevant error text", "Passwords, tokens, or personal data", "Browser version"], 2, "Evidence should be useful and privacy-safe."),
      ],
    },
    {
      slug: "web-functional-responsive-accessibility",
      n: "3.2",
      title: "Web functional, responsive, accessibility, and compatibility testing",
      minutes: 30,
      objectives: [
        "Test forms, search, filters, CRUD flows, navigation, and persistence.",
        "Check responsive layouts and keyboard access.",
        "Use a supported browser/device matrix.",
      ],
      notes:
        "Test user goals, not only individual controls. For forms, check required fields, formats, lengths, whitespace, duplicates, error messages, and successful submission. For search/filter/sort, check result correctness, combined filters, empty states, persistence, and reset behavior. For create/read/update/delete workflows, reload or revisit records to verify persistence where required. Responsive checks cover supported viewport sizes, horizontal overflow, readable content, target size, and mobile navigation. Accessibility basics include keyboard navigation, visible focus, input labels, meaningful headings, useful alternative text, and errors not conveyed by color alone. Compatibility scope should follow the support matrix and risk. Distinguish a visual mismatch from a failure that prevents completing a user goal, but document both when relevant to requirements.",
      example:
        "A checkout action disappears at a supported 360 px viewport. Users cannot place an order at that supported size, so this is a functional blocker on that device class, not only a cosmetic issue.",
      diagram: {
        title: "Web quality coverage",
        caption: "Functional, responsive, accessibility and compatibility checks side by side. Illustrative only.",
        alt: "Four connected boxes: functional, responsive, accessibility, compatibility.",
        boxes: [
          { t: "Functional", d: "Forms, search, CRUD and persistence" },
          { t: "Responsive", d: "Viewport and layout behavior" },
          { t: "Accessibility", d: "Keyboard, labels and focus" },
          { t: "Compatibility", d: "Supported browser/device matrix" },
        ],
      },
      lab: {
        title: "Responsive form lab",
        task: "Classify each observation as a functional, responsive or accessibility finding.",
        categories: ["Functional", "Responsive", "Accessibility"],
        items: [
          { t: "Search fails to return a matching product", c: 0 },
          { t: "The checkout button is clipped at 360 px width", c: 1 },
          { t: "A control cannot be reached with the Tab key", c: 2 },
          { t: "A saved profile email reverts after reload", c: 0 },
          { t: "Horizontal scrolling appears on a phone", c: 1 },
          { t: "An input has no label", c: 2 },
        ],
        takeaway: "Some findings belong to more than one group. A clipped button on a supported device is both a responsive and a functional problem.",
        reflection: "Describe one finding that could be both responsive and functional, and how you would report it.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "Test whole user goals across supported screen sizes, input methods and browsers, and always reload to verify that saved data persists.",
      },
      quiz: [
        q("After updating a profile, what confirms persistence?", ["Assume save worked because button clicked", "Reload and verify the new value remains", "Check only button color", "Close the report"], 1, "Persistence should be verified when required by the feature."),
        q("Which is an accessibility basic?", ["Keyboard users can reach controls and see focus", "All text uses one font", "Only mouse clicks work", "Errors are only shown in red"], 0, "Keyboard operation and visible focus are foundational."),
        q("Compatibility testing should use:", ["Every browser ever made", "A defined supported browser/device matrix and risk", "Only one laptop forever", "No mobile tests"], 1, "Scope follows support commitments and risk."),
        q("For an empty search result, verify:", ["An understandable empty state and a way to clear filters", "Only the logo", "Only password change", "Nothing; empty states never matter"], 0, "No-result behavior is part of the user experience."),
        q("Which issue is primarily functional?", ["A slightly different shadow", "Search fails to return a matching product", "A decorative icon is misaligned", "A footer color differs"], 1, "Search correctness is behavior."),
      ],
    },
    {
      slug: "bug-reports-severity-and-lifecycle",
      n: "3.3",
      title: "Bug reports, severity vs priority, and defect lifecycle",
      minutes: 30,
      objectives: [
        "Write complete and reproducible defect reports.",
        "Distinguish business impact from fix urgency.",
        "Apply triage, retest, regression, closure, and reopening correctly.",
      ],
      notes:
        "A useful defect report includes a clear title, environment/build, preconditions, exact steps, expected result grounded in the specification, actual result, frequency, evidence, and relevant test data. Severity describes impact; priority describes urgency or fix order. A security exposure may be both high; a campaign-critical typo may have low technical impact but high urgency. Triage determines whether a report is reproducible, duplicate, out of scope, a requirement question, or a confirmed defect. After a fix, repeat the failing case and execute relevant regression. Reopen the report if verification fails or the issue returns. Teams may use different status names, so learn the workflow agreed in the project.",
      example:
        'Weak title: "Checkout broken." Better: "Checkout creates duplicate orders when Place Order is clicked twice during a delayed response." Include exact steps, expected one order, actual two order IDs, build/browser, and sanitized evidence.',
      diagram: {
        title: "Defect report lifecycle",
        caption: "From discovery to closure or reopening. Illustrative only.",
        alt: "Five connected boxes: discover, document, triage, verify, close or reopen.",
        boxes: [
          { t: "Discover", d: "Observe mismatch" },
          { t: "Document", d: "Steps, expected/actual, evidence" },
          { t: "Triage", d: "Confirm impact and ownership" },
          { t: "Verify", d: "Retest the fix" },
          { t: "Close/reopen", d: "Check result and regressions" },
        ],
      },
      lab: {
        title: "Bug-report repair shop",
        task: "Assign severity and priority separately. Pick the pairing that fits each issue.",
        categories: ["High severity, high priority", "High severity, lower priority", "Low severity, high priority", "Low severity, low priority"],
        items: [
          { t: "Checkout charges customers twice", c: 0 },
          { t: "A crash in a rarely used admin export, with a workaround, planned for next release", c: 1 },
          { t: "A typo in the headline of a campaign page going live today", c: 2 },
          { t: "A one-pixel footer misalignment", c: 3 },
        ],
        takeaway: "Severity is the impact; priority is the urgency to fix. They are related but not identical.",
        reflection: "Rewrite the weak title \"Checkout broken\" into a specific, reproducible title.",
      },
      video: {
        id: "rWf-ZqHaL64",
        title: "Smoke and Sanity Testing",
        summary: "A good defect report lets another person reproduce the problem. Severity describes impact while priority describes how soon it should be fixed.",
      },
      quiz: [
        q("Severity primarily describes:", ["How urgently a manager wants a fix", "Impact of the defect", "Developer seniority", "Number of screenshots"], 1, "Severity describes impact; priority describes urgency."),
        q("Which title is most useful?", ["It is broken", "Bug on page", "Checkout creates duplicate orders after double-click", "Please fix ASAP"], 2, "The title names the affected feature and observable failure."),
        q("Expected result should be based on:", ["Personal preference", "Specification or agreed acceptance criteria", "Screenshot filename", "Developer identity"], 1, "Expected behavior needs an agreed source."),
        q("When should a defect be reopened?", ["When a test case is long", "When the fix fails verification or the issue returns", "Only at sprint end", "Never"], 1, "Reopening communicates that the problem remains unresolved."),
        q("Can a defect be high severity but scheduled later?", ["No, severity and priority always match", "Yes, impact and scheduling urgency are distinct", "It automatically stops being a defect", "It must be hidden"], 1, "Severity and priority are related, but not identical."),
      ],
    },
  ],
};
