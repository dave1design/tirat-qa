import "server-only";
import { db } from "./db";

/** Maps a topic listed on the Learn page to the article that covers it. Only linked when that article is published. */
export const TOPIC_ARTICLE: Record<string, string> = {
  "What is software testing?": "what-is-software-testing",
  "QA vs. testing": "qa-vs-testing",
  "Exploratory testing": "exploratory-testing",
  "Positive and negative testing": "positive-and-negative-testing",
  "Boundary-value analysis": "boundary-value-analysis",
  "Anatomy of a good bug report": "how-to-write-a-bug-report",
  "Severity vs. priority": "severity-vs-priority",
  "Testing forms and validation": "testing-form-validation",
  "Creating a basic test checklist": "your-first-website-testing-checklist",
};

export async function publishedArticles() {
  return db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { slug: true, title: true, summary: true, category: true },
  });
}
