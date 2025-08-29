# Tawredah E‑Commerce (Front‑End)

A modern, production‑ready e‑commerce front‑end built with Angular. It delivers a fast, responsive shopping experience with authentication, product discovery, cart & checkout flows, wishlist, user profile, order history, notifications, and a supplier portal for product management.

- Live Deployment: [tawredah-e-commerce-fzwk-delta.vercel.app](https://tawredah-e-commerce-fzwk-delta.vercel.app/)
- Status: Actively developed — admin role and subscriptions are in progress.

## Overview
This application focuses on a seamless shopping journey:
- Browse and search a rich product catalog
- Filter, sort, and view detailed product information
- Add to cart, manage quantities, and proceed to checkout
- Save items to a wishlist
- Authenticate, manage profile, and review past orders
- Receive notifications
- Supplier portal for inventory and order management

## Key Features
- Authentication & Authorization
  - Email/password login and registration
  - Session persistence
  - Route protection and role‑based access (customer, supplier; admin WIP)

- Product Discovery
  - Landing experience with banners and sliders
  - Category and keyword search
  - Sidebar filters (price ranges, categories, etc.)
  - Product cards and product detail pages with similar items

- Shopping Cart & Checkout
  - Cart sidebar overlay and full cart page
  - Quantity updates and removals
  - Checkout flow with address/contact capture and order review
  - Order confirmation and status feedback

- Wishlist
  - Save products to revisit later
  - Empty‑state UX for clarity

- User Profile & Orders
  - Profile details and account management
  - Past orders view and order detail
  - Notifications center

- Supplier Portal
  - Supplier dashboard overview
  - Product list, inventory management, and add product flow
  - Recent orders and customization requests management

- Requested Products
  - Dedicated views for requested products and request submission
  - Requested product detail exploration

- UI/UX
  - Responsive, mobile‑first design
  - Reusable components (navigation, sliders, banners, product cards)
  - Loading states and skeletons

- Performance & Quality
  - Lazy‑loaded pages and components where applicable
  - Route guards and interceptors for robust flows
  - Modular services and state stores for predictable data flow

## Architecture & Technology
- Angular (standalone components, modern Angular patterns)
- TypeScript for strong typing and maintainability
- RxJS for reactive programming where appropriate
- Client‑side state stores for session, products, and templates
- Services for API/data access, authentication, and domain logic
- Guards for route protection, redirection, and form deactivation
- Pipes and directives for view utilities
- Environment‑based configuration (e.g., API base, Firebase keys)

## Application Structure (High‑Level)
Without referencing specific directory names, the application is organized around:
- Core application bootstrap and configuration
- Layouts for public, authenticated, admin/supplier contexts
- Pages for major user journeys (landing, search, product details, cart, checkout, wishlist, profile, orders, notifications, supplier)
- Shared components (navigation, sliders, lists, cards, filters, banners, loading, forms)
- Core layer for guards, interceptors, services, models, and state
- Shared utilities like pipes and directives
- Global styles, fonts, and assets

## State Management
- Lightweight store modules for login/session, products, and template data
- Clear read/update flows via services and stores
- Optimistic UI patterns where suitable

## Routing & Guards
- Public routes for browsing and discovery
- Protected routes for profile, orders, and supplier tools
- Redirection for authenticated/unauthenticated flows
- Form deactivation guard to prevent accidental data loss

## Styling & Theming
- Component‑scoped styles alongside global styles
- Reusable CSS variables for consistent theming
- Responsiveness validated across mobile, tablet, and desktop

## Integrations
- Firebase authentication and hosting configuration supported
- Pluggable API layer for product, cart, and order endpoints
- Ready for third‑party analytics and error reporting

## Getting Started
Prerequisites:
- Node.js (LTS recommended)
- npm or yarn

Setup:
1. Clone the repository.
2. Install dependencies:
   - npm: `npm install`
   - yarn: `yarn install`
3. Create environment files for your local settings (API base URL, Firebase keys, etc.).
4. Start the development server:
   - npm: `npm start` or `ng serve`
   - yarn: `yarn start`

Build:
- Production build: `ng build --configuration production`

Testing:
- Unit tests (if configured): `ng test`
- E2E tests (if configured): `ng e2e`

## Deployment
The application is deployed and accessible at:
- Production: [https://tawredah-e-commerce-fzwk-delta.vercel.app/](https://tawredah-e-commerce-fzwk-delta.vercel.app/)

Typical steps to deploy:
1. Build production artifacts.
2. Upload/serve the `dist` output with your hosting provider (e.g., Vercel).
3. Configure environment variables and rewrites as needed.

## Roadmap
- Admin Role: Advanced dashboards, moderation, user and content management (in progress)
- Subscriptions: Plan management, billing integration, and entitlements (in progress)
- Enhanced analytics and observability
- Expanded product filters and personalized recommendations
- Accessibility refinements and audits

## Contributing
1. Create a new branch for your feature/fix.
2. Write clear, self‑documenting TypeScript and Angular code.
3. Ensure builds pass and follow the existing formatting and linting standards.
4. Open a pull request with a concise description and screenshots as relevant.

## License
This project’s license will be defined by the maintainers. Until then, treat it as “All Rights Reserved.”

## Acknowledgements
- Angular, TypeScript, and the open‑source ecosystem
- Firebase for authentication and hosting support

## Links
- Live Site: [tawredah-e-commerce-fzwk-delta.vercel.app](https://tawredah-e-commerce-fzwk-delta.vercel.app/)
