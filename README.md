# 🎅 Secret Santa - Aplikacja do Losowania Prezentów

Pełno-stackowa aplikacja do organizacji losowania Secret Santa z Node.js/Express backend i React/Tailwind frontend.

## 📚 Dokumentacja

- **[📋 Indeks wszystkich przewodników](DOCS-INDEX.md)** - znajdź właściwą dokumentację
- **[⚡ Szybki start lokalnie](QUICKSTART.md)** - uruchom w 2 minuty
- **[🚀 Szybki deploy na Render](QUICK-DEPLOY.md)** - wdróż w 5 minut
- **[📖 Szczegółowy przewodnik deploymentu](DEPLOYMENT.md)** - instrukcja krok po kroku
- **[✅ Checklist przed deploymentem](PRE-DEPLOYMENT-CHECKLIST.md)** - sprawdź wszystko

## 🚀 Deploy na Render.com

Aplikacja jest gotowa do wdrożenia na Render.com za darmo! Zobacz plik `render.yaml` w głównym katalogu lub przewodniki deploymentu powyżej.

## �📋 Funkcjonalności

- ✅ **Panel Administratora** - ustawienie uczestników i maksymalnej kwoty prezentu
- ✅ **Losowanie bez logowania** - użytkownicy wybierają imię z listy i losują
- ✅ **Jednorazowe losowanie** - każda osoba losuje tylko raz, bez możliwości ponownego losowania
- ✅ **Bezpieczny algorytm** - niemożliwe wylosowanie samego siebie
- ✅ **Prawdziwa losowość** - algorytm Fisher-Yates zapewnia nieprzewidywalne wyniki
- ✅ **Trwałe przechowywanie** - wyniki zapisywane w lokalnej bazie danych NeDB
- ✅ **Łatwe udostępnianie** - jeden link dla wszystkich uczestników
- ✅ **Przyjemny UI** - świąteczna kolorystyka z Tailwind CSS

## 🏗️ Struktura Projektu

```
secret-santa/
├── backend/           # Express.js server
│   ├── server.js      # Główny plik serwera z API
│   ├── package.json   # Zależności backendu
│   └── data/          # Folder na bazę danych NeDB (tworzony automatycznie)
├── frontend/          # React aplikacja
│   ├── src/
│   │   ├── App.js                      # Główny komponent
│   │   ├── components/
│   │   │   ├── AdminPanel.js           # Panel administratora
│   │   │   └── DrawPage.js             # Strona losowania
│   │   ├── index.js                    # Entry point
│   │   └── index.css                   # Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── package.json                    # Zależności frontendu
│   └── tailwind.config.js              # Konfiguracja Tailwind
└── README.md          # Ten plik
```

## 🚀 Instalacja i Uruchomienie

### Wymagania

- Node.js (wersja 14 lub wyższa)
- npm lub yarn

### Krok 1: Instalacja Zależności

Zależności zostały już zainstalowane, ale jeśli potrzebujesz je zainstalować ponownie:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Krok 2: Uruchomienie Aplikacji

Musisz uruchomić **backend i frontend osobno** w dwóch terminalach:

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```
Backend będzie dostępny na: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
Frontend będzie dostępny na: `http://localhost:3000`

Przeglądarka powinna otworzyć się automatycznie. Jeśli nie, otwórz ręcznie: `http://localhost:3000`

## 📖 Jak Używać

### Dla Administratora:

1. **Otwórz aplikację** w przeglądarce
2. **Przejdź do "Panel Admina"**
3. **Wprowadź hasło:** `swieta2000`
4. **Dodaj uczestników** (każde imię w nowej linii):
   ```
   Anna
   Jan
   Kasia
   Piotr
   Marta
   ```
5. **Ustaw maksymalną kwotę prezentu** (np. 50 PLN)
6. **Kliknij "Zapisz Konfigurację"**
7. **Skopiuj i udostępnij link** wszystkim uczestnikom

**🔒 Hasło do panelu admina:** `swieta2000`

### Dla Uczestników:

1. **Otwórz link** otrzymany od administratora
2. **Wybierz swoje imię** z listy rozwijanej
3. **Kliknij "Losuj!"**
4. **Zapisz wylosowaną osobę** - nie będziesz mógł losować ponownie!

## 🔒 Zasady Losowania

- Każda osoba może wylosować **tylko raz**
- **Nie można wylosować samego siebie** (automatycznie zablokowane)
- Po wylosowaniu **wynik jest zapisywany** w bazie danych
- Możesz **sprawdzić ponownie** swój wynik, wybierając swoje imię
- **Panel administratora zabezpieczony hasłem** (hasło: `swieta2000`)
- Administrator może **zresetować całe losowanie** w Panelu Admina

## 🛠️ Technologie

### Backend:
- **Node.js** - środowisko uruchomieniowe
- **Express.js** - framework webowy
- **NeDB** - lekka lokalna baza danych (embedded)
- **CORS** - obsługa cross-origin requests

### Frontend:
- **React** - biblioteka UI
- **Tailwind CSS** - framework CSS
- **Axios** - HTTP client
- **React Scripts** - narzędzia do budowania

## 🎨 Kolorystyka

Aplikacja wykorzystuje świąteczną paletę kolorów:
- **Czerwień** (#c41e3a) - główny kolor świąteczny
- **Zieleń** (#165b33) - kolor choinkowy
- **Złoto** (#d4af37) - akcenty
- **Śnieg** (#f8f9fa) - tło

## 📁 Baza Danych

Aplikacja używa **NeDB** - lokalnej nierelacyjnej bazy danych.

Pliki bazy danych są przechowywane w: `backend/data/`
- `config.db` - konfiguracja (uczestnicy, maksymalna kwota)
- `draws.db` - wyniki losowań

**Uwaga:** Folder `data/` jest tworzony automatycznie przy pierwszym uruchomieniu.

## 🔄 API Endpoints

### GET `/api/config`
Pobiera aktualną konfigurację (uczestników i maksymalną kwotę)

### POST `/api/config`
Zapisuje nową konfigurację (admin)
```json
{
  "participants": ["Anna", "Jan", "Kasia"],
  "maxPrice": 50
}
```

### POST `/api/draw`
Losuje osobę dla uczestnika
```json
{
  "participantName": "Anna"
}
```

### GET `/api/draw/:participantName`
Sprawdza, czy uczestnik już losował

### POST `/api/reset`
Resetuje wszystkie dane (admin)

### GET `/api/health`
Sprawdzenie stanu serwera

## 🐛 Rozwiązywanie Problemów

### Backend nie startuje
- Sprawdź, czy port 5000 nie jest zajęty
- Upewnij się, że zależności są zainstalowane: `cd backend && npm install`

### Frontend nie łączy się z backendem
- Upewnij się, że backend działa na porcie 5000
- Sprawdź plik `frontend/.env` - powinien zawierać: `REACT_APP_API_URL=http://localhost:5000`

### Błąd przy instalacji zależności
- Użyj Node.js w wersji 14 lub wyższej
- Spróbuj usunąć `node_modules` i `package-lock.json`, następnie ponownie uruchom `npm install`

### Baza danych się nie tworzy
- Upewnij się, że aplikacja ma uprawnienia do zapisu w folderze `backend/data/`
- Folder zostanie utworzony automatycznie przy pierwszym zapisie

## 🎯 Algorytm Losowania

Aplikacja używa **algorytmu Fisher-Yates** do prawdziwie losowego przetasowania uczestników, a następnie sprawdza, czy ktoś nie wylosował samego siebie. Jeśli tak - losuje ponownie. Gwarantuje to:

1. **Prawdziwą losowość** - nie da się przewidzieć wyników
2. **Brak powtórzeń** - każda osoba jest wylosowana tylko raz
3. **Bezpieczeństwo** - nikt nie wylosuje samego siebie
4. **Efektywność** - algorytm kończy się w rozsądnym czasie

## 📝 Licencja

MIT

## 👨‍💻 Autor

Stworzono z pomocą GitHub Copilot

## 🎄 Wesołych Świąt!

Miłego losowania i szczęśliwych prezentów! 🎁
