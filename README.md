# Growth Tactics

A library of growth tactics for marketing teams and clients. Each tactic is broken into steps you can run, with a real example and the psychology that explains why it works.

The content lives in plain Markdown files. A small build script turns them into a single browsable web page with filters for funnel stage, channel and psychology principle.

## What's inside

```
content/
  tactics/        one Markdown file per tactic or anti-pattern
  foundations/    groundwork pages that tactics depend on (tiering, measurement)
  principles.yml  the psychology principles, with origin and definition
site/template.html  the page design
scripts/build.mjs   turns content/ into dist/index.html
templates/tactic-template.md  copy this to add a new tactic
```

## Add a tactic

1. Copy `templates/tactic-template.md` into `content/tactics/` and give it a short, hyphenated file name. The file name becomes the page link.
2. Fill in the front matter and sections. Use only principle ids that exist in `content/principles.yml`. Add a new principle there if you need one.
3. Run the build. It stops with a clear message if a stage, channel, principle or section name is wrong.

## Build and preview

```bash
npm install
```

```bash
npm run build
```

Then open `dist/index.html` in a browser.

## Publishing

Every push to `main` builds the site and publishes it with GitHub Pages (see `.github/workflows/pages.yml`). Turn it on once in the repository settings: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
