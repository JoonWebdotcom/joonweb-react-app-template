import express from 'express';
import { createServer as createViteServer } from 'vite';
import joonwebApi from '@joonweb/api';
const { Context, Auth } = joonwebApi;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 5173;

  // Initialize Joonweb API SDK Context
  Context.init({
    apiKey: process.env.JOONWEB_CLIENT_ID || '',
    apiSecret: process.env.JOONWEB_CLIENT_SECRET || '',
    apiVersion: process.env.JOONWEB_API_VERSION || '26.0',
    appName: process.env.APP_NAME || 'React App'
  });

  // Joonweb OAuth Initiation Route
  app.get('/auth', async (req, res) => {
    try {
      const site = req.query.site;
      if (!site) {
        return res.status(400).send('Missing site parameter');
      }

      const redirectUri = process.env.JOONWEB_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/callback`;
      const authUrl = await Auth.beginAuth(req, res, site, redirectUri);
      
      return res.redirect(authUrl);
    } catch (e) {
      console.error('Failed to initiate auth', e);
      res.status(500).send(e.message);
    }
  });

  // Joonweb OAuth Callback Route
  app.get('/auth/callback', async (req, res) => {
    try {
      // Securely exchange code for token using the client secret
      const session = await Auth.validateCallback(req, res);
      
      // Successfully authenticated! In a production app, save session.accessToken to your database here.
      console.log(`OAuth successful for ${session.siteDomain}`);
      
      // Redirect back to the React UI, carrying the app bridge parameters
      const host = req.query.host;
      const site = req.query.site;
      const clientId = process.env.JOONWEB_CLIENT_ID;
      
      return res.redirect(`/?client_id=${clientId}&host=${host}&site=${site}`);
    } catch (e) {
      console.error('Failed to process callback', e);
      res.status(500).send(e.message);
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

createServer();
