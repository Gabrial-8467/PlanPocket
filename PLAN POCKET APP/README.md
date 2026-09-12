# PlanPocket Flutter App (`PLAN POCKET APP`)

A production-ready cross-platform Flutter application for **PlanPocket**, connected to the live backend hosted at **`https://planpocket.onrender.com/`** and providing the same financial management functionality as the React web frontend, excluding the loans functionality as requested.

---

## 🚀 Production Highlights

1. **Environment Configuration (`.env`)**
   - Managed via `flutter_dotenv` using `.env` at the root of `PLAN POCKET APP`.
   - Pre-configured for the live hosted production backend:
     ```env
     API_URL=https://planpocket.onrender.com/api
     APP_NAME=PlanPocket
     APP_ENV=production
     ```

2. **High-Performance Caching Layer (Instant Startup & Offline Tolerant)**
   - Implements the **Stale-While-Revalidate (SWR)** caching pattern via `StorageService`.
   - On app launch, user profiles and transactions hydrate from local cache in **<1ms**, eliminating blocking spinners and blank screens.
   - Background revalidation syncs with Render automatically without freezing the user interface.
   - Handles Render free-tier cold starts with a resilient 35s timeout and automatic wake-up detection.

3. **Native Launch & Splash Screen**
   - Configured with native Android launch drawables (`launch_background.xml`) using brand dark theme `#111827`.
   - Eliminates white flash on app startup.
   - Smooth native transition from OS boot directly to authenticated dashboard.

4. **Custom App Icon & Launcher Icons**
   - Custom 1024x1024 vector-rendered brand icon with wallet, golden coin, rupee symbol, and growth curve.
   - Native launcher icons automatically generated across all Android densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`), iOS, and Web via `flutter_launcher_icons`.

5. **Production Android Settings**
   - Proper permissions in `AndroidManifest.xml` (`INTERNET`, `ACCESS_NETWORK_STATE`).
   - App label set to **`PlanPocket`**.

---

## ✨ Features (Same Functionality as Frontend, Excluding Loans)

- **Authentication**: Sign-in & Sign-up matching `/api/auth/*` endpoints with password strength indicator, token persistence, and auto-login.
- **Dashboard**:
  - Monthly In-Hand Income (last 30 days calculation).
  - Total Monthly Expenses (last 30 days calculation).
  - Remaining Budget (`Income - Expenses`).
  - Progress bar showing budget used percentage with dynamic warning colors.
  - Transaction Statistics: Total count, Income count, Expense count, and Net Flow.
  - Recent transactions list with color-coded badges and currency formatting (`₹`).
  - Pull-to-refresh for manual cloud sync.
- **Transactions**: Add new transaction modal (Income/Expense toggle, Description, Amount, Category dropdown, Date picker) and delete with confirmation dialog.
- **Financial Summary**: Comprehensive breakdown of income, spending, lifetime totals, and monthly savings rate (`Net Cash Flow / Income * 100`). *(Loans excluded)*.
- **Profile & Settings**: Profile overview, Annual Income updater, Change Password form, and custom server URL switcher.

---

## 🏃‍♂️ How to Run

```bash
cd "PLAN POCKET APP"
flutter pub get
flutter run
```
