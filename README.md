# Norwegian Singles Method

A static website for the Norwegian Singles Method, a counterintuitive approach to distance running. Built with Next.js 14, Tailwind CSS, and MDX.

## Features

- Single-page scrolling layout with sticky sidebar navigation
- MDX support for content sections
- Glossary terms with tooltips and localStorage tracking
- Email gate for content unlocking
- Responsive design with mobile support
- Clean, minimalist styling with Inter font

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory
  - `components/` - React components
  - `page.tsx` - Main page component
  - `layout.tsx` - Root layout
  - `globals.css` - Global styles
- `public/` - Static assets
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## Development

- The site uses Tailwind CSS for styling
- MDX files can be added to the `app/content/` directory
- Components are written in TypeScript
- The email gate uses localStorage for persistence
- The glossary system tracks seen terms in localStorage

## Building for Production

```bash
npm run build
```

## License

MIT 