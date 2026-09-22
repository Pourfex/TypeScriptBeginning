#!/usr/bin/env node

/**
 * JavaScript CLI Hello World Application
 */

import chalk from 'chalk';
import figlet from 'figlet';

function displayBanner() {
  console.log(
    chalk.blue(
      figlet.textSync('JS CLI', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
}

function displayHelloWorld() {
  console.log(chalk.green.bold('🚀 Hello World from JavaScript CLI!'));
  console.log(chalk.yellow('📦 Running on Node.js version:'), process.version);
  console.log(chalk.cyan('⚡ Platform:'), process.platform);
  console.log(chalk.magenta('💻 Architecture:'), process.arch);
}

function main() {
  console.clear();
  displayBanner();
  console.log('\n');
  displayHelloWorld();
  console.log('\n');
  console.log(chalk.gray('Press Ctrl+C to exit'));
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.red('\n👋 Goodbye from JavaScript CLI!'));
  process.exit(0);
});

// Run the application
main();
