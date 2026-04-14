<h1 align="center">
  🌊 OceanGuard
</h1>

<p align="center">
  <b>AI-Powered Marine Risk & Fisheries Intelligence System</b><br/>
  <i>Empowering fishermen and marine operators with real-time risk prediction, weather intelligence, and profit analytics.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/ML-Python%20FastAPI-009688?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

---

## 📖 Overview

**OceanGuard** is a full-stack SaaS platform that leverages machine learning and real-time weather data to help fishermen and marine operators make safer, smarter decisions at sea.

By combining a **Random Forest ML model**, live **OpenWeather API** data, and a **rule-based hybrid system**, OceanGuard delivers accurate marine risk predictions, profit estimations, and actionable analytics — all through a clean, responsive dark-mode interface.

> Built for fisheries communities to reduce risk, maximize profit, and navigate with confidence. 🐟⚓

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **ML Risk Prediction** | Random Forest model predicts marine risk levels based on real-time conditions |
| 🌦️ **Weather Integration** | Live wind speed, wave height, and conditions via OpenWeather API |
| 🔀 **Hybrid Prediction** | Rule-based fallback system combined with ML for higher accuracy |
| 💰 **Profit Calculator** | Deterministic profit calculation module for fisheries planning |
| 📊 **Analytics Dashboard** | Risk trends, historical insights, and decision support |
| 🔐 **Secure Auth** | JWT-based authentication with OTP email verification |
| 💳 **Subscription Access** | Free, Pro, and Enterprise tier access control |
| 🌙 **Dark Mode UI** | Fully responsive interface with dark mode support |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React** — Component-based UI
- 🎨 **Tailwind CSS** — Utility-first styling
- 🔷 **TypeScript** — Type-safe development

### Backend
- 🟢 **Node.js** — Runtime environment
- 🚂 **Express.js** — REST API framework
- 🔑 **JWT + OTP** — Authentication & verification
- 📧 **Gmail OAuth2** — Email service

### ML Microservice
- 🐍 **Python** — ML development
- ⚡ **FastAPI** — High-performance ML API
- 🌲 **scikit-learn** — Random Forest model

### Database & APIs
- 🍃 **MongoDB Atlas** — Cloud database
- 🌤️ **OpenWeather API** — Real-time weather data

### Deployment
- 🔺 **Vercel** — Frontend hosting
- 🎯 **Render** — Backend & ML hosting

---

## 🏗️ Architecture

```
User Request
     │
     ▼
┌─────────────┐
│   Frontend  │  React + Tailwind (Vercel)
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│   Backend   │  Node.js + Express (Render)
│  (Node.js)  │──────────────────────────────┐
└──────┬──────┘                              │
       │                                     ▼
       │                           ┌──────────────────┐
       ├──► OpenWeather API        │   MongoDB Atlas   │
       │    (Weather Data)         │   (Users, OTPs,   │
       │                           │    Risk Logs)     │
       ▼                           └──────────────────┘
┌─────────────┐
│ ML Service  │  Python + FastAPI (Render)
│  (FastAPI)  │  Random Forest Model
└─────────────┘
       │
       ▼
  Risk Prediction
  (safe / moderate / dangerous)
```

---

## 📁 Folder Structure

```
oceanguard
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── db.js
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   ├── contactController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── profitController.js
│   │   │   ├── riskController.js
│   │   │   └── subscriptionController.js
│   │   ├── middleware
│   │   │   ├── auth.js
│   │   │   └── subscription.js
│   │   ├── models
│   │   │   ├── Contact.js
│   │   │   ├── OTP.js
│   │   │   ├── Profit.js
│   │   │   ├── Risk.js
│   │   │   └── User.js
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── profitRoutes.js
│   │   │   ├── riskRoutes.js
│   │   │   └── subscriptionRoutes.js
│   │   ├── services
│   │   │   ├── mlService.js
│   │   │   └── weatherService.js
│   │   ├── utils
│   │   │   ├── apiResponse.js
│   │   │   ├── generateOTP.js
│   │   │   └── sendEmail.js
│   │   └── app.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── public
│   │   ├── favicon.png
│   │   └── favicon.svg
│   ├── src
│   │   ├── assets
│   │   │   └── hero-bg.jpg
│   │   ├── components
│   │   │   ├── dashboard
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── landing
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── LandingNavbar.tsx
│   │   │   ├── ui
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── OceanGuardLogo.tsx
│   │   ├── hooks
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   └── useTheme.tsx
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── pages
│   │   │   ├── dashboard
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   ├── OverviewPage.tsx
│   │   │   │   ├── ProfitCalculatorPage.tsx
│   │   │   │   ├── RiskHistoryPage.tsx
│   │   │   │   ├── RiskPredictionPage.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   └── SubscriptionPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.app.tsbuildinfo
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tsconfig.node.tsbuildinfo
│   ├── vercel.json
│   └── vite.config.ts
└── ml_service
    ├── Procfile
    ├── main.py
    ├── model.pkl
    ├── model.py
    ├── requirements.txt
    └── scaler.pkl
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB Atlas account
- OpenWeather API key

### 1. Clone the Repository

```bash
git clone https://github.com/Mokshith08/OceanGuard.git
cd OceanGuard
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your environment variables
node server.js
```

### 3. ML Service Setup

```bash
cd ml_service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

> Frontend runs at `http://localhost:5173`
> Backend runs at `http://localhost:5000`
> ML Service runs at `http://localhost:8001`

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login & send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |

### 🌊 Risk Prediction
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/risk/predict/:city` | Get marine risk for a city |

### 💰 Profit Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profit/calculate` | Calculate fishing profit |

### 📬 Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get analytics & risk trends |

---

## 🤖 ML Model Details

### Model: Random Forest Classifier

| Property | Details |
|----------|---------|
| Algorithm | Random Forest |
| Framework | scikit-learn |
| API | FastAPI (Python) |
| Output | `safe` / `moderate` / `dangerous` |

### Input Features

```python
features = [
    "wind_speed",       # Wind speed in m/s
    "wave_height",      # Estimated wave height
    "weather_code",     # OpenWeather condition code
    "day_of_week",      # 0 = Monday, 6 = Sunday
    "is_daytime",       # 1 = day, 0 = night
]
```

### Hybrid Prediction Logic

```
If ML confidence > threshold:
    Use ML prediction
Else:
    Fallback to rule-based system
        wind_speed > 10  →  dangerous
        wind_speed > 6   →  moderate
        else             →  safe
```

### Additional Details
- ⚖️ **Class balancing** applied during training to handle imbalanced risk data
- 📏 **StandardScaler** used for feature normalization
- 🔄 **Model persistence** via joblib for fast inference

---

## 📸 Screenshots

### 🖥️ Dashboard
<img width="1913" height="914" alt="Screenshot 2026-04-14 162642" src="https://github.com/user-attachments/assets/41008bc9-c010-481e-84b7-cd318a0042b0" />

### 🌊 Risk Prediction
<img width="1919" height="912" alt="Screenshot 2026-04-14 162405" src="https://github.com/user-attachments/assets/b8f6069e-6993-490f-bb8c-7e3dbac97d58" />

### 🔐 Login Page
<img width="1919" height="911" alt="Screenshot 2026-04-14 162051" src="https://github.com/user-attachments/assets/c6e9efb9-232d-46ea-a0a1-f7fca5862499" />

---

## 🔮 Future Improvements

- 🧠 **Advanced ML Models** — XGBoost, LSTM for time-series risk forecasting.
- 📡 **Real-time IoT Integration** — Live sensor data from marine buoys.
- 📱 **Mobile App** — React Native app for fishermen on the go.
- 🗺️ **Geo-mapping** — Interactive risk heatmaps using Mapbox/Leaflet.
- 🌐 **Multi-language Support** — Regional language support for fishermen.
- 📶 **Offline Mode** — PWA support for low-connectivity areas.
- 💳 **Payment Integration** — Payment integration for subscription.
- 🔔 **Alert and notification system** — Fisherman gets alert before going to sea.
- 🤖 **AI chatbot** - AI chatbot for OceanGuard.
---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <b>Mokshith</b><br/>
      <a href="https://github.com/Mokshith08">GitHub</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and ☕ for the fishing communities of India 🇮🇳<br/>
  <b>OceanGuard — Navigate Smarter. Fish Safer. 🌊</b>
</p>
