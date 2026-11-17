// Builds the Growth Tactics site from the Markdown files in content/.
// Output: dist/index.html (full page for GitHub Pages) and dist/preview.html
// (the same page without the document wrapper, for hosts that add their own).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content');
const distDir = path.join(root, 'dist');

const STAGES = [
  { id: 'awareness', name: 'Awareness' },
  { id: 'engagement', name: 'Engagement' },
  { id: 'conversion', name: 'Conversion' },
  { id: 'acceleration', name: 'Deal acceleration' },
  { id: 'expansion', name: 'Retention & expansion' },
];

const CHANNELS = [
  { id: 'paid-ads', name: 'Paid ads' },
  { id: 'outbound', name: 'Outbound' },
  { id: 'content', name: 'Content' },
  { id: 'search-ai', name: 'Search & AI answers' },
  { id: 'offline', name: 'Offline' },
  { id: 'events', name: 'Events' },
  { id: 'product', name: 'Product' },
  { id: 'partnerships', name: 'Partnerships' },
];

// Section headings in tactic files, mapped to the keys the page renders.
const SECTION_KEYS = {
  'why it works': 'why',
  'why it backfires': 'why',
  'steps': 'steps',
  'what to do instead': 'steps',
  'example': 'example',
  'prerequisites': 'prerequisites',
  'how to measure': 'measure',
  'pitfalls': 'pitfalls',
};

const errors = [];

function readMarkdown(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    errors.push(`${path.relative(root, file)}: missing front matter block`);
    return { data: {}, body: raw };
  }
  return { data: yaml.load(match[1]) || {}, body: match[2] };
}

function splitSections(body, file) {
  const sections = {};
  const parts = body.split(/^## +/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const heading = part.slice(0, nl).trim();
    const key = SECTION_KEYS[heading.toLowerCase()];
    if (!key) {
      errors.push(`${file}: unknown section "## ${heading}"`);
      continue;
    }
    sections[key] = marked.parse(part.slice(nl + 1).trim());
  }
  return sections;
}

const principles = yaml.load(fs.readFileSync(path.join(contentDir, 'principles.yml'), 'utf8'));
const principleIds = new Set(principles.map((p) => p.id));
const stageIds = new Set(STAGES.map((s) => s.id));
const channelIds = new Set(CHANNELS.map((c) => c.id));

const foundationsDir = path.join(contentDir, 'foundations');
const foundations = fs
  .readdirSync(foundationsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { data, body } = readMarkdown(path.join(foundationsDir, f));
    return {
      slug: f.replace(/\.md$/, ''),
      title: data.title,
      summary: data.summary,
      order: data.order ?? 99,
      sources: data.sources || [],
      html: marked.parse(body),
    };
  })
  .sort((a, b) => a.order - b.order);
const foundationIds = new Set(foundations.map((f) => f.slug));

const tacticsDir = path.join(contentDir, 'tactics');
const tactics = fs
  .readdirSync(tacticsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const rel = `content/tactics/${f}`;
    const { data, body } = readMarkdown(path.join(tacticsDir, f));
    for (const field of ['title', 'summary', 'stages', 'channels', 'principles']) {
      if (!data[field]) errors.push(`${rel}: missing "${field}"`);
    }
    for (const s of data.stages || []) if (!stageIds.has(s)) errors.push(`${rel}: unknown stage "${s}"`);
    for (const c of data.channels || []) if (!channelIds.has(c)) errors.push(`${rel}: unknown channel "${c}"`);
    for (const p of data.principles || []) if (!principleIds.has(p)) errors.push(`${rel}: unknown principle "${p}" (add it to content/principles.yml)`);
    for (const fd of data.foundations || []) if (!foundationIds.has(fd)) errors.push(`${rel}: unknown foundation "${fd}"`);
    return {
      slug: f.replace(/\.md$/, ''),
      title: data.title,
      summary: data.summary,
      kind: data.kind === 'anti-pattern' ? 'anti-pattern' : 'tactic',
      stages: data.stages || [],
      channels: data.channels || [],
      principles: data.principles || [],
      effort: data.effort || '',
      cost: data.cost || '',
      time: data.time_to_impact || '',
      tools: data.tools || [],
      foundations: data.foundations || [],
      sources: data.sources || [],
      sections: splitSections(body, rel),
    };
  })
  // Tactics first, then anti-patterns; within each, by funnel stage, then title.
  .sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'tactic' ? -1 : 1;
    const sa = STAGES.findIndex((s) => s.id === a.stages[0]);
    const sb = STAGES.findIndex((s) => s.id === b.stages[0]);
    return sa - sb || a.title.localeCompare(b.title);
  });

if (errors.length) {
  console.error('Build failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}

const data = { stages: STAGES, channels: CHANNELS, principles, foundations, tactics };
const json = JSON.stringify(data).replace(/</g, '\\u003c');

const template = fs.readFileSync(path.join(root, 'site', 'template.html'), 'utf8');
const [head, bodyPart] = template.split('<!-- BODY -->');
const filled = (s) => s.replace('/*__DATA__*/null', json);

fs.mkdirSync(distDir, { recursive: true });
const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head.trim()}
</head>
<body>
${filled(bodyPart).trim()}
</body>
</html>
`;
fs.writeFileSync(path.join(distDir, 'index.html'), full);
fs.writeFileSync(path.join(distDir, 'preview.html'), `${head.trim()}\n${filled(bodyPart).trim()}\n`);
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log(`Built ${tactics.length} tactics, ${principles.length} principles, ${foundations.length} foundations -> dist/index.html`);
