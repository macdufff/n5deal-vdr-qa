# Test plan

Hosted build, 19 Oct 2026. Demo logins from the README, plus users I registered as I went.

**In:** auth, the one room the UI shows, nested folders, PDF upload/view/download, rename/move/delete file, delete folder (with the preview), public link, share-by-email, revoke, Shared with me, viewer is read-only.

**Out this pass:** search, versioning, moving folders, editor role, load. Optional in the original task or explicitly not built.

What I cared about first:

- can user B open user A's room
- does a public token stop at the shared folder
- does revoke actually kill the link
- can a viewer rename/delete/upload (they shouldn't)
- what happens if upload never finishes

Exploratory notes I followed, not a script:

- empty room → folders → rename → delete preview
- upload: happy, non-pdf, oversized, then a retry
- share a nested folder with viewer, try to walk up, try to mutate
- public link in a logged-out session, revoke, hit the same URL again
- share one file, make sure the neighbour file isn't there
- log out / log in as someone else in the same browser
- refresh on `/folder/:id` and `/share/:token`

If owner flows work, sharing doesn't leak, and revoke is visible — the demo is usable. 500s on a normal mistake are not.
