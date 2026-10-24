const fs = require('fs');
const path = require('path');
const https = require('https');

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\2c3776a3-fb01-4b3a-b26f-40e4bfbc751e';
const publicDir = path.join(__dirname, 'public');
const imgDir = path.join(publicDir, 'images');
const prodDir = path.join(imgDir, 'products');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
    return true;
  }
  return false;
}

// 1. Hero Backpack & Classic Cream
const heroGen = path.join(brainDir, 'hero_backpack_1792733146214.jpg');
copyIfExists(heroGen, path.join(imgDir, 'hero-backpack.png'));
copyIfExists(heroGen, path.join(prodDir, 'classic-cream.png'));

// 2. Urban Black
const urbanGen = path.join(brainDir, 'urban_black_1792733342035.jpg');
copyIfExists(urbanGen, path.join(prodDir, 'urban-black.png'));

// 3. Adventure Olive
const advGen = path.join(brainDir, 'adventure_olive_1792733404322.jpg');
copyIfExists(advGen, path.join(prodDir, 'adventure-olive.png'));

// Download high quality Unsplash backpack images for Casual Pink & Banner Lifestyle
function downloadImage(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded image to ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Failed to download ${url}: ${err.message}`);
      resolve();
    });
  });
}

async function fetchRemaining() {
  // Casual pastel pink backpack
  await downloadImage(
    'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=1000&q=80',
    path.join(prodDir, 'casual-pink.png')
  );

  // Lifestyle traveler backpacker for promotional banner
  await downloadImage(
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&q=80',
    path.join(imgDir, 'banner-lifestyle.png')
  );

  console.log('All image assets configured successfully!');
}

fetchRemaining();
