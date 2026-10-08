# Connect Pixel Pong

Pixel Pong is the first real entry at `/experiments`, with its GitHub link and an embedded game at `/experiments/pixel-pong`. The browser stays on the portfolio route while an iframe loads the independent deployment. Its root-relative assets resolve against the game's own origin, so it works without an upstream redeploy. The iframe permits scripts and its own origin but not top-level navigation.

The embedded page also offers **Open full page** at `/experiments/pixel-pong/fullscreen`. That route removes the portfolio shell, fills the viewport with the game, and includes a Back to portfolio link. The browser still shows the portfolio domain. The route is reserved ahead of future external proxy rewrites.

This is an embedded integration, not a reverse proxy. The optional steps below switch it to a full-page proxy later. Embedding requires the upstream to allow framing; the current deployment has been checked in the browser. Its internal URLs are not synchronized into the portfolio address bar.

Inspected source: https://github.com/iamus4ma/pixel-pong-game

Inspected deployment: https://pixel-pong-six.vercel.app/

The game uses React 19, Create React App 5, and the Canvas API. It animates automated paddles and pixel lettering; it does not use a routing library or load external game assets. The current deployed bundle uses root-relative `/static/js/...` and `/static/css/...` URLs. Enabling the portfolio rewrite now would request those files from the portfolio instead of the game.

## Prepared change for the independent game repository

Apply `docs/pixel-pong-base-path.patch` from this portfolio checkout **inside the Pixel Pong repository**, then build and deploy that repository:

```powershell
git apply --check C:/Users/LPT394/Documents/GitHub/usamadev/docs/pixel-pong-base-path.patch
git apply C:/Users/LPT394/Documents/GitHub/usamadev/docs/pixel-pong-base-path.patch
npm run build
```

The patch sets CRA's `homepage` to `/experiments/pixel-pong` and adds origin-side asset rewrites. This supports the prefix both on the standalone Vercel alias and through the portfolio's root-stripping proxy. It does not merge either repository or add dependencies. It has been prepared against the inspected `main` source, but has not been committed or deployed to the game repository.

Commit and push those game changes to its Vercel production branch. After deployment, confirm the HTML references `/experiments/pixel-pong/static/...`, and those exact JS/CSS URLs load on `pixel-pong-six.vercel.app`. Also verify the game renders at both `/` and `/experiments/pixel-pong` on that origin. Existing HTML refers to absent `logo192.png` and `manifest.json` files; remove those two optional link tags or supply the files separately.

Then change only Pixel Pong's registry `status` from `pending` to `ready` (leave `upstreamPath` empty), run `npm run experiments:sync`, and deploy the portfolio. This generates:

```text
/experiments/pixel-pong          -> https://pixel-pong-six.vercel.app/
/experiments/pixel-pong/:path*    -> https://pixel-pong-six.vercel.app/:path*
```

Check the game and its prefixed JS/CSS requests on the portfolio's Vercel preview before production. No remote repository, deployment, or dashboard settings were changed by adding this entry.
