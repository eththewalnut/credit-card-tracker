# Credit Card Tracker

A simple web app to track credit card statements, due dates, and payments in one place.

## ✨ Features

- Add and manage multiple credit cards (using simple identifiers)
- Track statement balances and due dates
- Mark payments as paid or unpaid
- Stay organized and avoid missed payments

## 🔐 Privacy & Data Usage

This app does **not** require or store any real credit card details.

Users only input a **personal identifier** (e.g., card nickname or label) to track statements and payments. No sensitive financial information such as card numbers, CVV, or bank data is collected or stored.

The goal of this app is purely to help organize and track due dates and payment status.

## 🛠 Tech Stack

### Frontend

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui (built on Radix UI)
- Framer Motion (animations)

### UI & UX

- Radix UI primitives
- Lucide Icons
- React Day Picker (date handling)
- Sonner (toast notifications)

### State & Data Handling

- TanStack React Query (server state)
- TanStack React Table (data tables)
- date-fns (date utilities)

### Backend & Database

- Prisma ORM
- PostgreSQL
- Prisma PG Adapter

### Auth

- better-auth

### Dev & Tooling

- ESLint
- TypeScript
- tsx
- dotenv

## 🚀 Getting Started

Clone the repo:

```bash
git clone https://github.com/eththewalnut/credit-card-tracker.git
cd credit-card-tracker
```

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📌 Notes

- Make sure to set up your `.env` file before running the app
- Prisma migrations may be required depending on your setup
- If you encounter database issues, try running:

  ```bash
  npx prisma generate
  ```

## 📷 Future Improvements

- Notifications for due dates
- Dashboard analytics
- Mobile responsiveness improvements

---

Built as part of my journey transitioning from QA to development.
