# 🚀 AI Content Engine

<img width="1912" height="873" alt="image" src="https://github.com/user-attachments/assets/3a6a142b-f3aa-4d0d-9293-9a3e1dd95b72" />

#
AI Content Engine (ACE) is a Next.js 16 app that helps small businesses generate practical, channel-specific social content plans in seconds ⚡. It turns three inputs (business type, target audience, and goal) into a five-day execution blueprint with ready-to-use ideas for Instagram, TikTok, Facebook/LinkedIn, hashtags, and learning resources 📈.

## 🎯 Why this exists

Most businesses know they *should* post consistently but struggle with what to post next 🤔. ACE is built to reduce that friction by giving users a concrete action plan they can execute immediately ✅.

## 🧠 Core capabilities

- **AI strategy generation** via OpenRouter (`/api/generate-content`) 🤖.
- **Structured outputs**: title, overview, Instagram plan, TikTok plan, Facebook/LinkedIn plan, hashtag plan, and a 5-day action plan 🗂️.
- **Curated video recommendations** to help users execute each strategy 🎥.
- **Local free-tier usage tracking** (5 free generations/day per browser) 🆓.
- **Stripe checkout + verification flow** for Pro upgrades 💳.
- **Firebase Auth support** (Google provider, browser persistence) 🔐.

## 🧩 Full blueprint

### 1) 🛠️ Product flow

1. User opens the marketing site/dashboard.
2. User submits:
   - business type
   - target audience
   - goal
3. API validates payload (required fields + max lengths).
4. Server requests generation from OpenRouter.
5. Response is parsed into strict JSON sections.
6. UI renders a practical 5-day strategy and related recommendations.
7. Free plan usage is tracked in localStorage.
8. User can upgrade to Pro through Stripe checkout.

### 2) 🏗️ System architecture

- **Frontend**: Next.js App Router with React 19 + TypeScript ⚛️.
- **Styling/UX**: Tailwind CSS 4, Framer Motion, and Three.js scene components 🎨.
- **Backend routes**:
  - `POST /api/generate-content`
  - `POST /api/checkout`
  - `GET /api/checkout/verify`
- **AI provider**: OpenRouter chat completions API 🤖.
- **Payments**: Stripe subscriptions 💸.
- **Auth**: Firebase client auth utilities 🔐.
- **Config source of truth**: `app/lib/site.ts`.

### 3) 📦 Data contract (AI output shape)

The generation pipeline expects these JSON keys:

- `title`
- `overview`
- `instagram_plan`
- `tiktok_plan`
- `facebook_linkedin_plan`
- `hashtag_plan`
- `five_day_plan` (exactly 5 items)
- `video_topics` (3 to 4 items)

### 4) 📊 Plans and limits

- **Free**: 5 generations/day (browser-local tracking) 🆓.
- **Pro**: unlimited generations (subscription flow scaffolded with Stripe) 🌟.

### 5) 🗺️ Project structure

```text
app/
  api/
    generate-content/route.ts
    checkout/route.ts
    checkout/verify/route.ts
  components/
  lib/
    generator.ts
    site.ts
    usage.ts
    stripe.ts
    firebase.ts
  dashboard/page.tsx
  pricing/page.tsx
  page.tsx
public/
```

## 🧰 Tech stack

- **Framework**: Next.js 16.2
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **3D/visuals**: Three.js + React Three Fiber + Drei
- **AI**: OpenRouter
- **Payments**: Stripe
- **Auth**: Firebase

## 🔧 Environment variables

Create `.env.local` in the project root:

```bash
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenRouter
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openai/gpt-4o-mini

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PRO_PRICE_ID=...

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## ▶️ Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 📜 Scripts

- `npm run dev` – start local dev server 🧪
- `npm run build` – production build 🏁
- `npm run start` – run production server 🌐
- `npm run lint` – lint codebase 🔍

## 💬 Skills

- Product strategy framing for early-stage SaaS 🧭
- Prompt and output-structure design for AI marketing workflows ✍️
- Next.js app architecture and feature decomposition 🧱
- Growth-oriented landing page and conversion copy 📣
- API-first integration planning (OpenRouter, Stripe, Firebase) 🔌

## 🛣️ Roadmap ideas

- Save and export generated strategies 💾.
- Team collaboration and shared workspaces 🤝.
- Calendar integrations and scheduled posting workflows 🗓️.
- Brand voice memory and campaign history 🧬.
- Analytics feedback loop for recommendation tuning 📈.

## 📄 License

[MIT License](https://github.com/skumalo0115-commits/ai-content-engine/blob/main/LICENSE)
