# Edstellar Corporate Games (Production & Deployment)

Concept work, interactive prototype, and compiled blogs for **Edstellar Engage** — a corporate engagement and learning-reinforcement platform built around Edstellar's training catalog.

> [!IMPORTANT]
> This is the **Production Deployment Repository** (`Edstellar-Corporate-games`). It is optimized for lightweight, lightning-fast static hosting on Vercel. It contains *only* the production-ready static assets and has zero compiler dependencies.
> 
> To modify blog content, run templates, or access the SQLite database, please see the master development repository:
> **👉 [Edstellar-Corporate-Games-Unified](https://github.com/Layruss98266/Edstellar-Corporate-Games-Unified)**

---

## 🏗️ Repository Role in Architecture

We utilize a **split-repository workflow** to keep production builds lean and performant:

1. **Development & Unified Repo** ([`Edstellar-Corporate-Games-Unified`](https://github.com/Layruss98266/Edstellar-Corporate-Games-Unified)):
   * Contains all development tooling, master templates (`.html.j2`), SQLite relational databases, scraping cache, and the automated verification suite.
   * **Purpose**: Content creation, layout iteration, and compiling.
2. **Production & Deployment Repo** (`Edstellar-Corporate-games` - *This Repo*):
   * Contains only pre-compiled standalone HTML blogs, prototype files, and the Vercel rewrite configuration.
   * **Purpose**: Connected directly to Vercel production hosting for instant deployments.

---

## 📂 Repository Contents

* **`engage-prototype/`** — Static interactive prototype (10 marketing landing pages + 3 playable games). Vanilla HTML/CSS/JS with absolutely no build toolchain required.
* **`blog/`** — 14 standard corporate games blogs and 14 content-only versions. Compiled into 100% self-contained standalone HTML files (CSS/JS inlined) for maximum cross-system compatibility.
* **`vercel.json`** — Vercel routing rules, rewriting subfolder assets to the root seamlessly.
* **`Edstellar_Engage_All_Games_Master.html`** — Source-of-truth for the 215 curated interactive game cards.
* **`MIGRATION_PLAN.md`** — Comprehensive operational strategy plan for Next.js and Supabase database scaling.

---

## 🚀 Run the Prototype Locally

Since this repository houses clean, vanilla assets, you can run the prototype immediately without installing any tools:
```bash
# Option A: Open directly in your browser
double-click engage-prototype/index.html

# Option B: Run a quick local server
python -m http.server 8080
# Visit http://localhost:8080/engage-prototype/
```

---

## 🔨 Syncing & Compilation Workflow

To modify blogs, games, or site assets:
1. Clone the master development repository: [Edstellar-Corporate-Games-Unified](https://github.com/Layruss98266/Edstellar-Corporate-Games-Unified).
2. Edit templates or databases in `blog-generator/`.
3. Rebuild and compile the assets in the dev repo:
   ```bash
   cd blog-generator
   python build_all.py
   ```
4. Copy the freshly generated `/blog/` and `/engage-prototype/` directories into this production repository folder.
5. Push the changes to trigger a production Vercel deployment:
   ```bash
   git add blog/ engage-prototype/
   git commit -m "Update compiled blogs and prototype pages"
   git push origin main
   ```

---

## 💻 Tech Details & Deployment

* **Hosting**: Automated Vercel hosting. Any push to `main` instantly triggers a rebuild and updates the live site under 10 seconds.
* **Stand-Alone Portability**: Inlined CSS/JS in `/blog/` guarantees the blogs render perfectly offline, within internal email systems, and across custom intranets.

---

## 📄 License

Internal intellectual property and concept work for Edstellar. All rights reserved.

