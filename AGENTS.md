## Project Summary
A cloned version of broomees.com, a domestic help service platform, customized with a specific blue color palette. The project features a modern, clean UI with sections for hero banners, featured services, highlights, customer testimonials, FAQs, and application promotion.

## Tech Stack
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Icons: Lucide React
- Fonts: Inter

## Architecture
- `src/app/`: Contains the main page and global styles.
- `src/components/sections/`: Modular components for each section of the website.
- `src/components/ui/`: Reusable UI components.

## User Preferences
- Theme: Light theme with a specific blue palette (Blues: #72bcd4, #8ad4f1, #ace5f8, #c7f0fd, #e1faff).
- Typography: Inter font family.

## Project Guidelines
- Use `"use client";` for components using React hooks or `styled-jsx`.
- Follow the modular section pattern for the home page.
- Maintain visual consistency with the provided blue palette.

## Common Patterns
- Each section is encapsulated in its own component within `src/components/sections/`.
- Global colors are defined in `src/app/globals.css` using CSS variables.
