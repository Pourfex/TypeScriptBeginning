// IGN WMS Image Fetcher - Frontend Version
// Copied and adapted from backend code

interface WMSOptions {
  epsg: string;
  bbox: string;
  layers: string;
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
    {
      code: 'EPSG:2154',
      name: 'RGF93 / Lambert-93',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 41.0, maxLat: 51.5 },
      description: 'Metropolitan France (official projection for all of France)'
    },
    {
      code: 'EPSG:3942',
      name: 'RGF93 / CC42',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 41.0, maxLat: 43.0 },
      description: 'Zone 42: Latitude band 41°N-43°N'
    },
    {
      code: 'EPSG:3943',
      name: 'RGF93 / CC43',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 42.0, maxLat: 44.0 },
      description: 'Zone 43: Latitude band 42°N-44°N'
    },
    {
      code: 'EPSG:3944',
      name: 'RGF93 / CC44',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 43.0, maxLat: 45.0 },
      description: 'Zone 44: Latitude band 43°N-45°N'
    },
    {
      code: 'EPSG:3945',
      name: 'RGF93 / CC45',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 44.0, maxLat: 46.0 },
      description: 'Zone 45: Latitude band 44°N-46°N'
    },
    {
      code: 'EPSG:3946',
      name: 'RGF93 / CC46',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 45.0, maxLat: 47.0 },
      description: 'Zone 46: Latitude band 45°N-47°N'
    },
    {
      code: 'EPSG:3947',
      name: 'RGF93 / CC47',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 46.0, maxLat: 48.0 },
      description: 'Zone 47: Latitude band 46°N-48°N'
    },
    {
      code: 'EPSG:3948',
      name: 'RGF93 / CC48',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 47.0, maxLat: 49.0 },
      description: 'Zone 48: Latitude band 47°N-49°N'
    },
    {
      code: 'EPSG:3949',
      name: 'RGF93 / CC49',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 48.0, maxLat: 50.0 },
      description: 'Zone 49: Latitude band 48°N-50°N'
    },
    {
      code: 'EPSG:3950',
      name: 'RGF93 / CC50',
      bounds: { minLon: -5.5, maxLon: 10.0, minLat: 49.0, maxLat: 51.5 },
      description: 'Zone 50: Latitude band 49°N-51.5°N'
    }
  ];

  public detectEPSG(longitude: number, latitude: number): EPSGZone {
    // Find the most appropriate CC zone based on latitude
    const ccZones = this.frenchZones.filter(z => z.code.startsWith('EPSG:39'));
    
    if (latitude >= 41.0 && latitude <= 51.5 && longitude >= -5.5 && longitude <= 10.0) {
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
      
      if (smallestDistance < Number.MAX_VALUE) {
        return bestZone;
      }
    }

    // Fallback to Lambert-93
    return this.frenchZones.find(z => z.code === 'EPSG:2154')!;
  }
}

class CoordinateTransformer {
  constructor() {
    const proj4 = (window as any).proj4;
    
    proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
    proj4.defs('EPSG:2154', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
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
    const proj4 = (window as any).proj4;
    const sourceProj = 'EPSG:4326';
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
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0];
      } else {
        return null;
      }

    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
}

class IGNWMSFetcher {
  private readonly baseUrl = 'https://data.geopf.fr/wms-r';

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

  private generateFileName(options: WMSOptions): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = options.format === 'image/jpeg' ? 'jpg' : 'png';
    return `ign_wms_${options.epsg.replace(':', '_')}_${timestamp}.${extension}`;
  }

  public async fetchImage(options: WMSOptions): Promise<void> {
    try {
      const url = this.buildWMSUrl(options);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = this.generateFileName(options);
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      throw new Error(`WMS fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// UI Management
class UIManager {
  private statusElement: HTMLElement;
  private progressElement: HTMLElement;
  private fetchButton: HTMLButtonElement;

  constructor() {
    this.statusElement = document.getElementById('status')!;
    this.progressElement = document.getElementById('progress')!;
    this.fetchButton = document.getElementById('fetch-button') as HTMLButtonElement;
  }

  public showStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    this.statusElement.textContent = message;
    this.statusElement.className = `status-${type}`;
  }

  public showProgress(message: string): void {
    this.progressElement.textContent = message;
    this.progressElement.className = 'status-info';
  }

  public setButtonEnabled(enabled: boolean): void {
    this.fetchButton.disabled = !enabled;
  }

  public clearMessages(): void {
    this.statusElement.textContent = '';
    this.statusElement.className = '';
    this.progressElement.textContent = '';
    this.progressElement.className = '';
  }
}

// Main application
async function fetchWMSImage(address: string): Promise<void> {
  const ui = new UIManager();
  
  try {
    ui.setButtonEnabled(false);
    ui.clearMessages();
    
    // Step 1: Geocode
    ui.showProgress('📍 Step 1: Geocoding address...');
    const geocoder = new IGNGeocoder();
    const result = await geocoder.searchAddress(address);
    
    if (!result) {
      ui.showStatus('❌ No geocoding result found for this address', 'error');
      return;
    }
    
    const [longitude, latitude] = result.geometry.coordinates;
    ui.showProgress(`✅ Found: ${result.properties.label}`);
    
    // Step 2: Detect EPSG
    ui.showProgress('🎯 Step 2: Detecting optimal EPSG code...');
    const epsgDetector = new EPSGDetector();
    const detectedZone = epsgDetector.detectEPSG(longitude, latitude);
    
    // Step 3: Transform coordinates
    ui.showProgress('🔄 Step 3: Transforming coordinates...');
    const transformer = new CoordinateTransformer();
    const [projectedX, projectedY] = transformer.transformFromWGS84(longitude, latitude, detectedZone.code);
    
    const bbox = transformer.createBoundingBox(projectedX, projectedY, 100);
    
    // Step 4: Fetch image
    ui.showProgress('🖼️ Step 4: Fetching WMS image...');
    
    const wmsOptions: WMSOptions = {
      epsg: detectedZone.code,
      bbox: bbox,
      layers: 'HR.ORTHOIMAGERY.ORTHOPHOTOS',
      width: 4096,
      height: 4096,
      format: 'image/png'
    };
    
    const wmsFetcher = new IGNWMSFetcher();
    await wmsFetcher.fetchImage(wmsOptions);
    
    ui.showStatus('🎉 Image downloaded successfully!', 'success');
    ui.showProgress(`📋 EPSG: ${detectedZone.code} | Bbox: ${bbox}`);
    
  } catch (error) {
    ui.showStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    console.error('Error:', error);
  } finally {
    ui.setButtonEnabled(true);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
  const addressInput = document.getElementById('address-input') as HTMLInputElement;
  const fetchButton = document.getElementById('fetch-button') as HTMLButtonElement;
  
  fetchButton.addEventListener('click', async () => {
    const address = addressInput.value.trim();
    if (!address) {
      const ui = new UIManager();
      ui.showStatus('❌ Please enter an address', 'error');
      return;
    }
    
    await fetchWMSImage(address);
  });
  
  // Allow Enter key to trigger fetch
  addressInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      fetchButton.click();
    }
  });
  
  // Set default value
  addressInput.value = '4 rue alfred kestler';
});
