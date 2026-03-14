/**
 * Writes src/environments/environment.prod.ts using FORMSPREE_FORM_ID from the environment.
 * Use in CI (e.g. GitHub Actions) with the secret set as FORMSPREE_FORM_ID.
 * Run before: ng build (or ng build --configuration production)
 *
 * Example (GitHub Actions):
 *   env:
 *     FORMSPREE_FORM_ID: ${{ secrets.FORMSPREE_FORM_ID }}
 *   run: node scripts/env-from-secrets.js && npm run build
 */
const fs = require('fs');
const path = require('path');

const formId = process.env.FORMSPREE_FORM_ID || 'YOUR_FORMSPREE_FORM_ID';
const outPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const content = `/**
 * Production environment (generated from FORMSPREE_FORM_ID in CI).
 * Do not commit real values; use GitHub Secrets and scripts/env-from-secrets.js.
 */
export const environment = {
    production: true,
    formspreeFormId: ${JSON.stringify(formId)}
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote environment.prod.ts with formspreeFormId from env');
