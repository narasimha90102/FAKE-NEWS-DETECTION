# TruthGuard — React Native Android App

A **100% native React Native Android application** for AI-powered fake news detection. Zero WebView. Zero Capacitor. Zero hybrid wrappers.

---

## 📁 Project Structure

```
mobile/
├── App.tsx                          # Root application component
├── index.js                         # Entry point registered with AppRegistry
├── metro.config.js                  # Metro bundler configuration
├── babel.config.js                  # Babel transpiler config
├── tsconfig.json                    # TypeScript configuration
├── react-native.config.js           # React Native autolinking config
│
├── src/
│   ├── api/
│   │   └── apiClient.ts             # Axios API client (connects to backend /api)
│   │
│   ├── theme/
│   │   ├── colors.ts                # Dark SaaS color tokens (#090d16, #00e5a0, etc.)
│   │   └── typography.ts            # Font size, weight, and line-height tokens
│   │
│   ├── store/
│   │   ├── useAuthStore.ts          # Auth state (login, register, logout) — Zustand
│   │   └── useVerifyStore.ts        # Verification engine & history — Zustand
│   │
│   ├── components/
│   │   ├── ScoreRing.tsx            # Circular SVG Truth Score Ring
│   │   ├── AgentProgressBar.tsx     # AI Agent analysis progress bar
│   │   ├── ResultCard.tsx           # Full dark SaaS analysis result card
│   │   ├── CustomButton.tsx         # Native ripple button
│   │   ├── CustomInput.tsx          # Floating-label text input with error state
│   │   ├── Header.tsx               # Screen header with badge & title
│   │   └── SkeletonLoader.tsx       # Animated loading skeleton
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Non-scrolling login card layout
│   │   ├── RegisterScreen.tsx       # Registration form with validation
│   │   ├── ForgotPasswordScreen.tsx # Password reset flow
│   │   ├── VerifyScreen.tsx         # News Verification Engine (main screen)
│   │   ├── TrendingScreen.tsx       # Trending claims feed with filters
│   │   ├── HistoryScreen.tsx        # Saved check history with search
│   │   ├── DashboardScreen.tsx      # Analytics overview & agent status
│   │   ├── ProfileScreen.tsx        # User account management
│   │   └── SettingsScreen.tsx       # App preferences & toggles
│   │
│   └── navigation/
│       ├── AppNavigator.tsx         # Root navigator (auth/main switch)
│       ├── AuthNavigator.tsx        # Auth stack (Login → Register → ForgotPass)
│       └── MainTabNavigator.tsx     # Bottom tab bar (5 main screens)
│
└── android/
    ├── build.gradle                 # Root Gradle config (Kotlin 1.8, SDK 34)
    ├── settings.gradle              # Project name & include paths
    ├── gradle.properties            # JVM tuning, Hermes, AndroidX flags
    ├── gradlew.bat                  # Windows Gradle wrapper script
    ├── gradle/wrapper/
    │   └── gradle-wrapper.properties # Gradle 8.3 distribution URL
    └── app/
        ├── build.gradle             # App Gradle (minSdk 24, signing, ProGuard/R8)
        ├── proguard-rules.pro       # Release build obfuscation rules
        └── src/main/
            ├── AndroidManifest.xml  # Permissions, deep links (truthguard://), theme
            ├── java/com/truthguard/
            │   ├── MainActivity.kt  # React Native entry Activity (Kotlin)
            │   └── MainApplication.kt # React Native Application class (Kotlin)
            └── res/values/
                ├── strings.xml      # App name: "TruthGuard"
                ├── styles.xml       # Dark status/nav bar theme (#090d16)
                └── colors.xml       # Native color resources
```

---

## 🚀 Setup Guide

### Prerequisites

1. **Node.js** ≥ 18 — [https://nodejs.org](https://nodejs.org)
2. **JDK 17** — [https://adoptium.net](https://adoptium.net)
3. **Android Studio** — [https://developer.android.com/studio](https://developer.android.com/studio)
   - Install Android SDK 34 (Android 14)
   - Create an Android Virtual Device (AVD): Pixel 7 API 34
4. **React Native CLI**:
   ```bash
   npm install -g @react-native-community/cli
   ```
5. Set **environment variables**:
   ```
   ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
   Path += %ANDROID_HOME%\platform-tools
   Path += %ANDROID_HOME%\emulator
   ```

### Installation & Run

```bash
# Step 1: Install dependencies
cd mobile
npm install

# Step 2: Start backend (in separate terminal)
cd ..
npm run dev:backend

# Step 3: Start Metro bundler
cd mobile
npm start

# Step 4: Launch on Android emulator or device (separate terminal)
npm run android
```

---

## 🔨 Build Release APK / AAB

```bash
cd mobile

# Debug APK (for testing)
cd android && .\gradlew.bat assembleDebug

# Release APK (requires signing keystore)
cd android && .\gradlew.bat assembleRelease

# Android App Bundle (for Google Play Store)
cd android && .\gradlew.bat bundleRelease
```

APK output: `mobile/android/app/build/outputs/apk/release/app-release.apk`
AAB output: `mobile/android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔗 Backend API Connection

The mobile app connects to your Express backend. Edit the API base URL in [`src/api/apiClient.ts`](./src/api/apiClient.ts):

| Device | URL |
|---|---|
| Android Emulator | `http://10.0.2.2:5000/api` |
| Physical Device (same LAN) | `http://192.168.x.x:5000/api` |
| Production / Cloud | `https://your-domain.com/api` |

---

## 📡 API Endpoints Used

| Endpoint | Screen |
|---|---|
| `POST /api/auth/login` | LoginScreen |
| `POST /api/auth/register` | RegisterScreen |
| `POST /api/analyze` | VerifyScreen |
| `POST /api/checks` | VerifyScreen (save history) |
| `GET /api/checks/trending` | TrendingScreen |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#090d16` |
| Card Surface | `#0e1523` |
| Primary Accent | `#00e5a0` (Neon Green) |
| Secondary | `#6366f1` (Indigo) |
| Text Primary | `#ffffff` |
| Text Secondary | `#94a3b8` |
| Verdict Fake | `#ef4444` |
| Verdict Misleading | `#f59e0b` |
