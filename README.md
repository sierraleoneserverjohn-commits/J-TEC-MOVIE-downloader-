# JTEC MOVIES

> **Premium Android-First Public Archive Cinema Discovery & Offline Download Application**

JTEC MOVIES is a production-grade cinematic discovery client designed to index, preview, and download verified public domain and Creative Commons films directly to Android device storage from open cultural archives (Library of Congress, Internet Archive, Wikimedia Commons, and Prelinger Archives).

---

## Key Features

- **Cinematic UI/UX Foundation**: Built strictly according to the Zero-Pill & Anti-Slop Design Constitution with deep charcoal/AMOLED backgrounds, rich typography, and native Android ergonomics.
- **Android-First & Responsive**: Built with Capacitor (`com.jtecmovies.app`), supporting Android safe areas (`pb-safe`, `pt-safe`), scoped storage (`/storage/emulated/0/Movies/JTEC`), and touch hitboxes ($\ge 44\text{px}$).
- **Modular Render Backend (`/backend`)**: Lightweight Node.js/Express service with rate limiting, CORS protection, and modular archive provider aggregators.
- **Upstash Redis Caching**: Serverless Redis caching for movie metadata, search results, and sliding-window rate limiting. No video blobs or permanent libraries are stored in Redis.
- **Direct Authorized Downloads**: Direct authorized stream links from the original public repository to the user's Android filesystem without proxying heavy video files through Render.
- **Offline Library & Player**: Fullscreen player with timecode seek, 10s back/forward, speed control (0.5x–2x), aspect ratio modes, and brightness adjustment.
- **Dual CI/CD Automation**: GitHub Actions workflows for automated GitHub Pages web deployment and Android APK compilation.

---

## Repository Structure

```
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml          # GitHub Pages automated build & deployment
│       └── build-android-apk.yml     # Capacitor Android Gradle APK build workflow
├── android/                          # Native Android Capacitor Gradle project
├── backend/                          # Production Render Backend Service
│   ├── src/
│   │   ├── config/env.ts             # Validated environment configuration
│   │   ├── controllers/              # Health, movies, and provider controllers
│   │   ├── middleware/               # CORS, rate limiting, and error handlers
│   │   ├── providers/                # Internet Archive, LoC, Wikimedia connectors
│   │   ├── redis/redisService.ts     # Upstash Redis REST client with fallback
│   │   ├── routes/                   # /api/health, /api/movies, /api/providers
│   │   ├── services/movieService.ts  # Catalog caching & aggregation
│   │   ├── app.ts                    # Express app configuration
│   │   └── server.ts                 # Production server entrypoint
│   ├── package.json
│   └── tsconfig.json
├── capacitor.config.ts               # Capacitor Android native configuration
├── public/
│   └── 404.html                      # GitHub Pages SPA routing fallback
├── render.yaml                       # Infrastructure-as-Code for Render Cloud
├── src/                              # React 19 Frontend Web & Mobile Application
│   ├── assets/                       # High-fidelity archival imagery
│   ├── components/                   # Home, Discover, Downloads, Library, Settings, Modals
│   ├── context/AppContext.tsx        # Central downloads, storage, and state engine
│   ├── services/                     # DeviceService, NotificationService, ApiService
│   └── types/movie.ts                # TypeScript domain models
├── DEPLOYMENT.md                     # Comprehensive production deployment walkthrough
├── package.json
└── vite.config.ts
```

---

## Quickstart

### 1. Run Frontend Web App Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Backend API Locally
```bash
cd backend
npm install
npm run dev
```
Health endpoint will be available at [http://localhost:10000/api/health](http://localhost:10000/api/health).

### 3. Sync & Open Native Android Studio Project
```bash
npm run build
npx cap sync android
npx cap open android
```

---

## Deployment Instructions

For complete step-by-step instructions on deploying the frontend to **GitHub Pages**, launching the backend on **Render**, setting up **Upstash Redis**, and generating Android APKs via **GitHub Actions**, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.
