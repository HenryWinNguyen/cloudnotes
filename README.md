# CloudNotes

CloudNotes is a small notebook app I built to experiment with running code safely inside Docker containers.  
You can write Markdown notes, add Python or C++ code cells, and run them in isolated containers right from the UI.

It’s designed to be a **local demo** rather than a hosted service. The goal is to show how a full-stack app can execute untrusted code securely using containers, resource limits, and timeouts.

---

## Why I Built This

I wanted a project that combines:

- a clean Next.js frontend
- a database-backed notes system
- real code execution through Docker
- container sandboxing, limits, and isolation

It’s the kind of problem you only run into when building dev tools, and I learned a lot putting it together.

---

## Features

- Markdown and code cells in one interface  
- Python and C++ support  
- Each run starts a fresh Docker container  
- Safe execution:
  - no network access  
  - memory limit  
  - CPU limit  
  - process limit  
  - per-run timeout  
- Clean dark UI with a subtle animated background

---

## Tech Stack

- **Next.js (App Router)**  
- **React + TypeScript**  
- **TailwindCSS**  
- **Prisma + Postgres (Neon)**  
- **Docker** (Python + C++ images)

---

## Running It Locally

CloudNotes only works locally because it requires access to `docker run`.

### Requirements

- Docker Desktop installed and running  
- Node.js 20+  
- A Postgres database (I used Neon)  
- A `.env.local` with `DATABASE_URL`

### Setup

```bash
git clone https://github.com/HenryWinNguyen/cloudnotes
cd cloudnotes/apps/web
npm install
