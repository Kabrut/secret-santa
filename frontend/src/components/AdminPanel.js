import React, { useState } from 'react';
import axios from 'axios';

const ADMIN_PASSWORD = 'swieta2000';

function AdminPanel({ config, onUpdate, apiUrl }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [participants, setParticipants] = useState(
    config?.participants?.join('\n') || ''
  );
  const [maxPrice, setMaxPrice] = useState(config?.maxPrice || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('❌ Nieprawidłowe hasło!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const participantList = participants
      .split('\n')
      .map(p => p.trim())
      .filter(p => p);

    if (participantList.length < 2) {
      setMessage('Musisz dodać co najmniej 2 uczestników!');
      setSaving(false);
      return;
    }

    if (!maxPrice || parseFloat(maxPrice) <= 0) {
      setMessage('Kwota maksymalna musi być większa od 0!');
      setSaving(false);
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/config`, {
        participants: participantList,
        maxPrice: parseFloat(maxPrice)
      });

      setMessage('✅ Konfiguracja zapisana pomyślnie!');
      setTimeout(() => {
        onUpdate();
      }, 1000);
    } catch (error) {
      setMessage('❌ Błąd podczas zapisywania: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Czy na pewno chcesz zresetować wszystkie dane? To usunie wszystkie losowania!')) {
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/reset`);
      setMessage('✅ Dane zostały zresetowane!');
      setParticipants('');
      setMaxPrice('');
      setTimeout(() => {
        onUpdate();
      }, 1000);
    } catch (error) {
      setMessage('❌ Błąd podczas resetowania: ' + (error.response?.data?.error || error.message));
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-christmas-green mb-6 text-center">
          🔒 Panel Administratora
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Aby uzyskać dostęp do panelu administratora, wprowadź hasło:
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              placeholder="Wprowadź hasło"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-christmas-green focus:outline-none transition-colors text-center text-lg"
              autoFocus
            />
          </div>

          {passwordError && (
            <div className="p-4 rounded-lg bg-red-100 text-red-800 text-center">
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-christmas-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            Zaloguj się
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            💡 Hasło otrzymałeś od administratora systemu
          </p>
        </div>
      </div>
    );
  }

  // Admin panel content (after authentication)
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-christmas-green">
          Panel Administratora
        </h2>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
          }}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Wyloguj
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Lista Uczestników
            <span className="text-sm font-normal text-gray-500 ml-2">
              (każda osoba w nowej linii)
            </span>
          </label>
          <textarea
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Anna&#10;Jan&#10;Kasia&#10;Piotr"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-christmas-green focus:outline-none transition-colors min-h-[200px] font-mono"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {participants.split('\n').filter(p => p.trim()).length} uczestników
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Maksymalna Kwota Prezentu (PLN)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="50"
            min="0.01"
            step="0.01"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-christmas-green focus:outline-none transition-colors"
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-christmas-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {saving ? 'Zapisywanie...' : 'Zapisz Konfigurację'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Uwaga:</strong> Zmiana konfiguracji usunie wszystkie dotychczasowe losowania!
        </p>
      </div>
    </div>
  );
}

export default AdminPanel;
