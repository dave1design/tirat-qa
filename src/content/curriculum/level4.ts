import { q, type Level } from "./types";

export const level4: Level = {
  n: 4,
  slug: "professional-workflow-apis-data",
  title: "Professional QA Workflow, APIs, and Data",
  track: "Professional QA",
  goal: "Plan risk-based testing, collaborate professionally, and test beyond the visual interface.",
  prerequisites: "Levels 1 to 3 completed.",
  outcome: "Prepare test strategy, communicate risk, test REST APIs, and perform basic SQL data validation.",
  deliverable: "Risk-based test plan, Postman collection, basic SQL evidence.",
  milestone: "Complete the level's manual work sample using the requirements and evidence supplied.",
  interview: [
    "How do you estimate testing effort?",
    "How would you prioritize when release time is short?",
    "What is an API request/response, and what would you assert?",
    "How would you test authorization at API level?",
    "What SQL query would verify a record was persisted?",
  ],
  lessons: [
    {
      slug: "test-planning-estimation-and-risk",
      n: "4.1",
      title: "Test planning, estimation, risk, and coverage",
      minutes: 25,
      objectives: [
        "Define scope, approach, entry/exit criteria, assumptions, and deliverables.",
        "Prioritize by likelihood and impact.",
        "Communicate untested areas and residual risk.",
      ],
      notes:
        "A test strategy/plan explains scope, exclusions, approach, environment/data, risks, responsibilities, schedule, entry/exit criteria, and reporting. Risk-based testing allocates effort according to likelihood and impact. Authentication, payments, permission checks, inventory movement, and migration often deserve more attention than low-impact copy changes. A likelihood × impact matrix supports discussion but is not a perfect scientific score. Estimate preparation, data creation, execution, investigation, retest, regression, dependencies, and reporting, not only click time. Coverage should connect to requirements and risk, rather than raw test-case count. When time prevents complete testing, state what was not tested and the resulting risk.",
      example:
        "Two hours remain. A typo and a possible duplicate-payment defect are open. Prioritize the payment risk, report what remains untested, and ask the accountable release owner to make an informed decision.",
      diagram: {
        title: "Risk-based test planning",
        caption: "Identify, assess, prioritize, execute and report. Illustrative only.",
        alt: "Five connected boxes: identify, assess, prioritize, execute, report.",
        boxes: [
          { t: "Identify", d: "List features and risks" },
          { t: "Assess", d: "Consider likelihood and impact" },
          { t: "Prioritize", d: "Spend effort where risk is highest" },
          { t: "Execute", d: "Gather outcome evidence" },
          { t: "Report", d: "State uncovered risk" },
        ],
      },
      lab: {
        title: "Risk-prioritization lab",
        task: "With a fixed testing budget, decide what to test first and what can wait if time allows.",
        categories: ["Test first", "Test if time allows"],
        items: [
          { t: "Payment processing", c: 0 },
          { t: "Login and permissions", c: 0 },
          { t: "A decorative copy change", c: 1 },
          { t: "Inventory updates", c: 0 },
          { t: "A footer link colour", c: 1 },
          { t: "Tooltip wording", c: 1 },
        ],
        takeaway: "Spend limited effort where likelihood and impact are highest, and say plainly what was not covered.",
        reflection: "Write a short release-risk message to a product owner explaining what you did not test and why it matters.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "Plan testing around risk, estimate the whole job, and report honestly what remains untested.",
      },
      quiz: [
        q("Risk-based testing prioritizes:", ["Random features", "Areas with high likelihood and impact", "Only recent pages", "Only features built by junior developers"], 1, "Risk helps focus limited effort."),
        q("Which is a measurable exit criterion?", ["Everyone feels ready", "Critical tests pass and no unresolved blocker remains under the agreed policy", "Tester has no more ideas", "Team stops talking"], 1, "Exit criteria should be observable and agreed."),
        q("If time prevents full coverage, report:", ["Nothing", "Untested areas and associated risks", "Only closed-bug count", "That all tests passed"], 1, "Honest residual-risk reporting supports release decisions."),
        q("A realistic estimate includes:", ["Execution only", "Data setup, execution, investigation, retest, regression, reporting", "Only writing titles", "No dependencies"], 1, "Testing includes preparation and follow-up."),
        q("Which metric is weak when used alone?", ["Requirements linked to results", "Critical workflows exercised", "Raw number of cases written", "Open high-risk defects"], 2, "Raw case count does not demonstrate meaningful coverage."),
      ],
    },
    {
      slug: "agile-collaboration-triage-and-metrics",
      n: "4.2",
      title: "Agile collaboration, defect triage, metrics, and reporting",
      minutes: 25,
      objectives: [
        "Participate in refinement, planning, daily coordination, review, and retrospectives.",
        "Communicate defects objectively and efficiently.",
        "Use metrics to explain risk rather than vanity.",
      ],
      notes:
        "QA is a collaborative role, not a gate that appears only at the end. During refinement, ask for testable acceptance criteria and discuss edge cases. During planning, identify dependencies and risks. During execution, report evidence quickly and maintain traceability. During triage, explain impact and reproduction conditions without blame. Useful reporting includes requirement coverage, test execution status, open defects by severity, escaped defects, automation reliability, and unresolved risk. Metrics can be misused: defect counts do not measure individual performance, and a high test count does not guarantee quality. Present context, trends, data definitions, and limitations. In a disagreement, return to expected behavior, evidence, reproducibility, and agreed business risk.",
      example:
        "A developer says a bug is not reproducible. Share the exact build, seed data, steps, role, request evidence, and screenshot. If still uncertain, pair to reproduce instead of arguing from opinion.",
      diagram: {
        title: "Agile QA collaboration loop",
        caption: "A sprint feedback loop: refine, plan, build and test, triage, improve. Illustrative only.",
        alt: "Five connected boxes: refine, plan, build/test, triage, improve.",
        boxes: [
          { t: "Refine", d: "Clarify acceptance criteria" },
          { t: "Plan", d: "Choose scope and data" },
          { t: "Build/test", d: "Feedback during delivery" },
          { t: "Triage", d: "Use evidence and impact" },
          { t: "Improve", d: "Capture lessons and actions" },
        ],
      },
      lab: {
        title: "Triage role-play",
        task: "Decide which behaviours help a defect triage discussion and which do not.",
        categories: ["Useful in triage", "Unhelpful in triage"],
        items: [
          { t: "Share the build, role, steps and request evidence", c: 0 },
          { t: "Say it is obviously broken and demand a fix", c: 1 },
          { t: "State the impact: customers can be charged twice, evidence attached", c: 0 },
          { t: "Blame the developer who wrote the code", c: 1 },
          { t: "Rank testers by their raw bug count", c: 1 },
          { t: "Offer to pair to reproduce it", c: 0 },
        ],
        takeaway: "Objective, reproducible, evidence-based communication resolves disputes; blame and vanity metrics do not.",
        reflection: "Write a three-line triage message for a defect: evidence, impact and your recommendation.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "QA works with the team throughout delivery and reports defects and metrics with context, evidence and honest limits.",
      },
      quiz: [
        q("Good defect communication is:", ["Blaming a person", "Specific, reproducible, and evidence-based", "Only a severity label", "A long message without steps"], 1, "Objective details allow others to act."),
        q("Which is a misuse of metrics?", ["Tracking critical open defects", "Using trend data with definitions", "Ranking individual testers by raw bug count", "Showing requirements coverage"], 2, "Raw counts ignore feature complexity, opportunity, and context."),
        q("During refinement, QA should:", ["Wait for production", "Help clarify acceptance criteria and risk", "Assign blame", "Write only UI colors"], 1, "Early shared understanding improves testability."),
        q("When a defect is disputed, begin with:", ["Personal opinion", "Reproduction evidence and agreed expected behavior", "Who wrote the code", "The loudest voice"], 1, "Evidence and requirements help resolve disagreement."),
        q("A useful release summary includes:", ["Only total test cases", "Coverage, outcomes, important defects, limits, and residual risk", "Only screenshots", "No untested areas"], 1, "Decision-makers need a concise view of evidence and remaining risk."),
      ],
    },
    {
      slug: "api-testing-and-sql-validation",
      n: "4.3",
      title: "API testing with Postman and basic SQL validation",
      minutes: 35,
      objectives: [
        "Build and inspect HTTP requests/responses.",
        "Validate status, headers, body, schema, authorization, and side effects.",
        "Use basic SQL reads to cross-check persisted data.",
      ],
      notes:
        "An API is a contract between software components. For a request, inspect method, URL, headers, query parameters, authorization, and body. For a response, verify status, expected fields/values, content type, schema, error handling, and data side effects. A 200 status is not sufficient if the returned balance or permissions are wrong. Test valid, invalid, missing, boundary, unauthorized, and duplicate requests. SQL can cross-check whether an expected record exists and whether totals or states changed as specified. Start with SELECT and WHERE; use controlled test data and read-only access for learning. Do not expose tokens or connect practice exercises to production databases.",
      example:
        "POST /api/orders returns 201 and orderId. A strong test confirms the response item total, quantity, status, and persistence through a read endpoint or safe database fixture. An invalid quantity should return a documented client error and create no order.",
      diagram: {
        title: "API testing and data validation",
        caption: "Request, response, authorization and side effects. Illustrative only.",
        alt: "Four connected boxes: request, response, authorization, side effects.",
        boxes: [
          { t: "Request", d: "Method, path, headers, body" },
          { t: "Response", d: "Status, body, schema" },
          { t: "Authorization", d: "Role and permission checks" },
          { t: "Side effects", d: "State changed only as expected" },
        ],
      },
      lab: {
        title: "Postman and SQL lab",
        task: "Sort each check into the kind of API or data verification it is.",
        categories: ["Request check", "Response check", "Side-effect check (SQL)"],
        items: [
          { t: "Omit a required field in the body", c: 0 },
          { t: "Verify the status code and body schema", c: 1 },
          { t: "SELECT the order row and confirm total and status", c: 2 },
          { t: "Send a request with an expired token", c: 0 },
          { t: "Confirm an invalid order created no row", c: 2 },
          { t: "Check the Content-Type header", c: 1 },
        ],
        takeaway: "A successful HTTP status alone is not enough; verify the body, authorization and what changed in the data.",
        reflection: "Write the SELECT statement you would use to confirm a seeded order exists with the right status.",
      },
      video: {
        id: "I0RQaztZulA",
        title: "Postman API Testing Tutorial",
        summary: "Send requests, read responses, and check status, body, authorization and side effects. A 200 response alone does not prove the business rule passed.",
      },
      quiz: [
        q("A status code of 200 alone proves:", ["Every business rule passed", "Only that the server returned a success status under the HTTP contract", "No data was changed", "All users are authorized"], 1, "The body, side effects, and business behavior still require assertions."),
        q("Which request is suitable to test missing required data?", ["Send a valid request only", "Omit the required field and verify error behavior", "Change browser theme", "Take a logo screenshot"], 1, "Negative API tests verify validation and error handling."),
        q("Which is sensitive information to exclude from evidence?", ["Endpoint path with no secrets", "A fake status code", "Live bearer token or password", "Public documentation link"], 2, "Tokens and passwords are credentials and must not be shared."),
        q("What does a SQL WHERE clause do?", ["Filters rows by a condition", "Deletes every table automatically", "Changes the browser width", "Creates a test video"], 0, "WHERE narrows rows that satisfy a condition."),
        q("After an invalid order request, what side effect should be checked?", ["An unintended order was not created", "The logo is blue", "The video played", "A new account was always created"], 0, "Validation tests should verify both error response and state changes."),
      ],
    },
  ],
};
