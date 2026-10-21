export const ROLES = ["LEARNER", "CONTENT_CREATOR", "REVIEWER", "ADMIN", "OWNER"] as const;
export type Role = (typeof ROLES)[number];

/** Roles allowed into the admin area, and what each can do there. */
export const ADMIN_ROLES: Role[] = ["CONTENT_CREATOR", "REVIEWER", "ADMIN", "OWNER"];
export const CAPABILITIES = {
  content: ["CONTENT_CREATOR", "ADMIN", "OWNER"],
  review: ["REVIEWER", "ADMIN", "OWNER"],
  payments: ["ADMIN", "OWNER"],
  users: ["ADMIN", "OWNER"],
  messages: ["ADMIN", "OWNER"],
} as const satisfies Record<string, readonly Role[]>;
export type Capability = keyof typeof CAPABILITIES;

export const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type Severity = (typeof SEVERITIES)[number];
export const SEVERITY_HELP: Record<Severity, string> = {
  LOW: "Cosmetic or minor; the user can easily work around it.",
  MEDIUM: "A feature behaves incorrectly but a workaround exists.",
  HIGH: "A key feature is broken or data is wrong; no easy workaround.",
  CRITICAL: "Security, data loss or the app is unusable.",
};

export const EXPERIENCE_LEVELS = [
  { value: "NEW", title: "I'm New to QA", text: "I'm learning software testing and want to start with the basics." },
  { value: "BASICS", title: "I Know the Basics", text: "I understand testing concepts and want more hands-on practice." },
  { value: "TESTER", title: "I'm Already a Tester", text: "I have testing experience and want to strengthen my skills." },
] as const;

export const LEARNING_GOALS = [
  { value: "FIND_BUGS", title: "Finding and identifying bugs." },
  { value: "WRITE_REPORTS", title: "Writing better bug reports." },
  { value: "JOB_PREP", title: "Preparing for a QA job." },
  { value: "TECHNIQUES", title: "Improving my testing techniques." },
] as const;

export const LEARN_CATEGORIES = [
  {
    slug: "fundamentals",
    index: "01",
    name: "Software Testing Fundamentals",
    description: "Understand the purpose of software testing and the role of QA in building reliable digital products.",
    cta: "Explore Fundamentals",
    topics: [
      "What is software testing?",
      "What is Quality Assurance?",
      "QA vs. testing",
      "Manual testing fundamentals",
      "Software development and testing lifecycle",
      "Verification and validation",
    ],
  },
  {
    slug: "techniques",
    index: "02",
    name: "Testing Techniques",
    description: "Learn different approaches to investigating software behavior and identifying potential defects.",
    cta: "Explore Testing Techniques",
    topics: [
      "Functional testing",
      "Exploratory testing",
      "UI testing",
      "Usability testing",
      "Regression testing",
      "Positive and negative testing",
      "Boundary-value analysis",
      "Equivalence partitioning",
    ],
  },
  {
    slug: "bug-reporting",
    index: "03",
    name: "Bug Reporting",
    description:
      "Learn how to communicate defects clearly so that another person can understand, reproduce, and investigate them.",
    cta: "Learn Bug Reporting",
    topics: [
      "What is a bug?",
      "Anatomy of a good bug report",
      "Writing a clear bug title",
      "Steps to reproduce",
      "Expected vs. actual results",
      "Severity vs. priority",
      "Screenshots and supporting evidence",
    ],
  },
  {
    slug: "practical-tips",
    index: "04",
    name: "Practical Testing Tips",
    description: "Develop a systematic approach to exploring websites and investigating unexpected behavior.",
    cta: "Explore Practical Tips",
    topics: [
      "How to test a website",
      "Testing forms and validation",
      "Testing navigation and links",
      "Testing user interactions",
      "Exploring edge cases",
      "Identifying usability issues",
      "Creating a basic test checklist",
    ],
  },
] as const;
export type LearnCategorySlug = (typeof LEARN_CATEGORIES)[number]["slug"];

/** Published scoring rules (shown to learners on the results page). */
export const SCORING = {
  passThreshold: 0.7,
  qualityMax: 5,
  severityMax: 2,
  falsePositivePenalty: 1,
  autoMatchConfidence: 0.67,
  reviewConfidence: 0.34,
  maxReportsPerAttempt: 40,
  minSecondsBetweenReports: 4,
} as const;

export const EVIDENCE = {
  maxBytes: 2 * 1024 * 1024,
  types: { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" } as Record<string, string>,
} as const;

export const SESSION_COOKIE = "tirat_session";
export const SESSION_TTL_DAYS = 7;
export const SESSION_TTL_REMEMBER_DAYS = 30;
