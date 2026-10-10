// api/auth/google/callback.js
// Endpoint: GET /api/auth/google/callback?code=xxx
// Fungsi: Tukar code Google jadi access_token, ambil user info,
//         redirect balik ke app via deep link.

export default async function handler(req, res) {
  const { code, error } = req.query;

  // Kalau user cancel / error dari Google
  if (error) {
    return res.redirect(
      `gitflow://auth/google?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return res.redirect('gitflow://auth/google?error=missing_code');
  }

  try {
    // 1. Tukar code jadi access_token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:
          'https://gitflow-backend-xi.vercel.app/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(
        `gitflow://auth/google?error=${encodeURIComponent(tokenData.error)}`
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.redirect('gitflow://auth/google?error=no_token');
    }

    // 2. Ambil user info dari Google
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const user = await userResponse.json();

    // 3. Redirect balik ke app dengan token + info user
    const params = new URLSearchParams({
      access_token: accessToken,
      email: user.email || '',
      name: user.name || '',
      picture: user.picture || '',
      id: user.id || '',
    });

    return res.redirect(`gitflow://auth/google?${params.toString()}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return res.redirect(
      `gitflow://auth/google?error=${encodeURIComponent(err.message)}`
    );
  }
}
