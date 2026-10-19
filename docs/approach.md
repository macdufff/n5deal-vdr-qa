# Approach

I started with `task.md`, then the live app, then the API. For a data room the only question that really matters is: can the wrong person see a file. Folders and polish come after that.

Most of the evening went into sharing. I used john/viewer first, then switched to throwaway accounts because john's room is full of leftover QA folders and it's hard to tell what's the product vs leftover junk.

Access checks I did over the API (sibling leak on a public token, breadcrumbs on a nested share, complete-upload with no PUT). Clicking those in the UI is slow and easy to miss. UI tests cover the stuff a reviewer will actually click: login, new folder, PDF upload, share dialog, Shared with me, revoked link.

Pyramid is boring on purpose:

- unit: the `(1).pdf` rename rule, because the API and the UI both depend on it
- API: auth, isolation, shares, folders, upload
- e2e: the flows above, Playwright + page objects

I didn't wrap their Nest unit tests and call them mine. I also didn't test 100k files on a shared Railway instance.

## AI

Used Cursor to skim the Nest controllers so I wasn't guessing paths, and to dump a first Playwright layout. I still walked the app myself and rewrote selectors after that — first pass had the register button as "Sign up", it's actually "Create account". Findings and the call on release readiness are mine.
