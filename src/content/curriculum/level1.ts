import { q, type Level } from "./types";

export const level1: Level = {
  n: 1,
  slug: "qa-foundations",
  title: "QA Foundations",
  track: "Foundations",
  goal: "Build a mental model of software quality and understand how QA fits into product delivery.",
  prerequisites: "None. Designed for complete beginners.",
  outcome: "Explain testing purpose, read requirements, identify testable acceptance criteria, and describe a delivery lifecycle.",
  deliverable: "Read and clarify a small BRD; produce acceptance-criteria questions.",
  milestone: "Complete the level's manual work sample using the requirements and evidence supplied.",
  interview: [
    "What is the difference between QA, QC, and testing? Give a workplace example.",
    "When should testing begin, and why?",
    "Explain SDLC and STLC in your own words.",
    "How would you clarify an ambiguous requirement?",
    'What would you do if a stakeholder says "just test everything"?',
  ],
  lessons: [
    {
      slug: "quality-qa-qc-and-testing",
      n: "1.1",
      title: "Software quality, QA, QC, and testing",
      minutes: 20,
      objectives: [
        "Explain QA, QC, and testing in plain language.",
        "Recognize why testing cannot prove the absence of every defect.",
        "Prioritize testing by user and business risk.",
      ],
      notes:
        "Quality means meeting user needs reliably, safely, accessibly, and consistently; it is not simply the absence of visible bugs. Quality Assurance (QA) focuses on improving the processes that help prevent defects. Quality Control (QC) evaluates a product or output against expectations. Software testing is a set of activities used to reveal defects and provide evidence about quality and risk. Testing can show that defects exist, but cannot prove that none exist. Exhaustive testing is impractical when inputs, roles, states, and integrations combine into many possibilities. Testing is context-dependent: a duplicate charge or exposed patient record deserves more attention than a small decorative spacing issue. A passing test only supports the particular condition and assertions exercised; it does not certify the whole system as perfect.",
      example:
        "An online store places an order and charges the customer twice. The page may look visually correct, yet the business outcome is wrong. A QA mindset asks whether the requirement was clear, payment operation was designed safely, and checks can detect duplicate submissions.",
      diagram: {
        title: "Quality roles: QA, QC, and testing",
        caption: "QA prevents defects through process, QC evaluates the product, and testing runs concrete checks. Illustrative only.",
        alt: "Three connected boxes: QA improves the process to prevent defects, QC evaluates product output against expectations, testing runs checks and gathers evidence.",
        boxes: [
          { t: "QA", d: "Improve the process to prevent defects" },
          { t: "QC", d: "Evaluate product output against expectations" },
          { t: "Testing", d: "Run checks and gather evidence" },
        ],
      },
      lab: {
        title: "Risk-sorting lab",
        task: "Sort each activity into the role it plays: process prevention (QA), product evaluation (QC), or test execution.",
        categories: ["Process prevention (QA)", "Product evaluation (QC)", "Test execution"],
        items: [
          { t: "Review requirements before coding starts", c: 0 },
          { t: "Inspect the finished build against the acceptance criteria", c: 1 },
          { t: "Enter a duplicate payment and observe the result", c: 2 },
          { t: "Agree a definition-of-done checklist with the team", c: 0 },
          { t: "Review results before signing off a release candidate", c: 1 },
          { t: "Click Submit with an empty form", c: 2 },
        ],
        takeaway: "QA works on the process, QC judges the output, testing produces the evidence. A duplicate payment outranks a footer typo because its user and business impact is far higher.",
        reflection: "Rank a duplicate payment, a slow checkout and a footer typo by impact, and explain your ranking in two sentences.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "Testing gives evidence about quality and risk. It reveals defects but cannot prove there are none, so effort is directed at the risks that matter most.",
      },
      quiz: [
        q("What is the main purpose of software testing?", ["Prove the product has no bugs", "Reveal evidence about quality and risk", "Replace requirements analysis", "Guarantee that every user succeeds"], 1, "Testing provides evidence; it cannot prove all defects are absent."),
        q("Which is a preventive QA activity?", ["Improve the requirements-review process", "Click Submit on a form", "Reproduce a failed checkout", "Close a verified bug"], 0, "QA improves the process that creates the product."),
        q("A test passes with one input. What can you conclude?", ["All inputs are correct", "The application is defect-free", "The tested condition behaved as expected", "No future regression is possible"], 2, "A pass applies to the tested condition and assertion."),
        q("Why is exhaustive testing usually impractical?", ["Testers cannot write notes", "Inputs, states, and combinations can be enormous", "Browsers cannot run tests", "Only developers can test"], 1, "Combinatorial complexity makes exhaustive coverage unrealistic."),
        q("Which issue usually deserves highest initial attention?", ["A duplicate payment", "A slight footer color mismatch", "An optional tooltip missing", "One-pixel spacing variance"], 0, "Prioritize by user impact, likelihood, and business risk."),
      ],
    },
    {
      slug: "sdlc-stlc-roles-and-agile",
      n: "1.2",
      title: "SDLC, STLC, team roles, and Agile basics",
      minutes: 20,
      objectives: [
        "Describe SDLC stages and where testing contributes.",
        "Distinguish product-delivery work from testing-specific activities.",
        "Explain how QA collaborates with product, design, and engineering.",
      ],
      notes:
        "The Software Development Life Cycle (SDLC) describes delivery from idea and requirements through design, implementation, verification, release, and operation. The Software Testing Life Cycle (STLC) organizes test-focused activities: requirement analysis, planning, test design, environment/data preparation, execution, defect reporting, and closure. They overlap rather than happen in isolated silos. QA can review requirements before code exists, prepare data while developers implement a story, and verify fixes after a build. Agile teams deliver in smaller increments and commonly use refinement, planning, daily coordination, review, and retrospective. Testers contribute throughout delivery by clarifying acceptance criteria, assessing risk, designing scenarios, testing increments, and communicating release risk.",
      example:
        "A team adds appointment rescheduling. Before coding, QA asks what happens if the doctor becomes unavailable, a patient already has another appointment, or the change request occurs just before the visit. Clarifying these questions early prevents disagreement later.",
      diagram: {
        title: "SDLC and STLC overlap",
        caption: "Testing activities run across every delivery phase. Illustrative only.",
        alt: "Four connected phases: Discover, Design/build, Verify, Learn, each with the testing activity that belongs to it.",
        boxes: [
          { t: "Discover", d: "Goals and requirements" },
          { t: "Design/build", d: "Clarify testability early" },
          { t: "Verify", d: "Execute, report, retest" },
          { t: "Learn", d: "Release evidence and improve" },
        ],
      },
      lab: {
        title: "Lifecycle placement lab",
        task: "Place each activity on the delivery timeline where it mainly belongs.",
        categories: ["Discover", "Design/build", "Verify", "Learn"],
        items: [
          { t: "Requirement clarification", c: 0 },
          { t: "Test-data setup while developers build", c: 1 },
          { t: "Regression execution", c: 2 },
          { t: "Escaped-defect review", c: 3 },
          { t: "Review acceptance criteria in refinement", c: 0 },
          { t: "Retest a fixed defect", c: 2 },
        ],
        takeaway: "Some activities span several stages. Placing them where they mainly happen shows why testing starts long before a build exists.",
        reflection: "Which activity on the timeline could your team start earlier, and what would that prevent?",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "SDLC describes how software is delivered and STLC organizes the testing work inside it. QA contributes from requirements through release, not only at the end.",
      },
      quiz: [
        q("Which statement best compares SDLC and STLC?", ["STLC replaces SDLC", "SDLC describes delivery; STLC organizes testing work", "STLC starts only after release", "They are always identical"], 1, "Testing is part of the wider delivery lifecycle."),
        q("When should QA begin contributing?", ["After all coding ends", "Only in the last release week", "During requirements and design discussions", "After customers report failures"], 2, "Early feedback catches ambiguity before rework becomes expensive."),
        q("A sprint retrospective primarily helps a team:", ["Demonstrate features to customers", "Improve the way it works", "Close every open defect", "Replace testing with discussion"], 1, "Retrospectives focus on process improvement."),
        q("A requirement is unclear before coding. What should QA do?", ["Guess silently", "Wait until release", "Ask focused questions and document the decision", "Create a production defect"], 2, "Clarifying expected behavior is better than making hidden assumptions."),
        q("Who normally makes the final business decision to release?", ["The tester alone", "The accountable product/release decision-maker", "A browser", "The bug-report template"], 1, "QA reports evidence and risk; release authority is defined by the organization."),
      ],
    },
    {
      slug: "brds-user-stories-and-traceability",
      n: "1.3",
      title: "BRDs, user stories, acceptance criteria, and traceability",
      minutes: 25,
      objectives: [
        "Find testable requirements in a BRD or user story.",
        "Identify ambiguity, missing conditions, and acceptance criteria.",
        "Connect requirements to tests and results.",
      ],
      notes:
        'A Business Requirements Document (BRD) captures business goals, scope, actors, rules, and constraints. A user story summarizes a user need, while acceptance criteria describe conditions that must hold for the story to be accepted. Good criteria use clear outcomes and observable conditions instead of vague words such as "fast," "easy," or "secure." Ask about normal paths, invalid inputs, boundaries, permissions, errors, and what should happen when dependencies fail. Requirements traceability connects requirements to test scenarios, test results, and defects. It helps show what is covered and what is still unknown. When BRD, design, and implementation disagree, do not silently choose the version you prefer: record the conflict and request an agreed decision.',
      example:
        'Vague criterion: "Checkout should be fast." More testable version: "For a valid cart with available items, the confirmation page appears within the agreed response target under the documented test load." The business owner must supply the actual time and load target; QA should not invent them.',
      diagram: {
        title: "Requirements traceability",
        caption: "Each requirement links to acceptance criteria, test scenarios, results and defects. Illustrative only.",
        alt: "Four connected boxes: BRD, acceptance criteria, test scenarios, results and defects.",
        boxes: [
          { t: "BRD", d: "Business need and rules" },
          { t: "Acceptance criteria", d: "Observable outcomes" },
          { t: "Test scenarios", d: "Planned checks and data" },
          { t: "Results/defects", d: "Coverage and evidence" },
        ],
      },
      lab: {
        title: "Requirements clinic",
        task: "Decide whether each requirement from a fictional appointment-booking BRD is testable as written or ambiguous.",
        categories: ["Testable", "Ambiguous"],
        items: [
          { t: "A valid booking displays a confirmation reference", c: 0 },
          { t: "The screen should feel nice", c: 1 },
          { t: "Checkout should be fast", c: 1 },
          { t: "Passwords shorter than 8 characters show an error message", c: 0 },
          { t: "The app should be modern", c: 1 },
          { t: "Applying a filter updates the visible results", c: 0 },
        ],
        takeaway: "Testable criteria describe an observable outcome. Vague words need clarification questions before reliable testing can start.",
        reflection: "Pick one ambiguous requirement and write the clarification question you would ask the business owner.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "A requirement is only testable when it describes an observable outcome. When documents disagree, record the conflict and ask for a decision instead of choosing silently.",
      },
      quiz: [
        q("Which acceptance criterion is most testable?", ["The screen should feel nice", "The app should be modern", "A valid booking displays a confirmation reference", "The workflow should be perfect"], 2, "Observable outcomes can be verified."),
        q("Traceability connects requirements with:", ["Only team names", "Tests, results, and related defects", "Color palettes only", "Marketing budget"], 1, "Links help demonstrate coverage and assess change impact."),
        q("When BRD and Figma contradict each other, QA should:", ["Choose one secretly", "Ignore the mismatch", "Record it and request an agreed decision", "Assume Figma always wins"], 2, "Conflicts require clarification; the tester should not invent policy."),
        q("Which detail is a useful clarification for a booking rule?", ["Should unavailable slots be disabled or show an error?", "What is the developer's favorite editor?", "Can the footer use more shadows?", "What music does the user prefer?"], 0, "The question affects expected functional behavior."),
        q('A requirement says "search is easy to use." It is:', ["A precise numeric criterion", "Potentially ambiguous and needing measurable/user-observable criteria", "A valid API response", "A defect by itself"], 1, "Vague wording needs clarification before reliable testing."),
      ],
    },
  ],
};
