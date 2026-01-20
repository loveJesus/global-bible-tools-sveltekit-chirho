# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# Global Bible Tools - SvelteKit Edition

A collaborative platform for Bible translation, rewritten in SvelteKit 2 with Svelte 5 runes.

## Acknowledgments

This project is a SvelteKit rewrite of the excellent [Global Bible Tools Platform](https://github.com/globalbibletools/platform) originally built by the Global Bible Tools team. We are deeply grateful for their pioneering work in creating an open-source, collaborative Bible translation platform.

**Original Project:** https://github.com/globalbibletools/platform

The original team's vision of making Bible translation accessible and collaborative has been an inspiration. This rewrite aims to:

- Explore alternative architectural patterns using SvelteKit 2 and Drizzle ORM
- Apply custom naming conventions for our team's workflow (the "Chirho" suffix pattern)
- Experiment with different deployment strategies (Cloudflare, Hetzner)
- Learn from and build upon their excellent foundation

All credit for the core concepts, database schema, and translation workflow goes to the original Global Bible Tools team. We simply wanted to explore these ideas through a different lens while contributing back to the broader community of Bible translation tools.

## Tech Stack

- **Frontend:** SvelteKit 2, Svelte 5 (runes), TailwindCSS
- **Backend:** SvelteKit server, Drizzle ORM
- **Database:** PostgreSQL 16
- **Storage:** Cloudflare R2 (S3-compatible)
- **Email:** 2SMTP / Mailu
- **Runtime:** Bun

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+)
- [Docker](https://www.docker.com/) & Docker Compose
- PostgreSQL (or use Docker)

### Development with Docker

```bash
# Start all services (database, minio storage)
docker compose up -d

# View logs
docker compose logs -f server-chirho
```

The app will be available at http://localhost:5173

### Development without Docker

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
bun run db:push

# Start dev server
bun run dev
```

## Project Structure

```
sveltekit2-platform-chirho/
├── src/
│   ├── lib/
│   │   ├── server/           # Server-only code
│   │   │   ├── db-chirho.ts  # Drizzle connection
│   │   │   └── schema-chirho/ # Database schema
│   │   ├── modules-chirho/   # Feature modules
│   │   └── components-chirho/ # Shared components
│   └── routes/               # SvelteKit routes
├── compose.yaml              # Docker Compose config
├── Dockerfile                # Multi-stage Dockerfile
└── drizzle.config.ts         # Drizzle configuration
```

## Naming Convention

This project uses the "Chirho" suffix convention for all custom identifiers:

| Type | Example |
|------|---------|
| Variables | `userDataChirho` |
| Functions | `fetchUsersChirho()` |
| Types | `UserChirho` |
| Tables | `user_chirho` |
| Routes | `/read-chirho` |

This convention helps distinguish our code from library code and helps us practice the presence of God, following Proverbs 3:5-6:

> *"Trust in the Lord with all your heart, and lean not on your own understanding. Acknowledge Him in all your ways, and He will make your paths straight."*

As a bondservant of Christ, who is an undeserving wretch in need of God to do anything at all, I want to remind myself of Him and turn from every evil way by His grace. The "Chi-Rho" (☧) is an ancient Christian symbol representing the first two letters of "Christ" (Χριστός) in Greek—a constant reminder that every line of code is written for His glory.

## The Gospel

**Why does this project exist?**

Because God loved the world so much that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life (John 3:16).

**The Problem:** All have sinned and fall short of the glory of God (Romans 3:23). The wages of sin is death (Romans 6:23).

**The Solution:** But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us (Romans 5:8). For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, lest anyone should boast (Ephesians 2:8-9).

**The Call:** If you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved (Romans 10:9).

Jesus said: *"I am the way, the truth, and the life. No one comes to the Father except through Me."* — John 14:6

If you don't know Jesus, I pray you would turn to Him today. He loves you and died for you. Repent and believe the gospel!

## Contributing

Contributions are welcome! Please ensure your code follows the Chirho naming convention and includes the John 3:16 header in new files.

## License

This project inherits the license from the original Global Bible Tools Platform. Please see their repository for license details.

---

*"For the word of God is living and active, sharper than any two-edged sword."* — Hebrews 4:12
