/* Original procedural artwork for VIGOR CLUB. Runs inside Chromium (canvas 2D).
   Everything is generated from code in this file: stylised, flat-lit athletic scenes and
   silhouettes on charcoal with acid-lime rim light. No third-party imagery is used. */
(function () {
  const C = { ink: '#08090A', char: '#101214', graph: '#1A1D20', steel: '#2A2E33', mid: '#4A5057', bone: '#F1EDE4', lime: '#C8FF2E', limeDeep: '#8FB81A', warm: '#E9DCC4' };
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  function backdrop(ctx, w, h, o, rand) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, o.top || '#15181B'); g.addColorStop(0.62, o.mid || C.char); g.addColorStop(1, o.bot || C.ink);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    glow(ctx, w * (o.gx ?? 0.7), h * (o.gy ?? 0.35), Math.max(w, h) * (o.gr ?? 0.55), o.glow || C.lime, o.ga ?? 0.16);
    glow(ctx, w * (o.gx2 ?? 0.15), h * 0.9, Math.max(w, h) * 0.45, C.bone, 0.05);
    for (let i = 0; i < 6; i++) { // haze
      ctx.save(); ctx.filter = 'blur(60px)'; ctx.fillStyle = rgba(C.bone, 0.025 + rand() * 0.03);
      ctx.beginPath(); ctx.ellipse(rand() * w, h * (0.3 + rand() * 0.5), w * (0.15 + rand() * 0.25), h * 0.06, 0, 0, 7); ctx.fill(); ctx.restore();
    }
  }
  function glow(ctx, x, y, r, color, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function floor(ctx, w, h, y0, a = 0.5) { const g = ctx.createLinearGradient(0, y0, 0, h); g.addColorStop(0, rgba('#000000', 0)); g.addColorStop(1, rgba('#000000', a)); ctx.fillStyle = g; ctx.fillRect(0, y0, w, h - y0); ctx.strokeStyle = rgba(C.bone, 0.08); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(w, y0); ctx.stroke(); }
  function shafts(ctx, w, h, n, rand, x0 = 0, x1 = 1, a = 0.07) {
    for (let i = 0; i < n; i++) {
      const x = w * (x0 + (x1 - x0) * rand()), wd = w * (0.03 + rand() * 0.06), sk = w * (0.25 + rand() * 0.2);
      const g = ctx.createLinearGradient(x, 0, x - sk, h); g.addColorStop(0, rgba(C.bone, a * (0.6 + rand()))); g.addColorStop(1, rgba(C.bone, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + wd, 0); ctx.lineTo(x + wd - sk, h); ctx.lineTo(x - sk, h); ctx.fill();
    }
  }
  function grainVig(ctx, w, h, rand, vig = 0.6) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (rand() - 0.5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(id, 0, 0);
  }

  /* ---------- equipment ---------- */
  function plate(ctx, x, y, r, rim) {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, '#3a3f45'); g.addColorStop(1, '#14161a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(C.bone, 0.1); ctx.lineWidth = Math.max(1, r * 0.03);
    [0.82, 0.62].forEach((k) => { ctx.beginPath(); ctx.arc(x, y, r * k, 0, 7); ctx.stroke(); });
    ctx.fillStyle = '#0a0b0c'; ctx.beginPath(); ctx.arc(x, y, r * 0.16, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(rim || C.lime, 0.9); ctx.lineWidth = Math.max(2, r * 0.045); ctx.beginPath(); ctx.arc(x, y, r - ctx.lineWidth / 2, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
  }
  function kettlebell(ctx, x, y, s, rim) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const body = ctx.createRadialGradient(-20, -20, 6, 0, 0, 90); body.addColorStop(0, '#42474d'); body.addColorStop(1, '#0d0e10');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill();
    ctx.lineWidth = 22; ctx.strokeStyle = '#16181b'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-42, -52); ctx.bezierCurveTo(-46, -150, 46, -150, 42, -52); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = rgba(rim || C.lime, 0.9); ctx.beginPath(); ctx.arc(0, 0, 78, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-46, -64); ctx.bezierCurveTo(-50, -140, 0, -150, 10, -146); ctx.stroke();
    ctx.restore();
  }
  function barbell(ctx, x0, x1, y, plates, rim) {
    ctx.fillStyle = '#9aa0a6'; ctx.fillRect(x0, y - 4, x1 - x0, 8); ctx.fillStyle = rgba('#ffffff', 0.5); ctx.fillRect(x0, y - 4, x1 - x0, 2);
    plates.forEach(([dx, r]) => { plate(ctx, x0 + dx, y, r, rim); plate(ctx, x1 - dx, y, r, rim); });
  }

  /* ---------- athlete figure (flat side-view with rim light) ---------- */
  const POSES = {
    press: { head: [0.03, -0.93], neck: [0.02, -0.86], sh: [0.02, -0.8], hip: [0, -0.5], kneeN: [0.03, -0.25], footN: [0.06, 0], kneeF: [-0.02, -0.25], footF: [-0.06, 0], elN: [0.1, -0.93], hN: [0.07, -1.12], elF: [0.0, -0.95], hF: [0.04, -1.12], bar: [0.055, -1.14] },
    dead: { head: [0.28, -0.7], neck: [0.2, -0.66], sh: [0.13, -0.62], hip: [-0.13, -0.46], kneeN: [0.08, -0.25], footN: [0.02, 0], kneeF: [0.05, -0.25], footF: [-0.04, 0], elN: [0.13, -0.45], hN: [0.12, -0.27], elF: [0.1, -0.45], hF: [0.1, -0.27], bar: [0.11, -0.27] },
    squat: { head: [0.1, -0.86], neck: [0.06, -0.8], sh: [0.02, -0.74], hip: [-0.14, -0.4], kneeN: [0.2, -0.34], footN: [0.1, 0], kneeF: [0.17, -0.34], footF: [0.04, 0], elN: [-0.06, -0.62], hN: [0.08, -0.76], elF: [-0.05, -0.64], hF: [0.06, -0.77], bar: [-0.01, -0.77] },
    sprint: { head: [0.14, -0.94], neck: [0.1, -0.87], sh: [0.06, -0.8], hip: [-0.02, -0.52], kneeN: [0.2, -0.46], footN: [0.12, -0.2], kneeF: [-0.14, -0.28], footF: [-0.34, -0.16], elN: [0.2, -0.72], hN: [0.26, -0.84], elF: [-0.1, -0.68], hF: [-0.2, -0.56] },
    box: { head: [0.1, -0.9], neck: [0.07, -0.84], sh: [0.04, -0.78], hip: [-0.03, -0.5], kneeN: [0.14, -0.26], footN: [0.18, 0], kneeF: [-0.1, -0.26], footF: [-0.22, 0], elN: [0.2, -0.68], hN: [0.3, -0.8], elF: [0.14, -0.6], hF: [0.36, -0.66], glove: true },
    lunge: { head: [0.06, -0.9], neck: [0.04, -0.84], sh: [0.02, -0.78], hip: [0, -0.42], kneeN: [0.26, -0.4], footN: [0.28, 0], kneeF: [-0.16, -0.14], footF: [-0.36, -0.02], elN: [0.02, -0.98], hN: [0.04, -1.16], elF: [0.0, -0.99], hF: [0.02, -1.16] },
    swing: { head: [0.15, -0.88], neck: [0.1, -0.82], sh: [0.05, -0.76], hip: [-0.12, -0.5], kneeN: [0.06, -0.28], footN: [0.05, 0], kneeF: [0.03, -0.28], footF: [-0.04, 0], elN: [0.2, -0.64], hN: [0.34, -0.58], elF: [0.18, -0.66], hF: [0.33, -0.6], kb: [0.38, -0.5] },
    stand: { head: [0.02, -0.92], neck: [0.02, -0.85], sh: [0.0, -0.8], hip: [0, -0.5], kneeN: [0.02, -0.25], footN: [0.04, 0], kneeF: [-0.02, -0.25], footF: [-0.05, 0], elN: [0.02, -0.58], hN: [0.04, -0.4], elF: [-0.02, -0.58], hF: [0.0, -0.4] }
  };
  function limb(ctx, a, b, wA, wB, S, ox, oy) {
    const ax = ox + a[0] * S, ay = oy + a[1] * S, bx = ox + b[0] * S, by = oy + b[1] * S;
    const ang = Math.atan2(by - ay, bx - ax) + Math.PI / 2, wa = wA * S / 2, wb = wB * S / 2;
    ctx.beginPath(); ctx.moveTo(ax + Math.cos(ang) * wa, ay + Math.sin(ang) * wa); ctx.lineTo(bx + Math.cos(ang) * wb, by + Math.sin(ang) * wb);
    ctx.lineTo(bx - Math.cos(ang) * wb, by - Math.sin(ang) * wb); ctx.lineTo(ax - Math.cos(ang) * wa, ay - Math.sin(ang) * wa); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(bx, by, wb, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(ax, ay, wa, 0, 7); ctx.fill();
  }
  function paintFigure(ctx, p, S, ox, oy, fill) {
    ctx.fillStyle = fill;
    limb(ctx, p.hip, p.kneeF, 0.14, 0.09, S, ox, oy); limb(ctx, p.kneeF, p.footF, 0.085, 0.055, S, ox, oy);
    limb(ctx, p.sh, p.elF, 0.075, 0.058, S, ox, oy); limb(ctx, p.elF, p.hF, 0.058, 0.044, S, ox, oy);
    limb(ctx, p.hip, p.sh, 0.18, 0.26, S, ox, oy);
    limb(ctx, p.hip, p.kneeN, 0.15, 0.095, S, ox, oy); limb(ctx, p.kneeN, p.footN, 0.09, 0.058, S, ox, oy);
    limb(ctx, p.sh, p.elN, 0.085, 0.064, S, ox, oy); limb(ctx, p.elN, p.hN, 0.064, 0.048, S, ox, oy);
    limb(ctx, p.sh, p.neck, 0.1, 0.075, S, ox, oy);
    ctx.beginPath(); ctx.ellipse(ox + p.head[0] * S, oy + p.head[1] * S, 0.058 * S, 0.07 * S, 0.3, 0, 7); ctx.fill();
    [p.footN, p.footF].forEach((f) => { ctx.beginPath(); ctx.ellipse(ox + (f[0] + 0.035) * S, oy + (f[1] - 0.012) * S, 0.06 * S, 0.026 * S, 0, 0, 7); ctx.fill(); });
  }
  function athlete(ctx, name, S, ox, oy, o = {}) {
    const p = POSES[name], flip = o.flip ? -1 : 1;
    ctx.save(); ctx.translate(ox, 0); ctx.scale(flip, 1);
    // rim light pass (offset copy in lime), then dark body
    if (o.rimGlow !== false) { ctx.save(); ctx.filter = `blur(${Math.max(2, S * 0.006)}px)`; paintFigure(ctx, p, S, -S * 0.012, oy - S * 0.004, rgba(o.rim || C.lime, 0.95)); ctx.restore(); }
    paintFigure(ctx, p, S, 0, oy, o.body || '#07080a');
    // equipment
    if (p.bar) {
      const bx = p.bar[0] * S, by = oy + p.bar[1] * S;
      if (name === 'press') { barbell(ctx, bx - S * 0.5, bx + S * 0.5, by, [[S * 0.03, S * 0.1], [S * 0.075, S * 0.1], [S * 0.12, S * 0.08]], o.rim); }
      else { const r = S * (name === 'dead' ? 0.14 : 0.13); plate(ctx, bx, by, r, o.rim); plate(ctx, bx, by, r * 0.99, o.rim); ctx.fillStyle = '#9aa0a6'; ctx.fillRect(bx - S * 0.02, by - 3, S * 0.04, 6); }
    }
    if (p.kb) kettlebell(ctx, p.kb[0] * S, oy + p.kb[1] * S, S / 900, o.rim);
    if (p.glove) { [p.hN, p.hF].forEach((g) => { ctx.fillStyle = '#0a0b0c'; ctx.beginPath(); ctx.arc(g[0] * S, oy + g[1] * S, 0.05 * S, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(o.rim || C.lime, 0.95); ctx.lineWidth = Math.max(2, S * 0.006); ctx.beginPath(); ctx.arc(g[0] * S, oy + g[1] * S, 0.05 * S, Math.PI * 1.1, Math.PI * 1.8); ctx.stroke(); }); }
    ctx.restore();
  }
  function bust(ctx, w, h, rand, o) { // portrait silhouette: shoulders + head, rim lit
    const cx = w * 0.5, base = h * 1.02, hr = w * 0.15;
    const fill = (col, dx, dy) => {
      ctx.fillStyle = col; ctx.beginPath();
      ctx.moveTo(cx - w * 0.5 + dx, base + dy); ctx.bezierCurveTo(cx - w * 0.5 + dx, h * 0.76 + dy, cx - w * 0.3 + dx, h * 0.7 + dy, cx - hr * 0.5 + dx, h * 0.66 + dy);
      ctx.lineTo(cx + hr * 0.5 + dx, h * 0.66 + dy); ctx.bezierCurveTo(cx + w * 0.3 + dx, h * 0.7 + dy, cx + w * 0.5 + dx, h * 0.76 + dy, cx + w * 0.5 + dx, base + dy); ctx.fill();
      ctx.fillRect(cx - hr * 0.38 + dx, h * 0.5 + dy, hr * 0.76, h * 0.2);
      ctx.beginPath(); ctx.ellipse(cx + dx, h * 0.42 + dy, hr, hr * 1.22, 0, 0, 7); ctx.fill();
      if (o.hair === 'bun') { ctx.beginPath(); ctx.arc(cx + dx, h * 0.27 + dy, hr * 0.5, 0, 7); ctx.fill(); }
      if (o.hair === 'long') { ctx.beginPath(); ctx.ellipse(cx + dx, h * 0.5 + dy, hr * 1.25, hr * 1.9, 0, 0, 7); ctx.fill(); }
      if (o.hair === 'cap') { ctx.beginPath(); ctx.ellipse(cx + dx, h * 0.37 + dy, hr * 1.06, hr * 0.8, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(cx + dx, h * 0.355 + dy, hr * 1.5, hr * 0.14); }
    };
    ctx.save(); ctx.filter = `blur(${w * 0.004}px)`; fill(rgba(o.rim || C.lime, 0.95), -w * 0.016, -w * 0.006); ctx.restore();
    fill('#0b0c0e', 0, 0);
    // soft key light on face side
    const g = ctx.createLinearGradient(cx - hr, 0, cx + hr, 0); g.addColorStop(0, rgba(C.bone, 0.0)); g.addColorStop(1, rgba(C.bone, 0.06)); ctx.fillStyle = g; ctx.fillRect(cx - hr * 1.3, h * 0.28, hr * 2.6, h * 0.4);
  }

  /* ---------- scenes ---------- */
  const S = {
    hall(ctx, w, h, rand, o) { // cinematic hall: shafts, rack silhouettes, lifter
      backdrop(ctx, w, h, { gx: 0.68, gy: 0.4, gr: 0.6, ga: 0.2, ...o }, rand); shafts(ctx, w, h, 9, rand, 0.1, 0.95, 0.06);
      const fy = h * 0.8; floor(ctx, w, h, fy, 0.65);
      // distant racks
      ctx.strokeStyle = rgba(C.bone, 0.07); ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) { const x = w * (0.04 + i * 0.14) + rand() * 20; ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy - h * 0.34); ctx.moveTo(x + w * 0.08, fy); ctx.lineTo(x + w * 0.08, fy - h * 0.34); ctx.moveTo(x, fy - h * 0.34); ctx.lineTo(x + w * 0.08, fy - h * 0.34); ctx.stroke(); }
      // floor reflection streaks
      for (let i = 0; i < 14; i++) { ctx.fillStyle = rgba(C.lime, 0.02 + rand() * 0.04); ctx.fillRect(w * rand(), fy + 6, 2 + rand() * 3, h * 0.2 * rand()); }
      athlete(ctx, o.pose || 'press', h * (o.s ?? 0.62), w * (o.ax ?? 0.68), fy, o);
      // chalk dust
      for (let i = 0; i < 70; i++) { ctx.fillStyle = rgba(C.bone, 0.05 + rand() * 0.2); ctx.beginPath(); ctx.arc(w * (0.4 + rand() * 0.5), h * (0.25 + rand() * 0.55), 0.6 + rand() * 1.8, 0, 7); ctx.fill(); }
    },
    lifter(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.5, ga: 0.2, ...o }, rand); shafts(ctx, w, h, 4, rand, 0.2, 0.8, 0.05); const fy = h * 0.86; floor(ctx, w, h, fy, 0.6); athlete(ctx, o.pose || 'dead', h * 0.7, w * 0.5, fy, o); },
    barbell(ctx, w, h, rand, o) { // macro: stacked plates side view
      backdrop(ctx, w, h, { gx: 0.3, gy: 0.4, ga: 0.18, ...o }, rand); const fy = h * 0.82; floor(ctx, w, h, fy, 0.6);
      const r = h * 0.36; ctx.fillStyle = '#9aa0a6'; ctx.fillRect(w * 0.1, h * 0.46 - 8, w * 0.9, 16);
      plate(ctx, w * 0.5, h * 0.46, r, C.lime); plate(ctx, w * 0.28, h * 0.46, r * 0.82, C.bone);
      ctx.fillStyle = rgba('#000', 0.55); ctx.fillRect(0, 0, w * 0.12, h);
    },
    kettlebells(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.3, ga: 0.2, ...o }, rand); const fy = h * 0.78; floor(ctx, w, h, fy, 0.65);
      const n = o.n || 5; for (let i = 0; i < n; i++) { const s = 0.9 + i * 0.22 * (o.asc === false ? 0 : 1); const x = w * (0.15 + 0.7 * i / (n - 1)); kettlebell(ctx, x, fy - 80 * s * h / 1000, s * h / 1000 * 1.1, i === (o.hl ?? 2) ? C.lime : C.bone); }
      shafts(ctx, w, h, 3, rand, 0.2, 0.8, 0.05); },
    boxing(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.35, gy: 0.35, ga: 0.2, ...o }, rand); const fy = h * 0.86; floor(ctx, w, h, fy, 0.6);
      const bx = w * 0.3; ctx.strokeStyle = '#555a60'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - 30, 0); ctx.lineTo(bx, h * 0.12); ctx.moveTo(bx + 30, 0); ctx.lineTo(bx, h * 0.12); ctx.stroke();
      const g = ctx.createLinearGradient(bx - 70, 0, bx + 70, 0); g.addColorStop(0, '#0c0d0f'); g.addColorStop(0.7, '#23272b'); g.addColorStop(1, '#3d4349'); ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(bx - 70, h * 0.12, 140, h * 0.52, 40); ctx.fill(); ctx.strokeStyle = rgba(C.lime, 0.9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx + 66, h * 0.2); ctx.lineTo(bx + 66, h * 0.56); ctx.stroke();
      athlete(ctx, 'box', h * 0.68, w * 0.58, fy, o); },
    ropes(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.6, gy: 0.5, ga: 0.2, ...o }, rand); shafts(ctx, w, h, 5, rand, 0.2, 0.9, 0.05);
      for (let k = 0; k < 3; k++) { ctx.lineWidth = h * 0.028; ctx.lineCap = 'round'; ctx.strokeStyle = k === 1 ? C.lime : rgba(C.bone, 0.85); if (k === 1) { ctx.shadowColor = C.lime; ctx.shadowBlur = 30; }
        ctx.beginPath(); const y0 = h * (0.45 + k * 0.1), ph = rand() * 3; for (let x = w * 0.62; x >= -10; x -= 8) { const t = (w * 0.62 - x) / w; ctx.lineTo(x, y0 + Math.sin(t * 22 + ph) * h * 0.14 * Math.min(1, t * 3) + t * 60); } ctx.stroke(); ctx.shadowBlur = 0; }
      athlete(ctx, 'swing', h * 0.66, w * 0.82, h * 0.88, { ...o, flip: true }); floor(ctx, w, h, h * 0.88, 0.5); },
    track(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.2, ga: 0.22, top: '#1a1d1f', ...o }, rand);
      const vx = w * 0.62, vy = h * 0.46; for (let i = -6; i <= 8; i++) { ctx.strokeStyle = rgba(i === 1 ? C.lime : C.bone, i === 1 ? 0.8 : 0.16); ctx.lineWidth = i === 1 ? 5 : 2; ctx.beginPath(); ctx.moveTo(vx + i * 4, vy); ctx.lineTo(vx + (i - 1) * w * 0.34, h); ctx.stroke(); }
      for (let j = 1; j < 9; j++) { const y = vy + (h - vy) * Math.pow(j / 9, 2.1); ctx.strokeStyle = rgba(C.bone, 0.05); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      athlete(ctx, 'sprint', h * 0.78, w * 0.42, h * 0.92, o); },
    cage(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.3, ga: 0.18, ...o }, rand); const fy = h * 0.84; floor(ctx, w, h, fy, 0.6);
      ctx.strokeStyle = '#2d3136'; ctx.lineWidth = w * 0.022; ctx.lineCap = 'square'; const L = w * 0.22, R = w * 0.78, T = h * 0.08;
      ctx.beginPath(); ctx.moveTo(L, fy); ctx.lineTo(L, T); ctx.lineTo(R, T); ctx.lineTo(R, fy); ctx.stroke();
      ctx.lineWidth = w * 0.012; ctx.strokeStyle = rgba(C.lime, 0.85); ctx.beginPath(); ctx.moveTo(L - 4, fy - h * 0.15); ctx.lineTo(L + 30, fy - h * 0.15); ctx.moveTo(R - 30, fy - h * 0.15); ctx.lineTo(R + 4, fy - h * 0.15); ctx.stroke();
      barbell(ctx, w * 0.14, w * 0.86, fy - h * 0.46, [[w * 0.04, h * 0.16], [w * 0.09, h * 0.16], [w * 0.14, h * 0.12]], C.lime);
      for (let i = 0; i < 6; i++) plate(ctx, w * (0.06 + i * 0.02), fy - h * 0.06 - (i % 3) * 4, h * 0.06, C.bone); },
    studio(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.1, ga: 0.22, top: '#1e2124', ...o }, rand); shafts(ctx, w, h, 8, rand, 0, 1, 0.06); const fy = h * 0.9; floor(ctx, w, h, fy, 0.5);
      const poses = ['lunge', 'stand', 'swing', 'lunge', 'press']; const n = o.n || 5;
      for (let i = 0; i < n; i++) { const t = i / (n - 1); const sz = h * (0.5 + (i % 2) * 0.1); athlete(ctx, poses[i % poses.length], sz, w * (0.14 + 0.72 * t), fy - (i % 2) * h * 0.04, { rim: i === 2 ? C.lime : C.bone, flip: i % 2 === 1, rimGlow: true }); } },
    cardio(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.8, gy: 0.3, gr: 0.7, ga: 0.2, ...o }, rand); const fy = h * 0.82; floor(ctx, w, h, fy, 0.55);
      // window grid
      ctx.fillStyle = rgba(C.bone, 0.06); for (let i = 0; i < 5; i++) ctx.fillRect(w * (0.06 + i * 0.19), h * 0.08, w * 0.16, h * 0.46);
      ctx.fillStyle = '#0a0b0c';
      for (let i = 0; i < 4; i++) { const x = w * (0.1 + i * 0.22), s = h * 0.5; ctx.save(); ctx.translate(x, fy); // treadmill
        ctx.fillRect(0, -s * 0.16, s * 0.62, s * 0.1); ctx.lineWidth = 10; ctx.strokeStyle = '#0a0b0c'; ctx.beginPath(); ctx.moveTo(s * 0.5, -s * 0.12); ctx.lineTo(s * 0.52, -s * 0.78); ctx.lineTo(s * 0.64, -s * 0.8); ctx.stroke();
        ctx.fillRect(s * 0.46, -s * 0.86, s * 0.22, s * 0.1); ctx.strokeStyle = rgba(i === 1 ? C.lime : C.bone, 0.85); ctx.lineWidth = 3; ctx.strokeRect(s * 0.46, -s * 0.86, s * 0.22, s * 0.1); ctx.restore(); } },
    recovery(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.7, gr: 0.7, ga: 0.14, glow: C.warm, top: '#1b1714', mid: '#14110f', ...o }, rand);
      for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 2 ? '#2a211a' : '#1c1612'; ctx.fillRect(0, h * (0.04 + i * 0.055), w, h * 0.04); ctx.fillStyle = rgba(C.warm, 0.05); ctx.fillRect(0, h * (0.04 + i * 0.055), w, 2); }
      glow(ctx, w * 0.5, h * 0.86, w * 0.5, '#ff8a3c', 0.28);
      for (let i = 0; i < 9; i++) { ctx.save(); ctx.filter = 'blur(26px)'; ctx.fillStyle = rgba(C.bone, 0.05 + rand() * 0.05); ctx.beginPath(); ctx.ellipse(w * rand(), h * (0.3 + rand() * 0.6), w * 0.12, h * 0.05, 0, 0, 7); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = '#0d0b09'; ctx.fillRect(0, h * 0.84, w, h * 0.16); ctx.fillStyle = rgba(C.lime, 0.8); ctx.fillRect(0, h * 0.84, w, 3); },
    water(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.5, ga: 0.22, top: '#0f1618', mid: '#0c1214', ...o }, rand);
      for (let i = 1; i < 14; i++) { ctx.strokeStyle = rgba(i % 5 === 0 ? C.lime : C.bone, i % 5 === 0 ? 0.7 : 0.12); ctx.lineWidth = 2 + (i % 5 === 0 ? 2 : 0); ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.55, i * w * 0.045, i * w * 0.045 * 0.32, 0, 0, 7); ctx.stroke(); } },
    mobility(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.45, gr: 0.5, ga: 0.2, ...o }, rand); const fy = h * 0.84; floor(ctx, w, h, fy, 0.6);
      ctx.strokeStyle = rgba(C.lime, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.45, h * 0.38, 0, 7); ctx.stroke(); athlete(ctx, 'lunge', h * 0.66, w * 0.52, fy, o); },
    stripes(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.5, ga: 0.15, ...o }, rand); ctx.save(); ctx.rotate(-0.28); for (let i = -4; i < 24; i++) { const x = i * w * 0.07; ctx.fillStyle = i % 5 === 2 ? rgba(C.lime, 0.9) : rgba(C.bone, 0.04 + (i % 3) * 0.02); ctx.fillRect(x, -h * 0.4, w * (i % 5 === 2 ? 0.012 : 0.03), h * 2); } ctx.restore();
      if (o.plates) { plate(ctx, w * 0.62, h * 0.5, h * 0.34, C.lime); } },
    portrait(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.35, gr: 0.6, ga: 0.2, top: o.top || '#1d2023', ...o }, rand); bust(ctx, w, h, rand, o); },
    mapgrid(ctx, w, h, rand, o) { backdrop(ctx, w, h, { gx: 0.5, gy: 0.5, ga: 0.12, ...o }, rand); ctx.strokeStyle = rgba(C.bone, 0.08); ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(w * (rand() * 1.2 - 0.1), 0); ctx.lineTo(w * (rand() * 1.2 - 0.1), h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, h * rand()); ctx.lineTo(w, h * rand()); ctx.stroke(); }
      ctx.strokeStyle = rgba(C.lime, 0.55); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, h * 0.7); ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.9, w, h * 0.35); ctx.stroke(); }
  };

  window.renderScene = function (canvas, { scene, w, h, seed, opts }) {
    canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d', { willReadFrequently: true }); const rand = rng(seed);
    S[scene](ctx, w, h, rand, opts || {}); grainVig(ctx, w, h, rng(seed + 99), (opts && opts.vig) ?? 0.62);
  };
})();
