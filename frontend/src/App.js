import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPanel from './components/AdminPanel';
import DrawPage from './components/DrawPage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [view, setView] = useState('draw'); // 'draw' or 'admin'
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`);
      setConfig(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching config:', error);
      setLoading(false);
    }
  };

  const handleConfigUpdate = () => {
    fetchConfig();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-christmas-red via-christmas-green to-christmas-red flex items-center justify-center">
        <div className="text-white text-2xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-christmas-red via-christmas-green to-christmas-red">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎅 Secret Santa 🎄
          </h1>
          <p className="text-white text-lg md:text-xl drop-shadow">
            Losowanie prezentów świątecznych
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-1 inline-flex">
            <button
              onClick={() => setView('draw')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                view === 'draw'
                  ? 'bg-christmas-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Losowanie
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                view === 'admin'
                  ? 'bg-christmas-green text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Panel Admina
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {view === 'admin' ? (
            <AdminPanel 
              config={config} 
              onUpdate={handleConfigUpdate}
              apiUrl={API_URL}
            />
          ) : (
            <DrawPage 
              config={config} 
              apiUrl={API_URL}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white text-sm opacity-75">
          <p>Wesołych Świąt! 🎁</p>
        </div>
      </div>
    </div>
  );
}

export default App;
