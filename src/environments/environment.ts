/**
 * Development / default environment.
 * Set your Formspree form ID here for local development.
 * Note: In a client-side app, this value is bundled and visible in the browser.
 * To keep the ID out of the repo, use environment.prod.ts and add it to .gitignore,
 * or use a backend that holds the ID in a secret manager and proxies form submissions.
 */
export const environment = {
    production: false,
    formspreeFormId: 'YOUR_FORMSPREE_FORM_ID'
};
