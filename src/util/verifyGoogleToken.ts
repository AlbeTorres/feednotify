import client from '../config/google.OAuth2Client';

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload; // Contiene email, sub, name, picture, etc.
}
// This function verifies a Google ID token using the OAuth2Client instance.
// It takes an ID token as input, verifies it, and returns the payload containing user information such as email, sub (subject), name, and picture.
