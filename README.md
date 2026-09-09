# Distil — process confirmation form

A 77-item confirmation form for Mectech's process engineer. He marks each
statement correct or flags it for correction, notes what it should say instead,
and submits.

**Everything runs on Vercel.** Storage is Vercel Blob. There is no email
service, no database service, no third-party integration of any kind. The only
npm dependency is `@vercel/blob`, which is Vercel's own SDK.

Because there is no email, returns are read on a password-protected page on the
same deployment: **`/api/results`**. Bookmark it.

---

## Files

```
index.html        the form — inline CSS and JS
questions.js      the 12 sections and 77 items
api/submit.js     POST /api/submit → writes a private blob
api/results.js    GET  /api/results → password-protected reading room
package.json      one dependency: @vercel/blob
vercel.json       security headers, noindex
```

`api/` must stay at the project root. Vercel maps it to `/api/*`.

---

## Deploy

**1 · New Vercel project.** Framework preset **Other**. No build command, no
output directory. Vercel installs the one dependency itself.

**2 · Blob store.** Project → Storage → connect a Blob store, in the same
project. Vercel writes `BLOB_READ_WRITE_TOKEN` into the project's environment
automatically. Nothing to copy or paste.

**3 · One variable by hand.** Settings → Environment Variables:

| Variable | Value |
|---|---|
| `RESULTS_PASSWORD` | a long random string, kept in a password manager |

Redeploy afterwards. Vercel does not apply new variables without one.

**4 · Domain — optional, and skip it unless asked.** The default
`*.vercel.app` URL works and carries zero risk. A custom subdomain means editing
the DNS zone that also holds the mail records for
`turbobytesconsulting.com`, which is not worth it for a single client form.

---

## Reading returns

Open `/api/results` on the deployment. The browser prompts for a password —
username is ignored, password is `RESULTS_PASSWORD`.

Each return shows the flagged items and their notes first, then values given,
then confirmed-with-a-note, then blanks, then the full table behind a toggle.

Raw JSON also sits in the Blob store under
`submissions/mectech-process-v1/`, one file per return.

---

## Smoke test before sending the link

- Load the page; confirm fonts and layout hold
- Answer three items, flag one with a note, fill one numeric field
- Reload; confirm the answers survive
- Submit; confirm the confirmation screen appears
- Open `/api/results`; confirm the return is there with the note
- Delete the test blob from the Blob store dashboard
- Open the URL on a phone; confirm buttons are tappable and nothing overflows

---

## Notes

**Drafts are local.** Progress saves to `localStorage` under
`distil-mectech-process-v1`. Starting on a laptop and finishing on a phone means
starting again. Acceptable for fifteen minutes of work.

**Nothing is lost on a failed submit.** The local draft is only cleared after
the server confirms. A failed request leaves everything in place to retry.

**Partial returns are fine.** Only a name is required. Blanks are listed by
clause number on the results page so you can chase four items rather than asking
for the whole thing again.

**No analytics.** This page carries a named client's technical answers about
their own plant designs. Do not add GA4, Clarity, or anything else to it.

**Reusing the form.** Edit `questions.js` and the `form` string in
`index.html`. Blobs are filed per form name, so several checklists can share one
deployment.

---

## Section map

| # | Section | Items |
|---|---|---|
| 1 | Biodiesel chain order | 9 |
| 2 | FFA thresholds | 5 |
| 3 | Multi-feed enquiries | 6 |
| 4 | Standalone sections | 6 |
| 5 | Materials of construction | 9 |
| 6 | Safety and hazardous service | 12 |
| 7 | Utilities | 8 |
| 8 | Effluent and residues | 5 |
| 9 | Sparing | 3 |
| 10 | Capacity and scaling | 6 |
| 11 | Product codes | 4 |
| 12 | Drawings | 4 |

Item 1.1 settles the contradiction between the recorded biodiesel chain and rule
CHEM-09, and unblocks biodiesel generation on its own.
