import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { JoonwebProvider } from '@joonweb/react';
import { JoonwebProvider as AppBridgeProvider } from '@joonweb/app-bridge-react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <JoonwebProvider>
      <AppBridgeProvider>
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
