
import { Routes, Route } from 'react-router-dom';
import { JoonwebProvider } from '@joonweb/react';
import { JoonwebProvider as AppBridgeProvider } from '@joonweb/app-bridge-react';
import Dashboard from './pages/Dashboard';

function App() {
  const params = new URLSearchParams(window.location.search);
  const apiKey = import.meta.env.VITE_JOONWEB_API_KEY || params.get('client_id') || '';
  const host = params.get('host') || '';
  const site = params.get('site') || '';

  return (
    <JoonwebProvider backendUrl={import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}>
      <AppBridgeProvider apiKey={apiKey} host={host} site={site}>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </AppBridgeProvider>
    </JoonwebProvider>
  );
}

export default App;
