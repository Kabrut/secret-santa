import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DrawPage({ config, apiUrl }) {
  const [selectedName, setSelectedName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Check if participant already drew, but only if no result is shown yet
    if (selectedName && config?.participants?.includes(selectedName) && !result) {
      checkExistingDraw();
    }
  }, [selectedName]);

  const checkExistingDraw = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/draw/${encodeURIComponent(selectedName)}`);
      if (response.data.drawn) {
        setResult({
          receiver: response.data.receiver,
          maxPrice: response.data.maxPrice,
          alreadyDrawn: true
        });
        setShowResult(true);
      } else {
        setResult(null);
        setShowResult(false);
      }
    } catch (error) {
      console.error('Error checking draw:', error);
    }
  };

  const handleDraw = async () => {
    if (!selectedName) {
      setError('Wybierz swoje imię z listy!');
      return;
    }

    setLoading(true);
    setError('');
    setShowResult(false);

    try {
      const response = await axios.post(`${apiUrl}/api/draw`, {
        participantName: selectedName
      });

      setResult({
        receiver: response.data.receiver,
        maxPrice: response.data.maxPrice,
        alreadyDrawn: response.data.alreadyDrawn
      });

      // Animate result reveal
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    } catch (error) {
      setError('❌ ' + (error.response?.data?.error || 'Wystąpił błąd podczas losowania'));
    } finally {
      setLoading(false);
    }
  };

  if (!config?.initialized || !config?.participants?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Konfiguracja wymagana
        </h2>
        <p className="text-gray-600">
          Administrator musi najpierw skonfigurować losowanie w Panelu Admina.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-christmas-red mb-6 text-center">
        🎁 Secret Santa
      </h2>

      {!result ? (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-3 text-lg">
              Wybierz swoje imię:
            </label>
            <select
              value={selectedName}
              onChange={(e) => {
                setSelectedName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-christmas-red focus:outline-none transition-colors text-lg"
            >
              <option value="">-- Wybierz --</option>
              {config.participants.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Zasady:</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Każda osoba losuje tylko raz</li>
              <li>Nie możesz wylosować samego siebie</li>
              <li>Maksymalna kwota prezentu: <strong>{config.maxPrice} PLN</strong></li>
            </ul>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}

          <button
            onClick={handleDraw}
            disabled={loading || !selectedName}
            className="w-full bg-christmas-red text-white font-bold py-4 px-6 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-xl transform hover:scale-105"
          >
            {loading ? '🎲 Losuję...' : '🎁 Losuj!'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`text-center transition-all duration-1000 ${
            showResult ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90'
          }`}>
            <div className="text-6xl mb-4">🎉</div>
            
            {result.alreadyDrawn && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Już losowałeś/aś! Oto przypomnienie:
                </p>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Kupujesz prezent dla:
            </h3>
            
            <div className="bg-gradient-to-r from-christmas-red to-christmas-green p-6 rounded-xl shadow-lg mb-6">
              <p className="text-5xl font-bold text-white">
                {result.receiver}
              </p>
            </div>

            <div className="bg-christmas-gold bg-opacity-20 p-4 rounded-lg border-2 border-christmas-gold">
              <p className="text-lg text-gray-800">
                <strong>Maksymalna kwota:</strong> {result.maxPrice} PLN
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-green-800">
              <strong>✅ Pamiętaj:</strong> Zapisz sobie tę informację! 
              {!result.alreadyDrawn && ' To Twoje jedyne losowanie.'}
            </p>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setSelectedName('');
              setShowResult(false);
            }}
            className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Powrót
          </button>
        </div>
      )}

      {/* Share Link Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <strong>🔗 Link do udostępnienia:</strong>
        </p>
        <div className="mt-2 p-3 bg-gray-100 rounded-lg text-center">
          <code className="text-sm text-gray-800 break-all">
            {window.location.href.split('?')[0]}
          </code>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Udostępnij ten link wszystkim uczestnikom
        </p>
      </div>
    </div>
  );
}

export default DrawPage;
