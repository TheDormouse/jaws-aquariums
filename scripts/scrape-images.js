/**
 * Image Scraper for JAWS Aquariums
 * Parses HTML/JS to find and download portfolio images from jawsaquariums.com
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public/images directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public', 'images');
const portfolioDir = path.join(publicDir, 'portfolio');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

const BASE_URL = 'https://www.jawsaquariums.com';

// Pages to scrape for images
const pagesToScrape = [
  { url: '/', prefix: 'home' },
  { url: '/aquariums/freestanding/index.html', prefix: 'freestanding' },
  { url: '/aquariums/in_wall/index.html', prefix: 'inwall' },
  { url: '/ponds/index.html', prefix: 'pond' },
  { url: '/water_features/bubble_walls/index.html', prefix: 'bubble' },
  { url: '/about/index.html', prefix: 'about' },
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    console.log(`Fetching page: ${fullUrl}`);
    
    const protocol = fullUrl.startsWith('https') ? https : http;
    
    protocol.get(fullUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        fetchPage(redirectUrl).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        resolve({ success: false, status: response.statusCode });
        return;
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve({ success: true, html: data }));
    }).on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}

function extractImageUrls(html, baseUrl) {
  const images = new Set();
  
  // Pattern 1: src="..." or src='...'
  const srcPattern = /src=["']([^"']*\.(?:jpg|jpeg|png|gif))/gi;
  let match;
  while ((match = srcPattern.exec(html)) !== null) {
    images.add(match[1]);
  }
  
  // Pattern 2: JavaScript image arrays like ["image1.jpg", "image2.jpg"]
  const jsArrayPattern = /["']([^"']*\/images\/[^"']*\.(?:jpg|jpeg|png|gif))["']/gi;
  while ((match = jsArrayPattern.exec(html)) !== null) {
    images.add(match[1]);
  }
  
  // Pattern 3: url(...) in CSS
  const cssUrlPattern = /url\(["']?([^"')]*\.(?:jpg|jpeg|png|gif))["']?\)/gi;
  while ((match = cssUrlPattern.exec(html)) !== null) {
    images.add(match[1]);
  }
  
  // Pattern 4: Any path that looks like /images/something.jpg
  const pathPattern = /["']?(\/images\/[^"'\s>)]+\.(?:jpg|jpeg|png|gif))["']?/gi;
  while ((match = pathPattern.exec(html)) !== null) {
    images.add(match[1]);
  }
  
  // Pattern 5: Relative paths like images/front/something.jpg
  const relativePattern = /["']?(images\/[^"'\s>)]+\.(?:jpg|jpeg|png|gif))["']?/gi;
  while ((match = relativePattern.exec(html)) !== null) {
    images.add('/' + match[1]);
  }

  // Pattern 6: skin/images paths
  const skinPattern = /["']?(skin\/images\/[^"'\s>)]+\.(?:jpg|jpeg|png|gif))["']?/gi;
  while ((match = skinPattern.exec(html)) !== null) {
    images.add('/' + match[1]);
  }
  
  return Array.from(images);
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(portfolioDir, filename);
    
    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭ Already exists: ${filename}`);
      resolve({ success: true, filename, skipped: true });
      return;
    }
    
    // Clean up URL - handle relative paths and malformed URLs
    let cleanUrl = url;
    
    // Remove ../ patterns
    cleanUrl = cleanUrl.replace(/\.\.\//g, '');
    
    // Ensure starts with /
    if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http')) {
      cleanUrl = '/' + cleanUrl;
    }
    
    // Build full URL
    let fullUrl;
    try {
      if (cleanUrl.startsWith('http')) {
        fullUrl = cleanUrl;
      } else {
        fullUrl = BASE_URL + cleanUrl;
      }
      // Validate URL
      new URL(fullUrl);
    } catch (e) {
      console.log(`  ⚠ Invalid URL, skipping: ${url}`);
      resolve({ success: false, filename, error: 'Invalid URL' });
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    console.log(`  Downloading: ${fullUrl}`);
    
    const protocol = fullUrl.startsWith('https') ? https : http;
    
    protocol.get(fullUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        const redirectUrl = response.headers.location;
        downloadImage(redirectUrl, filename).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        resolve({ success: false, filename, status: response.statusCode });
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ Saved: ${filename}`);
        resolve({ success: true, filename });
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      resolve({ success: false, filename, error: err.message });
    });
  });
}

function sanitizeFilename(url, prefix, index) {
  // Extract original filename
  const originalName = path.basename(url).replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${prefix}-${String(index).padStart(2, '0')}-${originalName}`;
}

async function scrapePage(pageInfo) {
  console.log(`\n📄 Scraping: ${pageInfo.url}`);
  
  const result = await fetchPage(pageInfo.url);
  if (!result.success) {
    console.log(`  ⚠ Failed to fetch page: ${result.status || result.error}`);
    return [];
  }
  
  const imageUrls = extractImageUrls(result.html, pageInfo.url);
  console.log(`  Found ${imageUrls.length} images`);
  
  const downloads = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const filename = sanitizeFilename(url, pageInfo.prefix, i + 1);
    const downloadResult = await downloadImage(url, filename);
    downloads.push({ ...downloadResult, url });
    await new Promise(r => setTimeout(r, 100)); // Small delay
  }
  
  return downloads;
}

async function scrapeImages() {
  console.log('🦈 JAWS Aquariums Image Scraper');
  console.log('================================');
  console.log(`Saving to: ${portfolioDir}`);
  
  const allResults = [];
  
  for (const page of pagesToScrape) {
    const results = await scrapePage(page);
    allResults.push(...results);
  }
  
  console.log('\n================================');
  console.log('Download Summary:');
  const successful = allResults.filter(r => r.success && !r.skipped);
  const skipped = allResults.filter(r => r.skipped);
  const failed = allResults.filter(r => !r.success);
  
  console.log(`  ✓ Downloaded: ${successful.length}`);
  console.log(`  ⏭ Skipped (already exists): ${skipped.length}`);
  console.log(`  ✗ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\nNewly downloaded:');
    successful.forEach(r => console.log(`  - ${r.filename}`));
  }
  
  // List all files in portfolio directory
  console.log('\n📁 All files in portfolio folder:');
  const files = fs.readdirSync(portfolioDir);
  files.forEach(f => console.log(`  - ${f}`));
  
  console.log('\n✅ Done!');
}

scrapeImages();
