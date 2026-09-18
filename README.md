# terminalBio website

A responsive, dependency-light landing site for terminalBio's new biological-intelligence positioning.

## Run locally

This project uses Vite. With Node.js 20+ installed:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Commit it with the site, then select **GitHub Actions** in the repository's **Settings → Pages** panel. Every push to `main` will build and publish the `dist` folder.

## Structure

- `index.html` — complete page structure and content
- `src/style.css` — responsive visual system, diagrams, motion, and layout
- `src/main.js` — interactive model-loop controls and reveal behavior

The site is intentionally self-contained: its visual diagrams are authored in CSS/SVG rather than relying on stock imagery or copied reference-site assets.
