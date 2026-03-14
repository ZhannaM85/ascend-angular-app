/**
 * Production environment.
 * Set your Formspree form ID here. You can add this file to .gitignore
 * and use environment.prod.example.ts (with a placeholder) as a template
 * so the real ID is not committed. The built app will still contain the ID
 * in the bundle; true secrecy requires a backend that stores the ID in a
 * secret manager and proxies submissions to Formspree.
 */
export const environment = {
    production: true,
    formspreeFormId: 'YOUR_FORMSPREE_FORM_ID'
};
