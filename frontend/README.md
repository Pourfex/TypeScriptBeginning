# Frontend Projects

This repository contains two Hello World projects demonstrating JavaScript and TypeScript implementations for web browsers.

## Project Structure

```
frontend/
├── javascript/          # Pure JavaScript project
│   ├── index.html      # HTML with styled container
│   ├── style.css       # Modern CSS with blue gradient
│   └── script.js       # JavaScript to display "Hello World"
├── typescript/          # TypeScript project
│   ├── src/
│   │   └── script.ts   # TypeScript with classes and interfaces
│   ├── dist/           # Compiled JavaScript output
│   ├── index.html      # HTML linking to compiled JS
│   ├── style.css       # Modern CSS with orange gradient
│   └── tsconfig.json   # TypeScript configuration
├── package.json        # All dependencies and scripts
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
└── README.md           # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

### Development

- `npm run start:js` - Start JavaScript project on port 3000
- `npm run start:ts` - Build TypeScript and start on port 3001
- `npm run start:both` - **Super command** to run both projects simultaneously
- `npm run dev:ts` - Watch TypeScript changes and serve

### Building

- `npm run build:ts` - Compile TypeScript
- `npm run build:ts:watch` - Watch and compile TypeScript changes

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

### Individual Servers

- `npm run serve:js` - Serve JavaScript project only
- `npm run serve:ts` - Serve TypeScript project only

## Usage

### Quick Start (Both Projects)

```bash
npm run start:both
```

This will open:

- JavaScript project: http://localhost:3000
- TypeScript project: http://localhost:3001

### Individual Projects

```bash
# JavaScript only
npm run start:js

# TypeScript only
npm run start:ts
```

## Features

- ✅ Pure JavaScript Hello World with DOM manipulation
- ✅ TypeScript Hello World with proper typing and classes
- ✅ ESLint configuration for both JS and TS
- ✅ Prettier code formatting
- ✅ TypeScript compilation with source maps
- ✅ HTTP server for both projects
- ✅ Concurrent execution support
- ✅ Modern CSS with gradients and responsive design

## Project Details

### JavaScript Project

- **URL**: http://localhost:3000
- **Features**: Simple DOM manipulation, modern CSS styling
- **Color Scheme**: Blue gradient background
- **Technology**: Vanilla JavaScript + HTML + CSS

### TypeScript Project

- **URL**: http://localhost:3001
- **Features**: Object-oriented approach with interfaces and classes
- **Color Scheme**: Orange gradient background
- **Technology**: TypeScript (compiled to JavaScript) + HTML + CSS
- **Compilation**: Automatic TypeScript compilation with source maps

Both projects demonstrate the same "Hello World" functionality but showcase different approaches and technologies for web development.
