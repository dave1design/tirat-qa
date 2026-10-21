// Seed content: learning articles and the private bug registries for the pilot practice websites.
// keywordGroups: every group is a set of alternative terms; the share of groups present in a report
// determines the match confidence (see src/lib/scoring/match.ts).

export const articles = [
  {
    slug: "what-is-software-testing",
    category: "fundamentals",
    title: "What Is Software Testing?",
    summary: "Understand why we test software and what testers actually do all day.",
    related: ["qa-vs-testing", "exploratory-testing", "how-to-write-a-bug-report"],
    body: `Software testing is the activity of checking whether a product behaves the way people expect it to — and finding out where it does not.

## Why we test

Every application is built from decisions, and every decision can go wrong. A tester investigates the software before real users do, so problems are found when they are cheap to fix instead of after they have cost someone money, data or trust.

## What testers do

- **Explore** the product to understand what it is meant to do.
- **Compare** what actually happens with what should happen.
- **Investigate** anything surprising until the cause and the steps to repeat it are clear.
- **Communicate** findings in a form another person can act on — a bug report.

## Testing finds problems, it does not prove there are none

You can never test every input on every device. Good testers choose where to look: the riskiest features, the most common paths and the places where mistakes usually hide, such as forms, totals and edge cases.

> **Try it:** open any website you use daily and ask, “What should happen if I leave this field empty?” Then try it. That question is the heart of testing.

Ready to practice? Open the Practice Lab, pick a website and look for behavior that does not match what you would expect.`,
  },
  {
    slug: "qa-vs-testing",
    category: "fundamentals",
    title: "QA vs. Testing: What's the Difference?",
    summary: "Quality Assurance and testing are related, but they are not the same job.",
    related: ["what-is-software-testing", "exploratory-testing"],
    body: `The two terms are often used as if they mean the same thing. They overlap, but the emphasis is different.

## Testing

Testing is **finding problems in a product**. It happens while or after something is built: run the software, observe, compare with expectations, report what is wrong.

## Quality Assurance

Quality Assurance (QA) is **making problems less likely in the first place**. It covers the way a team works — clear requirements, code reviews, test planning, agreed definitions of done — as well as testing itself.

## A simple way to remember it

- Testing asks: *“Does this work?”*
- QA asks: *“Are we working in a way that produces things that work?”*

## Why it matters for your career

Many job ads say “QA Tester” or “QA Engineer” and mean mostly testing. As you grow, you will take on more QA responsibilities: improving how requirements are written, spotting risks early and helping the team prevent repeat defects.

For now, the best way to grow is hands-on: test real behavior and write down what you find.`,
  },
  {
    slug: "exploratory-testing",
    category: "techniques",
    title: "Exploratory Testing: Learning While You Test",
    summary: "Explore an application with a goal, a time limit and a notebook.",
    related: ["your-first-website-testing-checklist", "positive-and-negative-testing"],
    body: `Exploratory testing means designing and running tests at the same time, using what you learn to decide what to try next. It is not random clicking — it is guided curiosity.

## Start with a charter

A charter is a one-sentence mission, for example: *“Explore the login form to discover how it handles invalid input.”* A charter keeps you focused and gives you something to report against.

## A simple session

1. Set a timer (30–45 minutes is a good length).
2. Read the charter and decide where to start.
3. Use the feature normally first so you understand the expected behavior.
4. Then vary things: different data, different order, unexpected actions.
5. Take notes as you go: what you tried, what you saw, anything odd.
6. Turn every real problem into a bug report while the details are fresh.

## What to vary

- **Data:** empty, very long, special characters, spaces, wrong format.
- **Order:** skip steps, go back, refresh in the middle.
- **State:** logged in vs. logged out, new vs. returning user.

## Keep notes

If you cannot remember how you found a problem, nobody else can reproduce it. Write down the exact actions as you do them.`,
  },
  {
    slug: "positive-and-negative-testing",
    category: "techniques",
    title: "Positive and Negative Testing",
    summary: "Check that valid input works and invalid input is handled gracefully.",
    related: ["testing-form-validation", "boundary-value-analysis"],
    body: `Every feature needs to be tested in two directions.

## Positive testing

Positive testing uses **valid** input and expected actions to confirm the feature works. Example: a registration form accepts a correctly filled-in form and creates an account.

## Negative testing

Negative testing uses **invalid or unexpected** input to confirm the feature fails safely. Example: the same form rejects an invalid email address with a clear message and does not create an account.

## Why both matter

Teams usually remember to check the happy path. Real users, however, make typos, paste the wrong thing and click in odd orders. Many of the most valuable bugs live on the negative side.

## Ideas for negative tests

- Leave a required field empty.
- Enter text where a number is expected.
- Use a value that is too long or too short.
- Submit the same form twice.
- Use leading or trailing spaces.

> **Tip:** when a negative test fails, always note what you expected to happen. “It should show a clear error and stay on the page” makes your bug report much stronger.`,
  },
  {
    slug: "boundary-value-analysis",
    category: "techniques",
    title: "Boundary-Value Analysis",
    summary: "Bugs love edges: test just inside and just outside the limits.",
    related: ["positive-and-negative-testing", "testing-form-validation"],
    body: `Many defects appear at the **edges** of allowed values. Boundary-value analysis is the habit of testing right at those edges.

## The idea

If a field accepts values from 1 to 10, test:

- 0 (just below the lower limit)
- 1 (the lower limit)
- 2 (just above the lower limit)
- 9 (just below the upper limit)
- 10 (the upper limit)
- 11 (just above the upper limit)

## Where to use it

- Quantity and number fields
- Password and text length limits
- Date ranges (for example a date of birth cannot be in the future)
- File size limits

## Why it works

Developers write comparisons such as \`<\` and \`<=\`. Getting one of them wrong creates an off-by-one bug that only appears at the boundary. Testing the boundary exposes it quickly.

Try it on any form in the Practice Lab: find a field with a limit and test either side of it.`,
  },
  {
    slug: "your-first-website-testing-checklist",
    category: "practical-tips",
    title: "Your First Website Testing Checklist",
    summary: "A simple checklist to guide your first website testing session.",
    related: ["testing-form-validation", "how-to-write-a-bug-report", "exploratory-testing"],
    body: `Not sure where to begin? Use this checklist for your first session on any website.

## Before you start

- Read the instructions and note what the site is supposed to do.
- Decide on a time limit.
- Open a notes file for what you try and what you see.

## The checklist

1. **Explore the main navigation.** Do all menu items go somewhere sensible?
2. **Test buttons and links.** Does each one do what its label says?
3. **Complete and submit forms.** Fill them in correctly first.
4. **Check required fields and validation messages.** Are they clear and correct?
5. **Try unexpected or invalid inputs.** Empty, too long, wrong format, spaces.
6. **Observe what happens after each action.** Did the page confirm it? Did the data change?
7. **Document any unexpected behavior** immediately.
8. **Write clear steps to reproduce** each issue.

## After the session

Re-read your notes and write one bug report per problem. Keep each report about **one** issue.

When you are ready, open a practice website in the Practice Lab and work through the list.`,
  },
  {
    slug: "testing-form-validation",
    category: "practical-tips",
    title: "Testing Form Validation",
    summary: "Forms are where bugs hide. Learn a repeatable way to test them.",
    related: ["positive-and-negative-testing", "boundary-value-analysis", "how-to-write-a-bug-report"],
    body: `Forms — login, registration, checkout, search — are among the most bug-prone parts of any website, because they accept free input from people.

## A repeatable approach

For each field, ask four questions:

1. **Is it required?** Submit with the field empty. You should see a clear message.
2. **What format does it expect?** Try an invalid email, letters in a phone number, a future date of birth.
3. **What are the limits?** Try very short and very long values.
4. **What happens with awkward input?** Leading or trailing spaces, special characters, pasted text.

## Check the whole form, too

- Does a failed submit **keep** what the user already typed?
- Are error messages next to the right field and easy to understand?
- Does the form accept the same data twice when it should not (duplicate email)?
- Does the confirmation show the correct information?

## Look at the messages

Messages should be accurate and helpful, and they should not leak information. For example, a login form that says “no account with this email” tells attackers which emails are registered.

## Write it up

When something is wrong, record the exact input you used. “Entered 'abc' in the phone field and submitted” is reproducible; “phone is broken” is not.`,
  },
  {
    slug: "severity-vs-priority",
    category: "bug-reporting",
    title: "Severity vs. Priority",
    summary: "Severity is about impact; priority is about when it gets fixed.",
    related: ["how-to-write-a-bug-report", "what-is-software-testing"],
    body: `These two words are often confused, but they answer different questions.

## Severity: how bad is it?

Severity describes the **impact of the bug on the product or user**. The testers usually propose it.

- **Critical:** security issue, data loss, or the application cannot be used.
- **High:** a key feature is broken or produces wrong data and there is no easy workaround.
- **Medium:** a feature behaves incorrectly but there is a workaround.
- **Low:** cosmetic or minor; easy to work around.

## Priority: how soon should we fix it?

Priority is a **business decision** about order of work. It depends on severity, but also on how many users are affected, deadlines and risk.

## Examples

- A typo on the home page headline: **low severity, high priority** — everyone sees it and it is quick to fix.
- A crash in a rarely used admin report: **high severity, low priority** — it is serious but affects almost nobody.

## In the Practice Lab

When you submit a bug report you choose a severity. Pick the level that matches the impact on the user, not how annoyed you were. Your result will tell you how close your choice was.`,
  },
  {
    slug: "how-to-write-a-bug-report",
    category: "bug-reporting",
    title: "How to Write a Good Bug Report",
    summary:
      "A useful bug report explains what went wrong, how to reproduce the problem, and what should have happened instead.",
    related: ["what-is-software-testing", "testing-form-validation", "severity-vs-priority"],
    body: `A useful bug report explains what went wrong, how to reproduce the problem, and what should have happened instead.

## 1. Write a Clear Title

Describe the problem in a short, specific sentence.

## 2. Explain the Steps to Reproduce

List the actions someone must take to encounter the issue.

## 3. Describe the Expected Result

Explain what should happen when the feature works correctly.

## 4. Describe the Actual Result

Explain what happened when you tested it.

## 5. Add Supporting Evidence

When available and appropriate, attach screenshots or other evidence that helps explain the issue.

## Example Bug Report

> **Title:** Registration form submits without a valid email address.
>
> **Steps to Reproduce:**
> 1. Open the registration page.
> 2. Enter an invalid email address.
> 3. Complete the remaining required fields.
> 4. Submit the form.
>
> **Expected Result:** The form should reject the invalid email address and display a helpful validation message.
>
> **Actual Result:** The form accepts the invalid email address and proceeds with submission.

*This is an illustrative example. Actual practice websites may behave differently.*

## One issue per report

If you found two problems, write two reports. Combined reports are hard to track and hard to score.`,
  },
];

export interface SeedBug {
  code: string;
  title: string;
  description: string;
  category: string;
  learningTopic: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  points: number;
  expectedBehavior: string;
  keywordGroups: string[][];
}

export const sites: {
  slug: string;
  name: string;
  description: string;
  skills: string[];
  objective: string;
  instructions: string;
  minutes: number;
  accessRule: "FREE" | "PAID";
  priceEtb: number;
  appUrl: string;
  bugs: SeedBug[];
}[] = [
  {
    slug: "login-and-account-access",
    name: "Login and Account Access",
    description: "A bank-style sign-in portal. Test how it handles credentials, errors and signing out.",
    skills: ["Form validation", "Authentication states", "Error messages"],
    objective: "Find as many defects as you can in the sign-in flow of the Northwind account portal.",
    instructions: `You are testing a fictional online-banking sign-in page.

**Test account:** \`demo@northwind.test\` with password \`Passw0rd!\`

**In scope:** the sign-in form, show/hide password, the "Forgot password" link, the account page and signing out.

**Permitted:** any normal browser testing — valid and invalid input, refreshing, using the back button, browser dev tools for observation.

**Not permitted:** attacking the platform itself, other users' data, or automated high-volume requests.`,
    minutes: 20,
    accessRule: "FREE",
    priceEtb: 0,
    appUrl: "/sandbox/northwind-login",
    bugs: [
      {
        code: "BUG-01",
        title: "Empty password accepted for a known email",
        description: "Submitting a registered email with a blank password logs the user in.",
        category: "Authentication",
        learningTopic: "Required-field validation on authentication forms",
        severity: "CRITICAL",
        points: 10,
        expectedBehavior: "A blank password is rejected with a required-field message.",
        keywordGroups: [
          ["password"],
          ["empty", "blank", "without entering", "no password", "not entered", "left blank", "leave", "omit", "missing", "didnt enter", "not provided", "nothing in"],
          ["log in", "login", "logged in", "signed in", "sign in", "access", "welcome", "account page", "dashboard", "accepted", "successful", "allowed", "lets me in", "let me in"],
          ["error", "required", "reject", "should not", "shouldnt", "denied", "validation", "prevent", "blocked", "invalid", "message"],
        ],
      },
      {
        code: "BUG-02",
        title: "Email with trailing space is rejected",
        description: "Leading/trailing whitespace in the email field produces an invalid-email error instead of being trimmed.",
        category: "Input handling",
        learningTopic: "Handling spaces and awkward input",
        severity: "LOW",
        points: 10,
        expectedBehavior: "Whitespace around the email is trimmed and sign-in succeeds.",
        keywordGroups: [
          ["space", "spaces", "whitespace", "trailing", "leading", "white space"],
          ["email", "e-mail", "username"],
          ["invalid", "error", "rejected", "not accepted", "cannot", "cant", "fails", "wont log", "not allowed", "valid email"],
          ["trim", "ignore", "should log", "should accept", "should be accepted", "should be trimmed", "should allow", "should work", "successful", "logged in"],
        ],
      },
      {
        code: "BUG-03",
        title: "Error messages reveal whether an account exists",
        description: "Unknown email and wrong password produce different messages, enabling account enumeration.",
        category: "Security",
        learningTopic: "Information leakage in error messages",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "One generic message is shown for any invalid credentials.",
        keywordGroups: [
          ["no account", "not found", "doesnt exist", "does not exist", "not registered", "unknown email", "unregistered", "nonexistent", "non-existent", "incorrect password", "wrong password", "different message", "different error", "two different", "reveal", "exists", "enumerat"],
          ["email", "account", "user"],
          ["message", "error", "text", "response"],
          ["generic", "same message", "security", "reveal", "expose", "information", "attacker", "enumerat", "shouldnt", "should not", "identical", "consistent"],
        ],
      },
      {
        code: "BUG-04",
        title: "“Forgot password” link is broken",
        description: "The link leads to a not-found page instead of a password-reset form.",
        category: "Navigation",
        learningTopic: "Testing links and navigation",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "The link opens a password-reset page.",
        keywordGroups: [
          ["forgot", "forgotten", "reset password", "forgot password"],
          ["link", "button", "click", "clicking", "clicked", "navigat"],
          ["404", "not found", "broken", "dead", "blank", "nothing happens", "doesnt work", "does not work", "page not found", "wrong page", "unavailable", "error"],
          ["reset", "form", "email", "instructions", "page", "should"],
        ],
      },
      {
        code: "BUG-05",
        title: "Password cannot be hidden again after showing it",
        description: "The show/hide control only works one way: once revealed, the password stays visible.",
        category: "User interaction",
        learningTopic: "Testing controls that change state",
        severity: "LOW",
        points: 10,
        expectedBehavior: "The toggle switches between shown and hidden.",
        keywordGroups: [
          ["show", "hide", "toggle", "eye", "visibility", "reveal", "unmask", "visible"],
          ["password"],
          ["again", "back", "cannot", "cant", "stays", "remains", "still visible", "doesnt hide", "not hide", "wont hide", "does not hide", "unable", "only works once", "one way", "not toggle", "doesnt toggle"],
          ["hidden", "mask", "dots", "asterisk", "hide", "toggle", "should"],
        ],
      },
      {
        code: "BUG-06",
        title: "Logging out does not end the session",
        description: "After signing out, refreshing the page returns the user to the account page.",
        category: "Session management",
        learningTopic: "Session handling and signing out",
        severity: "HIGH",
        points: 10,
        expectedBehavior: "Signing out ends the session and protected pages require signing in again.",
        keywordGroups: [
          ["log out", "logout", "sign out", "signout", "logged out", "signing out"],
          ["refresh", "reload", "back", "return", "revisit", "reopen", "again", "still", "session", "remain"],
          ["logged in", "account page", "session", "still signed in", "still logged in", "remains", "stays", "not cleared", "not ended", "access", "dashboard"],
          ["login page", "should", "redirect", "end", "clear", "invalidate", "terminate", "require"],
        ],
      },
    ],
  },
  {
    slug: "registration-form",
    name: "Registration Form",
    description: "A sign-up form for an online course provider. Test required fields, formats and duplicate data.",
    skills: ["Required fields", "Format validation", "Duplicate data"],
    objective: "Find as many defects as you can in the BrightPath registration form.",
    instructions: `You are testing a fictional sign-up form for an online learning provider.

**Hint for testing duplicates:** the address \`taken@example.com\` is already registered.

**In scope:** every field on the form, the terms checkbox, the submit button and the confirmation screen.

**Permitted:** normal browser testing with valid and invalid data.

**Not permitted:** automated high-volume submissions or attacks on the platform.`,
    minutes: 25,
    accessRule: "PAID",
    priceEtb: 200,
    appUrl: "/sandbox/brightpath-register",
    bugs: [
      {
        code: "BUG-01",
        title: "Password confirmation is not checked",
        description: "Mismatched password and confirm password still register successfully.",
        category: "Validation",
        learningTopic: "Cross-field validation",
        severity: "HIGH",
        points: 10,
        expectedBehavior: "Mismatched passwords block submission with a clear message.",
        keywordGroups: [
          ["confirm", "confirmation", "retype", "re-enter", "repeat", "match", "mismatch", "different passwords", "second password"],
          ["password"],
          ["accepted", "registered", "submitted", "success", "created", "proceeds", "goes through", "allows", "no error", "not checked", "doesnt check", "does not check"],
          ["should", "error", "reject", "block", "message", "validation", "must match", "prevent"],
        ],
      },
      {
        code: "BUG-02",
        title: "Future date of birth accepted",
        description: "A date of birth in the future is accepted.",
        category: "Validation",
        learningTopic: "Boundary-value analysis on dates",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "A future date of birth is rejected.",
        keywordGroups: [
          ["date of birth", "dob", "birth date", "birthday", "birthdate"],
          ["future", "tomorrow", "2030", "2040", "2050", "next year", "not born", "yet to"],
          ["accepted", "allowed", "submitted", "registered", "no error", "success", "allows", "accepts"],
          ["should", "invalid", "reject", "error", "validation", "past"],
        ],
      },
      {
        code: "BUG-03",
        title: "Phone number accepts letters",
        description: "The phone field has no format validation.",
        category: "Validation",
        learningTopic: "Format validation",
        severity: "LOW",
        points: 10,
        expectedBehavior: "Only digits and an optional leading + are accepted.",
        keywordGroups: [
          ["phone", "telephone", "mobile", "tel"],
          ["letters", "alphabet", "text", "characters", "abc", "non-numeric", "nonnumeric", "alphanumeric", "special characters", "symbols"],
          ["accepted", "allowed", "submitted", "registered", "no error", "success", "allows", "accepts"],
          ["should", "only", "digits", "numbers", "numeric", "invalid", "reject", "error", "validation", "format"],
        ],
      },
      {
        code: "BUG-04",
        title: "Terms checkbox is not required",
        description: "The form can be submitted without accepting the terms.",
        category: "Required fields",
        learningTopic: "Required-field validation",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "The user must accept the terms before registering.",
        keywordGroups: [
          ["terms", "conditions", "agreement", "agree", "checkbox", "consent", "policy"],
          ["unchecked", "not checked", "without", "not accepted", "not ticked", "untick", "skip", "didnt", "not select", "leave"],
          ["accepted", "allowed", "submitted", "registered", "no error", "success", "allows", "proceeds", "goes through", "can submit", "can register"],
          ["should", "required", "mandatory", "must", "error", "block", "prevent", "validation"],
        ],
      },
      {
        code: "BUG-05",
        title: "Duplicate email address accepted",
        description: "An email that is already registered can be registered again.",
        category: "Duplicate data",
        learningTopic: "Duplicate data handling",
        severity: "HIGH",
        points: 10,
        expectedBehavior: "The form reports that the email is already registered.",
        keywordGroups: [
          ["duplicate", "already registered", "already exists", "already used", "already taken", "taken@example.com", "existing email", "same email", "registered email", "already in use", "twice"],
          ["email", "account", "user", "address"],
          ["accepted", "allowed", "registered", "created", "success", "no error", "allows", "again", "proceeds", "goes through"],
          ["should", "error", "reject", "unique", "message", "prevent", "validation", "block"],
        ],
      },
      {
        code: "BUG-06",
        title: "Confirmation greets the user by last name only",
        description: "The success screen says “Welcome, Smith!” for “Jane Smith”.",
        category: "Output correctness",
        learningTopic: "Verifying confirmation content",
        severity: "LOW",
        points: 10,
        expectedBehavior: "The confirmation uses the first name or the full name entered.",
        keywordGroups: [
          ["welcome", "confirmation", "success message", "greeting", "success page", "success screen", "confirmation page", "confirmation screen", "thank you"],
          ["name", "surname", "last name", "first name", "full name"],
          ["wrong", "incorrect", "only", "instead", "shows", "displays", "last", "surname", "missing", "truncated"],
          ["should", "expected", "first name", "full name", "correct"],
        ],
      },
    ],
  },
  {
    slug: "product-listing",
    name: "Product Listing",
    description: "A small online shop. Test search, filters, sorting and product details.",
    skills: ["Search", "Filters", "Sorting", "Product details"],
    objective: "Find as many defects as you can in the ShopStack product listing.",
    instructions: `You are testing a fictional online shop's product list.

**In scope:** the search box, category filter, sort menu, empty results, product details and the add-to-cart button.

**Permitted:** normal browser testing — try different search terms, filters and sort orders and compare the list with the product details.

**Not permitted:** automated high-volume requests or attacks on the platform.`,
    minutes: 25,
    accessRule: "PAID",
    priceEtb: 200,
    appUrl: "/sandbox/shopstack-products",
    bugs: [
      {
        code: "BUG-01",
        title: "Price sort is alphabetical, not numeric",
        description: "Sorting by price low to high orders values as text (e.g. 1,299 before 249).",
        category: "Sorting",
        learningTopic: "Verifying sort order",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "Products are ordered by numeric price.",
        keywordGroups: [
          ["sort", "sorting", "order", "ordered", "low to high", "high to low", "ascending", "descending"],
          ["price", "prices", "cost"],
          ["wrong", "incorrect", "not in order", "out of order", "alphabetical", "string", "text", "not numeric", "not sorted", "incorrectly", "before", "first"],
          ["should", "numeric", "lowest", "highest", "expected", "correct", "cheapest"],
        ],
      },
      {
        code: "BUG-02",
        title: "Search is case sensitive",
        description: "Searching 'headphones' finds nothing but 'Headphones' does.",
        category: "Search",
        learningTopic: "Testing search input variations",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "Search ignores letter case.",
        keywordGroups: [
          ["search", "searching", "find", "query"],
          ["case", "lowercase", "uppercase", "capital", "capitalized", "capitalised", "upper case", "lower case"],
          ["no results", "nothing", "not found", "doesnt find", "does not find", "no products", "empty", "different results", "returns no", "no match"],
          ["should", "insensitive", "regardless", "same results", "expected", "work"],
        ],
      },
      {
        code: "BUG-03",
        title: "Category filter shows items from another category",
        description: "Filtering by Accessories also lists audio products.",
        category: "Filtering",
        learningTopic: "Testing filters against the full data set",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "Only products in the chosen category are listed.",
        keywordGroups: [
          ["filter", "category", "accessories", "filtering"],
          ["audio", "other category", "different category", "wrong category", "unrelated", "headphones", "speaker", "not in", "doesnt belong", "does not belong"],
          ["shows", "displays", "lists", "includes", "appear", "appears", "returned", "also"],
          ["should", "only", "expected", "correct", "belong", "match"],
        ],
      },
      {
        code: "BUG-04",
        title: "No message when there are no results",
        description: "An unmatched search leaves a blank area with no explanation.",
        category: "Empty states",
        learningTopic: "Testing empty and error states",
        severity: "LOW",
        points: 10,
        expectedBehavior: "A 'no products found' message is shown.",
        keywordGroups: [
          ["no results", "no result", "no products", "nothing found", "empty", "no matches", "not found", "no match", "unmatched", "zero results"],
          ["search", "filter", "list", "page", "results"],
          ["blank", "empty", "nothing", "no message", "no text", "no feedback", "missing", "doesnt show", "does not show", "not displayed", "not shown", "no indication"],
          ["should", "message", "inform", "tell", "feedback", "expected", "display"],
        ],
      },
      {
        code: "BUG-05",
        title: "Detail price differs from list price",
        description: "One product shows a higher price on its detail view than in the list.",
        category: "Data consistency",
        learningTopic: "Comparing data across screens",
        severity: "HIGH",
        points: 10,
        expectedBehavior: "The same price is shown everywhere.",
        keywordGroups: [
          ["price", "cost", "amount"],
          ["detail", "details", "product page", "product view", "modal", "popup", "open", "click on"],
          ["different", "differs", "mismatch", "inconsistent", "not the same", "higher", "lower", "instead of", "doesnt match", "does not match", "wrong"],
          ["list", "listing", "grid", "card", "should", "same", "consistent", "match"],
        ],
      },
      {
        code: "BUG-06",
        title: "Out-of-stock item can be added to the cart",
        description: "The 'Add to cart' button stays enabled for sold-out products and increments the cart.",
        category: "Business rules",
        learningTopic: "Testing business rules and stock states",
        severity: "MEDIUM",
        points: 10,
        expectedBehavior: "Sold-out products cannot be added.",
        keywordGroups: [
          ["out of stock", "sold out", "unavailable", "no stock", "out-of-stock", "stock"],
          ["add to cart", "cart", "basket", "add button", "buy", "add"],
          ["enabled", "can add", "able to add", "allows", "possible", "increments", "increase", "added", "still", "clickable", "works"],
          ["should", "disabled", "not be able", "cannot", "prevent", "block", "expected", "unavailable"],
        ],
      },
    ],
  },
];
