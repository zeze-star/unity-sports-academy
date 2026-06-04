# UNITY SPORTS ACADEMY — DEVELOPMENT & ARCHITECTURE BLUEPRINT

## 1. TECH STACK
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion, GSAP, Lenis (Smooth Scroll)
- **3D/Advanced**: React Three Fiber (Subtle depth/particles)
- **UI Components**: Shadcn UI, Lucide Icons
- **Backend/DB**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel

---

## 2. ARCHITECTURE & PERFORMANCE
- **Performance First**: Optimized lazy loading, GPU-accelerated animations, compressed WebP/AVIF media assets.
- **Server Components**: Use Next.js Server Components (RSC) for data fetching to ensure maximum speed.
- **Client Components**: Isolated to interactive UI elements and animation wrappers.
- **Data Hydration**: Direct Supabase integration for real-time match scores and program updates.

---

## 3. CORE FEATURES & SYSTEMS
### A. Match Management System
- **Real-time Status**: Live match cards, countdown timers.
- **Admin Control**: Fixtures, results, team scores, locations, and league standings.
- **Broadcast UI**: Animated scoreboards and live status indicators.

### B. Program Management
- **Dynamic Catalog**: Programs rendered from Supabase (Goalkeeper, Elite Conditioning, etc.).
- **Filtering**: Age category, skill focus, and schedule filters.

### C. News & Editorial System
- **CMS**: Modern editorial cards with dynamic article pages.
- **Media**: Integrated Supabase Storage for high-res sports photography.

### D. Admin Operating System (OS)
- **Aesthetic**: Dark matte "telemetry" style (Formula 1 / SaaS inspired).
- **Analytics**: Active players, revenue charts (KES), enrollment tracking.
- **Management Panels**: Specialized views for Matches, Programs, and News.

---

## 4. DESIGN ENGINEERING STANDARDS
- **Glassmorphism**: Implementation of `backdrop-blur` and liquid glass utility classes.
- **Motion System**: 
  - Standardized `framer-motion` variants for staggered reveals.
  - GSAP for high-performance complex scroll-trigger sequences.
- **Interaction**: Magnetic cursor effects and glow-tracking borders for cards.
- **Responsive**: Mobile-first design with custom hamburger animations and fluid typography.

---

## 5. DATABASE SCHEMA (Initial)
- `programs`: id, title, description, price (KES), age_bracket, duration, image_url.
- `matches`: id, team_a, team_b, team_a_score, team_b_score, date_time, location, status (upcoming, live, finished).
- `news`: id, title, content, category, author, image_url, published_at.
- `enrollments`: id, player_name, program_id, payment_status.

---

## 6. NAVIGATION STRUCTURE
- `(public)`
  - `/` (Home)
  - `/about` (About Us)
  - `/programs` (Programs Index)
  - `/programs/[slug]` (Program Details)
  - `/match-schedule` (Match Center)
  - `/pricing` (Pricing Plans)
  - `/contact` (Contact & Map)
- `(admin)`
  - `/admin` (Dashboard)
  - `/admin/matches`
  - `/admin/programs`
  - `/admin/news`
  - `/admin/settings`
