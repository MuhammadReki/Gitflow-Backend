export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing code parameter' });
    }

    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({
        error: tokenData.error,
        error_description: tokenData.error_description,
      });
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(500).json({ error: 'No access token received' });
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'GitFlow-App',
      },
    });

    const user = await userResponse.json();

    return res.status(200).json({
      access_token: accessToken,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      user: user,
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return res.status(500).json({
      error: 'internal_error',
      message: error.message,
    });
  }
}
