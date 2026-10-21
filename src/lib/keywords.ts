/** Registry matching rules are edited as text: one group per line, alternative terms separated by "|". */
export function parseKeywordText(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map((line) =>
      line
        .split("|")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    )
    .filter((g) => g.length > 0);
}

export function formatKeywordGroups(groups: string[][]): string {
  return groups.map((g) => g.join(" | ")).join("\n");
}

/** A registry bug is publishable when it has points and at least two non-empty keyword groups. */
export function isValidBug(b: { points: number; keywordGroups: string[][]; title: string; learningTopic: string }) {
  return b.points > 0 && b.title.trim() !== "" && b.learningTopic.trim() !== "" && b.keywordGroups.length >= 2;
}
