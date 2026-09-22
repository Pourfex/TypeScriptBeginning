# Backend CLI Projects

This repository contains two CLI Hello World applications demonstrating JavaScript and TypeScript implementations.

## Project Structure

```
backend/
├── javascript/          # Pure JavaScript CLI
│   ├── index.js         # CLI application with chalk and figlet
│   └── package.json     # Dependencies and scripts
├── typescript/          # TypeScript CLI
│   ├── src/
│   │   └── index.ts     # TypeScript CLI with classes and interfaces
│   ├── dist/            # Compiled JavaScript output
│   ├── package.json     # Dependencies and scripts
│   └── tsconfig.json    # TypeScript configuration
├── package.json         # Root package with scripts
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── start-both.sh        # Shell script for super command
└── README.md            # This file
```

## Setup

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

## Available Scripts

### Development

- `npm run start:js` - Start JavaScript CLI
- `npm run start:ts` - Build TypeScript and start CLI
- `npm run start:both` - **Super command** to run both CLIs simultaneously
- `npm run dev:js` - Start JavaScript CLI with nodemon
- `npm run dev:ts` - Start TypeScript CLI with ts-node
- `npm run dev:both` - Run both CLIs in development mode

### Building

- `npm run build:ts` - Compile TypeScript
- `npm run build:ts:watch` - Watch and compile TypeScript changes

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

## Usage

### Super Command (Run Both CLIs)

````bash
# Run both applications
npm run start:both

# Development mode
npm run dev:both

### Individual Applications

```bash
# JavaScript CLI only
npm run start:js

# TypeScript CLI only
npm run start:ts
````

### Development Mode

```bash
# JavaScript with auto-restart
npm run dev:js

# TypeScript with ts-node
npm run dev:ts
```

## Features

- ✅ JavaScript CLI with colorful output using chalk
- ✅ TypeScript CLI with proper typing and classes
- ✅ ASCII art banners using figlet
- ✅ System information display
- ✅ Graceful shutdown handling
- ✅ ESLint configuration for both JS and TS
- ✅ Prettier code formatting
- ✅ TypeScript compilation with source maps
- ✅ Concurrent execution support
- ✅ Development mode with auto-restart

## CLI Features

Both applications display:

- Stylized ASCII banner
- Colorful "Hello World" message
- Node.js version information
- Platform and architecture details
- Graceful exit handling (Ctrl+C)
