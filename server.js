import express from 'express';
import { createServer as createViteServer } from 'vite';
import joonwebApi from '@joonweb/api';
const { Context, OAuth } = joonwebApi;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 5173;

  // Simple in-memory session store for demo purposes. 
  // In production, use a real database (Redis, Postgres, etc.)
  const sessionStore = new Map();

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
      const scopes = ['read_products', 'write_products'];
      const authUrl = OAuth.getAuthorizationUrl(site, scopes, redirectUri);
      
      return res.redirect(authUrl);
    } catch (e) {
      console.error('Failed to initiate auth', e);
      res.status(500).send(e.message);
    }
  });

  // Joonweb OAuth Callback Route
  app.get('/auth/callback', async (req, res) => {
    try {
      const site = req.query.site;
      const code = req.query.code;
      if (!site || !code) return res.status(400).send('Missing site or code parameters');

      // Securely exchange code for token using the client secret
      const session = await OAuth.exchangeCodeForToken(site, code);
      
      // Successfully authenticated! Save session.access_token to our store.
      sessionStore.set(site, session.access_token);
      console.log(`OAuth successful for ${site}`);
      
      // Redirect back to JoonWeb embed URL so the app loads inside the iframe
      const site_hash = req.query.site_hash || '';
      const app_slug = req.query.app_slug || process.env.JOONWEB_CLIENT_ID;
      
      const embedUrl = `https://accounts.joonweb.com/site/?sitehash=${encodeURIComponent(site_hash)}&apps&${encodeURIComponent(app_slug)}`;
      return res.redirect(embedUrl);
    } catch (e) {
      console.error('Failed to process callback', e);
      res.status(500).send(e.message);
    }
  });

  // Example API Route to fetch products using the JoonWeb SDK
  app.get('/api/products', async (req, res) => {
    try {
      const site = req.query.site;
      if (!site) return res.status(400).send('Missing site parameter');
      
      const token = sessionStore.get(site);
      if (!token) return res.status(401).send('Unauthorized: App must be re-installed to get a fresh token.');

      const joonweb = new joonwebApi.JoonWebAPI(token, site);
      const products = await joonweb.product.list(); // SDK call to fetch products
      
      res.json({ data: products.data || [] });
    } catch (error) {
      console.error('Failed to fetch products', error);
      res.status(500).json({ error: 'Failed to fetch products from JoonWeb' });
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
