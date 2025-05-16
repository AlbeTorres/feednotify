import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default client;
// This code creates a new instance of the OAuth2Client from the google-auth-library using the Google client ID stored in the environment variable GOOGLE_CLIENT_ID.
// The OAuth2Client is used to handle OAuth 2.0 authentication and authorization flows with Google services.
