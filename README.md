# 📘 TripMate AI — Dokumentacja
### 📌 Spis treści
1. [Opis projektu](#️-opis-projektu)
2. [Funkcjonalności](#-funkcjonalności)
3. [Stack technologiczny](#-stack-technologiczny)
4. [Wymagania systemowe](#️-wymagania-systemowe)
5. [Instalacja](#-instalacja)
6. [Uruchamianie aplikacji](#-uruchamianie-aplikacji)
7. [Struktura katalogów](#️-struktura-katalogów)
8. [Baza danych (Supabase)](#-baza-danych-supabase)
9. [Autorzy](#-autorzy)

## 

### 🛰️ Opis projektu
**Tripmate AI** to aplikacja webowa połączona z inteligentym asystentem podróży, który personalizuje wycieczki na podstawie preferencji użytkownika. Umożliwia planowanie całych podróży, sugerowanie atrakcji, noclegów i wskazówek turystycznych z pomocą sztucznej inteligencji.

##

### 🎯 Funkcjonalności
- Personalizowane plany podróży
- Sugestie atrakcji, hoteli i porad
- Obsługa mapy (Google Maps)
- Profile użytkowników i preferencje
- Tryb jasny/ciemny
- Animacje i przyjazny interfejs
- Panel ustawień i edycja preferencji

## 

### 🧰 Stack technologiczny

| Front-end          | Back-end               | Inne                        |
|--------------------|------------------------|-----------------------------|
| Next.js (React)    | Express.js (Node.js)   | Vercel (Hosting Front-endu) |
| Tailwind.css       | Supabase (Baza danych) | Railway (Hosting Back-endu) |
| Framer Motion      | JWT (Autoryzacja)      | Github (Wersjonowanie)      |

##

### 🖥️ Wymagania systemowe
- Node.js >= 18.x
- NPM >= 10.x
- Terminal (Bash, PowerShell, itp.)

##
### 🧩 Instalacja

#### 1. Sklonuj repozytorium
```bash
git clone https://github.com/Jakubowsky97/tripmate-ai.git
cd tripmate-ai
```

#### 2. Instalacja zależności
```bash
npm run install:all
```

#### 3. Konfiguracja zmiennych środowiskowych
**Frontend** (`client/.env.local`)
```env
NODE_ENV="development"
NEXT_PUBLIC_SUPABASE_URL="**************"
NEXT_PUBLIC_SUPABASE_ANON_KEY="**************"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="**************"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="**************"
NEXT_PUBLIC_API_URL="**************"
NEXT_PUBLIC_PAGE_URL="**************
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="**************"
NEXT_PUBLIC_ADMIN_PASSWORD="**************"
JWT_SECRET="**************"
```

**Backend** (`server/.env`)
```env
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_SUPABASE_URL="**************"
NEXT_PUBLIC_SUPABASE_KEY="**************"
NEXT_PUBLIC_APP_URL = "**************"
DEEPSEEK_API_KEY="**************"
AMADEUS_API_KEY="**************"
AMADEUS_SECRET_KEY="**************"
JWT_SECRET="**************"
GOOGLE_API_KEY="**************"
SUPABASE_SERVICE_ROLE_KEY="**************"
```

## 

### 🚀 Uruchamianie aplikacji
#### Uruchomienie obu serwerów Frontendu i Backendu:
```bash
npm run dev
```
#### **Frontend** działa domyślnie pod: `http://localhost:3000`
#### **Backend** działa domyślnie pod: `http://localhost:5000`

##

### 🗂️ Struktura katalogów
```bash
tripmate-ai/
├── client/           # Next.js frontend
│   ├── public/         # Zasoby statyczne
│   └── src/
│        ├── app/           # (Next.js routing)
│        ├── components/    # Komponenty Reacta
│        ├── context/       # Kontekst do zarządzania stanem kroku rejestracji.
│        ├── hooks/         # Niestandardowe hooki Reacta (np. useDarkMode).
│        ├── lib/           # Funkcje pomocnicze i moduły narzędziowe
│        ├── store/         # Zarządzanie stanem aplikacji
│        └── utils/         # Niewielkie funkcje narzędziowe (np. Supabase)
│
├── server/           # Express backend
│   └── src/
│        ├── controllers/   # Kontrolery odpowiadające danym endpointom
│        ├── middleware/    # Middleware wykonywane przed każdym endpointem
│        ├── routes/        # Definicje tras API Express.
│        ├── types/         # Wspólne typy i interfejsy TypeScript.
│        └── utils/         # Funkcje pomocnicze dla backendu.
│
└── README.md # Ten plik (Dokumentacja)
```

##

### 🧾 Baza danych (Supabase)
![Supabase-db](/supabase-db.png "Baza danych Supabase")

##

### 👨‍💻 Autorzy
- #### Jakub Mądry - [GitHub](https://github.com/Jakubowsky97) | [LinkedIn](https://www.linkedin.com/in/jakub-mądry-28b694267/)
- #### Szymon Kasprzyk [GitHub](https://github.com/Septylion)