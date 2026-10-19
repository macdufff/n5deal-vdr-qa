# Findings

P1 = I wouldn't put real files behind this. P2 = people will hit it. P3 = polish / leftover / known cuts.

Prod, 19 Oct 2026.

## P1

**VDR-01 — complete without a PUT is 500**

`POST /files/{id}/complete` after an intent, no upload. Got `500 Could not verify the upload`. README / swagger say 400, "Upload did not finish - please try again".

The file stays hidden (good). The status is the problem — looks like storage is down, but you just closed the tab. Can't tell a real outage from an abandoned upload.

**VDR-02 — Swagger is open**

https://virtual-data-room-production.up.railway.app/docs and `/docs-json` both 200. Whole API, including how public tokens work. Fine for homework, not for a box with actual docs. Hide it behind auth or an env flag.

**VDR-03 — no login throttle**

I sent 8 wrong passwords for john. All 401, no delay, no lockout. README already publishes the password. Unknown email and wrong password share the same message, that part is correct.

**VDR-04 — JWT in localStorage, 7 days, no server logout**

Sign out only deletes the key in the browser. They already wrote this down as an MVP cut. Still: copy the token from DevTools and you're in until it expires. Client cache on logout *is* cleared (I checked), so the old "see the previous user's folders" issue looks gone.

## P2

**VDR-05 — extra rooms via API, UI shows one**

Created "Second room" with `POST /data-rooms`. List returns two. UI always opens the first. So you can have a room you can't open in the product.

**VDR-06 — Download dumps you out of the app**

Row download does `window.location.href = signedUrl`. File comes down, but you leave the SPA. Back is weird. An `<a download>` would be enough. The URL itself is fine, filename is on the query.

**VDR-07 — sharing with yourself**

Posted a USER share to my own email, 201. Shows up in the people list. No "that's you" check.

**VDR-08 — MIME is whatever the client says**

Intent rejects non-pdf in the JSON. Nothing sniffs the bytes on complete. Rename an exe, set `application/pdf`, it sits in the room. Ok for MVP, not ok if counterparties are hostile.

**VDR-09 — abandoned intents stick around**

After VDR-01, pending.pdf isn't listed, but the row is still there and it holds the name. Next upload of the same name becomes `pending (1).pdf`. Also mentioned in their README.

**VDR-10 — folder and file can have the same name**

I have a folder `memo.pdf` next to a file `memo.pdf`. Two rows, same label. Easy to click the wrong one.

## P3

**VDR-11 — john's room is junk.** `QA_Folder_*`, `API_Share_*`, a folder named `!@!#!$!@U%(U%`. Viewer still has empty `TestTabriz`. Looks broken before you even start.

**VDR-12 — `x-powered-by: Express`.** Whatever.

**VDR-13 — no folder move.** Files move. Folders don't. Matches their cut; people will still look for it.

**VDR-14 — no password reset / no email verify.** I can register founder@acme.com and later pick up shares meant for them. Share-before-register is a feature; squatting comes with it.

**VDR-15 — EDITOR in the schema, unused.** UI doesn't pretend it exists. Fine.

## What worked

Same 401 for unknown email vs bad password. Nested share: breadcrumbs start at the share, parent is 404, mutations 404. Public token doesn't list a sibling folder. Revoke is 410 and the UI says so. Share-to-unregistered-email shows up after they sign up. Folder clash is 409, file clash gets `(1).pdf`. Empty folder name 400. CORS didn't echo a random origin. `/folder/foo` still serves the SPA. `alg=none` rejected.

I'd spend the next week on upload errors and session, not on rewriting sharing. Sharing is the good part.
