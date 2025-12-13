# ZenGlow Skincare - Frontend

This is the frontend application for ZenGlow Skincare, built with Next.js 15, React 19, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15.1.3 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── sections/     # Page sections (Hero, Footer, etc.)
│   │   └── ui/          # Reusable UI components
│   ├── context/         # React context providers
│   └── data/            # Static data and content
├── public/              # Static assets
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create a production build
npm run build

# Start the production server
npm start
```

## Features

- Modern, responsive design with premium aesthetics
- Product showcase and shopping functionality
- Dynamic routing for product details
- Optimized images and performance
- SEO-friendly structure

## Environment Variables

Create a `.env.local` file in the frontend directory if you need to configure any environment-specific variables.

## Deployment

This application is configured for deployment on Vercel. Simply connect your repository to Vercel and it will automatically deploy on push to main.

## Development Notes

- The application uses the Next.js App Router (not Pages Router)
- All components are React Server Components by default unless marked with 'use client'
- Styling follows a modern design system with Tailwind CSS
