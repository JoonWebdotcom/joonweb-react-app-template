import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { JoonwebProvider } from '@joonweb/react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <JoonwebProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </JoonwebProvider>
  );
}

export default App;
