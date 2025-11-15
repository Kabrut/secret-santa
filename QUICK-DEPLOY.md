# 🚀 Quick Deploy Guide

## Najszybsza Metoda - Render Blueprint

### 1️⃣ Przygotuj repozytorium
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2️⃣ Deploy na Render
1. Zaloguj się na [Render.com](https://dashboard.render.com)
2. Kliknij **"New +"** → **"Blueprint"**
3. Wybierz swoje repozytorium z GitHub/GitLab/Bitbucket
4. Render automatycznie wykryje `render.yaml`
5. Kliknij **"Apply"**

### 3️⃣ Ustaw zmienne środowiskowe

#### Backend:
- `FRONTEND_URL` → URL frontendu (np. `https://secret-santa-frontend.onrender.com`)

#### Frontend:
- `REACT_APP_API_URL` → URL backendu (np. `https://secret-santa-backend.onrender.com`)

### 4️⃣ Gotowe! 🎉

Aplikacja będzie dostępna pod URL frontendu.

---

## 📚 Dokumentacja

- **Szczegółowy przewodnik:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Checklist przed deploymentem:** [PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)
- **README:** [README.md](README.md)

---

## ⚡ Szybkie Linki

- [Render Dashboard](https://dashboard.render.com)
- [Render Docs](https://render.com/docs)
- [Render Status](https://status.render.com)

---

## 💡 Przydatne Komendy

```bash
# Sprawdź status Git
git status

# Dodaj wszystkie zmiany
git add .

# Commitnij zmiany
git commit -m "Your message"

# Wypchnij do repozytorium
git push origin main
```

## 🔧 Rozwiązywanie Problemów

Jeśli coś nie działa, sprawdź:

1. **Logi** w Render Dashboard
2. **Zmienne środowiskowe** - czy są prawidłowo ustawione
3. **CORS** - czy `FRONTEND_URL` w backendzie jest poprawny
4. **Build** - czy build się zakończył sukcesem

Zobacz szczegóły w [DEPLOYMENT.md](DEPLOYMENT.md) sekcja "Rozwiązywanie problemów".

---

🎄 **Powodzenia z deploymentem!**
