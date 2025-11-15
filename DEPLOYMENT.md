# 🚀 Deployment Guide - Render.com

## Przewodnik krok po kroku do wdrożenia Secret Santa na Render.com

### 📋 Wymagania wstępne

1. Konto na [Render.com](https://render.com) (można założyć za darmo)
2. Repozytorium Git z projektem (GitHub, GitLab lub Bitbucket)
3. Projekt Secret Santa w repozytorium

---

## 🎯 Opcja 1: Automatyczny Deploy z render.yaml (ZALECANE)

### Krok 1: Przygotowanie repozytorium

1. Upewnij się, że projekt jest w repozytorium Git
2. Plik `render.yaml` jest już przygotowany w głównym folderze projektu
3. Wypchnij kod do repozytorium:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Krok 2: Połączenie z Render

1. Zaloguj się na [Render.com](https://dashboard.render.com)
2. Kliknij **"New +"** → **"Blueprint"**
3. Połącz swoje repozytorium Git
4. Wybierz repozytorium z projektem Secret Santa
5. Render automatycznie wykryje plik `render.yaml`

### Krok 3: Konfiguracja zmiennych środowiskowych

Render utworzy dwa serwisy:
- **secret-santa-backend** - Backend API
- **secret-santa-frontend** - Frontend React

#### Backend - Zmienne środowiskowe:
1. Przejdź do **secret-santa-backend** → **Environment**
2. Dodaj zmienną `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://secret-santa-frontend.onrender.com
   ```
   (Zastąp właściwym URL frontendu po deploymencie)

#### Frontend - Zmienne środowiskowe:
1. Przejdź do **secret-santa-frontend** → **Environment**
2. Dodaj zmienną `REACT_APP_API_URL`:
   ```
   REACT_APP_API_URL=https://secret-santa-backend.onrender.com
   ```
   (Zastąp właściwym URL backendu po deploymencie)

### Krok 4: Deploy!

1. Kliknij **"Apply"** lub **"Create Blueprint Instance"**
2. Render rozpocznie automatyczny deploy obu serwisów
3. Poczekaj 5-10 minut na zakończenie procesu
4. Aplikacja będzie dostępna pod URL frontendu!

---

## 🎯 Opcja 2: Ręczny Deploy (krok po kroku)

### A. Deploy Backendu

#### 1. Utwórz Web Service dla Backendu

1. W Render Dashboard kliknij **"New +"** → **"Web Service"**
2. Połącz repozytorium Git
3. Wypełnij formularz:
   - **Name:** `secret-santa-backend`
   - **Region:** Frankfurt (lub najbliższy)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

#### 2. Dodaj zmienne środowiskowe dla backendu

W sekcji **Environment**:
```
NODE_ENV=production
PORT=5000
```

#### 3. Dodaj Persistent Disk (opcjonalne, dla danych)

W sekcji **Disks**:
- **Name:** `secret-santa-data`
- **Mount Path:** `/opt/render/project/src/data`
- **Size:** 1 GB

#### 4. Kliknij "Create Web Service"

Backend rozpocznie deployment. Zanotuj URL backendu (np. `https://secret-santa-backend.onrender.com`)

---

### B. Deploy Frontendu

#### 1. Utwórz Static Site dla Frontendu

1. Wróć do Dashboard, kliknij **"New +"** → **"Static Site"**
2. Połącz to samo repozytorium
3. Wypełnij formularz:
   - **Name:** `secret-santa-frontend`
   - **Region:** Frankfurt (lub najbliższy)
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

#### 2. Dodaj zmienne środowiskowe dla frontendu

W sekcji **Environment**:
```
REACT_APP_API_URL=https://secret-santa-backend.onrender.com
```
*(Wklej tutaj rzeczywisty URL swojego backendu)*

#### 3. Kliknij "Create Static Site"

Frontend rozpocznie deployment.

---

### C. Finalizacja

#### 1. Zaktualizuj CORS w backendzie

Po deploymencie frontendu, wróć do **secret-santa-backend**:
1. Przejdź do **Environment**
2. Dodaj zmienną:
   ```
   FRONTEND_URL=https://secret-santa-frontend.onrender.com
   ```
   *(Wklej tutaj rzeczywisty URL frontendu)*
3. Kliknij **"Save Changes"**
4. Backend automatycznie się przebuduje

#### 2. Przetestuj aplikację

1. Otwórz URL frontendu w przeglądarce
2. Sprawdź, czy Panel Admina działa (hasło: `swieta2000`)
3. Dodaj testowych uczestników i przetestuj losowanie

---

## ⚙️ Konfiguracja po deploymencie

### Zmiana hasła administratora

Jeśli chcesz zmienić hasło `swieta2000`:
1. Edytuj plik `frontend/src/components/AdminPanel.js`
2. Zmień linię:
   ```javascript
   const ADMIN_PASSWORD = 'swieta2000';
   ```
3. Wypchnij zmiany do repozytorium
4. Render automatycznie przebuduje frontend

### Monitorowanie

- **Logi backendu:** Dashboard → secret-santa-backend → Logs
- **Logi frontendu:** Dashboard → secret-santa-frontend → Logs
- **Status:** Sprawdź status obu serwisów w Dashboard

---

## 🐛 Rozwiązywanie problemów

### Problem: "CORS error" w konsoli przeglądarki

**Rozwiązanie:**
1. Sprawdź, czy `FRONTEND_URL` w backendzie jest ustawiony prawidłowo
2. Upewnij się, że URL zawiera protokół `https://`
3. Przebuduj backend po zmianie zmiennej

### Problem: Frontend nie łączy się z backendem

**Rozwiązanie:**
1. Sprawdź, czy `REACT_APP_API_URL` w frontendzie jest poprawny
2. Upewnij się, że backend jest uruchomiony (sprawdź w Dashboard)
3. Sprawdź logi backendu pod kątem błędów

### Problem: Backend się nie uruchamia

**Rozwiązanie:**
1. Sprawdź logi w Render Dashboard
2. Upewnij się, że `backend/package.json` zawiera wszystkie zależności
3. Sprawdź, czy `engines.node` w package.json jest zgodny z wersją Node.js w Render

### Problem: Dane znikają po restarcie backendu

**Rozwiązanie:**
1. Upewnij się, że Persistent Disk jest dodany i zamontowany
2. Sprawdź ścieżkę montowania: `/opt/render/project/src/backend/data`
3. Folder `data/` w backendzie musi być dostępny dla zapisu

### Problem: Build frontendu kończy się błędem

**Rozwiązanie:**
1. Sprawdź logi buildu w Dashboard
2. Upewnij się, że wszystkie zależności są w `package.json`
3. Sprawdź, czy nie ma błędów TypeScript/ESLint w kodzie
4. Może być potrzebne dodanie `CI=false` do Build Command:
   ```
   CI=false npm install && npm run build
   ```

---

## 💰 Plan Free - Ograniczenia

Render.com oferuje darmowy plan z następującymi ograniczeniami:

- **Web Services (Backend):**
  - Usypia się po 15 minutach nieaktywności
  - Pierwsze żądanie po uśpieniu może trwać 30-60 sekund (cold start)
  - 750 godzin/miesiąc darmowego czasu działania

- **Static Sites (Frontend):**
  - Brak ograniczeń cold start
  - Zawsze dostępny

- **Persistent Disk:**
  - 1 GB za darmo

### Porady dla darmowego planu:

1. **Backend może się uśpić** - pierwsze żądanie może być wolne
2. **Informuj użytkowników** o możliwym opóźnieniu przy pierwszym wejściu
3. **Persistent Disk** zapewnia zachowanie danych między restartami

---

## 🔄 Automatyczne aktualizacje

Render automatycznie przebuduje aplikację po każdym push do głównej gałęzi:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Możesz też wyłączyć automatyczne deploymenty:
1. Dashboard → Service → Settings
2. **Auto-Deploy:** Off

---

## 🌐 Własna domena (opcjonalne)

Jeśli chcesz użyć własnej domeny:

1. Przejdź do **secret-santa-frontend** → **Settings** → **Custom Domains**
2. Kliknij **"Add Custom Domain"**
3. Wprowadź swoją domenę (np. `secretsanta.mojadomena.pl`)
4. Skonfiguruj rekordy DNS zgodnie z instrukcjami Render
5. Zaktualizuj `FRONTEND_URL` w backendzie
6. Zaktualizuj `REACT_APP_API_URL` w frontendzie (jeśli backend też ma własną domenę)

---

## ✅ Checklist przed uruchomieniem produkcyjnym

- [ ] Backend deployment zakończony sukcesem
- [ ] Frontend deployment zakończony sukcesem
- [ ] Zmienne środowiskowe `FRONTEND_URL` i `REACT_APP_API_URL` ustawione
- [ ] Persistent Disk dodany do backendu
- [ ] CORS działa poprawnie (brak błędów w konsoli)
- [ ] Panel admina działa (hasło: `swieta2000`)
- [ ] Losowanie działa poprawnie
- [ ] Dane są zachowywane między restartami
- [ ] Link do aplikacji udostępniony użytkownikom

---

## 📞 Wsparcie

- **Render Docs:** https://render.com/docs
- **Community:** https://community.render.com
- **Status:** https://status.render.com

---

## 🎄 Gotowe!

Twoja aplikacja Secret Santa jest teraz dostępna online! 🎅

Udostępnij link frontendu wszystkim uczestnikom i życzę udanych świąt! 🎁
