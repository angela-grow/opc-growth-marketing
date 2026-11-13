# Growth Tactics: writing guidelines

- Use regular hyphens (`-`), never em dashes, in all content.
- Every tactic follows `templates/tactic-template.md`. Section headings must match exactly; the build rejects unknown ones. Anti-patterns use "Why it backfires" and "What to do instead".
- "Why it works" explains the human behaviour in plain language and names each principle listed in the front matter.
- Principles live in `content/principles.yml` with a real origin (researcher and year). Do not invent citations.
- Examples must come from the source material. Credit the source in `sources`.
- Write for marketers and clients: short sentences, British spelling, no jargon without explanation.
- Run `npm run build` after changes to validate content.
