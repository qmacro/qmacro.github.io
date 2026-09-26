# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:5005 (with live reload)
npm run build      # production build to _site/
npm run debug      # build with Eleventy debug logging
npm run benchmark  # build with Eleventy benchmark logging
```

## Architecture

This is an [Eleventy v3](https://www.11ty.dev/) static site (`type: "module"` — all config files use ESM). The entry point is `eleventy.config.js`.

**Directory layout:**
- `content/` — Eleventy input root (`dir.input`)
  - `blog/` — all posts as Markdown files named `YYYY-MM-DD-slug.md`
  - `images/YYYY/MM/` — post images, organised by year/month
- `_includes/layouts/` — Nunjucks layouts (`base.njk` → `home.njk` / `blog.njk` / `post.njk`)
- `_config/filters.js` — all custom Eleventy filters (date formatting, array helpers)
- `_data/` — global data (`metadata.js`) and schema validation (`eleventyDataSchema.js`)
- `_site/` — build output (not committed)
- `public/` — files copied as-is to the output root

**Post conventions:**
- Filename: `YYYY-MM-DD-slug.md` — the date in the filename must match the `date:` frontmatter field.
- Frontmatter fields: `title`, `date` (YYYY-MM-DD), `tags` (array), `description`. The `posts` tag and `layouts/post.njk` layout are injected automatically via `content/blog/blog.11tydata.js` — do not add them to individual posts.
- `draft: true` suppresses a post from production builds; it still renders in dev (`--serve`) mode with "(draft)" appended to the title.
- Post URLs are generated as `/blog/posts/YYYY/MM/DD/slugified-title/` by the permalink template in `blog.11tydata.js`.

**Images:** stored under `content/images/YYYY/MM/` and referenced in posts as `/images/YYYY/MM/filename.ext`. They are passed through to `_site` unchanged.

**Syntax highlighting:** Prism.js with a custom CDS language grammar (`prism-cds.js`). The Prism CSS is injected only on post pages via a per-page CSS bundle.

**Deployment:** Netlify (`netlify.toml`) runs `npm run build` and publishes `_site/`.
