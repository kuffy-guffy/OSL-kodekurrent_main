# Inheritance Odds

A web app that estimates the chances of a child inheriting genetic traits and conditions from two parents, using simple Mendelian genetics (Punnett squares). It also includes a height range estimator, Rh incompatibility guidance and a combined "chance of at least one condition" summary.

> **Educational use only.** This is not medical advice or a diagnostic tool. Real inheritance is more complex than these models. For genetic counselling, talk to a clinical geneticist.

## Features

- 18 traits: cystic fibrosis, sickle cell disease, Huntington's disease, thalassaemia, PKU, Tay-Sachs, SMA, Wilson disease, albinism, ABO and Rh blood groups, and more
- Punnett square for each gene with outcome probabilities
- Child height range from parents' heights
- Rh incompatibility explanation
- Combined risk summary across several conditions
- No data stored: request bodies are never logged or saved

## Project structure

```
inheritance-odds/
├── public/
│   └── index.html      # frontend
├── logic.js            # calculations and input validation (no Express)
├── logic.test.js       # unit tests
├── traits.js           # genetics data; edit to add or change genes
├── server.js           # Express server and API routes
├── render.yaml         # Render deployment config
├── build-static.js     # builds docs/ for GitHub Pages
├── docs/               # server-free build (GitHub Pages)
├── package.json
└── package-lock.json
```

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000

## Run tests

```bash
npm test
```

## API

| Method | Route          | Body                                  |
|--------|----------------|---------------------------------------|
| GET    | `/api/traits`  | none                                  |
| POST   | `/api/cross`   | `{ traitId, p1, p2 }`                 |
| POST   | `/api/height`  | `{ parent1, parent2 }` (cm)           |
| POST   | `/api/rh`      | `{ p1, p2, mother }` (mother: 1 or 2) |
| POST   | `/api/summary` | `{ items: [{ traitId, p1, p2 }] }`    |

## GitHub Pages (no server)

GitHub Pages cannot run `server.js`. A server-free copy of the site is in `docs/`, where the same calculations run in the browser.

1. In the repo, open **Settings → Pages**
2. Source: **Deploy from a branch**, branch `main`, folder **/docs**
3. Save. The site appears at `https://<username>.github.io/<repo>/`

After changing `logic.js`, `traits.js` or `public/index.html`, run `node build-static.js` and commit the updated `docs/`.

## Deploying on Render

1. Push this repo to GitHub (`server.js` and `package.json` at the repo root, `index.html` inside `public/`).
2. On https://render.com choose **New → Web Service** and connect the repo (or **New → Blueprint** to use `render.yaml`).
3. Settings: Runtime **Node**, Build Command `npm install`, Start Command `npm start`.
4. Environment variable: `TRUST_PROXY` = `1`.
5. Deploy. Your site is live at `https://<service-name>.onrender.com`.

On the free plan the service sleeps after about 15 minutes idle, so the first visit afterwards takes up to a minute.

## Other hosts

Set `PORT` if your host needs it. When running behind a proxy (Render, Railway, Nginx), set `TRUST_PROXY=1` so the rate limiter sees real client IPs.

## Adding a trait

Add an entry to `T` in `traits.js` (and an outlook text in `OUT` if it is a condition), then run `npm test`. Update the expected trait count in `logic.test.js`.
