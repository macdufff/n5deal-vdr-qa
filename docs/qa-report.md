# QA report

19 Oct 2026, hosted VDR. One pass, not a week-long audit. I tested against the live web and API, didn't run it locally.

## What I actually exercised

Auth (register, login, duplicate email, short password, case). Isolation between two fresh users, and a look at john/viewer. Folders: nest, duplicate names, empty name, delete preview. Files: intent validation, complete with and without PUT, rename suffix, move, view/download URLs. Sharing both ways, including share-before-the-person-exists, revoke, breadcrumbs, sibling leak. UI: login, folder, PDF upload, share dialog, Shared with me, revoked public page. Also poked Swagger, CORS, `alg=none`, a handful of bad logins in a row.

## Issues / risk

Details in [findings.md](findings.md).

Sharing itself is in good shape. What would stop me putting a real CIM in here is the session (no throttle, 7-day JWT, sign-out is client-only), public `/docs`, and upload complete returning 500 if the file never arrived.

Don't demo on john. That room is leftover folders from other people. Register a clean user.

## Automation

Unit: file name suffix.  
API: auth, 404 isolation, nested share + breadcrumbs, public token + 410, folders, PDF upload, pending intent hidden, non-PDF rejected.  
E2E: register/login, folder, PDF upload, public link from the dialog, Shared with me, revoked link.

Left out: drag-and-drop, move dialog, a 50+ file page, waiting 5 minutes for a signed URL to die.

`npm run test:unit && npm run test:api && npm run test:e2e`

## Ready to ship?

For a take-home demo — yes, with the notes above. Owner/viewer flows work and sharing matches `task.md`.

For real documents — no. I'd want token revoke, login throttle, docs locked, and that 500 on complete fixed.

## Next

If they fix complete-without-PUT, change the API test from "400 or 500" to just 400. After that: pagination in the share dialog, signed URL after revoke, switch accounts in one tab, drag-and-drop. I wouldn't pile on more login tests.
