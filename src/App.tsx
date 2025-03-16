import React from 'react';
import CallDashboard from './components/CallDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">AI Cold Calling Agent</h1>
        </div>
      </nav>
      <main className="py-8">
        <CallDashboard />
      </main>
    </div>
  );
}

export default App;