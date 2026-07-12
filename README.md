# EcoSphere AI

EcoSphere AI is a full-stack ESG and sustainability management platform built for monitoring environmental impact, managing governance and social workflows, and supporting decision-making with AI-assisted insights. The repository contains a Flask backend, a React/Vite frontend, and a set of prototype concept pages that document the product direction.

## Project Vision

The platform is organized around a centralized sustainability workspace where organizations can:

- Track carbon activity and environmental performance
- Manage ESG reporting and reporting workflows
- Review governance, social, and trust-center information
- Use gamification and AI recommendations to drive engagement
- Authenticate users and manage settings across the platform

## Repository Layout

The repository is split into three main areas:

- `EcoSphere/backend` - Flask API, models, services, blockchain helpers, and authentication
- `EcoSphere/frontend` - React application built with Vite, routing, reusable UI components, and feature pages
- `Ecosphere_360_esg_platform_prototype` - static prototype pages and design references for the broader product concept

## Main Features

### Environmental Module

The environmental module is one of the core product areas and includes:

- Carbon dashboard and analytics
- Carbon transaction listing, creation, update, deletion, and verification flows
- Carbon calculator and emission factor management
- Sustainability goals and department-level tracking
- ESG reports and AI recommendations for environmental actions

### Social Module

The social module provides a dedicated area for engagement and social impact workflows.

### Governance Module

The governance module supports policy, compliance, and oversight-related features.

### Gamification

The gamification area is used to encourage participation and progress tracking across sustainability tasks.

### Trust Center

The trust center acts as a transparency and confidence layer for the platform.

### AI Copilot

The AI copilot surface exposes AI-assisted guidance and recommendations inside the product.

### Settings and Authentication

The platform includes authentication routes and settings pages for managing user access and application preferences.

## Technology Stack

### Backend

- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-Cors
- SQLAlchemy
- PyMySQL
- Gunicorn

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Hook Form
- Recharts
- Lucide icons
- Tailwind CSS

## Backend Overview

The backend lives in `EcoSphere/backend` and exposes REST APIs under `/api/*`.

### Entry Point

- `EcoSphere/backend/run.py` creates the Flask app, registers extensions, loads blueprints, and exposes a health check endpoint.

### Blueprints

The current backend is organized into the following route groups:

- `/api/auth`
- `/api/environment`
- `/api/social`
- `/api/governance`
- `/api/gamification`
- `/api/notification`
- `/api/setting`

### Data and Services

The backend is structured around reusable service modules, models, and helper layers for:

- Authentication and user management
- Environmental tracking and ESG reporting
- Blockchain verification helpers
- Notifications and settings
- Domain-specific business logic for the different ESG modules

### Database

The application is configured to use a database URL from `DATABASE_URL` when available. If no external database is configured, it falls back to a local SQLite database for demo use.

## Frontend Overview

The frontend lives in `EcoSphere/frontend` and uses a nested route structure to organize the product experience.

### Route Groups

- Public auth pages: login, register, forgot password
- Main application shell with dashboard and module navigation
- Environmental submodule with calculator, transactions, emission factors, goals, departments, and reports
- Core ESG pages for social, governance, gamification, reports, trust center, AI copilot, and settings

### UI Structure

The frontend includes shared components for:

- Layouts and navigation
- Cards, buttons, badges, inputs, avatars, and empty states
- Charts and dashboard visualizations
- Context providers for application state, auth, theme, notifications, sidebar, user data, and ESG data

## Prototype Material

The `Ecosphere_360_esg_platform_prototype` folder contains concept pages for product exploration. These files are useful as design references, feature inspiration, and presentation material.

## Local Setup

### Backend

1. Open a terminal in `EcoSphere/backend`.
2. Create and activate a Python environment.
3. Install dependencies from `requirements.txt`.
4. Run the Flask application through `run.py`.

Example:

```bash
cd EcoSphere/backend
pip install -r requirements.txt
python run.py
```

### Frontend

1. Open a terminal in `EcoSphere/frontend`.
2. Install dependencies with npm.
3. Start the Vite development server.

Example:

```bash
cd EcoSphere/frontend
npm install
npm run dev
```

## Environment Variables

The backend supports the following environment variables:

- `SECRET_KEY`
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `CORS_ORIGINS`

If these are not supplied, the backend uses safe demo defaults for local development.

## API Notes

Some key backend endpoints include:

- `GET /health` - service health check
- `POST /api/auth/register` - create a new account
- `POST /api/auth/login` - sign in and receive JWT tokens
- `GET /api/auth/me` - fetch the authenticated user
- `GET /api/environment/dashboard` - environmental summary and AI insights
- `GET /api/environment/carbon` - list carbon transactions
- `POST /api/environment/carbon/calculate` - calculate and store carbon data
- `GET /api/environment/emission-factors` - list emission factors
- `GET /api/environment/goals` - list sustainability goals
- `GET /api/environment/reports` - list ESG reports

## Development Notes

- The backend auto-creates tables on startup for demo-friendly local development.
- JWT authentication is used for protected user routes.
- CORS is enabled for `/api/*` routes.
- The frontend uses client-side routing to separate public pages from protected application views.

## Suggested Next Improvements

- Add a dedicated API reference with request and response examples
- Document environment setup with `.env` examples for both backend and frontend
- Add screenshots for the main dashboard and module pages
- Expand the prototype folder documentation with design goals and page ownership

