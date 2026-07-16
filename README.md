# ⚡ Codexa (Repo Samjho) — Interactive AI Codebase Analyzer

Codexa (also known as **Repo Samjho**) is a beautiful, interactive, AI-powered codebase analysis platform designed to help developers understand public GitHub repositories instantly. By fetching repository trees and analyzing directory structures, dependencies, and configuration files, Codexa generates comprehensive summaries, architectural maps, and interactive file explanations—all written in friendly, easy-to-understand **Hinglish (Hindi + English)**.

---

## 🚀 Key Features

*   🔍 **Instant GitHub Analysis**: Paste any public GitHub URL and get a detailed structural breakdown in seconds.
*   💻 **Interactive File Tree Explorer**: Navigate through files and folders with custom Hinglish descriptions explaining the exact role of every directory.
*   📐 **Visual Architecture Map**: A dynamic interface mapping out the project components, layouts, pages, APIs, and configs.
*   ⚡ **Data Flow Animations**: Canvas-based particle simulations visually representing data flows and communication patterns in the codebase.
*   🔌 **Auto Tech-Stack Detection**: Automatically identifies frameworks (Next.js, React, Remix, Svelte, Vue, Angular, Express, Django, etc.) and toolkits (Tailwind CSS, Drizzle, Prisma, MongoDB, etc.).
*   🏎️ **Double Caching & DB Persistence**: Utilizes Redis for sub-millisecond response caches and PostgreSQL (via Drizzle ORM) to keep track of recent analyses.

---

## 🗺️ System Flow Diagram

Here is how data flows from the user's browser to the backend analysis engine and database:

```mermaid
graph TD
    User([User Browser]) -->|1. Paste GitHub URL| FE[Frontend React + Vite App]
    FE -->|2. POST /api/analyze| BE[Express Node.js Backend]
    BE -->|3. Check Cache| Redis[(Redis Cache)]
    
    Redis -.->|Cache Hit: Return result| BE
    
    BE -->|4. Cache Miss: Fetch Meta & Tree| GH_API[GitHub REST API]
    GH_API -->|5. Return Repo Tree & Files| BE
    
    BE -->|6. Run Heuristic Analysis| Analyzer[analyzer.ts / knowledge.ts]
    Analyzer -->|7. Generate Hinglish Summary| BE
    
    BE -->|8. Save to DB| Postgres[(PostgreSQL Database)]
    BE -->|9. Cache Result 2 Hours| Redis
    
    BE -->|10. Send Analysis Payload| FE
    FE -->|11. Render Dashboard & Animations| User
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript | Ultra-fast client-side SPA |
| **Styling** | Tailwind CSS, Framer Motion | Fluid layouts and smooth micro-animations |
| **Backend** | Express, TypeScript, TSX | Lightweight API Server |
| **Database** | PostgreSQL | Permanent storage of recent analyses |
| **ORM** | Drizzle ORM | Type-safe queries and schema migrations |
| **Caching** | Redis | Temporary performance caching of analyze results |
| **DevOps** | Docker Compose | Local database setup |
