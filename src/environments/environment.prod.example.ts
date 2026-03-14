/**
 * Copy this file to environment.prod.ts and set your Formspree form ID.
 * Optionally add environment.prod.ts to .gitignore so the real ID is not committed.
 * The ID will still be visible in the built client bundle; for true secrecy
 * use a backend with a secret manager.
 */
export const environment = {
    production: true,
    formspreeFormId: 'YOUR_FORMSPREE_FORM_ID'
};
