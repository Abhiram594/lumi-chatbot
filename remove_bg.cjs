const { Jimp } = require('jimp');

async function run() {
  const image = await Jimp.read('public/lumi-powers-raw.jpg');
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  const visited = new Uint8Array(w * h);
  const queue = [];
  
  function push(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    if (visited[y * w + x]) return;
    visited[y * w + x] = 1;
    queue.push({x, y});
  }
  
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  
  let head = 0;
  while (head < queue.length) {
    const {x, y} = queue[head++];
    const idx = (y * w + x) * 4;
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx+1];
    const b = image.bitmap.data[idx+2];
    
    // Check if pixel is gray/white (checkerboard)
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    
    if (minC > 180 && (maxC - minC) < 30) {
      image.bitmap.data[idx+3] = 0; // Make transparent
      push(x+1, y);
      push(x-1, y);
      push(x, y+1);
      push(x, y-1);
    }
  }
  
  // Try to remove remaining checkerboard just in case by checking surrounding pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!visited[y * w + x]) continue;
      const idx = (y * w + x) * 4;
      if (image.bitmap.data[idx+3] === 0) {
          // It's transparent. Let's make it fully transparent (0 alpha)
      }
    }
  }
  
  await image.write('public/lumi-powers.png');
  console.log('Done');
}

run();
