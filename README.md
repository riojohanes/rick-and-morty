# Rick & Morty Character Hub

Single Page Application (SPA) built with React + Vite + TypeScript that lets you browse characters from [rickandmortyapi.com](https://rickandmortyapi.com/graphql), inspect their details, and assign them to custom locations stored locally on your device.

## Key Features

- **Characters List** – paginated, mobile-first gallery with search debounce and status badges.
- **Character Detail** – full character bio, episode highlights, and a workflow to assign/unassign the character to a user-defined location.
- **Characters by Location** – dynamic view that groups assigned characters per custom location. Data persists via `localStorage`, so refreshes keep your assignments intact.
- **Architecture** – MVVM-inspired structure: React pages consume dedicated ViewModels, while GraphQL calls are centralized in `services/`.

## Tech Stack

- React 19 + Vite + TypeScript
- React Router DOM for SPA navigation
- Apollo Client for GraphQL data access
- Local storage persistence through `LocationAssignmentsProvider`
- Utility helpers: `clsx`, custom hooks (debounce, localStorage state)

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation & Development

```bash
npm install
npm run dev
```

Visit the printed URL (default `http://localhost:5173`) to use the app.

### Production Build

```bash
npm run build
npm run preview
```

`npm run build` runs `tsc -b` and `vite build`, generating static assets inside `dist/`. `npm run preview` serves that build locally.

## Directory Guide

| Path | Description |
| --- | --- |
| `src/pages/` | Route-level views. Each page imports its matching ViewModel. |
| `src/viewmodels/` | Encapsulate UI state, GraphQL data, and actions per page (MVVM). |
| `src/services/` | Apollo-powered hooks that fetch data from the Rick & Morty GraphQL API. |
| `src/providers/LocationAssignmentsProvider.tsx` | Local storage-backed store that keeps character/location assignments. |
| `src/components/` | Presentational components (cards, badges, layout helpers). |
| `src/hooks/` | Reusable hooks (`useDebouncedValue`, `useLocalStorageState`). |

## Data & Persistence

- All remote data comes from `https://rickandmortyapi.com/graphql`. No API key needed, but respect public rate limits.
- Custom locations and assignments are saved under the `localStorage` key `rm-location-assignments`. Clearing browser storage resets them.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR. |
| `npm run build` | Type-check (via `tsc -b`) and create production bundle. |
| `npm run preview` | Serve the production build locally. |

## Extending the App

- Add more ViewModels under `src/viewmodels/` to keep stateful logic isolated.
- Introduce new GraphQL queries/mutations inside `src/services/` to expose typed hooks for consumption by ViewModels.
- Colors, spacing, and responsive tweaks live in `src/index.css`.

Feel free to open issues or send improvements that keep the MVVM structure and clean-code principles intact. Have fun exploring the multiverse! 🚀🛸
