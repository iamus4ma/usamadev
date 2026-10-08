# Independently deployed experiments

## Current portfolio

This repository is a React 18 / Create React App (`react-scripts` 5) SPA, not Next.js or Vite. `src/App.js` renders the conversational portfolio and its existing Helmet metadata. About, Projects, Contact, etc. are conversation states, not `/about`, `/projects`, or `/contact` routes. There was no routing library, `vercel.json`, or local Vercel project linkage. The existing build command is `npm run build`, with output in `build/`. Live dashboard settings cannot be inferred from this checkout.

The new `/experiments` page uses the same conversation shell, theme, navigation, and scroll container. Real anchor links enter experiments so the browser requests the independent application from Vercel. Do not replace these with client-only SPA navigation. No dependencies or experiment repositories are merged into the portfolio.

## One registry

Edit `src/components/experiments/registry.json`. The page and Vercel configuration generator both read this file.

```json
{
  "slug": "linkedin-companion",
  "name": "LinkedIn Companion",
  "description": "A local companion for LinkedIn conversations and applications.",
  "technologies": ["React", "Node.js", "Playwright"],
  "highlights": ["Review and approve generated content before filling forms."],
  "githubUrl": "https://github.com/iamus4ma/linkedin-companion",
  "status": "local"
}
```

- `example`: optional placeholder entry for a future experiment; no external proxy. There are no example entries in the current registry.
- `local`: source-only project with a portfolio detail page and GitHub link. Omit `deploymentUrl` and `upstreamPath`; no live demo or proxy is generated. LinkedIn Companion uses this status.
- `inline`: interactive experiment rendered directly by the portfolio. Omit `deploymentUrl` and `upstreamPath`; the model and animation files stay in this repo. Animated Developer uses this status.
- `pending`: a real project embedded at its portfolio route, with a GitHub link. Assets load from the iframe's independent origin; no reverse proxy is enabled until its base-path setup is deployed. The upstream must allow framing. See [Pixel Pong's optional proxy activation steps](pixel-pong.md).
- `ready`: after replacing both URLs and preparing the experiment's base path, enables the external rewrites and GitHub link.
- `deploymentUrl`: HTTPS origin only, no path, credentials, query, or fragment. Use the stable production deployment alias, not a temporary preview URL.
- `upstreamPath: ""`: strip `/experiments/<slug>` when forwarding to a root-served static SPA.
- `upstreamPath: "/experiments/<slug>"`: preserve that prefix for an app natively mounted there, such as Next.js with `basePath`.

After editing the registry:

```sh
npm run experiments:sync
npm run test:experiments
npm run build
```

Commit **both the registry and generated `vercel.json`**. Do not hand-edit the generated file. Vercel needs routing configuration when it reads the deployment; generating it only inside the build is not a reliable setup. The `prebuild` check fails if the committed configuration is stale. If other Vercel configuration is needed later, add it to `createConfig` in `scripts/experiments-config.cjs`.

For a ready root-served sample entry, the generator puts these before local experiment page fallbacks:

```json
[
  { "source": "/experiments/sample", "destination": "https://YOUR_PROJECT.vercel.app/" },
  { "source": "/experiments/sample/:path*", "destination": "https://YOUR_PROJECT.vercel.app/:path*" }
]
```

The browser URL stays on the portfolio domain. `/experiments/sample/assets/app.js` reaches `/assets/app.js` upstream; `/experiments/sample/some-route` reaches `/some-route` upstream. Query strings are forwarded by Vercel. Unrelated portfolio asset paths are not captured.

## Required work in each experiment repository

The experiment repositories were not supplied; no framework is assumed for them and none were modified. Use the matching setup below after inspecting each repository. Merely adding a portfolio rewrite does **not** rewrite HTML, JS, CSS, redirects, cookies, or asset URLs returned by the experiment.

### Root-served static SPA (Vite or Create React App)

For a sample experiment, the public browser base is `/experiments/sample/`. Keep `upstreamPath` empty in the portfolio registry.

1. Configure the experiment's asset base at build time:
   - Vite: merge `base: '/experiments/sample/'` into the existing `defineConfig` in `vite.config.js`.
   - CRA: set `"homepage": "/experiments/sample"` in its `package.json` (or the equivalent `PUBLIC_URL` build environment setting).
2. If using React Router, set the existing router's `basename` to `/experiments/sample`. Other routers need their equivalent base setting. Do not install a router just for this setup.
3. In that **experiment's** `vercel.json`, retain its existing configuration and add a SPA fallback:

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

   Existing emitted files are served normally; unknown document paths load the SPA. Ensure the SPA itself renders a not-found view for unknown routes. Exclude actual API/server routes from a blanket SPA fallback if the experiment has them.
4. Replace hard-coded root paths. Vite public assets can use `import.meta.env.BASE_URL + 'favicon.ico'`; CRA public HTML uses `%PUBLIC_URL%/favicon.ico`, and JS uses `process.env.PUBLIC_URL + '/favicon.ico'`. Audit manifest icons, CSS URLs, dynamic imports, image loaders, fonts, API calls, and service workers as well as the main bundle. Do not use `./assets/...` as a shortcut: it resolves differently on deep links.
5. Fetch same-origin experiment endpoints at `/experiments/sample/api/...`, or use an explicit backend URL with the appropriate CORS configuration. Never assume `/api/...` belongs to the experiment.
6. Add a normal `<a href="/experiments">Back to experiments</a>` in the experiment if desired. The portfolio shell does not wrap the independent app.

With this root-stripping setup, the upstream deployment is an origin, not necessarily a directly browsable app: its HTML references portfolio-prefixed assets and the router expects that prefix. To also browse the upstream alias directly, configure prefix support there (including mapping prefixed assets to their real files) and switch to the prefix-preserving mode, or use a separate standalone build. Do not remove the public base just to make the origin's `/` look correct.

### Next.js experiment

Merge `basePath: '/experiments/sample'` into that experiment's `next.config.js`, rebuild it, and set `upstreamPath` to `/experiments/sample` in the portfolio registry. Forwarding must preserve the prefix for framework routes and generated assets. Keep Next.js's Vercel framework routing; do **not** use the static SPA fallback above. Audit public image URLs and any manually built API URLs for the prefix. `assetPrefix` alone is not a replacement for `basePath`.

### Runtime and origin limitations

- Vercel hosts the experiment's web frontend, not a persistent local Ollama daemon or a desktop browser session. Ollama/Playwright backends need their own reachable runtime and authentication where appropriate; no backend is provisioned here.
- Upstream deployments must be accessible to Vercel's proxy. Deployment protection or upstream redirects can produce an authentication page or navigate away from `usama.dev`. Test the actual deployed app rather than assuming the proxy fixes these.
- Experiments share the portfolio's browser origin. Namespace local storage and cookies, scope service workers to the experiment prefix, and only connect applications you control. Absolute redirects, OAuth callback URLs, cookie Domain/Path, CSP, and origin checks may need application-specific updates.
- Unknown experiment pages are client-rendered `noindex` placeholders, not HTTP 404 responses. `npm start` serves the UI but does not emulate Vercel's external proxy; ready experiments show an explanatory local page.
- Existing portfolio SEO still names `iamus4ma.com` in `App.js`; this work leaves that unrelated metadata intact. Confirm your real domain before doing a separate site-wide SEO migration.

## Vercel settings and deployment steps

1. In each real experiment repository, apply the appropriate base-path setup above and deploy to its own Vercel project using its actual framework preset. Keep its repo, builds, and deployment lifecycle independent.
2. For a newly deployed experiment, add its real deployment URL, set `status` to `ready`, and choose `upstreamPath` for its mount mode. Local-only entries such as LinkedIn Companion remain `local` without a deployment URL.
3. Run `npm run experiments:sync`, `npm run test:experiments`, `npm test -- --watchAll=false --runInBand`, and `npm run build`. Commit the source and generated config.
4. In the **portfolio's** Vercel project, use repository root as Root Directory, **Create React App** as the preset, `npm run build` as Build Command, and `build` as Output Directory. Use Node.js 24.x, matching this repo's `engines`. Keep the existing install command/default npm install behavior. No new environment variables or secrets are required.
5. Push the branch to the connected Git repository to create a Preview deployment. If the repository is not connected, import it in Vercel with the settings above. This change does not deploy or change dashboard settings automatically.
6. On the preview URL, check `/`, existing conversation topics, `/experiments`, `/experiments/linkedin-companion`, and the Pixel Pong page and full-page route. For any newly proxied experiment, check its base route, a nested route, and refresh. Test query parameters, Back/Forward navigation, and links within the experiment.
7. In DevTools Network, verify JS, CSS, fonts, images, favicon, and API requests stay under the correct prefix (or an intentional external origin) and return the correct content type, not the portfolio's HTML. Check console errors and test 320px mobile plus desktop in both themes. Confirm the address stays on the preview domain.
8. After preview checks, merge to the production branch. Confirm `usama.dev` belongs to the portfolio Vercel project; attach/verify it in Domains if needed. No domain attachment is needed for each path. Repeat the path and asset checks on `https://usama.dev`.

Live proxy behavior cannot be verified until an experiment has been prepared for prefix routing and set to `ready`. Local tests cover config validation, rewrite ordering, both prefix modes, local project pages, navigation, and existing portfolio interactions.

## References

- [Vercel external rewrites](https://vercel.com/docs/routing/rewrites)
- [Vite public base](https://vite.dev/config/shared-options.html#base)
- [Create React App deployment and relative paths](https://create-react-app.dev/docs/deployment/#building-for-relative-paths)
- [Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
