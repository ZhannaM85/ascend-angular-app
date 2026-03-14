# Environment configuration

## Formspree form ID (feedback)

Set your Formspree form ID from [Formspree](https://formspree.io) (create a form and set your email as the recipient).

### Option A: GitHub Secrets (recommended for GitHub Pages)

Same idea as storing a TMDB key in GitHub Secrets – the ID is never in the repo and is injected at build time in CI.

1. In your repo: **Settings → Secrets and variables → Actions → New repository secret**
2. Name: `FORMSPREE_FORM_ID`, Value: your Formspree form ID (e.g. `xyzabc` from `https://formspree.io/f/xyzabc`)
3. The workflow in `.github/workflows/deploy-pages.yml` runs `node scripts/env-from-secrets.js` before `npm run build`, which writes `environment.prod.ts` from that secret.

So when you push (or run the workflow), the build uses the secret and your Formspree ID never appears in the repo – only in GitHub’s secret store and in the built bundle.

### Option B: Local / not using GitHub Actions

- **Development:** set `formspreeFormId` in `environment.ts`
- **Production:** copy `environment.prod.example.ts` to `environment.prod.ts`, set `formspreeFormId` there, and add `src/environments/environment.prod.ts` to `.gitignore` if you don’t want to commit it

**Note:** In a client-side app, the form ID still ends up in the JavaScript bundle in the browser. GitHub Secrets (or `.gitignore`) only keeps it out of the **source** repo.
