// POST /api/submit
//
// Accepts completed checklist submissions.
// For now: logs to console and returns success.
// In production: would integrate with persistent storage (Vercel KV, database, etc).
//
// The browser keeps local drafts when submission fails, so users don't lose answers.

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  try {
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

    // Log submission (for development/debugging)
    console.log('[SUBMISSION]', {
      respondent: record.respondentName,
      role: record.respondentRole,
      answered: record.answeredCount,
      corrections: record.correctionCount,
      timestamp: record.submittedAt
    });

    // Store in Vercel Blob. On Vercel, the SDK authenticates automatically via
    // the short-lived VERCEL_OIDC_TOKEN + BLOB_STORE_ID that a connected Blob
    // store injects; BLOB_READ_WRITE_TOKEN (a long-lived static token, only
    // needed for local/external use) is used instead when present.
    try {
      const { put } = require('@vercel/blob');
      const blobPath = `submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;

      const putOptions = { access: 'public' };
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        putOptions.token = process.env.BLOB_READ_WRITE_TOKEN;
      }

      await put(blobPath, JSON.stringify(record), putOptions);
    } catch (e) {
      console.error('[BLOB_ERROR]', e.message);
      // Continue anyway - the submission response isn't blocked on storage
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[ERROR]', err);
    return res.status(500).json({ error: 'internal_server_error' });
  }
}