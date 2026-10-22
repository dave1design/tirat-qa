import { q, type Level } from "./types";

export const level5: Level = {
  n: 5,
  slug: "advanced-manual-qa-and-domains",
  title: "Advanced Manual QA and Domain Capstones",
  track: "Professional QA",
  goal: "Apply non-functional testing, learn industry-specific workflows, and deliver a complete manual QA assessment.",
  prerequisites: "Levels 1 to 4 completed.",
  outcome: "Explore complex workflows across business domains, identify high-risk defects, and write a release-quality test summary.",
  deliverable: "Full manual QA pack and release summary.",
  milestone: "Complete the level's manual work sample using the requirements and evidence supplied.",
  interview: [
    "How do you distinguish functional from non-functional testing?",
    "How would you test a shipment state machine?",
    "What risks arise in healthcare scheduling or finance?",
    "How do you decide whether a release is ready?",
    "Describe an end-to-end QA cycle from BRD to closure.",
  ],
  lessons: [
    {
      slug: "non-functional-testing",
      n: "5.1",
      title: "Non-functional testing: accessibility, performance, security, and compatibility",
      minutes: 30,
      objectives: [
        "Distinguish functional outcomes from quality attributes.",
        "Perform safe accessibility, performance, and security checks.",
        "Record environment and evidence so results are meaningful.",
      ],
      notes:
        "Functional testing asks whether the system does the right thing; non-functional testing examines qualities such as speed, accessibility, reliability, security, usability, and compatibility. Accessibility checks include keyboard operation, focus visibility, labels, headings, contrast, and meaningful error announcements; automated tools can help but do not replace manual assistive-technology checks. Performance testing must define workload, environment, metrics, and acceptable thresholds before results can be interpreted. Security testing in this course stays authorized and safe: check role boundaries, session handling, input validation, information exposure, and common configuration mistakes without attacking external systems. Compatibility checks use the documented browser/device matrix. Report conditions and limits so findings can be reproduced.",
      example:
        "A patient can book an appointment by mouse but cannot reach the confirmation button with a keyboard. The booking feature works for one interaction method but fails an accessibility requirement.",
      diagram: {
        title: "Non-functional test dimensions",
        caption: "Four quality attributes, each with its own technique and limits. Illustrative only.",
        alt: "Four connected boxes: accessibility, performance, security, compatibility.",
        boxes: [
          { t: "Accessibility", d: "Keyboard and assistive usage" },
          { t: "Performance", d: "Defined workload and thresholds" },
          { t: "Security", d: "Authorized, safe role checks" },
          { t: "Compatibility", d: "Supported platforms and viewports" },
        ],
      },
      lab: {
        title: "Accessibility and quality lab",
        task: "Match each check to the quality attribute it examines.",
        categories: ["Accessibility", "Performance", "Security", "Compatibility"],
        items: [
          { t: "Navigate the booking form using only the keyboard", c: 0 },
          { t: "Measure response time under a defined workload", c: 1 },
          { t: "Check one role cannot open another role's page", c: 2 },
          { t: "Run checkout on the supported browser list", c: 3 },
          { t: "Check that every input has a label", c: 0 },
          { t: "Confirm tokens are not shown in the page", c: 2 },
        ],
        takeaway: "Each attribute needs its own technique, defined conditions and safe, authorized scope.",
        reflection: "Which non-functional check would matter most for a booking system, and what evidence would you record?",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "Quality is more than features working: speed, accessibility, security and compatibility each need defined conditions to be meaningful.",
      },
      quiz: [
        q("Functional testing asks whether:", ["Behavior matches requirements", "Every page is fast under all loads", "Color contrast is always perfect", "Code has no vulnerabilities"], 0, "Functional tests verify expected behavior."),
        q("An accessibility keyboard check should include:", ["Reaching interactive controls and seeing focus", "Only mouse hover", "Disabling labels", "Testing only font choice"], 0, "Keyboard operation and focus visibility are important basics."),
        q("A performance result is hard to interpret without:", ["A defined workload and environment", "A favorite browser theme", "A page title only", "A long bug title"], 0, "Performance is meaningful only in context."),
        q("Security practice exercises should be performed:", ["Against any public website", "Only in authorized, controlled environments", "With real customer accounts", "Without recording scope"], 1, "Testing authorization and safety boundaries is essential."),
        q("Compatibility scope should reflect:", ["Every device ever invented", "Supported platforms and risk", "Only the tester's personal laptop", "No documented assumptions"], 1, "Use an explicit support matrix and risk-based scope."),
      ],
    },
    {
      slug: "domain-qa",
      n: "5.2",
      title: "Domain QA across logistics, POS, warehouse, e-commerce, LMS, finance, and healthcare",
      minutes: 35,
      objectives: [
        "Identify domain invariants and high-risk workflows.",
        "Test status transitions, calculations, permissions, and data integrity.",
        "Adapt generic test techniques to business context.",
      ],
      notes:
        "Domain-specific systems have invariants: conditions that should remain true throughout workflows. Logistics requires valid shipment transitions and reliable proof of delivery. Food POS requires correct totals, modifiers, tax, payment, kitchen status, and cancellation handling. Inventory requires stock balance integrity, reservation behavior, and transfer consistency. E-commerce needs price, coupon, cart, inventory, and order consistency. LMS requires enrollment permissions, grading, prerequisites, and student privacy. Finance needs exact calculations, duplicate-transaction protection, and authorization; use simulated values only. Healthcare scheduling requires correct availability, no conflicting bookings, role boundaries, and privacy; use fictional patient data only. For each workflow, test normal, invalid, boundary, duplicate, interrupted, and unauthorized paths.",
      example:
        "Warehouse: start with 8 units in Bin A. Transfer 3 to Bin B. Expected result: A=5, B=3, total=8. If A becomes 5 but B remains 2, stock conservation is broken. Check audit history and concurrent transfer behavior in controlled scenarios.",
      diagram: {
        title: "Domain invariants",
        caption: "A business action, the rule that must stay true, the state to verify and the evidence. Illustrative only.",
        alt: "Four connected boxes: business action, expected invariant, verify state, evidence.",
        boxes: [
          { t: "Business action", d: "Transfer, payment, booking, or grading" },
          { t: "Expected invariant", d: "The rule that must remain true" },
          { t: "Verify state", d: "Compare resulting records and statuses" },
          { t: "Evidence", d: "Audit trail and reproducible steps" },
        ],
      },
      lab: {
        title: "Domain challenge",
        task: "Match each invariant to the domain it protects.",
        categories: ["Warehouse", "Banking (simulated)", "Healthcare scheduling (fictional)", "LMS"],
        items: [
          { t: "Total stock stays the same after a bin transfer", c: 0 },
          { t: "A duplicate transfer must not be processed twice", c: 1 },
          { t: "A cancelled slot becomes bookable again", c: 2 },
          { t: "A student must not see another student's submission", c: 3 },
          { t: "Insufficient funds must be rejected", c: 1 },
          { t: "Two patients cannot hold the same exclusive slot", c: 2 },
        ],
        takeaway: "Every domain has invariants. Name the rule first, then test normal, invalid, duplicate, interrupted and unauthorized paths against it.",
        reflection: "Pick one domain, name its key invariant and list two failure paths you would test.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "Each business domain has rules that must always hold. Find the rule, then try to break it with normal, invalid, duplicate and unauthorized actions.",
      },
      quiz: [
        q("For a stock transfer of 3 units from A(8) to B(1), a basic invariant is:", ["Total becomes 6", "Source and destination quantities update consistently and total remains 9", "Destination becomes negative", "History is optional regardless of requirement"], 1, "A transfer should preserve total stock unless a documented rule says otherwise."),
        q("A shipment marked Delivered without proof when proof is required is likely a:", ["State/business-rule defect", "Pure font issue", "Browser compatibility only", "Expected outcome automatically"], 0, "Workflow invariants derive from the requirement."),
        q("For a simulated banking transfer, test:", ["Only button style", "Duplicate submission, insufficient funds, authorization, and balance consistency", "Only page title", "Real bank credentials"], 1, "Financial invariants and safe simulated data matter."),
        q("For healthcare scheduling, an important check is:", ["Two patients can always own the same exclusive slot", "A cancelled appointment no longer blocks availability when required", "Patient data can appear in public logs", "No role tests are needed"], 1, "Availability and patient privacy are core risks."),
        q("In an LMS, a student trying to view another student's private submission tests:", ["Authorization and privacy", "Only color contrast", "Only video playback", "Stock balance"], 0, "Roles and record-level permissions must be verified."),
      ],
    },
    {
      slug: "end-to-end-qa-and-release-readiness",
      n: "5.3",
      title: "End-to-end QA cycle, release readiness, and manual QA interview prep",
      minutes: 30,
      objectives: [
        "Bring requirements, testing, defects, and risk together in one engagement.",
        "Prepare a concise test summary report.",
        "Practice scenario-based interview answers with evidence and trade-offs.",
      ],
      notes:
        'An end-to-end QA cycle begins with requirement analysis and clarification, continues through risk-based planning, scenarios/cases, data and environment preparation, test execution, defect reporting, retest, regression, and closure. A test summary reports what was tested, key results, important open defects, known limitations, and residual risk. Release readiness is not simply "all tests pass": it depends on the agreed exit criteria, severity of remaining issues, test coverage, environment confidence, and accountable release decision. Interview answers should use a structured example: context, goal, steps, evidence, result, and lesson. Be honest about what you personally did and what remains a limitation. Build a portfolio with sanitized artefacts rather than making unsupported claims.',
      example:
        'After a checkout release candidate, 92 of 100 planned cases pass; 5 are blocked by unavailable service and 3 fail, including one duplicate-order risk. A professional summary lists each category, explains the release risk, and recommends a decision against agreed criteria rather than calling the release "good" or "bad" without context.',
      diagram: {
        title: "Release readiness is an evidence-based decision",
        caption: "Coverage, results, critical defects and residual risk feed the decision. Illustrative only.",
        alt: "Four connected boxes: coverage, results, critical defects, residual risk.",
        boxes: [
          { t: "Coverage", d: "What was tested" },
          { t: "Results", d: "Pass, fail, blocked" },
          { t: "Critical defects", d: "Known high-risk issues" },
          { t: "Residual risk", d: "Limits and recommendation" },
        ],
      },
      lab: {
        title: "Release simulation",
        task: "Decide what belongs in a one-page test summary and what you must never do.",
        categories: ["Include in the summary", "Never do"],
        items: [
          { t: "Scope and outcomes", c: 0 },
          { t: "Record blocked tests as passed", c: 1 },
          { t: "Open high-risk defects and residual risk", c: 0 },
          { t: "Hide a critical payment defect to meet the date", c: 1 },
          { t: "Known limitations", c: 0 },
          { t: 'Call the release "good" with no criteria', c: 1 },
        ],
        takeaway: "QA provides evidence and risk. The accountable owner decides the release against agreed criteria.",
        reflection: "Write the first three lines of a test summary for a release with 92 passes, 5 blocked and 3 failures.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "A release summary lists coverage, results, important defects, limits and residual risk so the accountable owner can decide with the full picture.",
      },
      quiz: [
        q("A useful test summary includes:", ["Only a pass percentage", "Scope, outcomes, major defects, limitations, and residual risk", "Only tester names", "No blocked tests"], 1, "Decision-makers need both evidence and limitations."),
        q("If a critical payment defect remains, the tester should:", ["Hide it to meet the date", "Communicate evidence and risk through the agreed process", "Mark every test passed", "Make the release decision alone"], 1, "QA provides evidence; the accountable authority decides release."),
        q("A strong interview story includes:", ["Claims without examples", "Context, action, evidence, result, and learning", "Only tool names", "Another person's work as your own"], 1, "Structured truthful examples demonstrate judgment."),
        q("When a test is blocked, record:", ["It passed", "The blocker, affected coverage, and risk", "Nothing", "A random severity"], 1, "Blocked tests are not passes and reduce confidence."),
        q("A useful portfolio should use:", ["Real private customer data", "Sanitized artefacts with clear ownership and explanation", "Only unsupported certificates", "Screenshots that reveal tokens"], 1, "Portfolio evidence must be safe and accurately represented."),
      ],
    },
  ],
};
