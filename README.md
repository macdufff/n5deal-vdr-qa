# VDR QA

Reviewed the hosted app from [evo9/virtual-data-room](https://github.com/evo9/virtual-data-room).

- web: https://virtual-data-room-ten.vercel.app
- api: https://virtual-data-room-production.up.railway.app

I didn't change their code. Notes and tests are in this folder.

- [test plan](docs/test-plan.md)
- [findings](docs/findings.md)
- [how I tested](docs/approach.md)
- [QA report](docs/qa-report.md)

Automation: Playwright (API + UI) + a couple of unit checks for the file-name suffix. Pages live in `src/pages`, helpers in `src/api`. Tests spin up their own users so they don't depend on `john@example.com` (that room is already a mess).

```bash
npm install
npx playwright install chromium
npm run test:unit
npm run test:api
npm run test:e2e
```

Hits prod. Folders/files created during a run get deleted afterwards.
