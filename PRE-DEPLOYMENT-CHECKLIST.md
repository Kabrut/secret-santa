# 📋 Pre-Deployment Checklist

Sprawdź te punkty przed deploymentem na Render.com:

## ✅ Pliki i Konfiguracja

- [x] `render.yaml` - plik konfiguracyjny jest gotowy
- [x] `backend/package.json` - zawiera `engines.node`
- [x] `frontend/package.json` - zawiera `engines.node`
- [x] `backend/.env.example` - dokumentacja zmiennych środowiskowych
- [x] `frontend/.env.example` - dokumentacja zmiennych środowiskowych
- [x] `.gitignore` - wykluczenie node_modules i plików tymczasowych

## ✅ Kod

- [x] Backend używa `process.env.PORT` dla portu
- [x] Backend ma skonfigurowany CORS z `process.env.FRONTEND_URL`
- [x] Frontend używa `process.env.REACT_APP_API_URL`
- [x] Hasło admina ustawione (`swieta2000`)

## ✅ Git Repository

- [ ] Kod jest w repozytorium Git (GitHub/GitLab/Bitbucket)
- [ ] Wszystkie zmiany są commitnięte
- [ ] Kod jest wypchany do remote repository

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## ✅ Render.com Account

- [ ] Konto na Render.com utworzone
- [ ] Repozytorium połączone z Render

## 📝 Deployment Steps

### Opcja 1: Automatyczny (Blueprint)
1. New + → Blueprint
2. Wybierz repozytorium
3. Render wykryje `render.yaml`
4. Ustaw zmienne środowiskowe
5. Deploy!

### Opcja 2: Ręczny
Zobacz szczegóły w `DEPLOYMENT.md`

## 🔧 Po Deploymencie

- [ ] Backend działa (sprawdź URL/api/health)
- [ ] Frontend się ładuje
- [ ] Ustaw `FRONTEND_URL` w backendzie
- [ ] Ustaw `REACT_APP_API_URL` we frontendzie
- [ ] Przetestuj panel admina
- [ ] Przetestuj losowanie
- [ ] Sprawdź logi

## 🎯 Gotowe!

Aplikacja powinna być dostępna pod adresem frontendu.
Udostępnij link użytkownikom! 🎄
