#!/usr/bin/env node

/**
 * IGN WMS Image Fetcher CLI
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import proj4 from 'proj4';

interface WMSOptions {
  epsg: string;
  bbox: string;
  layers: string;
  outputDir: string;
  width?: number;
  height?: number;
  format?: string;
}

interface GeocodingResponse {
  type: string;
  features: GeocodingFeature[];
}

interface GeocodingFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    type: string;
    importance: number;
  };
}

interface EPSGZone {
  code: string;
  name: string;
  bounds: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
  description: string;
}

class EPSGDetector {
  private readonly frenchZones: EPSGZone[] = [
    // CC zones are latitude-based bands (simplified approach - use latitude only)
    {
      code: 'EPSG:3942',
      name: 'RGF93 / CC42',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 41.0, maxLat: 43.0 },
      description: 'Zone 42: Latitude band 41°N-43°N (Corsica, extreme south)'
    },
    {
      code: 'EPSG:3943',
      name: 'RGF93 / CC43',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 42.0, maxLat: 44.0 },
      description: 'Zone 43: Latitude band 42°N-44°N (Pyrénées, Languedoc)'
    },
    {
      code: 'EPSG:3944',
      name: 'RGF93 / CC44',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 43.0, maxLat: 45.0 },
      description: 'Zone 44: Latitude band 43°N-45°N (Toulouse, Montpellier)'
    },
    {
      code: 'EPSG:3945',
      name: 'RGF93 / CC45',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 44.0, maxLat: 46.0 },
      description: 'Zone 45: Latitude band 44°N-46°N (Lyon, Bordeaux)'
    },
    {
      code: 'EPSG:3946',
      name: 'RGF93 / CC46',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 45.0, maxLat: 47.0 },
      description: 'Zone 46: Latitude band 45°N-47°N (Lyon, Dijon)'
    },
    {
      code: 'EPSG:3947',
      name: 'RGF93 / CC47',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 46.0, maxLat: 48.0 },
      description: 'Zone 47: Latitude band 46°N-48°N (Besançon, Châlons)'
    },
    {
      code: 'EPSG:3948',
      name: 'RGF93 / CC48',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 47.0, maxLat: 49.0 },
      description: 'Zone 48: Latitude band 47°N-49°N (Paris, Strasbourg)'
    },
    {
      code: 'EPSG:3949',
      name: 'RGF93 / CC49',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 48.0, maxLat: 50.0 },
      description: 'Zone 49: Latitude band 48°N-50°N (Reims, Metz)'
    },
    {
      code: 'EPSG:3950',
      name: 'RGF93 / CC50',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 49.0, maxLat: 51.5 },
      description: 'Zone 50: Latitude band 49°N-51.5°N (Lille, northern France)'
    }
  ];

  public detectEPSG(longitude: number, latitude: number): EPSGZone | undefined {    
    // For metropolitan France, find the most appropriate CC zone based on latitude
    // CC zones overlap, so we need to find the one where the latitude is closest to the center
    const ccZones = this.frenchZones.filter(z => z.code.startsWith('EPSG:39'));
    
    if (latitude >= 41.0 && latitude <= 51.5 && longitude >= -5.5 && longitude <= 10.0) {
      // Find the CC zone where the latitude is most centered
      let bestZone = ccZones[0];
      let smallestDistance = Number.MAX_VALUE;
      
      for (const zone of ccZones) {
        if (latitude >= zone.bounds.minLat && latitude <= zone.bounds.maxLat) {
          const centerLat = (zone.bounds.minLat + zone.bounds.maxLat) / 2;
          const distance = Math.abs(latitude - centerLat);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            bestZone = zone;
          }
        }
      }
      
      // If we found a good CC zone match, return it
      if (smallestDistance < Number.MAX_VALUE) {
        return bestZone;
      }
    }
    return undefined;
  }

  public getAllZones(): EPSGZone[] {
    return [...this.frenchZones];
  }
}

class CoordinateTransformer {
  constructor() {
    // Define WGS84
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    
    // Define CC zones (Conical Conformal zones)
    proj4.defs('EPSG:3942', '+proj=lcc +lat_1=41.25 +lat_2=42.75 +lat_0=42 +lon_0=3 +x_0=1700000 +y_0=1200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3943', '+proj=lcc +lat_1=42.25 +lat_2=43.75 +lat_0=43 +lon_0=3 +x_0=1700000 +y_0=2200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3944', '+proj=lcc +lat_1=43.25 +lat_2=44.75 +lat_0=44 +lon_0=3 +x_0=1700000 +y_0=3200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3945', '+proj=lcc +lat_1=44.25 +lat_2=45.75 +lat_0=45 +lon_0=3 +x_0=1700000 +y_0=4200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3947', '+proj=lcc +lat_1=46.25 +lat_2=47.75 +lat_0=47 +lon_0=3 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3948', '+proj=lcc +lat_1=47.25 +lat_2=48.75 +lat_0=48 +lon_0=3 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3949', '+proj=lcc +lat_1=48.25 +lat_2=49.75 +lat_0=49 +lon_0=3 +x_0=1700000 +y_0=8200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    proj4.defs('EPSG:3950', '+proj=lcc +lat_1=49.25 +lat_2=50.75 +lat_0=50 +lon_0=3 +x_0=1700000 +y_0=9200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
  }

  public transformFromWGS84(longitude: number, latitude: number, targetEPSG: string): [number, number] {
    const sourceProj = 'EPSG:4326'; // WGS84
    const result = proj4(sourceProj, targetEPSG, [longitude, latitude]);
    return [result[0], result[1]];
  }

  public createBoundingBox(centerX: number, centerY: number, radiusMeters: number): string {
    const minX = centerX - radiusMeters;
    const minY = centerY - radiusMeters;
    const maxX = centerX + radiusMeters;
    const maxY = centerY + radiusMeters;
    
    return `${minX},${minY},${maxX},${maxY}`;
  }
}

class IGNGeocoder {
  private readonly baseUrl = 'https://data.geopf.fr/geocodage';

  constructor() {}

  public async searchAddress(query: string): Promise<GeocodingFeature | null> {
    try {
      const params = new URLSearchParams({
        q: query,
        autocomplete: '1',
        index: 'address',
        limit: '10',
        returntruegeometry: 'true'
      });

      const url = `${this.baseUrl}/search?${params.toString()}`;
      console.log(chalk.blue(`🔍 Searching for: ${query}`));
      console.log(chalk.gray(`URL: ${url}`));

      const response = await fetch(url, {
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data: GeocodingResponse = await response.json();
      
      if (data.features && data.features.length > 0) {
        const firstResult = data.features[0];
        console.log(chalk.green(`✅ Found address: ${firstResult.properties.label}`));
        console.log(chalk.cyan(`📍 Coordinates (WGS84): ${firstResult.geometry.coordinates[0]}, ${firstResult.geometry.coordinates[1]}`));
        console.log(chalk.yellow(`⭐ Score: ${firstResult.properties.score}`));
        console.log(chalk.magenta(`🏙️  City: ${firstResult.properties.city}`));
        console.log(chalk.gray(`📮 Postcode: ${firstResult.properties.postcode}`));
        
        return firstResult;
      } else {
        console.log(chalk.red('❌ No results found'));
        return null;
      }

    } catch (error) {
      console.error(chalk.red(`❌ Geocoding error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


async function main(): Promise<void> {
  console.log(chalk.blue.bold('🗺️  IGN WMS Complete Workflow'));
  console.log('═'.repeat(60));
  
  // Get address from command line arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(chalk.red('❌ Please provide an address as argument'));
    console.log(chalk.yellow('Usage: node dist/index.js "your address here"'));
    console.log(chalk.gray('Example: node dist/index.js "4 rue alfred kestler"'));
    return;
  }
  
  const address = args.join(' '); // Join all arguments to handle addresses with spaces
  
  // Step 1: Geocode the address
  console.log(chalk.yellow(`📍 Step 1: Geocoding address "${address}"...`));
  const geocoder = new IGNGeocoder();
  const result = await geocoder.searchAddress(address);
  
  if (!result) {
    console.log(chalk.red('❌ No geocoding result found'));
    return;
  }
  
  const [longitude, latitude] = result.geometry.coordinates;
  console.log(chalk.green(`✅ Found: ${result.properties.label}`));
  console.log(chalk.cyan(`🌍 WGS84 coordinates: ${longitude}, ${latitude}`));
  
  // Step 2: Detect appropriate EPSG code
  console.log('\n' + chalk.yellow('🎯 Step 2: Detecting optimal EPSG code...'));
  const epsgDetector = new EPSGDetector();
  const detectedZone = epsgDetector.detectEPSG(longitude, latitude);
  if (!detectedZone) {
    console.log(chalk.red('❌ No detected zone found'));
    return;
  }
  console.log(chalk.green(`✅ Selected EPSG: ${detectedZone.code}`));
  console.log(chalk.gray(`📝 ${detectedZone.description}`));
  
  // Step 3: Transform coordinates and create bounding box
  console.log('\n' + chalk.yellow('🔄 Step 3: Transforming coordinates...'));
  const transformer = new CoordinateTransformer();
  const [projectedX, projectedY] = transformer.transformFromWGS84(longitude, latitude, detectedZone.code);
  
  console.log(chalk.cyan(`🎯 Projected coordinates (${detectedZone.code}): ${projectedX.toFixed(2)}, ${projectedY.toFixed(2)}`));
  
  // Create 100m bounding box around the point
  const bbox = transformer.createBoundingBox(projectedX, projectedY, 100);
  console.log(chalk.magenta(`📦 100m bounding box: ${bbox}`));
  
  // Step 4: Fetch WMS image
  console.log('\n' + chalk.yellow('🖼️  Step 4: Fetching WMS image...'));
  
  const outputDir = '/tmp/ign-complete-workflow';
  const wmsOptions: WMSOptions = {
    epsg: detectedZone.code,
    bbox: bbox,
    layers: 'HR.ORTHOIMAGERY.ORTHOPHOTOS',
    outputDir: outputDir,
    width: 4096,
    height: 4096,
    format: 'image/png'
  };
  
  const wmsFetcher = new IGNWMSFetcher();
  await wmsFetcher.fetchImage(wmsOptions);
  
  console.log('\n' + chalk.green.bold('🎉 Complete workflow finished successfully!'));
  console.log(chalk.blue('📋 Summary:'));
  console.log(chalk.gray(`   Address: ${result.properties.label}`));
  console.log(chalk.gray(`   EPSG: ${detectedZone.code}`));
  console.log(chalk.gray(`   Bbox: ${bbox}`));
  console.log(chalk.gray(`   Output: ${outputDir}`));
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
