export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html, text, type, userEmail, userName, company } = req.body || {};
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY environment variable not configured.');
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: 'Simulated email dispatch (RESEND_API_KEY env not configured on host).' 
    });
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'AutoFlow Studio <onboarding@resend.dev>';
    const recipients = Array.isArray(to) ? to : [to];

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject: subject || 'AutoFlow Studio Alert',
        html: html || `<p>${text || ''}</p>`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn('Resend API response warning:', data);
      return res.status(response.status).json({ success: false, data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Email dispatch error:', err);
    return res.status(500).json({ error: err.message || 'Internal error dispatching email' });
  }
}
