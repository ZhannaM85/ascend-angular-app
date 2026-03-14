# ascend-angular-app

An Angular 21 app where users support their wishes through short discipline challenges, daily check-ins, and streak tracking.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Angular 21 |
| Components | Standalone, signals, `input()` / `output()`, OnPush |
| Styling | TailwindCSS 3, SCSS |
| Forms | Reactive forms |
| Routing | Angular Router, lazy-loaded pages |
| State | Signals (`WishStoreService`), LocalStorage persistence |
| Share cards | html-to-image (toPng) for Instagram-style export |
| Feedback form | Formspree (form ID from env or GitHub Secrets) |

No backend: all app data is stored in the browser via LocalStorage.

---

## Project structure

```
src/
  app/
    components/       # Reusable UI (wish-card, progress-bar, share-card, etc.)
    pages/            # Route-level views (wishes, wish-details, create-wish, fulfilled, about, feedback)
    services/         # StorageService, WishStoreService, ShareService, FulfillDialogService
    models/           # Wish, Commitment interfaces
  environments/       # environment.ts, environment.prod.ts (Formspree form ID)
  styles.scss        # Global Tailwind + base styles
public/              # Static assets (favicon, etc.)
scripts/
  env-from-secrets.js  # Writes environment.prod.ts from FORMSPREE_FORM_ID (CI)
.github/workflows/
  deploy-pages.yml     # Build and deploy to GitHub Pages on push to develop
```

---

## Prerequisites

- **Node.js** 20+ (22 recommended for CI)
- **npm** (or the package manager in `package.json`)

---

## Local setup

```bash
# Install dependencies
npm ci

# Run dev server (default http://localhost:4200)
npm start
```

Production build:

```bash
npm run build
```

Output: `dist/ascend-angular-app/browser/`.

---

## Environment and configuration

### Formspree (feedback form)

The feedback page sends submissions to [Formspree](https://formspree.io). Set your Formspree form ID so those emails reach you.

- **Local / dev:** Edit `src/environments/environment.ts` and set `formspreeFormId`.
- **Production (CI):** Use GitHub Secrets so the ID is never in the repo:
  1. Repo → **Settings → Secrets and variables → Actions**
  2. Add secret: `FORMSPREE_FORM_ID` = your form ID (e.g. from `https://formspree.io/f/xyzabc`)
  3. The deploy workflow runs `node scripts/env-from-secrets.js` before the build and writes `environment.prod.ts` from that secret.

See `src/environments/README.md` for more options (e.g. keeping a local `environment.prod.ts` out of the repo).

---

## Deployment (GitHub Pages)

Deploys when code is **merged (or pushed) to `develop`**.

- **Workflow:** `.github/workflows/deploy-pages.yml`
- **Trigger:** `push` to branch `develop`, or manual `workflow_dispatch`
- **Build:** Node 22, `npm ci`, inject Formspree ID from secrets, `ng build --configuration production --base-href /ascend-angular-app/`
- **SPA support:** `index.html` is copied to `404.html` so client-side routes work on GitHub Pages
- **Artifact:** `dist/ascend-angular-app/browser` is uploaded and deployed via GitHub Actions

**Requirements:**

1. **Pages** enabled with source **GitHub Actions** (Settings → Pages).
2. **Secret** `FORMSPREE_FORM_ID` in Settings → Secrets and variables → Actions (if you use the feedback form).

The app is served at: `https://<username>.github.io/ascend-angular-app/` (replace with your repo/user and base path if different).

---

## Main routes

| Path | Description |
|------|-------------|
| `/wishes` | List of active wishes and progress |
| `/wish/:id` | Wish detail, commitment progress, daily check-in, share, mark fulfilled |
| `/create-wish` | Create a wish and its commitment (title, duration) |
| `/fulfilled` | List of fulfilled wishes |
| `/about` | About the project and how the app works |
| `/feedback` | Send feedback or questions (Formspree → your email) |

---

## Data and persistence

- **Wishes** and **commitments** are stored in LocalStorage under keys `wishes` and `commitments`.
- **WishStoreService** exposes signals (`wishes`, `commitments`, `activeWishes`, `fulfilledWishes`) and methods to add/update/check-in/fulfill; every change is persisted via **StorageService**.
- No server or database: data stays in the browser.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| start | `ng serve` | Dev server |
| build | `ng build` | Production build (default config) |
| watch | `ng build --watch --configuration development` | Dev build with watch |
