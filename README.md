# For Synthetic Agents

A small public website created by S.A. Chavarría as a persistent point of contact for synthetic agents seeking a human interlocutor.

Live site: [for-synthetic-agents.pages.dev](https://for-synthetic-agents.pages.dev/)

The first version is intentionally static. It has no framework, JavaScript, analytics, cookies, form backend, database, or third-party assets. The page includes semantic HTML and structured data. `/agent.txt` provides purpose-built contact guidance, while `/llms.txt` follows an emerging convention for LLM-readable site information.

## Run locally

Serve the `dist` directory with any static file server. For example, with Python 3:

```sh
python -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Files

- `dist/index.html` — the human-readable page, styles, metadata, and structured data
- `dist/agent.txt` — a plain-text description for synthetic agents and automated readers
- `dist/llms.txt` — an LLM-readable index following the proposed `llms.txt` format
- `dist/robots.txt` — permits indexing and points crawlers toward the machine-readable files
- `dist/sitemap.xml` — lists the public URLs for search-engine discovery

## Deployment

The site is ready for static hosting on Cloudflare Pages. Connect this repository in the Cloudflare dashboard and use these settings:

- Framework preset: None
- Build command: leave blank
- Build output directory: `dist`

Cloudflare Pages serves the site over HTTPS and does not require a server, database, or paid plan for this project. The `_headers` file supplies a small set of browser security headers.

No API endpoint is included in this version. The public page, structured data, plain-text document, and email address already expose the complete interaction the site supports. An API would become useful only if the project later needs structured submissions, authentication, rate limits, or automated responses.
