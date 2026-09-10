// GET /api/results
//
// Password-protected reading room for returned checklists. There is no email
// notification by design: everything stays inside Vercel. Bookmark this URL and
// check it.
//
// Environment:
//   RESULTS_PASSWORD        set by hand in Vercel. Any long random string.
//   BLOB_READ_WRITE_TOKEN   created automatically with the Blob store.
//
// Auth is HTTP Basic, so the browser handles the prompt and there is no login
// page to build or maintain. Username is ignored; only the password is checked.

const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  try {
    const expected = process.env.RESULTS_PASSWORD;

    if (!expected) {
      return res
        .status(500)
        .send('RESULTS_PASSWORD is not set. Add it in Vercel and redeploy.');
    }

    if (!authorised(req.headers.authorization, expected)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Distil results"');
      return res.status(401).send('Authentication required.');
    }

    let blobs = [];
    try {
      const out = await list({ prefix: 'submissions/' });
      blobs = out.blobs || [];
    } catch (e) {
      console.error('blob list failed', e);
      return res.status(502).send('Could not read the store.');
    }

    // Newest first.
    blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));

    const records = [];
    for (const b of blobs.slice(0, 100)) {
      try {
        const r = await fetch(b.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        });
        if (r.ok) records.push(await r.json());
      } catch (e) {
        console.error('blob read failed', b.pathname, e);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(render(records));
  } catch (err) {
    console.error('[ERROR]', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Internal server error: ' + err.message);
  }
};

function authorised(header, expected) {
  if (!header || !header.startsWith('Basic ')) return false;
  let decoded;
  try {
    decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  } catch (e) {
    return false;
  }
  try {
    const given = decoded.slice(decoded.indexOf(':') + 1);
    // Length-independent comparison, to avoid leaking length by timing.
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch (e) {
    return false;
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(records) {
  let h = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Returned checklists</title>
<style>
:root{--blue:#1B3A8C;--gold:#C8960C;--emerald:#1A5C3A;--ink:#0D1B2A;
      --ivory:#FAFAF8;--grey:#6B7280;--line:#E2E1DC}
*{box-sizing:border-box}
body{margin:0;background:var(--ivory);color:var(--ink);
     font:16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
main{max-width:860px;margin:0 auto;padding:48px 24px 120px}
h1{font-size:26px;font-weight:600;letter-spacing:-.02em;margin:0 0 4px}
.lede{color:var(--grey);margin:0 0 40px}
.sub{border:1px solid var(--line);background:#fff;border-radius:4px;
     padding:24px;margin:0 0 28px}
.sub h2{font-size:19px;font-weight:600;margin:0 0 2px}
.sub .meta{color:var(--grey);font-size:14px;margin:0 0 20px}
.tag{display:inline-block;padding:2px 9px;border-radius:3px;font-size:13px}
.tag.fix{background:#FBF4E3;color:#7A5B04}
.tag.ok{background:#EAF2ED;color:var(--emerald)}
h3{font-size:14px;font-weight:600;margin:24px 0 10px;
   padding-bottom:5px;border-bottom:1px solid var(--line)}
h3.gold{border-bottom:2px solid var(--gold)}
.item{margin:0 0 14px;padding-left:12px;border-left:3px solid var(--gold)}
.item .id{font-size:13px;color:var(--grey)}
.item .note{margin-top:5px;padding:8px 10px;background:#FBF4E3;border-radius:3px}
table{border-collapse:collapse;width:100%;font-size:13px;margin-top:8px}
td{padding:6px 8px 6px 0;vertical-align:top;border-top:1px solid var(--line)}
td.id{color:var(--grey);white-space:nowrap;width:52px}
td.v{white-space:nowrap;text-align:right;width:96px}
.v-yes{color:var(--emerald)}.v-no{color:var(--gold);font-weight:500}
.v-none{color:var(--grey)}
.secrow td{font-weight:600;border-top:none;padding-top:16px}
details summary{cursor:pointer;color:var(--blue);font-size:14px;margin-top:16px}
.empty{color:var(--grey);padding:40px 0}
</style><main>`;

  h += `<h1>Returned checklists</h1>`;
  h += `<p class="lede">${records.length} ${
    records.length === 1 ? 'return' : 'returns'
  }. Newest first.</p>`;

  if (!records.length) {
    h += `<p class="empty">Nothing returned yet. This page fills as answers come in.</p></main>`;
    return h;
  }

  for (const rec of records) {
    const corrections = (rec.answers || []).filter(a => a.answer === 'no');
    const fields = (rec.answers || []).filter(
      a => a.kind === 'field' && String(a.value || '').trim() !== ''
    );
    const notedYes = (rec.answers || []).filter(a => a.answer === 'yes' && a.note);
    const blank = (rec.answers || []).filter(
      a =>
        (a.kind === 'binary' && !a.answer) ||
        (a.kind === 'field' && String(a.value || '').trim() === '')
    );

    h += `<div class="sub"><h2>${esc(rec.respondentName)}</h2>`;
    h += `<p class="meta">${
      rec.form ? '<strong>' + esc(rec.form) + '</strong> &middot; ' : ''
    }${
      rec.respondentRole ? esc(rec.respondentRole) + ' &middot; ' : ''
    }${esc(new Date(rec.submittedAt).toLocaleString('en-GB'))} &middot; ${
      rec.answeredCount
    } of ${rec.totalCount} answered &nbsp;`;
    h += rec.correctionCount
      ? `<span class="tag fix">${rec.correctionCount} to correct</span>`
      : `<span class="tag ok">nothing flagged</span>`;
    h += `</p>`;

    if (corrections.length) {
      h += `<h3 class="gold">Marked for correction</h3>`;
      for (const a of corrections) {
        h += `<div class="item"><div class="id">${esc(a.id)} &middot; ${esc(
          a.section
        )}</div><div>${esc(a.statement)}</div>`;
        if (a.note) h += `<div class="note">${esc(a.note)}</div>`;
        h += `</div>`;
      }
    }

    if (fields.length) {
      h += `<h3>Values given</h3>`;
      for (const a of fields) {
        h += `<div style="margin-bottom:7px"><span class="id" style="color:#6B7280;font-size:13px">${esc(
          a.id
        )}</span> ${esc(a.statement)} &mdash; <strong>${esc(a.value)}${
          a.unit ? ' ' + esc(a.unit) : ''
        }</strong></div>`;
      }
    }

    if (notedYes.length) {
      h += `<h3>Confirmed, with a note</h3>`;
      for (const a of notedYes) {
        h += `<div style="margin-bottom:11px"><span style="color:#6B7280;font-size:13px">${esc(
          a.id
        )}</span> ${esc(a.statement)}<div style="color:#6B7280;margin-top:3px">${esc(
          a.note
        )}</div></div>`;
      }
    }

    if (blank.length) {
      h += `<h3>Left blank (${blank.length})</h3><div style="color:#6B7280">${blank
        .map(a => esc(a.id))
        .join(', ')}</div>`;
    }

    h += `<details><summary>Full return</summary><table>`;
    let last = '';
    for (const a of rec.answers || []) {
      if (a.section !== last) {
        last = a.section;
        h += `<tr class="secrow"><td colspan="3">${esc(a.section)}</td></tr>`;
      }
      let cls = 'v-none';
      let val = '&mdash;';
      if (a.kind === 'field') {
        if (String(a.value || '').trim() !== '') {
          val = esc(a.value) + (a.unit ? ' ' + esc(a.unit) : '');
          cls = 'v-yes';
        }
      } else if (a.answer === 'yes') {
        val = 'Correct';
        cls = 'v-yes';
      } else if (a.answer === 'no') {
        val = 'Correct it';
        cls = 'v-no';
      }
      h += `<tr><td class="id">${esc(a.id)}</td><td>${esc(
        a.statement
      )}</td><td class="v ${cls}">${val}</td></tr>`;
    }
    h += `</table></details></div>`;
  }

  h += `</main>`;
  return h;
}