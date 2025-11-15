# 📚 Dokumentacja Secret Santa

## Przewodniki według przypadku użycia

### 🏠 Chcesz uruchomić aplikację lokalnie?
→ **[QUICKSTART.md](QUICKSTART.md)** - Szybki start (2 minuty)

### 🚀 Chcesz wdrożyć aplikację online na Render.com?
→ **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** - Najszybszy sposób (5 minut)  
→ **[DEPLOYMENT.md](DEPLOYMENT.md)** - Szczegółowy przewodnik krok po kroku (15 minut)

### ✅ Przygotowujesz się do deploymentu?
→ **[PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)** - Sprawdź wszystko przed deploymentem

### 📖 Chcesz poznać szczegóły projektu?
→ **[README.md](README.md)** - Pełna dokumentacja projektu

---

## Struktura dokumentacji

```
├── README.md                      # Główna dokumentacja projektu
├── QUICKSTART.md                  # Szybki start - lokalnie
├── QUICK-DEPLOY.md                # Szybki deploy na Render
├── DEPLOYMENT.md                  # Szczegółowy przewodnik deploymentu
├── PRE-DEPLOYMENT-CHECKLIST.md    # Checklist przed deploymentem
└── render.yaml                    # Konfiguracja Render (automatyczny deploy)
```

---

## Najczęściej zadawane pytania

### Jak uruchomić aplikację lokalnie?
Zobacz: [QUICKSTART.md](QUICKSTART.md)

### Jak wdrożyć na Render.com?
Zobacz: [QUICK-DEPLOY.md](QUICK-DEPLOY.md) lub [DEPLOYMENT.md](DEPLOYMENT.md)

### Jak zmienić hasło administratora?
Edytuj `frontend/src/components/AdminPanel.js` i zmień:
```javascript
const ADMIN_PASSWORD = 'swieta2000';
```

### Gdzie są przechowywane dane?
Lokalnie: `backend/data/` (NeDB)  
Na Render: Persistent Disk

### Co to jest render.yaml?
To plik konfiguracyjny dla automatycznego deploymentu na Render.com

### Czy mogę zmienić port backendu?
Tak, zmień `PORT` w `backend/.env` lub zmiennej środowiskowej

### Czy aplikacja jest darmowa?
Tak! Możesz uruchomić ją za darmo na Render.com (plan Free)

---

## Technologie

- **Backend:** Node.js + Express + NeDB
- **Frontend:** React + Tailwind CSS
- **Hosting:** Render.com (zalecane)

---

## Wsparcie

Jeśli masz problemy:
1. Sprawdź odpowiednią dokumentację wyżej
2. Przeczytaj sekcję "Rozwiązywanie problemów" w DEPLOYMENT.md
3. Sprawdź logi w Render Dashboard (jeśli deployujesz online)

---

🎄 **Wesołych Świąt!** 🎅
