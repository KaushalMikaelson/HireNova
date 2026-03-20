# 🚀 HireNova — AI-Powered Career Intelligence Platform

<div align="center">

![HireNova Banner](./public/poster1.png)

**Accelerate your career with personalized AI-driven guidance, mock interviews, smart resume building, and real-time industry insights.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)](https://www.postgresql.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3%2070B-F55036)](https://groq.com/)
[![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-5A67D8)](https://www.inngest.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Folder Structure](#-folder-structure)
- [Background Jobs (Inngest)](#-background-jobs-inngest)
- [AI Integration](#-ai-integration)
- [Screenshots](#-screenshots)

---

## 🌟 About the Project

**HireNova** is a full-stack, production-ready AI career intelligence platform built with **Next.js 16** and **React 19**. It helps job seekers and professionals accelerate their careers with four core AI-powered tools:

1. **📊 Industry Dashboard** — Real-time salary ranges, market outlook, growth rates, and trending skills for your chosen industry
2. **🎯 Mock Interview Prep** — AI-generated role-specific quiz questions with instant feedback and improvement tips
3. **📄 Smart Resume Builder** — A rich Markdown-based resume editor with AI enhancement for every section
4. **✉️ AI Cover Letter Generator** — Job-specific cover letters generated from your profile and a job description

HireNova is designed for **professionals across 50+ industries**, offering a seamless onboarding experience that tailors every AI interaction to the user's specific industry, skill set, and experience level.

---

## ✨ Key Features

### 🔐 Authentication & Onboarding
- **Clerk-powered auth** with Google Sign-In support (dark-themed UI)
- First-time users go through a guided **onboarding flow** where they specify their industry, years of experience, bio, and skills
- Onboarding status is persisted in the database and checked on every protected route

### 📊 Career Dashboard
- Displays **AI-generated industry insights** for the user's selected industry:
  - Salary ranges for common roles (min/max/median)
  - Market growth rate (%)
  - Demand level (HIGH / MEDIUM / LOW)
  - Top in-demand skills
  - Market outlook (POSITIVE / NEUTRAL / NEGATIVE)
  - Key industry trends
  - Recommended skills to learn
- Data is **cached in PostgreSQL** and automatically refreshed every 30 days via a scheduled Inngest background job
- Uses **Recharts** to visualize salary data in beautiful charts

### 🎯 Interview Preparation
- Generates **10 tailored multiple-choice quiz questions** based on the user's industry and skills using **LLaMA 3.3 70B via Groq**
- After submission, calculates the quiz score and identifies wrong answers
- AI generates a **personalized improvement tip** targeting the specific knowledge gaps revealed
- Quiz history and scores are stored and shown as a **performance trend chart** over time

### 📄 Resume Builder
- Full-featured **Markdown editor** (`@uiw/react-md-editor`) for crafting a professional resume
- **"Improve with AI" button** on each resume section — sends the current content to Groq and returns an enhanced, ATS-optimized version using action verbs and quantifiable metrics
- Resume content is **auto-saved** to the database (one resume per user, using `upsert`)
- **PDF export** powered by `html2pdf.js` so users can download their resumes instantly

### ✉️ AI Cover Letter Generator
- Users input a **job description** and **company name**; the AI generates a polished, industry-specific cover letter
- Multiple cover letters can be created and browsed by individual cover letter ID (`/ai-cover-letter/[id]`)
- All cover letters are stored per user in the database

### 🎨 UI/UX
- **Dark mode by default** with system-aware theme toggling via `next-themes`
- **Framer Motion** animations — fade-in, slide-up, and parallax scroll effects on the landing page
- Glassmorphism cards, gradient headings, and backdrop blur throughout
- Fully **responsive** design from mobile to widescreen
- Smooth hero section with parallax scroll effect on the banner image
- Grid-background pattern on the landing page for a modern tech aesthetic

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + custom CSS |
| **UI Components** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion |
| **Auth** | Clerk (with Clerk Themes dark mode) |
| **Database** | PostgreSQL (via Neon / hosted provider) |
| **ORM** | Prisma v7 |
| **AI / LLM** | Groq SDK (LLaMA 3.3 70B Versatile) |
| **Background Jobs** | Inngest (weekly cron for industry insights) |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |
| **Markdown Editor** | @uiw/react-md-editor |
| **PDF Export** | html2pdf.js |
| **Notifications** | Sonner (toast notifications) |
| **Icons** | Lucide React |
| **Font** | Geist Sans + Geist Mono (Google Fonts via Next.js) |

---

## 🏗 Project Architecture

HireNova uses the **Next.js App Router** with a clean separation between server and client code:

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│   React 19 + Framer Motion + Recharts + React Hook Form  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP / RSC
┌────────────────────────▼─────────────────────────────────┐
│                  NEXT.JS APP ROUTER                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  app/(auth) │  │  app/(main)  │  │    app/api/     │  │
│  │  sign-in    │  │  dashboard   │  │    inngest/     │  │
│  │  sign-up    │  │  interview   │  │                 │  │
│  └─────────────┘  │  resume      │  └─────────────────┘  │
│                   │  ai-cover-   │                        │
│                   │  letter      │                        │
│                   │  onboarding  │                        │
│                   └──────────────┘                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              SERVER ACTIONS (actions/)               │  │
│  │   user.js   dashboard.tsx   interview.tsx            │  │
│  │                       resume.tsx                     │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────-┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌─────────────┐  ┌──────┐  ┌──────────┐
   │  PostgreSQL  │  │ Groq │  │  Inngest │
   │  (Prisma)   │  │ LLM  │  │  (Cron)  │
   └─────────────┘  └──────┘  └──────────┘
```

### Route Groups
| Route Group | Purpose |
|---|---|
| `app/(auth)` | Authentication pages (sign-in, sign-up) with Clerk UI |
| `app/(main)` | All protected, authenticated user pages |
| `app/api/inngest` | Inngest API endpoint for background job processing |

### Data Flow Pattern
All data mutations use **Next.js Server Actions** (`"use server"`) rather than API routes, keeping the data-fetching layer co-located with the components and enabling React Server Components to fetch data directly.

---

## 🗄 Database Schema

The Prisma schema defines **5 models** backed by PostgreSQL:

```
User
├── id (UUID, primary key)
├── clerkUserId (unique — links to Clerk auth)
├── email, name, imageUrl
├── industry → IndustryInsight (FK)
├── bio, experience, skills[]
├── assessments Assessment[]
├── resumes Resume[]
└── coverLetters CoverLetter[]

Assessment
├── id, userId → User
├── quizScore (Float)
├── questions (Json[]) — stores Q&A results
├── category, improvementTip
└── timestamps

Resume
├── id, userId → User (unique — 1 resume/user)
├── content (Text — Markdown)
└── timestamps

CoverLetter
├── id, userId → User
├── content, jobDescription
├── companyName, jobTitle
└── timestamps

IndustryInsight
├── id, industry (unique)
├── salaryRanges (Json[])
├── growthRate (Float)
├── demandLevel (HIGH | MEDIUM | LOW)
├── topSkills[], marketOutlook (POSITIVE | NEUTRAL | NEGATIVE)
├── keyTrends[], recommendedSkills[]
├── lastUpdated, nextUpdate
└── users User[]
```

**Design choices:**
- `IndustryInsight` is shared across users in the same industry (cached, not regenerated per user)
- `Resume` is a **one-to-one** relation (`userId @unique`) — only one active resume per user
- `CoverLetter` is **one-to-many** — users can generate multiple cover letters
- `Assessment` accumulates over time to enable progress tracking charts

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (e.g., [Neon](https://neon.tech) for serverless Postgres)
- [Clerk](https://clerk.com) account for authentication
- [Groq](https://console.groq.com) API key (free tier available)
- [Inngest](https://www.inngest.com) account for background jobs

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KaushalMikaelson/HireNova.git
cd HireNova

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Push the Prisma schema to your database
npx prisma db push

# 5. Generate the Prisma client
npx prisma generate

# 6. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database — PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Groq LLM API
GROQ_API_KEY=gsk_...

# Inngest (for background jobs)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

---

## 🔄 How It Works

### User Journey

```
Sign Up / Sign In (Clerk)
        │
        ▼
Onboarding Flow
├── Select Industry (50+ options)
├── Enter Years of Experience
├── Write Bio
└── Add Skills
        │
        ▼
Dashboard (auto-generates IndustryInsight if none exists for the industry)
        │
   ┌────┴────────────────────────┐
   │                             │
   ▼                             ▼
Interview Prep              Resume Builder
├── Generate 10 MCQs         ├── Markdown editor
├── Submit answers            ├── AI improve sections
├── View score + tip          └── Download as PDF
└── Track progress chart
        │
        ▼
   Cover Letter Generator
   ├── Input job description
   ├── Company name + job title
   └── AI generates letter
```

### AI Prompt Engineering
All AI calls follow a strict **structured-output pattern**:
- Prompts explicitly request **JSON-only** responses
- The response is cleaned of any markdown code fences (` ```json `) before parsing
- User context (industry, skills, experience) is always injected into the prompt for personalization

---

## 📁 Folder Structure

```
HireNova/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/              # Protected route group
│   │   ├── dashboard/       # Industry insights dashboard
│   │   ├── interview/       # Mock interview quiz
│   │   │   ├── component/   # Quiz UI components
│   │   │   └── mock/        # Mock interview page
│   │   ├── resume/          # Resume builder
│   │   │   └── _components/ # Editor components
│   │   ├── ai-cover-letter/ # Cover letter generator
│   │   │   └── [id]/        # Individual cover letter view
│   │   └── onboarding/      # Onboarding flow
│   │       └── _components/
│   ├── api/
│   │   └── inngest/         # Inngest webhook endpoint
│   ├── globals.css          # Global styles + CSS variables
│   ├── layout.tsx           # Root layout (Clerk + ThemeProvider)
│   └── page.tsx             # Public landing page
│
├── actions/                 # Next.js Server Actions
│   ├── user.js              # updateUser, getUserOnboardingStatus
│   ├── dashboard.tsx        # getIndustryInsights, generateAIInsights
│   ├── interview.tsx        # generateQuiz, saveQuizResult, getAssessments
│   └── resume.tsx           # saveResume, getResume, improveWithAI
│
├── components/
│   ├── Hero.tsx             # Landing page hero section
│   └── ui/                  # shadcn/ui components
│       ├── header.tsx       # Global navigation header
│       ├── theme-provider.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── data/                    # Static data files
│   ├── features.js          # Landing page features list
│   ├── howItWorks.jsx       # "How It Works" steps
│   ├── testimonial.js       # Testimonials data
│   ├── faqs.js              # FAQ accordion data
│   └── industries.js        # 50+ industry options for onboarding
│
├── hooks/                   # Custom React hooks
├── lib/
│   ├── prisma.tsx           # Prisma client singleton
│   ├── checkUser.tsx        # Ensures user exists in DB on auth
│   ├── utils.ts             # cn() utility (clsx + tailwind-merge)
│   ├── generated/prisma/    # Generated Prisma client
│   └── inngest/
│       ├── client.tsx       # Inngest client setup
│       └── functions.tsx    # Scheduled industry insight refresh
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
│
├── types/                   # TypeScript type definitions
├── public/                  # Static assets (images, icons)
├── next.config.ts           # Next.js configuration
├── tailwind.config          # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## ⏱ Background Jobs (Inngest)

HireNova uses **Inngest** for reliable, scheduled background job processing.

### `generateIndustryInsights` function

- **Trigger:** Weekly cron — `0 0 * * 0` (every Sunday at midnight UTC)
- **What it does:**
  1. Fetches all unique industries stored in the `IndustryInsight` table
  2. For each industry, calls **Groq LLaMA 3.3 70B** with a structured prompt to get fresh market data
  3. Updates the `IndustryInsight` record with the new data and sets `nextUpdate` to 30 days from now
- **Why Inngest?** Inngest provides step-level retries, observability, and reliable scheduling without needing a separate worker process

The Inngest API endpoint is exposed at `/api/inngest` and handles both event triggers and cron scheduling.

---

## 🤖 AI Integration

All AI features use **Groq's ultra-fast inference** with the **LLaMA 3.3 70B Versatile** model.

| Feature | AI Task | Model |
|---|---|---|
| Industry Insights | Generate structured JSON market data | LLaMA 3.3 70B |
| Quiz Generation | Create 10 MCQs tailored to user's industry & skills | LLaMA 3.3 70B |
| Improvement Tips | Analyze wrong answers → concise improvement tip | LLaMA 3.3 70B |
| Resume Enhancer | Rewrite a resume section with action verbs + metrics | LLaMA 3.3 70B |
| Cover Letter | Generate full cover letter from job description | LLaMA 3.3 70B |

**Why Groq?**
- Sub-second inference speeds (ideal for interactive UX)
- LLaMA 3.3 70B delivers GPT-4-class quality for structured reasoning tasks
- Generous free tier for development

---

## 📸 Screenshots

> **Landing Page** — Hero section with parallax animation and glassmorphism design

> **Dashboard** — Salary range charts, market outlook, top skills, and growth rate for the user's industry

> **Interview Prep** — Multiple-choice technical quiz with real-time scoring and AI improvement tips

> **Resume Builder** — Side-by-side Markdown editor with live preview and AI enhancement buttons

---

## 👷 Built By

Built with ❤️ by **Kaushal** — [GitHub: @KaushalMikaelson](https://github.com/KaushalMikaelson)

---

## 📄 License

This project is for educational and portfolio purposes.
