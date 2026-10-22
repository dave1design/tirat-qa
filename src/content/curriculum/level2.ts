import { q, type Level } from "./types";

export const level2: Level = {
  n: 2,
  slug: "manual-testing-fundamentals",
  title: "Manual Testing Fundamentals",
  track: "Manual QA",
  goal: "Design effective tests, understand test levels and types, and choose suitable black-box techniques.",
  prerequisites: "Level 1 completed or equivalent knowledge.",
  outcome: "Write clear test cases and apply smoke, sanity, functional, retest, regression, EP, BVA, decision-table, and state-transition testing.",
  deliverable: "Test cases and a technique-selection exercise.",
  milestone: "Complete the level's manual work sample using the requirements and evidence supplied.",
  interview: [
    "Walk through the parts of a useful test case.",
    "Differentiate smoke, sanity, retesting, and regression with examples.",
    "Explain equivalence partitioning and boundary value analysis.",
    "How would you test a password or quantity field?",
    "How do you decide when exploratory testing is useful?",
  ],
  lessons: [
    {
      slug: "scenarios-cases-data-and-coverage",
      n: "2.1",
      title: "Test scenarios, test cases, test data, and coverage",
      minutes: 25,
      objectives: [
        "Distinguish a high-level scenario from a detailed test case.",
        "Write preconditions, steps, data, expected result, and postconditions.",
        "Use coverage links instead of counting cases alone.",
      ],
      notes:
        "A test scenario describes a user goal or behavior to examine. A test case is a repeatable set of preconditions, steps, data, and expected results. A useful case is specific enough that another tester can reproduce it without asking what the author meant. Test data is part of the case: identify valid, invalid, boundary, duplicate, and role-specific data. Preconditions describe required state; postconditions describe what should be true afterward. Keep one clear objective per case when practical, and avoid assertions so broad that a failure is difficult to localize. Coverage can be measured against requirements, risks, workflows, roles, data partitions, or state transitions. More test cases do not automatically mean better coverage.",
      example:
        'For "update profile email," define: precondition, a signed-in user; data, a valid new email; steps, open profile, edit email, save, reload; expected, the new email persists and validation rejects malformed data. Separate cases may cover duplicate emails and failed network requests.',
      diagram: {
        title: "Anatomy of a repeatable test case",
        caption: "A test case card: objective, preconditions and data, steps, expected result. Illustrative only.",
        alt: "Four connected boxes: objective, preconditions and data, steps, expected result.",
        boxes: [
          { t: "Objective", d: "One clear behavior" },
          { t: "Preconditions/data", d: "Required state and inputs" },
          { t: "Steps", d: "Exact actions" },
          { t: "Expected result", d: "Observable outcome and evidence" },
        ],
      },
      lab: {
        title: "Test-case builder",
        task: "A quantity field accepts whole numbers from 1 to 10. Classify each test idea as a positive, negative or boundary case.",
        categories: ["Positive", "Negative", "Boundary"],
        items: [
          { t: "Enter 5, a typical valid value", c: 0 },
          { t: "Enter 1 and 10", c: 2 },
          { t: "Enter the letters abc", c: 1 },
          { t: "Enter -3", c: 1 },
          { t: "Enter 11, just above the limit", c: 2 },
          { t: "Enter 7", c: 0 },
        ],
        takeaway: "Good coverage mixes valid, invalid and limit values, each with explicit data and an expected result.",
        reflection: "Write one complete test case for the quantity field: preconditions, steps, data and expected result.",
      },
      video: {
        id: "goaZTAzsLMk",
        title: "Software Testing Tutorials for Beginners",
        summary: "A scenario names what to examine; a test case says exactly how, with data and expected results, so anyone can repeat it.",
      },
      quiz: [
        q("A test scenario is usually:", ["A high-level behavior or goal to test", "Always a single click", "A full defect root-cause analysis", "A server log"], 0, "Scenarios express what needs examination; cases detail how."),
        q("Why record test data explicitly?", ["So the test is repeatable and its inputs are clear", "To make every case longer", "To hide assumptions", "To replace expected results"], 0, "Data is part of the conditions needed to reproduce a test."),
        q("Which test case is clearest?", ["Try things and see", "Open profile, enter valid email, save, reload; verify new email persists", "Click around profile", "Email should work"], 1, "Specific steps and an observable expected result support repeatability."),
        q("A useful postcondition for an update operation is:", ["The tester feels satisfied", "The new value persists after reload", "The button was clicked", "The browser is open"], 1, "Persistence should be checked when required by the feature."),
        q("Why is raw test-case count a weak quality metric?", ["It never changes", "It does not show whether critical requirements or risks are covered", "Test cases cannot have IDs", "It measures browser speed"], 1, "Relevance and coverage matter more than count alone."),
      ],
    },
    {
      slug: "test-types",
      n: "2.2",
      title: "Test types: smoke, sanity, functional, retest, regression, and more",
      minutes: 25,
      objectives: [
        "Describe when common testing types are used.",
        "Choose an appropriate testing type for a scenario.",
        "Build interactive experiments that show different scopes and purposes.",
      ],
      notes:
        "Smoke testing is a broad, shallow check that a new build's essential paths work well enough for further testing. Sanity testing is a narrow check of a focused change or area after a small change, often before deeper verification. Functional testing checks behavior against requirements. Retesting (confirmation testing) reruns a test that previously failed to verify a specific fix. Regression testing checks whether changes broke previously working behavior. Integration testing examines interactions among components; system testing evaluates the integrated system; acceptance testing checks suitability against business/user acceptance criteria. These labels may vary across teams, so ask how the organization defines them. A test type describes purpose/scope; a test level describes where or at what integration level testing occurs.",
      example:
        "A new build is deployed: run smoke checks on login, search, add to cart, and checkout availability. A coupon defect is fixed: retest that exact condition. Then run regression on cart totals, discount stacking, stock validation, and order creation.",
      diagram: {
        title: "Select a test activity by purpose",
        caption: "Smoke, sanity, functional and retest/regression compared by the question each answers. Illustrative only.",
        alt: "Four connected boxes: smoke asks if the build is testable, sanity asks if the changed area is healthy, functional asks if behavior meets requirements, retest and regression confirm the fix and guard old behavior.",
        boxes: [
          { t: "Smoke", d: "Is the build testable?" },
          { t: "Sanity", d: "Is the changed area healthy?" },
          { t: "Functional", d: "Does behavior meet requirements?" },
          { t: "Retest/regression", d: "Confirm the fix and guard old behavior" },
        ],
      },
      lab: {
        title: "Test-type selector",
        task: "For each situation, choose the testing type that fits best.",
        categories: ["Smoke", "Sanity", "Retest", "Regression"],
        items: [
          { t: "A new build is deployed; check login, search, cart and checkout open", c: 0 },
          { t: "A coupon calculation changed; check that rule and its neighbours", c: 1 },
          { t: "Rerun the exact steps of a defect that was fixed", c: 2 },
          { t: "After a cart change, rerun earlier-working coupon stacking and stock updates", c: 3 },
          { t: "Quick check that the build is stable enough to test", c: 0 },
          { t: "Confirm a reported failing case now passes", c: 2 },
        ],
        takeaway: "Smoke is broad and shallow, sanity is narrow and focused, retesting confirms one fix, regression guards everything that used to work.",
        reflection: "A smoke test fails on login. What do you do next, and why does it block deeper testing?",
      },
      video: {
        id: "rWf-ZqHaL64",
        title: "Smoke and Sanity Testing",
        summary: "Smoke checks whether a build is stable enough to test; sanity checks a focused change. Retesting confirms a fix and regression protects existing behavior.",
      },
      quiz: [
        q("Smoke testing mainly asks:", ["Is the build stable enough for deeper testing?", "Did one isolated bug fix work?", "Did all old features regress?", "Is every requirement accepted by customers?"], 0, "Smoke checks essential areas broadly and shallowly."),
        q("After a specific bug fix, rerunning the formerly failing case is:", ["Regression only", "Retesting/confirmation testing", "Load testing", "Compatibility testing"], 1, "Retesting confirms the reported failure is fixed."),
        q("Regression testing asks whether:", ["A fix worked only once", "Changes broke previously working behavior", "A design matches Figma only", "An API returns one status code"], 1, "Regression protects existing behavior from unintended side effects."),
        q("A build has a broken login page and cannot proceed. What is appropriate first?", ["Full exhaustive regression", "Smoke test failure blocks deeper testing", "Ignore login", "Only accessibility testing"], 1, "A critical-path smoke failure can make deeper testing unreliable."),
        q("Sanity testing is usually:", ["Focused around a change or area", "Always broader than system testing", "The same as user acceptance testing", "A security certification"], 0, "Sanity is a narrow confidence check on a focused change."),
      ],
    },
    {
      slug: "black-box-techniques",
      n: "2.3",
      title: "Black-box techniques: EP, BVA, decision tables, state transitions, exploratory",
      minutes: 30,
      objectives: [
        "Use equivalence partitions and boundaries to reduce redundant tests.",
        "Derive tests from condition/action combinations and state changes.",
        "Conduct time-boxed exploratory sessions with evidence.",
      ],
      notes:
        "Equivalence Partitioning (EP) groups inputs expected to behave similarly; select representative values from valid and invalid groups. Boundary Value Analysis (BVA) emphasizes values at and near limits because off-by-one errors are common. Decision tables map combinations of conditions to expected actions, useful for coupons, permissions, and policy rules. State-transition testing checks allowed and forbidden transitions, such as Draft → Submitted → Approved, and whether the system behaves correctly after each event. Exploratory testing combines learning, test design, and execution; a charter keeps the session focused and notes record findings. Techniques complement each other: use boundaries for ranges, decision tables for combinations, and state transitions for lifecycle behavior.",
      example:
        "A quantity is allowed from 1 to 10. EP groups: invalid below range, valid range, invalid above range. BVA examples: 0, 1, 2, 9, 10, 11. The specification, not an assumption, must define the endpoints.",
      diagram: {
        title: "Black-box test design",
        caption: "Four techniques and what each one chooses. Illustrative only.",
        alt: "Four connected boxes: EP chooses representative input groups, BVA tests limits and nearby values, decision tables cover condition combinations, state transitions check allowed and forbidden moves.",
        boxes: [
          { t: "EP", d: "Choose representative input groups" },
          { t: "BVA", d: "Test limits and values nearby" },
          { t: "Decision tables", d: "Cover condition combinations" },
          { t: "State transitions", d: "Check allowed and forbidden moves" },
        ],
      },
      lab: {
        title: "Technique picker",
        task: "Choose the technique that suits each scenario best.",
        categories: ["EP / BVA", "Decision table", "State transition", "Exploratory"],
        items: [
          { t: "A quantity field accepts 1 to 10", c: 0 },
          { t: "A coupon depends on customer type, validity and minimum cart total", c: 1 },
          { t: "A shipment moves Created, then Dispatched, then Delivered", c: 2 },
          { t: "There is no spec yet; learn a new screen in a 30-minute charter", c: 3 },
          { t: "An age field allows 18 to 65", c: 0 },
          { t: "Permissions depend on role and account-status combinations", c: 1 },
        ],
        takeaway: "Use boundaries for ranges, decision tables for combinations, state transitions for lifecycles, and exploration when you need to learn while testing.",
        reflection: "For a 1 to 10 quantity field, list the six BVA values you would run and why each matters.",
      },
      video: {
        id: "P1Hv2sUPKeM",
        title: "Boundary Value Analysis and Equivalence Partitioning",
        summary: "Group inputs that behave alike, then test the edges of each group where off-by-one mistakes hide.",
      },
      quiz: [
        q("EP reduces effort by:", ["Testing every possible value", "Testing representative values from behaviorally similar groups", "Skipping invalid inputs", "Testing only the midpoint"], 1, "Equivalent partitions support representative selection."),
        q("For allowed integers 1-10, which set best represents BVA?", ["3,4,5 only", "0,1,2,9,10,11", "100 and 200 only", "Only 5"], 1, "Values at and just outside both limits are informative."),
        q("A decision table is especially useful when:", ["Many conditions combine to change an outcome", "The page has an image", "Only font size is tested", "No rules exist"], 0, "Decision tables expose condition/action combinations."),
        q("State-transition testing focuses on:", ["Only field length", "States, events, and allowed/forbidden transitions", "Video playback", "Number of files"], 1, "It checks valid lifecycle movement and responses to events."),
        q("A time-boxed exploratory charter should state:", ["A focused goal and scope", "A promise to test everything", "Only a bug title", "The answer key"], 0, "Charters help exploration stay focused while preserving learning."),
      ],
    },
  ],
};
