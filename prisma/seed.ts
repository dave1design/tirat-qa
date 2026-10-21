import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import { articles, sites } from "./seed-data";

const db = new PrismaClient();

async function main() {
  const password = process.env.SEED_PASSWORD ?? "TiratQA#2026";
  const salt = randomBytes(16);
  const hash = `scrypt$16384$${salt.toString("base64")}$${scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 }).toString("base64")}`;

  // Staff and demo accounts (development / pilot only)
  const people = [
    { email: "owner@tirat.test", name: "Owner Account", role: "OWNER" },
    { email: "admin@tirat.test", name: "Admin Operator", role: "ADMIN" },
    { email: "reviewer@tirat.test", name: "Report Reviewer", role: "REVIEWER" },
    { email: "content@tirat.test", name: "Content Creator", role: "CONTENT_CREATOR" },
    { email: "learner@tirat.test", name: "Demo Learner", role: "LEARNER" },
  ];
  for (const p of people) {
    await db.user.upsert({
      where: { email: p.email },
      create: { ...p, passwordHash: hash, onboardedAt: new Date(), termsAcceptedAt: new Date() },
      update: {},
    });
  }

  // Articles
  for (const [i, a] of articles.entries()) {
    const data = {
      title: a.title,
      category: a.category,
      summary: a.summary,
      body: a.body,
      related: JSON.stringify(a.related),
      order: i,
      status: "PUBLISHED",
      publishedAt: new Date(),
    };
    await db.article.upsert({ where: { slug: a.slug }, create: { slug: a.slug, ...data }, update: data });
  }

  // Level 01 with the three pilot practice websites
  const level = await db.level.upsert({
    where: { slug: "level-01" },
    create: {
      slug: "level-01",
      number: 1,
      name: "Beginner",
      difficulty: "Beginner",
      description:
        "Build your testing foundation by exploring website functionality, forms, navigation, and common user interactions.",
      skills: JSON.stringify(["Functional testing", "Form validation", "Navigation testing", "Basic bug identification", "Writing bug reports"]),
      accessRule: "FREE",
      status: "PUBLISHED",
      order: 1,
    },
    update: {},
  });

  for (const [i, s] of sites.entries()) {
    const site = await db.practiceWebsite.upsert({
      where: { levelId_slug: { levelId: level.id, slug: s.slug } },
      create: {
        levelId: level.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        skills: JSON.stringify(s.skills),
        objective: s.objective,
        instructions: s.instructions,
        estimatedMinutes: s.minutes,
        accessRule: s.accessRule,
        priceEtb: s.priceEtb,
        appUrl: s.appUrl,
        status: "PUBLISHED",
        order: i + 1,
      },
      update: {},
    });
    for (const b of s.bugs) {
      const data = {
        title: b.title,
        description: b.description,
        category: b.category,
        learningTopic: b.learningTopic,
        severity: b.severity,
        points: b.points,
        expectedBehavior: b.expectedBehavior,
        keywordGroups: JSON.stringify(b.keywordGroups),
      };
      await db.bugRegistryItem.upsert({
        where: { websiteId_version_code: { websiteId: site.id, version: site.version, code: b.code } },
        create: { websiteId: site.id, version: site.version, code: b.code, ...data },
        update: data,
      });
    }
  }

  // The demo learner has paid access to Level 01 so every challenge can be tried locally.
  const learner = await db.user.findUniqueOrThrow({ where: { email: "learner@tirat.test" } });
  const has = await db.entitlement.findFirst({ where: { userId: learner.id, levelId: level.id } });
  if (!has) await db.entitlement.create({ data: { userId: learner.id, levelId: level.id, source: "GRANT" } });

  console.log("Seeded. Staff/demo password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
