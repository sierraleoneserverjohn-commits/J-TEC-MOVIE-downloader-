# JTEC MOVIES — Production Deployment & Infrastructure Guide

This comprehensive guide details the real-world production deployment of **JTEC MOVIES** across web (GitHub Pages), backend cloud infrastructure (Render + Upstash Redis), and native mobile APK builds (Capacitor + Android).

---

## Architecture Overview

```
                        +---------------------------------------+
                        |   JTEC MOVIES Frontend (React/Vite)  |
                        |     - Hosted on GitHub Pages          |
                        |     - Packaged via Capacitor Android |
                        +-------------------+-------------------+
                                            |
                      HTTP API REST Queries | Direct Video Downloads
                     (Metadata & Providers) | (Original Authorized Streams)
                                            |
                                            v
                        +---------------------------------------+
                        |      Render Web Service (Node.js)     |
                        |     - Express 4 + TypeScript          |
                        |     - Rate limiting & CORS            |
                        |     - Provider metadata aggregation   |
                        +-------------------+-------------------+
                                            |
                           REST Read/Write  | Cache Queries
                           (Tokens & TTL)   |
                                            v
                        +---------------------------------------+
                        |       Upstash Redis (REST API)        |
                        |     - Serverless caching layer        |
                        |     - Sliding window rate limiting    |
                        |     - NO video file storage           |
                        +---------------------------------------+
```

---

## 1. Upstash Redis Setup

Upstash provides serverless Redis with low-latency REST access. Video files are **never** stored in Redis; it serves strictly as a high-speed metadata, search, and rate-limiting cache.

### Step-by-Step Instructions:
1. Navigate to [https://console.upstash.com/](https://console.upstash.com/) and sign in or create an account.
2. Click **Create Database**:
   - **Name**: `jtec-movies-cache`
   - **Type**: Regional (select the region closest to your Render server, e.g. Frankfurt or US East)
   - **Eviction**: Enabled (e.g. `volatile-lru` or default)
3. Once provisioned, scroll to the **REST API** section on the database details page.
4. Select the **`.env`** tab.
5. Copy the following two values:
   - `UPSTASH_REDIS_REST_URL` (format: `https://...upstash.io`)
   - `UPSTASH_REDIS_REST_TOKEN` (starts with `AX...`)
6. **Security Note**: Never commit these credentials into source code or pass them into frontend build variables. They belong strictly in your Render environment dashboard.

---

## 2. Render Backend Deployment

The backend resides in the `/backend` directory and provides:
- Health check: `GET /api/health`
- Public archive metadata: `GET /api/movies`, `GET /api/movies/search`, `GET /api/movies/:id`
- Provider statuses: `GET /api/providers`
- Direct video URLs (never proxies large video streams through Render)

### Option A: Automatic Deployment using `render.yaml`
1. Go to [https://dashboard.render.com/](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository (`<username>/<repo>`).
4. Render will parse `render.yaml` automatically and configure the `jtec-movies-api` web service.
5. In the Render prompt, fill in the secret environment variables:
   - `UPSTASH_REDIS_REST_URL`: `<Your Upstash REST URL>`
   - `UPSTASH_REDIS_REST_TOKEN`: `<Your Upstash REST Token>`
   - `FRONTEND_URL`: `https://<your-username>.github.io,capacitor://localhost,https://localhost`
6. Click **Apply**.

### Option B: Manual Web Service Setup
1. On the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `jtec-movies-api`
   - **Region**: Frankfurt (or closest region)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free
4. Add Environment Variables under the **Environment** tab:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Injected by Render |
   | `FRONTEND_URL` | `https://<username>.github.io,capacitor://localhost,https://localhost` | Allowed CORS origins |
   | `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | From Upstash Console |
   | `UPSTASH_REDIS_REST_TOKEN` | `AX...` | From Upstash Console |
   | `REDIS_CACHE_TTL_SECONDS` | `3600` | 1 hour TTL |
   | `RATE_LIMIT_MAX_REQUESTS` | `120` | Max requests per minute |
5. Click **Create Web Service**.
6. When deployment finishes, note your service URL (e.g. `https://jtec-movies-api.onrender.com`).
7. Verify by visiting `https://<your-service>.onrender.com/api/health` in your browser. Expected response:
   ```json
   {
     "status": "ok",
     "service": "jtec-movies-backend",
     "version": "1.0.0",
     "cache": {
       "provider": "Upstash Redis REST",
       "status": "upstash",
       "connected": true
     }
   }
   ```

---

## 3. GitHub Pages Deployment

The frontend uses Vite with a configurable base path and an SPA redirect fallback (`404.html`) to prevent page refresh errors on subpaths.

### Step-by-Step Instructions:
1. Push your repository to GitHub.
2. In your repository on GitHub, go to **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. Under **Settings** -> **Secrets and variables** -> **Actions**:
   - Add Secret `VITE_API_BASE_URL` with your Render backend URL (e.g. `https://jtec-movies-api.onrender.com`).
5. Trigger the workflow:
   - Push a commit to `main`, or
   - Go to **Actions** -> **Deploy JTEC MOVIES to GitHub Pages** -> **Run workflow**.
6. When complete, your web app is live at `https://<your-username>.github.io/<repository-name>/`.
7. The web app automatically communicates with your Render API and provides full discovery, playback, and offline simulation!

---

## 4. Capacitor Android Native Build & APK Generation

JTEC MOVIES is configured as an Android-first native app (`com.jtecmovies.app`) using Capacitor.

### Features Configured:
- **Application ID**: `com.jtecmovies.app`
- **Native Storage**: Direct access to `/storage/emulated/0/Movies/JTEC`
- **Native Notifications**: Local background notifications for download events
- **Network Awareness**: Automatic network monitoring
- **Dark Status Bar**: `#090a0d` seamless system bar styling

### Automated GitHub Actions APK Build:
1. The repository includes `.github/workflows/build-android-apk.yml`.
2. To trigger a build:
   - Push any commit touching `src/`, `android/`, or `capacitor.config.ts`, or
   - Go to **Actions** -> **Build JTEC MOVIES Android APK** -> **Run workflow**.
3. The workflow performs:
   - Node.js 22 & Java 17 setup
   - Android SDK installation
   - Web application build
   - Capacitor Android synchronization
   - `./gradlew assembleDebug`
4. When finished, download the **`JTEC-MOVIES-Debug-APK`** artifact from the GitHub Actions run summary.
5. Transfer the APK to an Android phone or emulator to test native performance.

### Optional Signed Production Release APK:
To generate signed release APKs, add these GitHub Repository Secrets:
- `ANDROID_KEYSTORE_BASE64`: Base64 string of your `.keystore` / `.jks` file
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_ALIAS`: Key alias
- `ANDROID_KEY_PASSWORD`: Key password

---

## 5. Troubleshooting Guide

| Issue | Likely Cause | Solution |
|---|---|---|
| **CORS error in browser** | Origin not listed in `FRONTEND_URL` | Add your exact GitHub Pages origin (e.g. `https://username.github.io`) to `FRONTEND_URL` in the Render dashboard. |
| **Render cold start delay** | Render free tier spins down after 15 minutes of inactivity | The frontend automatically falls back to local archive data while the Render container boots up (typically 30–50s). |
| **Redis connection warning** | `UPSTASH_REDIS_REST_URL` missing or invalid | Check Upstash Console and verify both URL and Token in Render environment variables. The backend gracefully falls back to memory cache if Upstash is unreachable. |
| **GitHub Pages 404 on refresh** | GitHub Pages doesn't natively handle client-side routing | The build automatically copies `index.html` to `dist/404.html` and includes `public/404.html` SPA routing script. |
| **Android Gradle build error** | Java version mismatch | Ensure Java 17 is selected (`actions/setup-java@v4` with `java-version: 17`). |
| **Capacitor missing plugin** | Plugins not synced to native project | Run `npx cap sync android` after installing any new Capacitor packages. |
