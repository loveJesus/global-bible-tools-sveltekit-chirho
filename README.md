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

This convention helps distinguish our code from library code and ensures consistency across the codebase.

## Contributing

Contributions are welcome! Please ensure your code follows the Chirho naming convention and includes the John 3:16 header in new files.

## License

This project inherits the license from the original Global Bible Tools Platform. Please see their repository for license details.

---

*"For the word of God is living and active, sharper than any two-edged sword."* — Hebrews 4:12
