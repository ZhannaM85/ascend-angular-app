# ascend-angular-app

An Angular 21 app where users support their wishes through short discipline challenges, daily check-ins, streak tracking, and reflections.

**Live site:** [https://zhannam85.github.io/ascend-angular-app/](https://zhannam85.github.io/ascend-angular-app/)

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
| i18n | ngx-translate (English, Russian) |
| Share cards | html-to-image (toPng) for Instagram-style export |
| Images | Client-side compression (JPEG) for wish photos |
| Testing | Jest |
| Linting | ESLint (Angular ESLint, TypeScript ESLint), Prettier |
| Code style | 4-space indent, no multiple empty lines, lines between class members |

No backend: all app data is stored in the browser via LocalStorage.

---

## Project structure

```
src/
  app/
    components/       # Reusable UI (wish-card, streak-calendar, share-modal, etc.)
    pages/            # Route-level views (wishes, wish-details, edit-wish, create-wish, fulfilled, about)
    services/         # WishStoreService, StorageService, ShareService, LocaleService, dialogs
    models/           # Wish, Commitment, Reflection interfaces
    guards/           # canDeactivateCreateWish (unsaved changes)
    directives/       # TruncateTooltipDirective
  assets/i18n/        # Translation JSON (en.json, ru.json)
  styles.scss         # Global Tailwind + base styles
public/               # Static assets (favicon, etc.)
eslint.config.js      # ESLint flat config (Angular + TypeScript)
.github/workflows/
  deploy-pages.yml    # Build and deploy to GitHub Pages on push to master
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

Run tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Auto-fix lint issues where possible:

```bash
npm run lint:fix
```

---

## Deployment (GitHub Pages)

Deploys automatically when code is **pushed or merged to `master`**.

- **Workflow:** `.github/workflows/deploy-pages.yml`
- **Trigger:** `push` to branch `master`, or manual `workflow_dispatch`
- **Build:** Node 22, `npm ci`, `ng build --configuration production --base-href /ascend-angular-app/`
- **SPA support:** `index.html` is copied to `404.html` so client-side routes work on GitHub Pages
- **Artifact:** `dist/ascend-angular-app/browser` is uploaded and deployed via GitHub Actions

**Requirements:**

1. **Pages** enabled with source **GitHub Actions** (Settings → Pages).

**Published at:** [https://zhannam85.github.io/ascend-angular-app/](https://zhannam85.github.io/ascend-angular-app/)

---

## Main routes

| Path | Description |
|------|-------------|
| `/wishes` | List of active wishes and progress |
| `/wish/:id` | Wish detail, commitment progress, daily check-in, reflections, share, edit, mark fulfilled |
| `/wish/:id/edit` | Edit wish and commitment |
| `/create-wish` | Create a wish and its commitment (title, duration, start date) |
| `/fulfilled` | List of fulfilled wishes |
| `/about` | About the project and how the app works |

---

## Data and persistence

- **Wishes**, **commitments**, and **reflections** are stored in **LocalStorage** under keys `wishes`, `commitments`, and `reflections`. Data is **not** stored on any server.
- **WishStoreService** exposes signals (`wishes`, `commitments`, `reflections`, `activeWishes`, `fulfilledWishes`) and methods to add/update/check-in/fulfill; every change is persisted via **StorageService**.
- **Data is device- and browser-specific:** if you open the app on a different device or in a different browser, you will not see your existing wishes or progress. There is no sync or cloud backup.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| start | `ng serve` | Dev server |
| build | `ng build` | Production build (default config) |
| watch | `ng build --watch --configuration development` | Dev build with watch |
| test | `jest` | Run unit tests |
| test:watch | `jest --watch` | Run tests in watch mode |
| lint | `ng lint` | Run ESLint |
| lint:fix | `ng lint --fix` | Run ESLint with auto-fix |
