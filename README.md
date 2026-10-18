# terminalbio website

Static, responsive website for terminalbio, including TB Biocompute, the Biological World Model, specialist models, and the XIRA research programs.

## Run locally

Run `npm run build`, then `python -m http.server 4173 --directory dist`. Open http://localhost:4173.

The build uses Node's standard library; it needs no dependency installation.

## Check and build

- `npm run check`: validate local links, assets, and the 26 XIRA3 study records.
- `npm run build`: produce the deployment in `dist/`.

## Publish to GitHub Pages

Upload the project files to the repository root, retaining `.github/workflows/deploy-pages.yml`, `scripts/`, all page folders, and `src/`. Push to main. The workflow builds the site and deploys only `dist/`.

`CNAME` retains terminalbio.com. All page links use clean directory routes, including `/biocompute/`.

## Interactions

Homepage model details are native HTML disclosures and work without JavaScript. XIRA40 includes a research-stage explorer, chapter navigation, and expandable roadmap/flagships. XIRA3 includes combined search/category filtering, reset, empty states, and expandable study details. Scientific caveats and all planned studies remain.

The public product pages describe terminalbio's research and infrastructure direction; no performance figures, client endorsements, or public API availability have been invented.
