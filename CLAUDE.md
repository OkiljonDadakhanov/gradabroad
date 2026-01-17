# University Dashboard

## Tech Stack
- **Framework:** Next.js 15.2.4 with App Router
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS 3.4, shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** npm

## Development
```bash
npm run dev      # Start dev server (use port 3001)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Project Structure
```
app/             # Next.js App Router pages
components/      # React components (ui/ for shadcn)
hooks/           # Custom React hooks
lib/             # Utilities (fetchWithAuth.ts)
types/           # TypeScript interfaces
```

## Environment Variables (.env.local)
```
NEXT_PUBLIC_API_BASE=http://localhost
```

## API Integration
- Fetch wrapper in `lib/fetchWithAuth.ts`
- JWT tokens stored in localStorage
- Auto token refresh on 401

## Key Pages
```
/candidates      # View and manage applicants
/academic-programs # Manage university programs
/scholarships    # Manage scholarships
/profile         # University profile
```
