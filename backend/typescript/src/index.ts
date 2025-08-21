#!/usr/bin/env node

/**
 * IGN WMS Image Fetcher CLI
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface WMSOptions {
  epsg: string;
  bbox: string;
  layers: string;
  outputDir: string;
  width?: number;
  height?: number;
  format?: string;
}

class IGNWMSFetcher {
  private readonly baseUrl = 'https://data.geopf.fr/wms-r';

  constructor() {}

  private buildWMSUrl(options: WMSOptions): string {
    const params = new URLSearchParams({
      SERVICE: 'WMS',
      REQUEST: 'GetMap',
      LAYERS: options.layers,
      VERSION: '1.3.0',
      STYLES: '',
      FORMAT: options.format || 'image/png',
      TRANSPARENT: 'false',
      BBOX: options.bbox,
      CRS: options.epsg,
      WIDTH: (options.width || 4096).toString(),
      HEIGHT: (options.height || 4096).toString(),
    });

    return `${this.baseUrl}?${params.toString()}`;
  }

  private validateBBox(bbox: string): boolean {
    const coords = bbox.split(',').map(Number);
    return coords.length === 4 && coords.every(coord => !isNaN(coord));
  }

  private validateEPSG(epsg: string): boolean {
    return /^EPSG:\d+$/.test(epsg);
  }

  private generateFileName(options: WMSOptions): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = options.format === 'image/jpeg' ? 'jpg' : 'png';
    return `ign_wms_${options.epsg.replace(':', '_')}_${timestamp}.${extension}`;
  }

  public async fetchImage(options: WMSOptions): Promise<void> {
    try {
      // Validate inputs
      if (!this.validateEPSG(options.epsg)) {
        throw new Error('Invalid EPSG code format. Expected format: EPSG:XXXX');
      }

      if (!this.validateBBox(options.bbox)) {
        throw new Error('Invalid bounding box format. Expected format: minX,minY,maxX,maxY');
      }

      // Ensure output directory exists
      if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir, { recursive: true });
        console.log(chalk.green(`✅ Created output directory: ${options.outputDir}`));
      }

      // Build WMS URL
      const url = this.buildWMSUrl(options);
      console.log(chalk.blue(`🌐 Fetching from: ${url}`));

      // Fetch image
      console.log(chalk.yellow('⏳ Downloading image...'));
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      // Get image buffer
      const buffer = await response.buffer();

      // Generate filename and save
      const fileName = this.generateFileName(options);
      const filePath = path.join(options.outputDir, fileName);
      
      fs.writeFileSync(filePath, buffer);

      console.log(chalk.green(`✅ Image saved successfully: ${filePath}`));
      console.log(chalk.cyan(`📊 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`));

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  }
}

interface ParsedArgs {
  epsg?: string;
  bbox?: string;
  layers?: string;
  outputDir?: string;
  width?: string;
  height?: string;
  format?: string;
  help?: boolean;
}

function showHelp(): void {
  console.log(chalk.blue.bold('IGN WMS Image Fetcher CLI'));
  console.log(chalk.gray('CLI tool to fetch images from IGN WMS service\n'));
  
  console.log(chalk.yellow('Usage:'));
  console.log('  ign-wms-fetcher [options]\n');
  
  console.log(chalk.yellow('Required Options:'));
  console.log('  -e, --epsg <code>         EPSG coordinate system code (e.g., EPSG:3946)');
  console.log('  -b, --bbox <coordinates>  Bounding box coordinates (minX,minY,maxX,maxY)');
  console.log('  -l, --layers <layers>     WMS layers to request (e.g., HR.ORTHOIMAGERY.ORTHOPHOTOS)');
  console.log('  -o, --output-dir <path>   Output directory for the image\n');
  
  console.log(chalk.yellow('Optional:'));
  console.log('  -w, --width <pixels>      Image width in pixels (default: 4096)');
  console.log('  -h, --height <pixels>     Image height in pixels (default: 4096)');
  console.log('  -f, --format <format>     Image format (image/png or image/jpeg) (default: image/png)');
  console.log('  --help                    Show this help message\n');
  
  console.log(chalk.yellow('Example:'));
  console.log('  ign-wms-fetcher -e "EPSG:3946" -b "1840716.94,5177312.83,1840916.94,5177512.83" \\');
  console.log('                  -l "HR.ORTHOIMAGERY.ORTHOPHOTOS" -o "./images"\n');
}

function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '-e':
      case '--epsg':
        parsed.epsg = nextArg;
        i++;
        break;
      case '-b':
      case '--bbox':
        parsed.bbox = nextArg;
        i++;
        break;
      case '-l':
      case '--layers':
        parsed.layers = nextArg;
        i++;
        break;
      case '-o':
      case '--output-dir':
        parsed.outputDir = nextArg;
        i++;
        break;
      case '-w':
      case '--width':
        parsed.width = nextArg;
        i++;
        break;
      case '-h':
      case '--height':
        parsed.height = nextArg;
        i++;
        break;
      case '-f':
      case '--format':
        parsed.format = nextArg;
        i++;
        break;
      case '--help':
        parsed.help = true;
        break;
    }
  }
  
  return parsed;
}

function validateRequiredArgs(args: ParsedArgs): string[] {
  const errors: string[] = [];
  
  if (!args.epsg) errors.push('Missing required argument: --epsg');
  if (!args.bbox) errors.push('Missing required argument: --bbox');
  if (!args.layers) errors.push('Missing required argument: --layers');
  if (!args.outputDir) errors.push('Missing required argument: --output-dir');
  
  return errors;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  
  // Show help if requested or no arguments
  if (args.help || process.argv.length <= 2) {
    showHelp();
    return;
  }
  
  // Validate required arguments
  const errors = validateRequiredArgs(args);
  if (errors.length > 0) {
    console.error(chalk.red('Error: ' + errors.join(', ')));
    console.log(chalk.gray('\nUse --help to see usage information.'));
    process.exit(1);
  }
  
  // Create WMS options with defaults
  const wmsOptions: WMSOptions = {
    epsg: args.epsg!,
    bbox: args.bbox!,
    layers: args.layers!,
    outputDir: args.outputDir!,
    width: parseInt(args.width || '4096'),
    height: parseInt(args.height || '4096'),
    format: args.format || 'image/png',
  };
  
  // Fetch the image
  const fetcher = new IGNWMSFetcher();
  await fetcher.fetchImage(wmsOptions);
}

// Handle graceful shutdown
process.on('SIGINT', (): void => {
  console.log(chalk.red('\n👋 Goodbye!'));
  process.exit(0);
});

// Run the application
main().catch((error) => {
  console.error(chalk.red(`❌ Unexpected error: ${error.message}`));
  process.exit(1);
});
