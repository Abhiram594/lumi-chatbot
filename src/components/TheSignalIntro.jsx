import React, { useRef, useEffect } from 'react';

const TheSignalIntro = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  
  // Layer 4A, 4B & 5 DOM Refs
  const mainWrapperRef = useRef(null);
  const lumiContainerRef = useRef(null);
  const silhouetteRef = useRef(null);
  const lumiImgRef = useRef(null);
  const capeRef = useRef(null);
  const chestGlowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let startTime = null;
    const dpr = window.devicePixelRatio || 1;

    // 1. STAR SPRITES (Bloom & Spikes)
    // 55% Neutral, 30% Warm, 15% Cool
    const colors = [
      { r: 245, g: 240, b: 232, prob: 0.55 }, // Neutral/Pale Yellow
      { r: 255, g: 194, b: 127, prob: 0.30 }, // Warm Orange/Gold
      { r: 185, g: 207, b: 255, prob: 0.15 }  // Cool Blue-White
    ];

    const createStarSprite = (r, g, b, isHero) => {
      const spriteSize = isHero ? 256 : 64; 
      const offscreen = document.createElement('canvas');
      offscreen.width = spriteSize;
      offscreen.height = spriteSize;
      const oCtx = offscreen.getContext('2d');
      const cx = spriteSize / 2;
      const cy = spriteSize / 2;

      // Spikes for Hero Stars (Thin, 4-point cross, inherits color)
      if (isHero) {
        const drawSpike = (x0, y0, x1, y1) => {
            const grad = oCtx.createLinearGradient(x0, y0, x1, y1);
            grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
            grad.addColorStop(0.45, `rgba(${r},${g},${b},0.6)`);
            grad.addColorStop(0.5, `rgba(255,255,255,1)`);
            grad.addColorStop(0.55, `rgba(${r},${g},${b},0.6)`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            oCtx.fillStyle = grad;
        };
        
        drawSpike(0, cy, spriteSize, cy);
        oCtx.fillRect(0, cy - 0.5, spriteSize, 1);
        
        drawSpike(cx, 0, cx, spriteSize);
        oCtx.fillRect(cx - 0.5, 0, 1, spriteSize);
      }

      // Radial Bloom (Halo + Core)
      const maxR = isHero ? 48 : 32; 
      const bloom = oCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      
      if (isHero) {
        bloom.addColorStop(0, `rgba(255, 255, 255, 1)`); 
        bloom.addColorStop(0.04, `rgba(255, 255, 255, 0.9)`); 
        bloom.addColorStop(0.12, `rgba(${r}, ${g}, ${b}, 0.7)`); 
        bloom.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.15)`); 
        bloom.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      } else {
        // Faint background stars get tight cores and almost no milky halo
        bloom.addColorStop(0, `rgba(255, 255, 255, 1)`);
        bloom.addColorStop(0.03, `rgba(255, 255, 255, 0.8)`);
        bloom.addColorStop(0.08, `rgba(${r}, ${g}, ${b}, 0.2)`);
        bloom.addColorStop(0.15, `rgba(${r}, ${g}, ${b}, 0.02)`);
        bloom.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }

      oCtx.fillStyle = bloom;
      oCtx.beginPath();
      oCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
      oCtx.fill();

      return offscreen;
    };

    const spriteCache = [];
    colors.forEach((c, i) => {
      spriteCache[i] = {
        normal: createStarSprite(c.r, c.g, c.b, false),
        hero: createStarSprite(c.r, c.g, c.b, true) 
      };
    });

    // 2. FILM GRAIN NOISE CACHE
    const noiseSize = 256;
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = noiseSize;
    noiseCanvas.height = noiseSize;
    const nCtx = noiseCanvas.getContext('2d');
    const nImg = nCtx.createImageData(noiseSize, noiseSize);
    for (let i = 0; i < nImg.data.length; i += 4) {
      const val = Math.random() * 255;
      nImg.data[i] = val;
      nImg.data[i+1] = val;
      nImg.data[i+2] = val;
      nImg.data[i+3] = 9; // ~3-4% opacity max
    }
    nCtx.putImageData(nImg, 0, 0);

    // 3. PROCEDURAL DUST LANE (Fractal Value Noise)
    // Pre-generates a fibrous, irregular, diagonal astrophotography dust lane
    const dustSize = 256; 
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = dustSize;
    dustCanvas.height = dustSize;
    const dCtx = dustCanvas.getContext('2d');
    const dImg = dCtx.createImageData(dustSize, dustSize);
    
    // Simple fast pseudo-random hash
    const hash = (x, y) => {
      let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };
    const valueNoise = (x, y) => {
      const ix = Math.floor(x); const iy = Math.floor(y);
      const fx = x - ix; const fy = y - iy;
      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);
      const n00 = hash(ix, iy); const n10 = hash(ix + 1, iy);
      const n01 = hash(ix, iy + 1); const n11 = hash(ix + 1, iy + 1);
      return (n00 * (1 - ux) + n10 * ux) * (1 - uy) + (n01 * (1 - ux) + n11 * ux) * uy;
    };
    const fbm = (x, y) => {
      let v = 0, amp = 0.5, freq = 1.0;
      for (let i = 0; i < 5; i++) {
          v += amp * valueNoise(x * freq, y * freq);
          freq *= 2.0; amp *= 0.5;
      }
      return v;
    };

    const r1 = 46, g1 = 42, b1 = 92;   // #2E2A5C
    const r2 = 74, g2 = 63, b2 = 122;  // #4A3F7A

    for (let y = 0; y < dustSize; y++) {
      for (let x = 0; x < dustSize; x++) {
        const nx = x / dustSize;
        const ny = y / dustSize;
        
        // u goes along the bottom-left to top-right diagonal, v is perpendicular
        const u = nx - ny; 
        const v = nx + ny; 

        // Generate layered noise
        const macro = fbm(u * 2 + 10, v * 2 + 10); // Broader shapes
        const fibrous = fbm(u * 3, v * 15);        // Stretched anisotropic streaks
        const detail = fbm(u * 10, v * 30);        // Fine granularity
        
        const combinedNoise = macro * 0.5 + fibrous * 0.4 + detail * 0.1;
        
        // Create an irregular masking band along the diagonal (v ~ 1)
        const dist = Math.abs(v - 1 + (macro - 0.5) * 0.6);
        let mask = Math.max(0, 1.0 - (dist / 0.4));
        mask = Math.pow(mask, 1.5); 
        
        // Final dust intensity (Thresholding to create sparse gaps)
        let intensity = Math.pow(combinedNoise * mask, 1.8);
        
        if (intensity > 0.01) {
          const idx = (y * dustSize + x) * 4;
          const mix = fibrous; // vary color across strands
          dImg.data[idx] = r1 * (1 - mix) + r2 * mix;
          dImg.data[idx+1] = g1 * (1 - mix) + g2 * mix;
          dImg.data[idx+2] = b1 * (1 - mix) + b2 * mix;
          
          // Max opacity mapped to ~10% visual weight
          dImg.data[idx+3] = Math.min(255, intensity * 200); 
        } else {
          const idx = (y * dustSize + x) * 4;
          dImg.data[idx+3] = 0;
        }
      }
    }
    dCtx.putImageData(dImg, 0, 0);

    // 4. GENERATE STARS (Clustered & Weighted to dust lane)
    let seed = 9999;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const getStarPos = () => {
      if (random() < 0.65) {
        // 65% Clustered in/near dust lane
        const u = random() * 2 - 1; 
        const vOffset = (random() - 0.5) * Math.pow(random(), 1.5) * 1.5;
        const v = 1 + vOffset;
        let x = (u + v) / 2; let y = (v - u) / 2;
        if (x < 0) x += 1; if (x > 1) x -= 1;
        if (y < 0) y += 1; if (y > 1) y -= 1;
        return { x, y };
      } else {
        // 35% scattered, strongly avoiding the top-right void
        let x = random(), y = random();
        if (x > 0.5 && y < 0.5 && random() < 0.85) {
            x = random() * 0.4; // Push to left side
        }
        return { x, y };
      }
    };

    let allStars = [];
    const createBand = (count, baseSize, speed, layerName) => {
      for (let i = 0; i < count; i++) {
        const pos = getStarPos();
        const colorRand = random();
        let colorIdx = 0; // Neutral 55%
        if (colorRand > 0.55) colorIdx = 1; // Warm 30%
        if (colorRand > 0.85) colorIdx = 2; // Cool 15%

        allStars.push({
          x: pos.x, y: pos.y, opacity: 0.1, 
          baseSize: baseSize + (random() * (baseSize * 0.4)),
          speedX: (random() - 0.5) * speed,
          speedY: (random() - 0.5) * speed,
          colorIdx, isHero: false, layerName
        });
      }
    };

    // 300 total stars
    createBand(200, 16, 0.001, 'far'); 
    createBand(80, 24, 0.004, 'mid');  
    createBand(20, 36, 0.012, 'near'); 

    // Shuffle stars to distribute brightness randomly across depths
    allStars.sort(() => random() - 0.5);

    // Exact hierarchy: 9 hero, 36 mid, 255 dim
    allStars.forEach((star, i) => {
      if (i < 9) { 
        star.opacity = 0.85 + random() * 0.15; // Hero: 0.85 - 1.0
        star.isHero = true;
        star.baseSize *= 3.5; // Scale up sprite for spikes
      } else if (i < 45) { 
        star.opacity = 0.30 + random() * 0.20; // Mid: 0.3 - 0.5
      } else { 
        star.opacity = 0.08 + random() * 0.12; // Dim: 0.08 - 0.2
        star.baseSize *= 0.6; // Tiny cores
      }
    });

    // Depth sorting
    const layerOrder = { 'far': 0, 'mid': 1, 'near': 2 };
    allStars.sort((a, b) => layerOrder[a.layerName] - layerOrder[b.layerName]);

    // === LAYER 3 CONSTELLATION PRE-CALCULATION ===
    const generateConstellation = () => {
      const pts = [];
      const lines = [];
      const sparks = [];
      
      // Center
      pts.push({ id: 0, nx: 0, ny: 0, type: 'core', delay: 0 });
      
      let idCounter = 1;
      const majorTips = [], minorTips = [], valleys = [];
      
      for (let i = 0; i < 8; i++) {
        const angle = -Math.PI / 2 + i * (Math.PI / 4);
        const isMajor = i % 2 === 0;
        
        // Exact proportions from reference image
        const R = isMajor ? 1.0 : 0.6;
        const delay = isMajor ? 0.0 : 0.08;
        
        const tip = { id: idCounter++, nx: Math.cos(angle) * R, ny: Math.sin(angle) * R, type: isMajor ? 'majorTip' : 'minorTip', delay, angle };
        pts.push(tip);
        if (isMajor) majorTips.push(tip);
        else minorTips.push(tip);
        
        const vAngle = angle + (Math.PI / 8);
        const vR = 0.18;
        // Valley arrives exactly as the energy connects from the tips
        const valley = { id: idCounter++, nx: Math.cos(vAngle) * vR, ny: Math.sin(vAngle) * vR, type: 'valley', delay: 0.25, angle: vAngle };
        pts.push(valley);
        valleys.push(valley);
      }
      
      const allTips = []; 
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) allTips.push(majorTips[i / 2]);
        else allTips.push(minorTips[Math.floor(i / 2)]);
      }
      
      for (let i = 0; i < 8; i++) {
        const tip = allTips[i];
        const vRight = valleys[i];
        const vLeft = valleys[(i + 7) % 8];
        
        const tipArrivalT = tip.delay + 0.35; // Major: 0.35, Minor: 0.43 (relative to t5)
        
        // Lines from Tip to Valleys (Energy flows inward)
        lines.push({ a: tip.id, b: vLeft.id, startT: tipArrivalT, endT: tipArrivalT + 0.2, type: 'perimeter' });
        lines.push({ a: tip.id, b: vRight.id, startT: tipArrivalT, endT: tipArrivalT + 0.2, type: 'perimeter' });
        
        // Lines from Valley to Core (Energy reaches center)
        lines.push({ a: vRight.id, b: 0, startT: tipArrivalT + 0.2, endT: tipArrivalT + 0.4, type: 'core' });
        
        // Energy sparks travel along the primary axes
        sparks.push({ origin: tip.id, startT: tip.delay, endT: tipArrivalT });
      }
      
      // Sparks that converge to center from valleys
      for (let i = 0; i < 8; i++) {
         sparks.push({ origin: valleys[i].id, startT: 0.65, endT: 0.85 }); // relative to t5
      }
      
      return { points: pts, lines, sparks };
    };
    
    const constellation = generateConstellation();

    let frameCount = 0;

    const render = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      frameCount++;
      
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);
      }

      // 1. True Black Background
      ctx.fillStyle = '#020204'; 
      ctx.fillRect(0, 0, w, h);

      // 2. Procedural Dust Lane
      // Extremely subtle atmospheric drift
      const driftX = Math.sin(elapsed * 0.02) * (w * 0.03);
      const driftY = Math.cos(elapsed * 0.025) * (h * 0.03);
      
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.8; // Control overall dust prominence
      
      // Draw dust canvas scaled up to cover rotating aspect ratios safely
      const dw = Math.max(w, h) * 1.5;
      ctx.drawImage(dustCanvas, (w - dw)/2 + driftX, (h - dw)/2 + driftY, dw, dw);
      
      ctx.globalCompositeOperation = 'source-over';

      // 3. Parallax Camera Zoom
      const zoomProgress = Math.min(elapsed / 1.5, 1.0);
      const easeProgress = Math.sin((zoomProgress * Math.PI) / 2);
      const zoom = 1.0 + (0.02 * easeProgress); // Very subtle zoom

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);

      // 4. Draw Stars
      ctx.globalCompositeOperation = 'screen';
      allStars.forEach(star => {
        let sx = (star.x * w + elapsed * star.speedX * w) % w;
        let sy = (star.y * h + elapsed * star.speedY * h) % h;
        if (sx < 0) sx += w;
        if (sy < 0) sy += h;

        ctx.globalAlpha = star.opacity;
        
        let cacheItem = star.isHero ? spriteCache[star.colorIdx].hero : spriteCache[star.colorIdx].normal;
        const size = star.baseSize;
        
        ctx.drawImage(cacheItem, sx - size/2, sy - size/2, size, size);
      });
      ctx.restore();

      // === LAYER 2 & LAYER 3 FADE LOGIC ===
      let l2Fade = 1.0;
      if (elapsed > 2.4) {
        l2Fade = Math.max(0, 1.0 - (elapsed - 2.4) / 0.4);
      }

      // === LAYER 2: THE SIGNAL IGNITES ===
      if (elapsed >= 1.20 && l2Fade > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const t1 = Math.max(0, elapsed - 1.20); // Appear
        const t2 = Math.max(0, elapsed - 1.45); // Pulse 1
        const t3 = Math.max(0, elapsed - 1.75); // Pulse 2
        const t4 = Math.max(0, elapsed - 2.05); // Flare
        
        let signalOpacity = 0;
        let coreRadius = 0;
        let glowRadius = 0;
        
        // 1. Signal Appears
        if (t1 > 0) {
          const appearP = Math.min(t1 / 0.25, 1.0); 
          signalOpacity = appearP;
          coreRadius = 0.5 + appearP * 1.5; // 0.5px to 2.0px
          glowRadius = 2 + appearP * 6; // 2px to 8px
        }
        
        // 2. Pulse 1
        if (t2 > 0) {
          const p1Bump = Math.max(0, Math.sin(Math.min(t2 / 0.4 * Math.PI, Math.PI)));
          coreRadius += p1Bump * 0.5;
          glowRadius += p1Bump * 4;
        }
        
        // 3. Pulse 2
        if (t3 > 0) {
          const p2Bump = Math.max(0, Math.sin(Math.min(t3 / 0.4 * Math.PI, Math.PI)));
          coreRadius += p2Bump * 0.8;
          glowRadius += p2Bump * 8;
        }
        
        // 4. Third Pulse (Major Flare)
        let flareScale = 0;
        if (t4 > 0) {
          if (t4 < 0.15) {
            flareScale = t4 / 0.15; // Fast attack 0 to 1
          } else {
            const decay = Math.min((t4 - 0.15) / 0.6, 1.0);
            flareScale = 1.0 - (decay * 0.6); // Settles at 0.4 for transition
          }
          coreRadius += flareScale * 3.5;
          glowRadius += flareScale * 80;
        }

        signalOpacity *= l2Fade;
        flareScale *= l2Fade;
        
        // Environment Illumination (reacts to pulses)
        let envIllum = 0;
        if (t3 > 0) envIllum += Math.max(0, Math.sin(Math.min(t3 / 0.3 * Math.PI, Math.PI))) * 0.04;
        if (t4 > 0) envIllum += flareScale * 0.12;
        envIllum *= l2Fade;
        
        if (envIllum > 0) {
          const envGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
          envGrad.addColorStop(0, `rgba(255, 215, 150, ${envIllum})`);
          envGrad.addColorStop(1, 'rgba(255, 215, 150, 0)');
          ctx.fillStyle = envGrad;
          ctx.fillRect(0, 0, w, h);
        }
        
        // Ripple Rings (thin, soft expanding sonar)
        const drawRipple = (t, dur, maxR, maxOp) => {
          if (t > 0 && t < dur) {
            const p = t / dur;
            const easeOut = 1 - Math.pow(1 - p, 2);
            const r = easeOut * maxR;
            const op = (1 - p) * maxOp;
            
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 235, 180, ${op})`;
            ctx.lineWidth = 0.5 + (1 - p) * 1.5; // Thin and tapers
            ctx.stroke();
          }
        };
        
        drawRipple(t2, 1.2, w * 0.25, 0.3); // 1st pulse ripple
        drawRipple(t3, 1.5, w * 0.35, 0.4); // 2nd pulse ripple
        drawRipple(t4, 2.5, w * 0.55, 0.6); // 3rd major pulse ripple
        
        if (signalOpacity > 0) {
          // Light Rays during major flare
          if (t4 > 0 && flareScale > 0) {
            const numRays = 6;
            const maxRayLength = Math.min(w, h) * 0.35;
            
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(elapsed * 0.05); // Slow atmospheric rotation
            
            for (let i = 0; i < numRays; i++) {
              ctx.rotate((Math.PI * 2) / numRays);
              // Alternate lengths for realism
              const len = maxRayLength * flareScale * (i % 2 === 0 ? 1.0 : 0.6);
              
              const rayGrad = ctx.createLinearGradient(0, 0, 0, len);
              rayGrad.addColorStop(0, `rgba(255, 240, 180, ${0.4 * flareScale})`);
              rayGrad.addColorStop(0.2, `rgba(255, 210, 120, ${0.1 * flareScale})`);
              rayGrad.addColorStop(1, 'rgba(255, 240, 180, 0)');
              
              ctx.fillStyle = rayGrad;
              ctx.beginPath();
              ctx.moveTo(-0.5, 0); // Very thin base
              ctx.lineTo(0.5, 0);
              ctx.lineTo(0, len);
              ctx.fill();
            }
            ctx.restore();
          }
          
          // Signal Bloom
          const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
          bloom.addColorStop(0, `rgba(255, 255, 255, ${signalOpacity})`);
          bloom.addColorStop(0.1, `rgba(255, 245, 210, ${signalOpacity * 0.9})`);
          bloom.addColorStop(0.4, `rgba(255, 190, 110, ${signalOpacity * 0.3})`);
          
          // Chromatic Edge during major flare
          if (t4 > 0) {
            bloom.addColorStop(0.8, `rgba(90, 70, 190, ${0.1 * flareScale})`);
          }
          
          bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = bloom;
          ctx.beginPath();
          ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Sharp Signal Core
          ctx.fillStyle = `rgba(255, 255, 255, ${signalOpacity})`;
          ctx.beginPath();
          ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }

      // === LAYER 3: THE CONSTELLATION ===
      const activePoints = [];
      if (elapsed >= 2.40 && elapsed < 4.00) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Scale the 1.6s real-time duration into the original 1.2s animation timeframe
        const t5 = Math.max(elapsed - 2.40, 0) * 0.75;
        const tCollapse = Math.max(t5 - 1.05, 0);
        const pCollapse = Math.min(tCollapse / 0.15, 1.0);
        
        const currentR = Math.min(w, h) * 0.18; // Constellation radius
        
        // 1. Calculate and draw particles
        constellation.points.forEach(pt => {
          const tx = cx + pt.nx * currentR;
          const ty = cy + pt.ny * currentR;
          
          let px = cx, py = cy;
          let pEmerge = Math.min(Math.max((t5 - pt.delay) / 0.35, 0), 1.0);
          
          if (pCollapse > 0) {
            // Collapsing back to center
            const easeIn = Math.pow(pCollapse, 3);
            px = tx + (cx - tx) * easeIn;
            py = ty + (cy - ty) * easeIn;
          } else {
            // Emerging from center
            const ease = 1 - Math.pow(1 - pEmerge, 4);
            px = cx + (tx - cx) * ease;
            py = cy + (ty - cy) * ease;
            
            // Organic swoop curve
            const curveAmount = Math.sin(pEmerge * Math.PI) * currentR * 0.2 * (pt.id % 2 === 0 ? 1 : -1);
            px += -pt.ny * curveAmount;
            py += pt.nx * curveAmount;
          }
          
          activePoints[pt.id] = { x: px, y: py };
          
          // Draw trails for emerging particles
          if (pEmerge > 0 && pEmerge < 1.0 && pCollapse === 0) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            for (let s = 1; s <= 5; s++) {
              const trailP = pEmerge - (s * 0.015);
              if (trailP > 0) {
                const ease = 1 - Math.pow(1 - trailP, 4);
                let prevX = cx + (tx - cx) * ease;
                let prevY = cy + (ty - cy) * ease;
                const cAmt = Math.sin(trailP * Math.PI) * currentR * 0.2 * (pt.id % 2 === 0 ? 1 : -1);
                prevX += -pt.ny * cAmt;
                prevY += pt.nx * cAmt;
                ctx.lineTo(prevX, prevY);
              } else {
                ctx.lineTo(cx, cy);
              }
            }
            ctx.strokeStyle = `rgba(255, 193, 7, ${pEmerge * 0.5})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
          
          if (pEmerge > 0 && pt.type !== 'core') {
             // Particle size
             let pSize = pt.type === 'majorTip' ? 3.0 : (pt.type === 'minorTip' ? 2.0 : 1.5);
             
             // Activation Flash when point arrives
             let flashAlpha = 0;
             let flashScale = 0;
             const arrivalT = pt.delay + 0.35;
             if (t5 >= arrivalT) {
                const flashT = t5 - arrivalT;
                if (flashT < 0.2) {
                   flashAlpha = 1.0 - (flashT / 0.2);
                   flashScale = Math.sin((flashT / 0.2) * Math.PI);
                }
             }
             
             // Base particle
             ctx.beginPath();
             ctx.arc(px, py, pSize, 0, Math.PI * 2);
             ctx.fillStyle = `rgba(255, 249, 230, ${pEmerge})`;
             ctx.fill();
             
             // Settled Glow + Flash Glow
             ctx.beginPath();
             ctx.arc(px, py, pSize * 3 + flashScale * 12, 0, Math.PI * 2);
             ctx.fillStyle = `rgba(255, 193, 7, ${(pEmerge * 0.3) + (flashAlpha * 0.7)})`;
             ctx.fill();
          }
        });
        
        // 2. Draw Connecting Lines (Energy Flow)
        const collapseFade = 1.0 - Math.pow(pCollapse, 2);
        
        constellation.lines.forEach((line) => {
          const pLine = Math.min(Math.max((t5 - line.startT) / (line.endT - line.startT), 0), 1.0);
          
          if (pLine > 0 && activePoints[line.a] && activePoints[line.b]) {
            const ptA = activePoints[line.a];
            const ptB = activePoints[line.b];
            
            const currentX = ptA.x + (ptB.x - ptA.x) * pLine;
            const currentY = ptA.y + (ptB.y - ptA.y) * pLine;
            
            // Base semi-transparent line
            ctx.beginPath();
            ctx.moveTo(ptA.x, ptA.y);
            ctx.lineTo(currentX, currentY);
            
            const settledAlpha = pLine >= 1.0 ? 0.3 : 0.8; 
            ctx.strokeStyle = `rgba(255, 193, 7, ${settledAlpha * collapseFade})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            
            // Leading energy spark
            if (pLine > 0 && pLine < 1.0 && pCollapse === 0) {
              // Spark core
              ctx.beginPath();
              ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = '#FFF9E6';
              ctx.fill();
              
              // Spark glow
              ctx.beginPath();
              ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 193, 7, 0.8)`;
              ctx.fill();
              
              // Spark trail
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              const trailX = ptA.x + (ptB.x - ptA.x) * Math.max(0, pLine - 0.2);
              const trailY = ptA.y + (ptB.y - ptA.y) * Math.max(0, pLine - 0.2);
              ctx.lineTo(trailX, trailY);
              ctx.strokeStyle = `rgba(255, 249, 230, 0.5)`;
              ctx.lineWidth = 2.0;
              ctx.stroke();
            }
          }
        });
        
        // 3. Central Core Convergence
        if (t5 >= 0.65 && pCollapse === 0) {
           constellation.sparks.forEach(spark => {
              const pSpark = Math.min(Math.max((t5 - spark.startT) / (spark.endT - spark.startT), 0), 1.0);
              if (pSpark > 0 && pSpark < 1.0) {
                 const origin = activePoints[spark.origin];
                 const ease = Math.pow(pSpark, 2);
                 const sx = origin.x + (cx - origin.x) * ease;
                 const sy = origin.y + (cy - origin.y) * ease;
                 
                 ctx.beginPath();
                 ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                 ctx.fillStyle = '#FFF9E6';
                 ctx.fill();
                 
                 ctx.beginPath();
                 ctx.arc(sx, sy, 5, 0, Math.PI * 2);
                 ctx.fillStyle = 'rgba(255, 193, 7, 0.6)';
                 ctx.fill();
              }
           });
        }
        
        // 4. Central Core Activation (Hold Phase)
        if (t5 >= 0.85) {
           const coreActiveP = Math.min((t5 - 0.85) / 0.15, 1.0);
           if (coreActiveP > 0) {
              const flash = Math.sin(coreActiveP * Math.PI);
              const settled = coreActiveP;
              
              const coreR = 30 * settled + 20 * flash;
              const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
              coreGrad.addColorStop(0, `rgba(255, 249, 230, ${(0.9 * settled + flash) * collapseFade})`);
              coreGrad.addColorStop(0.3, `rgba(255, 193, 7, ${(0.5 * settled + flash * 0.5) * collapseFade})`);
              coreGrad.addColorStop(1, 'rgba(255, 152, 0, 0)');
              
              ctx.beginPath();
              ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
              ctx.fillStyle = coreGrad;
              ctx.fill();
              
              ctx.beginPath();
              ctx.arc(cx, cy, 3 * settled, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 249, 230, ${collapseFade})`;
              ctx.fill();
           }
        }
        
        ctx.restore();
      }

      // === LAYER 4A: LUMI REVEAL ===
      if (elapsed >= 4.00) {
        const tFinal = elapsed - 4.00;
        let starScale = 1.0;
        let lightGlow = 1.0;
        
        // At end of collapse (tFinal=0), the golden star appears and holds.
        // It holds and softly pulses until Lumi emerges.
        
        const pulse = Math.sin(tFinal * Math.PI * 4) * 0.1;
        starScale = 1.0 + pulse;
        lightGlow = 0.5 + Math.sin(tFinal * Math.PI * 2) * 0.5;
        
        // Star expands into the Lumi cinematic backlight
        if (elapsed >= 4.60) {
            const t4a = elapsed - 4.60;
            const expandP = Math.min(t4a / 0.6, 1.0); // 0.6s expand
            const easeOut = 1 - Math.pow(1 - expandP, 3);
            starScale = 1.0 + easeOut * 40; // Massive expansion
            lightGlow = 1.0 + easeOut * 2.0;
        }
        
        // Fade out the physical star geometry as the light takes over
        let starAlpha = 1.0;
        if (elapsed >= 4.60) {
            const t4a = elapsed - 4.60;
            // Star intensifies and expands
            const expandP = Math.min(t4a / 1.5, 1.0);
            const easeExpand = expandP * (2 - expandP); // quad out
            starScale += easeExpand * 0.8;
            lightGlow += easeExpand * 1.5; 
        }
        
        if (elapsed >= 5.20) {
            const tFade = elapsed - 5.20;
            // Geometry dissolves into the light as Lumi appears
            starAlpha = 1.0 - Math.min(tFade / 1.0, 1.0);
        }
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const finalR = Math.min(w, h) * 0.18 * starScale;
        
        // Massive Bloom (stays active to backlight Lumi)
        const glowR = 150 * starScale * Math.max(1.0, lightGlow * 0.8);
        const bloomAlpha = Math.min(lightGlow, 1.2) * (0.4 + 0.6 * starAlpha);
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        bloom.addColorStop(0, `rgba(255, 249, 230, ${0.8 * bloomAlpha})`);
        bloom.addColorStop(0.15, `rgba(255, 193, 7, ${0.5 * bloomAlpha})`);
        bloom.addColorStop(0.5, `rgba(255, 152, 0, ${0.15 * bloomAlpha})`);
        bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fill();
        
        if (starAlpha > 0) {
            ctx.globalAlpha = starAlpha;
            
            // Star Geometry Path Generator
            const drawStarPath = (radiusMultiplier) => {
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = -Math.PI / 2 + i * (Math.PI / 4);
                    const isMajor = i % 2 === 0;
                    const tipR = (isMajor ? 1.0 : 0.6) * finalR * radiusMultiplier;
                    ctx.lineTo(cx + Math.cos(angle) * tipR, cy + Math.sin(angle) * tipR);
                    
                    const vAngle = angle + (Math.PI / 8);
                    const vR = 0.18 * finalR * radiusMultiplier;
                    ctx.lineTo(cx + Math.cos(vAngle) * vR, cy + Math.sin(vAngle) * vR);
                }
                ctx.closePath();
            };

            // Outer soft glow layer
            drawStarPath(1.1);
            ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
            ctx.fill();
            
            // Main gradient body
            const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, finalR);
            starGrad.addColorStop(0, '#FFF9E6');
            starGrad.addColorStop(0.2, '#FFC107');
            starGrad.addColorStop(1, '#FF9800');
            
            drawStarPath(1.0);
            ctx.fillStyle = starGrad;
            ctx.fill();
            
            // Inner bright core
            drawStarPath(0.4);
            ctx.fillStyle = '#FFF9E6';
            ctx.fill();
            
            // Radiant Rays
            const rayLen = 110 * starScale;
            const drawSpike = (angle, alpha) => {
              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(angle);
              const rayGrad = ctx.createLinearGradient(0, -rayLen, 0, rayLen);
              rayGrad.addColorStop(0, `rgba(255, 193, 7, 0)`);
              rayGrad.addColorStop(0.4, `rgba(255, 193, 7, ${0.4 * alpha})`);
              rayGrad.addColorStop(0.5, `rgba(255, 249, 230, ${1.0 * alpha})`);
              rayGrad.addColorStop(0.6, `rgba(255, 193, 7, ${0.4 * alpha})`);
              rayGrad.addColorStop(1, `rgba(255, 193, 7, 0)`);
              ctx.fillStyle = rayGrad;
              ctx.fillRect(-0.5, -rayLen, 1, rayLen * 2);
              ctx.restore();
            };
            drawSpike(0, 1.0);
            drawSpike(Math.PI / 2, 1.0);
        }
        
        ctx.restore();
      }

      // === LAYER 4A DOM SYNC ===
      if (elapsed >= 4.60) {
          const t4a = elapsed - 4.60;
          if (lumiContainerRef.current) {
              const scale = 0.95 + Math.min(t4a / 3.0, 1.0) * 0.05; 
              // Gentle emergence upward, settling slightly, then subtle float
              const yOffset = Math.sin(t4a * 2.0) * 8 - (Math.min(t4a / 1.5, 1.0) * 15) + (Math.sin(t4a * 1.5) * 4);
              
              lumiContainerRef.current.style.opacity = 1;
              lumiContainerRef.current.style.transform = `translate(0px, ${yOffset}px) scale(${scale})`;
              
              // Silhouette appears around 5.00 (t4a = 0.40)
              const silOpacity = Math.min(Math.max((t4a - 0.4) / 0.8, 0), 1.0);
              if (silhouetteRef.current) {
                  silhouetteRef.current.style.opacity = silOpacity;
                  if (window.innerWidth < 768) {
                      silhouetteRef.current.style.filter = 'brightness(0) drop-shadow(0 0 10px rgba(255,193,7,0.8))';
                  } else {
                      silhouetteRef.current.style.filter = 'brightness(0) drop-shadow(0 0 25px rgba(255,193,7,0.8)) sepia(1) hue-rotate(330deg) saturate(3)';
                  }
              }
              
              // Full character resolves around 5.60 (t4a = 1.0)
              const wipeP = Math.min(Math.max((t4a - 1.0) / 1.2, 0), 1.0);
              if (lumiImgRef.current) {
                  const wipePct = wipeP * 150 - 25; 
                  lumiImgRef.current.style.WebkitMaskImage = `linear-gradient(to bottom, black ${wipePct}%, transparent ${wipePct + 25}%)`;
                  lumiImgRef.current.style.maskImage = `linear-gradient(to bottom, black ${wipePct}%, transparent ${wipePct + 25}%)`;
                  lumiImgRef.current.style.opacity = silOpacity; 
              }
              
              // === LAYER 4B: CAPE APPEARS ===
              // Cape reveals smoothly after Lumi is fully visible (around t4a = 1.2)
              if (capeRef.current) {
                  const capeFade = Math.min(Math.max((t4a - 1.2) / 1.0, 0), 1.0);
                  capeRef.current.style.opacity = capeFade;
                  
                  if (capeFade > 0) {
                      // Wind math for flowing cloth
                      const wind = (t4a - 1.2);
                      const wave1 = Math.sin(wind * 2.5) * 3;     // slow, natural wave
                      const wave2 = Math.cos(wind * 4.2) * 1.5;   // slightly faster ripple
                      
                      const totalRot = wave1 + wave2;
                      const skewX = Math.sin(wind * 3.0) * 2;     // billow/depth effect
                      const scaleY = 1.0 + Math.sin(wind * 2.0) * 0.02;
                      
                      // Using a stable base translate and origin
                      // These values align the cape to Lumi's shoulders
                      capeRef.current.style.transformOrigin = '85% 45%';
                      capeRef.current.style.transform = `translate(-5%, -5%) scale(1.05) rotate(${totalRot}deg) skewX(${skewX}deg) scaleY(${scaleY})`;
                  }
              }
              
              // === LAYER 5: CHEST STAR & HOMEPAGE REVEAL ===
              if (chestGlowRef.current && mainWrapperRef.current) {
                  // Phase 1: Brighten (t4a: 2.5 to 2.8)
                  let glowOpacity = Math.min(Math.max((t4a - 2.5) / 0.3, 0), 1.0);
                  const baseScale = 0.02;
                  let glowScale = baseScale;
                  
                  // Phase 2: Pulses (t4a: 2.8 to 3.3)
                  if (t4a > 2.8) {
                      const pulseTime = t4a - 2.8;
                      if (pulseTime < 0.5) {
                          const p = pulseTime / (0.5 / 3); 
                          const pulseIdx = Math.floor(p);
                          const localP = p - pulseIdx; 
                          const wave = (1 - Math.cos(localP * Math.PI * 2)) / 2;
                          
                          if (pulseIdx === 0) glowScale = baseScale * (1.0 + wave * 2.0); 
                          else if (pulseIdx === 1) glowScale = baseScale * (1.0 + wave * 5.0); 
                          else glowScale = baseScale * (1.0 + wave * 12.0);
                      } else {
                          // Phase 3: Expansion (t4a: 3.3 to 4.0)
                          const expandP = Math.min((t4a - 3.3) / 0.7, 1.0);
                          const easeExp = Math.pow(expandP, 4);
                          glowScale = baseScale * (1.0 + easeExp * 2500.0);
                      }
                  }
                  
                  chestGlowRef.current.style.opacity = glowOpacity;
                  chestGlowRef.current.style.transform = `scale(${glowScale})`;
                  
                  // Phase 4: Fade Intro out to reveal Homepage (t4a: 4.0 to 4.5)
                  if (t4a > 4.0) {
                      const fadeOut = Math.max(1.0 - (t4a - 4.0) / 0.5, 0);
                      mainWrapperRef.current.style.opacity = fadeOut;
                      
                      if (fadeOut === 0) {
                          mainWrapperRef.current.style.display = 'none';
                      }
                  } else {
                      mainWrapperRef.current.style.opacity = 1;
                      mainWrapperRef.current.style.display = 'block';
                  }
              }
          }
      } else {
          if (lumiContainerRef.current) lumiContainerRef.current.style.opacity = 0;
          if (silhouetteRef.current) silhouetteRef.current.style.opacity = 0;
          if (lumiImgRef.current) lumiImgRef.current.style.opacity = 0;
          if (capeRef.current) capeRef.current.style.opacity = 0;
          if (chestGlowRef.current) chestGlowRef.current.style.opacity = 0;
      }

      // 5. Film Grain Overlay
      ctx.globalAlpha = 1.0; 
      ctx.globalCompositeOperation = 'overlay';
      
      const grainTick = Math.floor(frameCount / 4);
      const grainOffsetX = ((grainTick * 123) % noiseSize);
      const grainOffsetY = ((grainTick * 321) % noiseSize);
      
      for(let x = -grainOffsetX; x < w; x += noiseSize) {
        for(let y = -grainOffsetY; y < h; y += noiseSize) {
          ctx.drawImage(noiseCanvas, x, y);
        }
      }
      
      ctx.globalCompositeOperation = 'source-over';
      
      // Stop rendering after transition is completely finished (t4a > 4.6 / elapsed > 9.2)
      if (elapsed > 9.2) {
          // The intro is fully invisible and display: none. Halt loop.
          return;
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div ref={mainWrapperRef} className="fixed inset-0 z-[9999] bg-[#020204] overflow-hidden pointer-events-none" style={{ willChange: 'opacity' }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Layer 4A: Lumi Reveal DOM Layer */}
      <div 
        ref={lumiContainerRef} 
        className="absolute inset-0 flex items-center justify-center opacity-0 scale-[0.95]" 
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
          {/* Cape (Behind Lumi) */}
          <img
            ref={capeRef}
            src="/lumi-cape-transparent.png"
            className="absolute inset-0 object-contain w-full h-full pointer-events-none"
            style={{ 
              willChange: 'opacity, transform',
              opacity: 0,
              // These will be tuned via rAF animation
              transformOrigin: '85% 45%',
              transform: 'scale(1.05) translate(-5%, -5%) rotate(0deg)'
            }}
            alt=""
          />
          {/* Silhouette */}
          <img 
            ref={silhouetteRef}
            src="/lumi-capeless-v3.png" 
            className="absolute inset-0 w-full h-full object-contain"
            style={{ willChange: 'opacity, filter' }}
            alt=""
          />
          {/* Full Reveal */}
          <img 
            ref={lumiImgRef}
            src="/lumi-capeless-v3.png" 
            className="absolute inset-0 w-full h-full object-contain"
            style={{ willChange: 'mask-image, opacity' }}
            alt="Lumi"
          />
          {/* Layer 5: Chest Glow Expansion */}
          <div
            ref={chestGlowRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '56%',
              top: '42.5%',
              width: '200px',
              height: '200px',
              marginLeft: '-100px',
              marginTop: '-100px',
              background: `
                radial-gradient(ellipse 3% 100% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,215,0,0.8) 30%, rgba(255,165,0,0) 70%),
                radial-gradient(ellipse 100% 3% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,215,0,0.8) 30%, rgba(255,165,0,0) 70%),
                radial-gradient(circle at 50% 50%, rgba(255,255,240,1) 0%, rgba(255,215,0,1) 15%, rgba(255,165,0,0.6) 35%, rgba(255,140,0,0) 60%)
              `,
              opacity: 0,
              transform: 'scale(0.02)',
              willChange: 'opacity, transform'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TheSignalIntro;
