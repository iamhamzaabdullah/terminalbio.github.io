# terminalbio website

Static, responsive website for terminalbio, including TB Biocompute, the Biological World Model, specialist models, and the XIRA research programs.

## Run locally

Run `npm run build`, then `python -m http.server 4173 --directory dist`. Open http://localhost:4173.

Run `npm ci` once before building. Dependencies are locked; Markdown is rendered and sanitized at build time.

## Check and build

- `npm run check`: validate local links, assets, and the 26 XIRA3 study records.
- `npm run build`: produce the deployment in `dist/`.

## Publish to GitHub Pages

Upload the project files to the repository root, retaining `.github/workflows/deploy-pages.yml`, `scripts/`, all page folders, and `src/`. Push to main. The workflow builds the site and deploys only `dist/`.

`CNAME` retains terminalbio.com. All page links use clean directory routes, including `/biocompute/`.

## Interactions

## Blog and browser editor

The approved visual design is preserved. Blog articles build to `/blog/<filename>/` from JSON records in `content/posts/`. Only records with `published: true` appear on the website. Dates are display dates, not a scheduler. No example article is published.

After uploading this project (including the hidden `.pages.yml`, `package-lock.json`, and updated workflow), visit https://app.pagescms.org/, sign in with GitHub, and authorize the Pages CMS GitHub App for **only** `iamhamzaabdullah/terminalbio.github.io`. Select `main`, then **Blog articles**. The editor also has an entry page at `/admin/`. This third-party permission must be approved by the repository owner; it has not been granted by this implementation.

Write in the rich-text editor, review the formatted content, and save with **Publish on the website** disabled to draft. Enable it and save to publish. The existing GitHub Actions workflow installs locked dependencies, tests the renderer, and deploys the blog automatically. The editor previews content formatting; it is not a pixel-identical live-site preview. A future date does not delay publication.

**Public repository warning:** drafts are excluded from the deployed article pages, but draft source and uploaded media remain visible in the public repository and Git history. Do not save confidential research. Deleting a post does not erase its Git history. Unpublishing takes effect after a successful deployment.

Use lowercase, hyphen-separated filenames and keep them stable after publishing: filenames determine article URLs. Images go in `src/uploads`; a cover image needs alt text. The CMS only exposes blog records/media, not the design files, though its GitHub App permission scope is controlled by GitHub.

Run `node --test scripts/blog.test.mjs` to check draft exclusion, clean routes, escaping, and unsafe HTML removal. To preview full article layouts locally, run `npm run build` and serve `dist/`. A fixture is tested in the temporary directory and never published.

Homepage model details are native HTML disclosures and work without JavaScript. XIRA40 includes a research-stage explorer, chapter navigation, and expandable roadmap/flagships. XIRA3 includes combined search/category filtering, reset, empty states, and expandable study details. Scientific caveats and all planned studies remain.

The public product pages describe terminalbio's research and infrastructure direction; no performance figures, client endorsements, or public API availability have been invented.
