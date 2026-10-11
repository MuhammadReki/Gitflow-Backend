\# GitFlow Backend



!\[Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

!\[Node.js](https://img.shields.io/badge/Node.js-Serverless-green?logo=node.js)

!\[OAuth](https://img.shields.io/badge/OAuth-GitHub%20%2B%20Google-blue)



> OAuth backend untuk \*\*GitFlow\*\* — GitHub client mobile yang dibangun dengan Flutter.



\---



\## 📖 Tentang Project



`gitflow-backend` adalah \*\*serverless backend\*\* yang menangani proses OAuth untuk aplikasi mobile \*\*GitFlow\*\*. Backend ini berjalan di \*\*Vercel\*\* dan berfungsi sebagai perantara antara aplikasi mobile dengan GitHub dan Google OAuth API.



\### Kenapa butuh backend?



OAuth flow memerlukan \*\*Client Secret\*\* yang \*\*tidak boleh\*\* disimpan di aplikasi mobile (rawan dibaca orang). Backend ini menyimpan secret dengan aman di environment variables Vercel, lalu melakukan exchange `code` → `access\_token` di server.



\### Alur OAuth



```

\[Mobile App] → \[GitHub/Google OAuth] → \[Backend Vercel] → \[OAuth API]

&#x20;    ↑                                                              │

&#x20;    └────────────────────── access\_token ──────────────────────────┘

```



\---



\## 🛠️ Tech Stack



| Komponen | Tech |

|----------|------|

| Runtime | Node.js (Vercel Serverless Functions) |

| Hosting | \[Vercel](https://vercel.com) |

| OAuth Provider | GitHub API, Google OAuth 2.0 |

| HTTP Client | Native `fetch` / `https` |

| Config | Environment Variables |



\---



\## 📁 Struktur Project



```

gitflow-backend/

├── api/

│   └── auth/

│       ├── github.js              # POST /api/auth/github

│       └── google/

│           └── callback.js        # GET /api/auth/google/callback

├── .gitignore

├── LICENSE

└── README.md

```



\---



\## 🔌 API Endpoints



\### 1. GitHub OAuth — Exchange Code



\*\*Endpoint:\*\* `POST /api/auth/github`



\*\*Request Body:\*\*

```json

{

&#x20; "code": "github\_oauth\_code\_from\_mobile"

}

```



\*\*Response:\*\*

```json

{

&#x20; "access\_token": "gho\_xxxxxxxxxxxx",

&#x20; "token\_type": "bearer",

&#x20; "scope": "repo,user,notifications,read:org",

&#x20; "user": {

&#x20;   "login": "MuhammadReki",

&#x20;   "id": 12345678,

&#x20;   "avatar\_url": "https://avatars.githubusercontent.com/u/...",

&#x20;   "name": "Muhammad Reki"

&#x20; }

}

```



\*\*Cara Kerja:\*\*

1\. Terima `code` dari mobile app

2\. Kirim `code` + `client\_id` + `client\_secret` ke `https://github.com/login/oauth/access\_token`

3\. Dapatkan `access\_token`

4\. Fetch user info dari `https://api.github.com/user`

5\. Return token + user ke mobile app



\---



\### 2. Google OAuth — Callback



\*\*Endpoint:\*\* `GET /api/auth/google/callback?code=xxx`



\*\*Response:\*\* Redirect 307 ke `gitflow://auth/google?access\_token=...\&email=...\&name=...\&picture=...\&id=...`



\*\*Cara Kerja:\*\*

1\. Terima `code` dari Google OAuth redirect

2\. Kirim `code` + `client\_id` + `client\_secret` ke `https://oauth2.googleapis.com/token`

3\. Dapatkan `access\_token`

4\. Fetch user info dari `https://www.googleapis.com/oauth2/v2/userinfo`

5\. Redirect ke deep link `gitflow://auth/google?...` dengan data user



\---



\## 🚀 Cara Deploy



\### Prasyarat



\- Akun \[Vercel](https://vercel.com) (gratis)

\- Akun \[GitHub](https://github.com)

\- Akun \[Google Cloud Console](https://console.cloud.google.com)

\- Node.js 18+ (untuk testing lokal)



\### Setup GitHub OAuth App



1\. Buka https://github.com/settings/developers

2\. Klik \*\*New OAuth App\*\*

3\. Isi:

&#x20;  - \*\*Application name:\*\* GitFlow

&#x20;  - \*\*Homepage URL:\*\* `https://github.com/MuhammadReki/GitFlow`

&#x20;  - \*\*Authorization callback URL:\*\* `gitflow://auth/callback`

4\. Copy \*\*Client ID\*\* + \*\*Client Secret\*\*



\### Setup Google OAuth



1\. Buka https://console.cloud.google.com/apis/credentials

2\. Buat \*\*OAuth 2.0 Client ID\*\* → \*\*Web application\*\*

3\. Authorized JavaScript origins: `https://gitflow-backend-xi.vercel.app`

4\. Authorized redirect URIs: `https://gitflow-backend-xi.vercel.app/api/auth/google/callback`

5\. Copy \*\*Client ID\*\* + \*\*Client Secret\*\*



\### Deploy ke Vercel



```bash

\# Clone repo

git clone https://github.com/MuhammadReki/gitflow-backend.git

cd gitflow-backend



\# Install Vercel CLI (opsional)

npm i -g vercel



\# Deploy

vercel

```



Atau deploy via GitHub:

1\. Buka https://vercel.com/new

2\. Import repo `gitflow-backend`

3\. Tambah environment variables (lihat di bawah)

4\. Klik \*\*Deploy\*\*



\---



\## 🔐 Environment Variables



Set di \*\*Vercel Dashboard → Project → Settings → Environment Variables\*\*:



| Variable | Value | Keterangan |

|----------|-------|------------|

| `GITHUB\_CLIENT\_ID` | `Ov23li...` | Dari GitHub OAuth App |

| `GITHUB\_CLIENT\_SECRET` | `xxx...` | Dari GitHub OAuth App |

| `GOOGLE\_CLIENT\_ID` | `624229663803-...` | Dari Google Cloud Console |

| `GOOGLE\_CLIENT\_SECRET` | `GOCSPX-...` | Dari Google Cloud Console |



> ⚠️ \*\*JANGAN\*\* commit file `.env` ke repo. Semua secret disimpan di Vercel env vars.



\---



\## 📱 Integrasi dengan GitFlow Mobile



Backend ini dipakai oleh aplikasi mobile \*\*GitFlow\*\* → \[repo GitFlow](https://github.com/MuhammadReki/GitFlow).



Di aplikasi mobile, URL backend di-set di:

```dart

// lib/data/services/github\_oauth\_service.dart

static const String backendUrl =

&#x20;   'https://gitflow-backend-xi.vercel.app/api/auth/github';

```



\---



\## 🧪 Testing



\### Test backend hidup



```bash

curl -I "https://gitflow-backend-xi.vercel.app/api/auth/google/callback?error=test"

```



\*\*Expected:\*\* `HTTP/1.1 307` + `Location: gitflow://auth/google?error=test`



\### Test GitHub OAuth (butuh code valid)



```bash

curl -X POST "https://gitflow-backend-xi.vercel.app/api/auth/github" \\

&#x20; -H "Content-Type: application/json" \\

&#x20; -d '{"code": "your\_github\_code"}'

```



\---



\## 🐛 Bug Report \& Feature Request



Buka \*\*issue\*\* di \[GitHub Issues](https://github.com/MuhammadReki/gitflow-backend/issues).



\---



\## 📄 License



Project ini dilisensikan under \[MIT License](LICENSE).



\---



\## 👤 Author



\*\*Muhammad Reki\*\*

\- GitHub: \[@MuhammadReki](https://github.com/MuhammadReki)

\- Email: mreki2022@gmail.com



\---



<p align="center">

&#x20; Made with ❤️ in Indonesia

</p>

