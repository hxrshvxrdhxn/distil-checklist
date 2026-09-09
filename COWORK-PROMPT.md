# Cowork prompt — deploy the Distil checklist form

Paste the block below into Cowork. Everything it needs is in this folder.

---

## THE PROMPT

Deploy the site in this folder to Vercel using my browser. It is a finished
static page plus two serverless functions. It needs deploying, not building.

**Do not rewrite it. Do not add a framework. Do not add any dependency beyond
the one already in `package.json`. Do not add any third-party service — no
email provider, no external database, no analytics. Everything stays inside
Vercel.** If something looks broken, fix that specific thing and tell me exactly
what you changed and why.

### Absolute rules — read these before you click anything

1. **Do not touch DNS.** My nameservers are on Vercel and that zone holds the
   mail records for `turbobytesconsulting.com` — MX, SPF, DKIM, DMARC, and the
   `mail.` subdomain that runs my mailing system. A broken record there stops my
   business email. **Do not open the Domains section at all.** Use the
   `*.vercel.app` URL that Vercel assigns. If you believe a custom domain is
   needed, stop and ask me.
2. **Do not modify any existing Vercel project.** Create one new project.
   Do not redeploy, rename, pause, transfer or change the settings of anything
   that already exists in my account.
3. **Do not delete anything.** No projects, no deployments, no stores, no
   environment variables, no files.
4. **Do not change account, team, billing or security settings.**
5. **Do not accept any new terms, upgrade any plan, or add any paid product.**
   If a step requires a plan upgrade, stop and ask me.
6. **Do not put any credential in chat.** Not the blob token, not the results
   password, not a session cookie. If one appears on screen, do not repeat it in
   your messages. If you ever paste one by accident, tell me immediately so I
   can rotate it.
7. **Stop and ask me before any action you cannot undo.**

### Steps

**1 · Create the project.** New Vercel project from this folder. Framework
preset **Other**. Leave build command, install command and output directory
empty — Vercel handles the single dependency itself. Name it
`distil-checklist`.

**2 · Attach Blob storage.** In the new project, Storage → connect a Blob
store, created inside this same project. Vercel then writes
`BLOB_READ_WRITE_TOKEN` into the project environment on its own. Do not create
this variable by hand and do not copy the token anywhere.

**3 · Add one environment variable.** Settings → Environment Variables, scope
Production:

- Name: `RESULTS_PASSWORD`
- Value: generate a long random string, at least 24 characters, letters and
  digits only. **Do not show it to me in chat.** Save it to a plain text file at
  the top level of this folder called `RESULTS-PASSWORD.txt` and tell me the
  file is there.

**4 · Redeploy.** Vercel does not apply new environment variables to an existing
deployment. Trigger a fresh production deployment after step 3.

**5 · Test it, and do not report success before all of this passes.**

- Open the live URL. Confirm the fonts load and the layout holds.
- Enter a name, answer three items, mark one of them "Needs correction" and type
  a short note, and fill one numeric field.
- Reload the page. Confirm those answers are still there.
- Press "Send answers". Confirm the confirmation screen appears.
- Open `<live-url>/api/results`. The browser will prompt for a password — leave
  the username blank or type anything, and use the password from step 3.
  Confirm the test return is listed, with the flagged item and its note showing
  at the top.
- Go to the Blob store in the Vercel dashboard and delete the single test file
  under `submissions/`. Delete only that file.
- Resize the browser to a phone width and confirm the buttons are tappable and
  nothing overflows.

### Report back

- The live URL
- The `/api/results` URL
- Confirmation that every test step above passed
- Confirmation that `RESULTS-PASSWORD.txt` was written
- Anything you changed in the code, and why
- Anything you were unsure about, rather than guessing

Do not summarise the plan back to me before starting. Start, and tell me when
each step is done.
