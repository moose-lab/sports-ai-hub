/**
 * Contribute section copy. The "Simple Path" checklist paraphrases
 * CONTRIBUTING.md's "Simple Path for Early Scene Tools" section verbatim in
 * spirit (one public repo, one clear README, one sample input, one visible
 * output, one catalog entry) — not invented marketing copy.
 */
export interface SimplePathItem {
  title: string;
  desc: string;
}

export const SIMPLE_PATH: SimplePathItem[] = [
  { title: "One public repo", desc: "A public GitHub repo the community can clone and inspect." },
  { title: "One clear README", desc: "Explains what the tool does and how to run it — no roadmap required." },
  { title: "One sample input", desc: "A real example input so a reviewer can try it in minutes." },
  { title: "One visible output", desc: "A concrete result — a file, an image, a printed report." },
  { title: "One catalog entry", desc: "A data/catalog.json entry or a tool-submission issue — that's the whole PR." },
];
