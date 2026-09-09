// POST /api/submit
//
// Stores one completed checklist as a private JSON blob in Vercel Blob.
// No third-party service is involved: storage is Vercel's own, and the token
// is created automatically when the Blob store is attached to this project.
//
// Environment:
//   BLOB_READ_WRITE_TOKEN   created by Vercel when the Blob store is connected.
//                           Nothing to set by hand.

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body =
    req.body && typeof req.body === 'object' ? req.body : safeParse(req.body);

  if (!body || !Array.isArray(body.answers) || !body.respondentName) {
    return res.status(400).json({ error: 'invalid_payload' });
  }

  // Cap the payload so a malformed or hostile request cannot fill the store.
  if (body.answers.length > 300) {
    return res.status(413).json({ error: 'payload_too_large' });
  }

  const record = {
    form: String(body.form || 'unknown').slice(0, 64),
    respondentName: String(body.respondentName).slice(0, 200),
    respondentRole: String(body.respondentRole || '').slice(0, 200),
    answeredCount: Number(body.answeredCount) || 0,
    totalCount: Number(body.totalCount) || 0,
    correctionCount: Number(body.correctionCount) || 0,
    answers: body.answers,
    submittedAt: new Date().toISOString(),
    userAgent: String(req.headers['user-agent'] || '').slice(0, 400)
  };

  // Pathname sorts newest-last and stays readable in the Blob dashboard.
  const stamp = record.submittedAt.replace(/[:.]/g, '-');
  const who = record.respondentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'unnamed';

  try {
    await put(
      `submissions/${record.form}/${stamp}--${who}.json`,
      JSON.stringify(record, null, 2),
      { access: 'private', contentType: 'application/json' }
    );
  } catch (e) {
    // Surface the failure rather than swallowing it: the browser keeps the
    // local draft when the request fails, so the answers are not lost.
    console.error('blob put failed', e);
    return res.status(502).json({ error: 'store_failed' });
  }

  return res.status(200).json({ ok: true });
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
