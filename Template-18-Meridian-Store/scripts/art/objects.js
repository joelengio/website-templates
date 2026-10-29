/* Original procedural still-life objects for MERIDIAN STORE (Canvas 2D, runs inside Chromium).
   Every object is drawn from code: no photographs, stock images or third-party artwork are used.
   Coordinates: origin = centre of the object's base on the floor, y grows downwards (so up is negative).
   `u` is the object's largest nominal dimension in pixels. `c` = { a: main, b: accent, d: dark }. */
(function () {
  const TAU = Math.PI * 2;
  const hex = (c) => { if (c[0] === 'r') { const m = c.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2]]; } const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (a, al = 1) => `rgba(${a.map(Math.round).join(',')},${al})`;
  /** Lighten (t > 0) or darken (t < 0) a hex colour. */
  const sh = (c, t, al = 1) => {
    const [r, g, b] = hex(c); const k = Math.abs(t); const tg = t > 0 ? [255, 250, 241] : [26, 19, 14];
    return rgba([r + (tg[0] - r) * k, g + (tg[1] - g) * k, b + (tg[2] - b) * k], al);
  };
  const mixc = (a, b, t) => { const x = hex(a), y = hex(b); return rgba(x.map((v, i) => v + (y[i] - v) * t)); };
  const lg = (ctx, x0, y0, x1, y1, stops) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };
  /** Horizontal "cylinder" shading with light from the upper left. */
  const cyl = (ctx, x0, x1, c, k = 1) => lg(ctx, x0, 0, x1, 0, [[0, sh(c, -0.16 * k)], [0.16, sh(c, 0.14 * k)], [0.3, sh(c, 0.2 * k)], [0.58, c], [0.84, sh(c, -0.2 * k)], [1, sh(c, -0.34 * k)]]);
  const vert = (ctx, y0, y1, c, k = 1) => lg(ctx, 0, y0, 0, y1, [[0, sh(c, 0.14 * k)], [0.5, c], [1, sh(c, -0.22 * k)]]);
  const rr = (ctx, x, y, w, h, r) => { const q = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + q, y); ctx.arcTo(x + w, y, x + w, y + h, q); ctx.arcTo(x + w, y + h, x, y + h, q); ctx.arcTo(x, y + h, x, y, q); ctx.arcTo(x, y, x + w, y, q); ctx.closePath(); };
  const blurDo = (ctx, px, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); };
  /** Smooth closed path through mirrored profile points: pts = [[t(0..1 up), halfWidth(fraction of u)]]. */
  const lathe = (ctx, pts, u) => {
    const R = pts.map(([t, w]) => [w * u, -t * u]);
    const L = pts.map(([t, w]) => [-w * u, -t * u]).reverse();
    const all = [...R, ...L];
    ctx.beginPath(); ctx.moveTo(all[0][0], all[0][1]);
    for (let i = 0; i < all.length; i++) { const p = all[i], n = all[(i + 1) % all.length]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + n[0]) / 2, (p[1] + n[1]) / 2); }
    ctx.closePath();
  };
  const gloss = (ctx, x, y, w, h, a = 0.35) => blurDo(ctx, Math.max(2, w * 0.35), () => { ctx.fillStyle = `rgba(255,252,244,${a})`; rr(ctx, x, y, w, h, w / 2); ctx.fill(); });
  const speckle = (ctx, r, u, n, col) => { for (let i = 0; i < n; i++) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc((r() - 0.5) * u * 0.9, -r() * u, 0.6 + r() * 1.4, 0, TAU); ctx.fill(); } };
  const stitch = (ctx, fn, col, w = 1.6) => { ctx.save(); ctx.setLineDash([w * 3, w * 2.2]); ctx.strokeStyle = col; ctx.lineWidth = w; fn(); ctx.stroke(); ctx.restore(); };
  const leafShape = (ctx, len, wid, fill, vein) => {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(wid, -len * 0.25, wid * 0.9, -len * 0.75, 0, -len); ctx.bezierCurveTo(-wid * 0.9, -len * 0.75, -wid, -len * 0.25, 0, 0);
    ctx.fillStyle = fill; ctx.fill(); if (vein) { ctx.strokeStyle = vein; ctx.lineWidth = Math.max(1, len * 0.012); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len * 0.92); ctx.stroke(); }
  };
  const fabricLines = (ctx, x, y, w, h, col, step, vertical) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); if (vertical) for (let i = x; i < x + w; i += step) { ctx.moveTo(i, y); ctx.lineTo(i, y + h); } else for (let j = y; j < y + h; j += step) { ctx.moveTo(x, j); ctx.lineTo(x + w, j); } ctx.stroke(); ctx.restore(); };

  const O = {};

  O.vase = (ctx, u, c, o, r) => {
    const shapes = {
      round: [[0, 0.13], [0.05, 0.21], [0.28, 0.31], [0.5, 0.3], [0.72, 0.18], [0.86, 0.1], [0.94, 0.1], [1, 0.12]],
      tall: [[0, 0.11], [0.04, 0.14], [0.5, 0.16], [0.85, 0.135], [0.94, 0.085], [1, 0.1]],
      bud: [[0, 0.07], [0.04, 0.11], [0.2, 0.15], [0.38, 0.1], [0.55, 0.035], [0.92, 0.035], [1, 0.05]],
      jug: [[0, 0.17], [0.04, 0.2], [0.4, 0.26], [0.7, 0.22], [0.84, 0.12], [0.93, 0.12], [1, 0.15]]
    };
    const pts = shapes[o.shape || 'round']; const mw = Math.max(...pts.map((p) => p[1])) * u;
    ctx.save(); lathe(ctx, pts, u); ctx.fillStyle = cyl(ctx, -mw, mw, c.a); ctx.fill(); ctx.clip();
    if (o.band) { ctx.fillStyle = sh(c.b, 0, 0.9); ctx.fillRect(-mw, -u * o.band[0], mw * 2, u * o.band[1]); }
    if (o.speckle) speckle(ctx, r, u * 0.7, 160, sh(c.d, 0, 0.45));
    ctx.restore();
    const top = pts[pts.length - 1][1] * u; ctx.fillStyle = sh(c.d, -0.2); ctx.beginPath(); ctx.ellipse(0, -u, top, top * 0.26, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh(c.a, 0.3, 0.9); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -u, top, top * 0.26, 0, Math.PI, TAU); ctx.stroke();
    gloss(ctx, -mw * 0.62, -u * 0.8, mw * 0.14, u * 0.5, 0.3);
    if (o.stems) { for (let i = 0; i < o.stems; i++) { ctx.save(); ctx.translate((i - (o.stems - 1) / 2) * top * 0.5, -u); ctx.rotate((i - (o.stems - 1) / 2) * 0.28); ctx.strokeStyle = '#6a6b48'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -u * 0.7); ctx.stroke(); ctx.translate(0, -u * 0.7); for (let k = 0; k < 6; k++) { ctx.save(); ctx.rotate(k * 0.5 - 1.3); leafShape(ctx, u * 0.13, u * 0.035, o.stemColor || '#d9cdb6'); ctx.restore(); } ctx.restore(); } }
  };

  O.bowl = (ctx, u, c, o, r) => {
    const W = u, H = u * (o.h || 0.38);
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-W / 2, -H); ctx.bezierCurveTo(-W * 0.5, -H * 0.1, -W * 0.3, 0, -W * 0.18, 0); ctx.lineTo(W * 0.18, 0); ctx.bezierCurveTo(W * 0.3, 0, W * 0.5, -H * 0.1, W / 2, -H); ctx.ellipse(0, -H, W / 2, W * 0.09, 0, 0, Math.PI, true); ctx.closePath();
    ctx.fillStyle = cyl(ctx, -W / 2, W / 2, c.a); ctx.fill(); ctx.clip();
    if (o.speckle) speckle(ctx, r, W * 0.6, 120, sh(c.d, 0, 0.4));
    ctx.restore();
    ctx.fillStyle = lg(ctx, -W / 2, 0, W / 2, 0, [[0, sh(c.a, -0.25)], [0.5, sh(c.a, 0.1)], [1, sh(c.a, -0.1)]]); ctx.beginPath(); ctx.ellipse(0, -H, W / 2, W * 0.09, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lg(ctx, 0, -H - W * 0.08, 0, -H + W * 0.08, [[0, sh(c.b || c.a, -0.18)], [1, sh(c.b || c.a, 0.08)]]); ctx.beginPath(); ctx.ellipse(0, -H + 1, W / 2 - W * 0.025, W * 0.075, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh(c.a, 0.35, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -H, W / 2, W * 0.09, 0, Math.PI, TAU); ctx.stroke();
    gloss(ctx, -W * 0.36, -H * 0.8, W * 0.035, H * 0.5, 0.25);
  };

  const mug = (ctx, x, y, s, c) => {
    const w = s * 0.5, h = s * 0.56;
    ctx.save(); ctx.translate(x, y);
    ctx.strokeStyle = sh(c.a, -0.18); ctx.lineWidth = s * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w / 2 - 2, -h * 0.78); ctx.bezierCurveTo(w * 0.95, -h * 0.85, w * 0.95, -h * 0.25, w / 2 - 2, -h * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w * 0.46, -h * 0.06); ctx.quadraticCurveTo(-w * 0.44, 0, -w * 0.3, 0); ctx.lineTo(w * 0.3, 0); ctx.quadraticCurveTo(w * 0.44, 0, w * 0.46, -h * 0.06); ctx.lineTo(w / 2, -h); ctx.ellipse(0, -h, w / 2, w * 0.1, 0, 0, Math.PI, true); ctx.closePath();
    ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a); ctx.fill();
    ctx.fillStyle = sh(c.d, 0, 0.9); ctx.beginPath(); ctx.ellipse(0, -h, w / 2, w * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh(c.b || '#3a2a20', 0, 0.95); ctx.beginPath(); ctx.ellipse(0, -h + 2, w / 2 - 4, w * 0.075, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh(c.a, 0.3, 0.8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -h, w / 2, w * 0.1, 0, Math.PI, TAU); ctx.stroke();
    gloss(ctx, -w * 0.34, -h * 0.85, w * 0.07, h * 0.6, 0.28);
    ctx.restore();
  };
  O.mugs = (ctx, u, c) => {
    blurDo(ctx, 8, () => { ctx.fillStyle = 'rgba(40,28,18,.22)'; ctx.beginPath(); ctx.ellipse(u * 0.04, 2, u * 0.5, u * 0.07, 0, 0, TAU); ctx.fill(); });
    mug(ctx, u * 0.18, -u * 0.06, u * 0.78, { ...c, a: sh(c.a, -0.06) }); mug(ctx, -u * 0.2, 0, u * 0.86, c);
  };

  O.candle = (ctx, u, c, o) => {
    const w = u * 0.62, h = u * 0.8;
    ctx.save(); rr(ctx, -w / 2, -h, w, h, u * 0.07); ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.d, 0.3, 0.75)], [0.2, sh('#ffffff', 0, 0.28)], [0.6, sh(c.d, 0.4, 0.55)], [1, sh(c.d, -0.1, 0.8)]]); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, -w / 2 + 5, -h * 0.82, w - 10, h * 0.8, u * 0.05); ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a); ctx.fill(); ctx.restore();
    ctx.fillStyle = sh(c.a, 0.1); ctx.beginPath(); ctx.ellipse(0, -h * 0.82, w / 2 - 5, w * 0.08, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2a211b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -h * 0.82); ctx.lineTo(0, -h * 0.9); ctx.stroke();
    if (o.label !== false) { ctx.fillStyle = sh(c.b || '#f3ead9', 0, 0.96); rr(ctx, -w * 0.32, -h * 0.58, w * 0.64, h * 0.3, 2); ctx.fill(); ctx.fillStyle = 'rgba(40,32,28,.55)'; ctx.fillRect(-w * 0.2, -h * 0.5, w * 0.4, 2); ctx.fillRect(-w * 0.12, -h * 0.43, w * 0.24, 1.5); }
    gloss(ctx, -w * 0.42, -h * 0.92, w * 0.07, h * 0.8, 0.4);
    if (o.lid) { ctx.save(); ctx.translate(w * 0.62, 0); rr(ctx, -w * 0.28, -u * 0.12, w * 0.56, u * 0.12, 3); ctx.fillStyle = cyl(ctx, -w * 0.28, w * 0.28, c.b || '#b49762'); ctx.fill(); ctx.restore(); }
  };

  O.bottle = (ctx, u, c, o, r) => {
    const w = u * 0.4, h = u * 0.62, kind = o.kind || 'dropper';
    ctx.save(); const body = () => { ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.82); ctx.quadraticCurveTo(-w / 2, -h * 0.9, -w * 0.3, -h * 0.92); ctx.lineTo(-w * 0.18, -h * 0.94); ctx.lineTo(w * 0.18, -h * 0.94); ctx.lineTo(w * 0.3, -h * 0.92); ctx.quadraticCurveTo(w / 2, -h * 0.9, w / 2, -h * 0.82); ctx.lineTo(w / 2, -h * 0.07); ctx.quadraticCurveTo(w / 2, 0, w * 0.4, 0); ctx.lineTo(-w * 0.4, 0); ctx.quadraticCurveTo(-w / 2, 0, -w / 2, -h * 0.07); ctx.closePath(); };
    body(); ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a, 1.1); ctx.fill(); ctx.clip();
    ctx.fillStyle = 'rgba(255,240,205,.16)'; ctx.fillRect(-w / 2, -h * 0.9, w, h * 0.12);
    if (o.label !== false) { ctx.fillStyle = sh(c.b || '#f2e9d8', 0, 0.97); ctx.fillRect(-w / 2, -h * 0.58, w, h * 0.36); ctx.fillStyle = 'rgba(40,30,24,.6)'; ctx.fillRect(-w * 0.3, -h * 0.46, w * 0.6, 2); ctx.fillRect(-w * 0.2, -h * 0.4, w * 0.4, 1.5); ctx.fillRect(-w * 0.22, -h * 0.3, w * 0.44, 1.2); }
    ctx.restore(); gloss(ctx, -w * 0.4, -h * 0.82, w * 0.07, h * 0.7, 0.4);
    const cw = w * 0.34;
    ctx.fillStyle = cyl(ctx, -cw, cw, c.d); rr(ctx, -cw, -h * 1.0, cw * 2, h * 0.08, 3); ctx.fill();
    if (kind === 'dropper') { ctx.fillStyle = cyl(ctx, -cw * 0.72, cw * 0.72, c.d, 1.2); ctx.beginPath(); ctx.moveTo(-cw * 0.72, -h * 1.0); ctx.lineTo(-cw * 0.72, -h * 1.2); ctx.quadraticCurveTo(0, -h * 1.34, cw * 0.72, -h * 1.2); ctx.lineTo(cw * 0.72, -h * 1.0); ctx.fill(); }
    else { ctx.fillStyle = cyl(ctx, -cw * 0.5, cw * 0.5, c.d, 1.2); ctx.fillRect(-cw * 0.5, -h * 1.12, cw, h * 0.12); rr(ctx, -cw * 1.1, -h * 1.22, cw * 2.1, h * 0.1, 3); ctx.fillStyle = cyl(ctx, -cw * 1.1, cw, c.d, 1.1); ctx.fill(); ctx.fillRect(cw * 0.9, -h * 1.2, cw * 0.9, h * 0.05); }
  };

  O.jar = (ctx, u, c) => {
    const w = u * 0.84, h = u * 0.46;
    ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a); rr(ctx, -w / 2, -h * 0.72, w, h * 0.72, h * 0.14); ctx.fill();
    ctx.fillStyle = cyl(ctx, -w * 0.52, w * 0.52, c.d); rr(ctx, -w * 0.52, -h, w * 1.04, h * 0.32, h * 0.1); ctx.fill();
    ctx.fillStyle = sh(c.d, 0.25); ctx.beginPath(); ctx.ellipse(0, -h, w * 0.52, w * 0.07, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh(c.d, 0.05); ctx.beginPath(); ctx.ellipse(0, -h, w * 0.46, w * 0.055, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh(c.b || '#f2e9d8', 0, 0.95); ctx.fillRect(-w * 0.28, -h * 0.5, w * 0.56, h * 0.2); ctx.fillStyle = 'rgba(40,30,24,.55)'; ctx.fillRect(-w * 0.2, -h * 0.43, w * 0.4, 2);
    gloss(ctx, -w * 0.42, -h * 0.68, w * 0.03, h * 0.5, 0.35);
  };

  O.perfume = (ctx, u, c) => {
    const w = u * 0.5, h = u * 0.62;
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, 0.1, 0.9)], [0.3, sh(c.a, 0.35, 0.8)], [0.7, sh(c.a, 0, 0.88)], [1, sh(c.a, -0.25, 0.95)]]); rr(ctx, -w / 2, -h, w, h, 5); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,240,.45)'; rr(ctx, -w / 2 + 4, -h + 4, w - 8, h * 0.16, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,240,.3)'; ctx.fillRect(-w / 2 + 3, -h * 0.1, w - 6, h * 0.08);
    ctx.fillStyle = sh(c.b || '#f2e9d8', 0, 0.96); ctx.fillRect(-w * 0.3, -h * 0.64, w * 0.6, h * 0.3); ctx.fillStyle = 'rgba(40,30,24,.6)'; ctx.fillRect(-w * 0.2, -h * 0.55, w * 0.4, 2); ctx.fillRect(-w * 0.14, -h * 0.48, w * 0.28, 1.5);
    gloss(ctx, -w * 0.42, -h * 0.9, w * 0.06, h * 0.7, 0.45);
    ctx.fillStyle = cyl(ctx, -w * 0.28, w * 0.28, c.d); rr(ctx, -w * 0.28, -h - h * 0.34, w * 0.56, h * 0.36, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(-w * 0.2, -h - h * 0.3, w * 0.06, h * 0.28);
  };

  O.diffuser = (ctx, u, c, o) => {
    const w = u * 0.42, h = u * 0.5; const bodyTop = -h;
    ctx.strokeStyle = '#a98d62'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    [-0.2, -0.08, 0.04, 0.16, 0.26].forEach((a, i) => { ctx.beginPath(); ctx.moveTo((i - 2) * 3, bodyTop - h * 0.02); ctx.lineTo((i - 2) * 3 + Math.sin(a * 2.2) * u * 0.62, bodyTop - u * 0.72 + Math.abs(a) * 30); ctx.stroke(); });
    ctx.save(); ctx.beginPath(); ctx.moveTo(-w * 0.12, bodyTop - h * 0.12); ctx.lineTo(-w * 0.12, bodyTop + h * 0.02); ctx.quadraticCurveTo(-w / 2, bodyTop + h * 0.18, -w / 2, bodyTop + h * 0.4); ctx.lineTo(-w / 2, -h * 0.05); ctx.quadraticCurveTo(-w / 2, 0, -w * 0.38, 0); ctx.lineTo(w * 0.38, 0); ctx.quadraticCurveTo(w / 2, 0, w / 2, -h * 0.05); ctx.lineTo(w / 2, bodyTop + h * 0.4); ctx.quadraticCurveTo(w / 2, bodyTop + h * 0.18, w * 0.12, bodyTop + h * 0.02); ctx.lineTo(w * 0.12, bodyTop - h * 0.12); ctx.closePath();
    ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a, 1.1); ctx.fill(); ctx.clip();
    ctx.fillStyle = sh(c.a, 0.08, 0.6); ctx.fillRect(-w / 2, bodyTop + h * 0.12, w, h * 0.8);
    if (o.label !== false) { ctx.fillStyle = sh(c.b || '#f2e9d8', 0, 0.96); ctx.fillRect(-w / 2, -h * 0.55, w, h * 0.34); ctx.fillStyle = 'rgba(40,30,24,.55)'; ctx.fillRect(-w * 0.28, -h * 0.42, w * 0.56, 2); }
    ctx.restore(); gloss(ctx, -w * 0.4, -h * 0.8, w * 0.07, h * 0.62, 0.4);
  };

  O.tote = (ctx, u, c, o, r) => {
    const w = u * (o.wide || 0.9), h = u * (o.tall || 0.72), tw = w * 0.86;
    ctx.strokeStyle = sh(c.a, -0.25); ctx.lineWidth = u * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-tw * 0.3, -h); ctx.bezierCurveTo(-tw * 0.3, -h - u * 0.42, tw * 0.3, -h - u * 0.42, tw * 0.3, -h); ctx.stroke();
    ctx.strokeStyle = sh(c.a, 0.1); ctx.lineWidth = u * 0.03; ctx.beginPath(); ctx.moveTo(-tw * 0.3, -h); ctx.bezierCurveTo(-tw * 0.3, -h - u * 0.42, tw * 0.3, -h - u * 0.42, tw * 0.3, -h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-tw / 2, -h); ctx.lineTo(tw / 2, -h); ctx.lineTo(w / 2, -u * 0.03); ctx.quadraticCurveTo(w / 2, 0, w / 2 - u * 0.04, 0); ctx.lineTo(-w / 2 + u * 0.04, 0); ctx.quadraticCurveTo(-w / 2, 0, -w / 2, -u * 0.03); ctx.closePath();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.08)], [0.25, sh(c.a, 0.14)], [0.6, c.a], [1, sh(c.a, -0.28)]]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -h, 0, 0, [[0, 'rgba(255,255,255,.1)'], [0.4, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.18)']]); ctx.fillRect(-w, -h, w * 2, h);
    if (o.grain !== false) for (let i = 0; i < 220; i++) { ctx.fillStyle = `rgba(30,18,10,${0.04 + r() * 0.05})`; ctx.fillRect((r() - 0.5) * w, -r() * h, 2 + r() * 5, 1); }
    ctx.restore();
    ctx.fillStyle = sh(c.a, -0.2, 0.9); ctx.beginPath(); ctx.moveTo(-tw / 2, -h); ctx.lineTo(tw / 2, -h); ctx.lineTo(tw / 2, -h + u * 0.035); ctx.lineTo(-tw / 2, -h + u * 0.035); ctx.fill();
    stitch(ctx, () => { ctx.beginPath(); ctx.moveTo(-tw / 2 + 12, -h + u * 0.09); ctx.lineTo(tw / 2 - 12, -h + u * 0.09); }, sh(c.b, 0, 0.8));
    ctx.fillStyle = sh(c.b, -0.1, 0.9); ctx.beginPath(); ctx.arc(0, -h * 0.55, u * 0.022, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-w * 0.45, -h * 0.9, w * 0.05, h * 0.8);
  };

  O.crossbody = (ctx, u, c, o, r) => {
    const w = u * 0.86, h = u * 0.58;
    ctx.strokeStyle = sh(c.a, -0.3); ctx.lineWidth = u * 0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w * 0.44, -h * 0.92); ctx.bezierCurveTo(-w * 0.5, -h - u * 0.85, w * 0.5, -h - u * 0.85, w * 0.44, -h * 0.92); ctx.stroke();
    ctx.strokeStyle = sh(c.a, 0.05); ctx.lineWidth = u * 0.026; ctx.beginPath(); ctx.moveTo(-w * 0.44, -h * 0.92); ctx.bezierCurveTo(-w * 0.5, -h - u * 0.85, w * 0.5, -h - u * 0.85, w * 0.44, -h * 0.92); ctx.stroke();
    rr(ctx, -w / 2, -h, w, h, u * 0.1); ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.06)], [0.3, sh(c.a, 0.15)], [0.65, c.a], [1, sh(c.a, -0.3)]]); ctx.fill();
    ctx.save(); rr(ctx, -w / 2, -h, w, h, u * 0.1); ctx.clip();
    if (o.grain !== false) for (let i = 0; i < 200; i++) { ctx.fillStyle = `rgba(30,18,10,${0.04 + r() * 0.05})`; ctx.fillRect((r() - 0.5) * w, -r() * h, 2 + r() * 5, 1); }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.98); ctx.lineTo(w / 2, -h * 0.98); ctx.lineTo(w / 2, -h * 0.54); ctx.quadraticCurveTo(0, -h * 0.34, -w / 2, -h * 0.54); ctx.closePath();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, 0.02)], [0.3, sh(c.a, 0.22)], [0.65, sh(c.a, 0.08)], [1, sh(c.a, -0.22)]]); ctx.fill();
    ctx.strokeStyle = 'rgba(30,18,10,.28)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    stitch(ctx, () => { ctx.beginPath(); ctx.moveTo(-w / 2 + 14, -h * 0.58); ctx.quadraticCurveTo(0, -h * 0.4, w / 2 - 14, -h * 0.58); }, sh(c.b, 0, 0.85));
    ctx.fillStyle = cyl(ctx, -u * 0.03, u * 0.03, c.b); ctx.beginPath(); ctx.arc(0, -h * 0.44, u * 0.03, 0, TAU); ctx.fill();
  };

  O.cardholder = (ctx, u, c, o, r) => {
    const w = u * 0.82, h = u * 0.54;
    ctx.save(); ctx.rotate(-0.05);
    ['#ffffff', '#e9dfcd'].forEach((cc, i) => { ctx.fillStyle = cc; rr(ctx, -w * 0.3 + i * 12, -h * 1.02 - i * 6, w * 0.6, h * 0.5, 4); ctx.fill(); });
    rr(ctx, -w / 2, -h * 0.78, w, h * 0.78, u * 0.05); ctx.fillStyle = lg(ctx, -w / 2, -h, w / 2, 0, [[0, sh(c.a, 0.18)], [0.5, c.a], [1, sh(c.a, -0.25)]]); ctx.fill();
    ctx.save(); rr(ctx, -w / 2, -h * 0.78, w, h * 0.78, u * 0.05); ctx.clip(); if (o.grain !== false) for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(30,18,10,${0.04 + r() * 0.05})`; ctx.fillRect((r() - 0.5) * w, -r() * h, 2 + r() * 4, 1); } ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-w / 2 + 3, -h * 0.78, w - 6, 3);
    rr(ctx, -w / 2, -h * 0.5, w, h * 0.5, u * 0.05); ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, 0.06)], [0.5, sh(c.a, 0.14)], [1, sh(c.a, -0.2)]]); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1.5; ctx.stroke();
    stitch(ctx, () => { rr(ctx, -w / 2 + 8, -h * 0.5 + 8, w - 16, h * 0.5 - 16, 4); }, sh(c.b, 0, 0.85), 1.4);
    ctx.restore();
  };

  O.pouch = (ctx, u, c, o, r) => {
    const w = u * 0.92, h = u * 0.56;
    ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.12); ctx.quadraticCurveTo(-w * 0.52, -h * 0.9, -w * 0.4, -h * 0.94); ctx.lineTo(w * 0.4, -h * 0.94); ctx.quadraticCurveTo(w * 0.52, -h * 0.9, w / 2, -h * 0.12); ctx.quadraticCurveTo(w / 2, 0, w * 0.38, 0); ctx.lineTo(-w * 0.38, 0); ctx.quadraticCurveTo(-w / 2, 0, -w / 2, -h * 0.12); ctx.closePath();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.05)], [0.3, sh(c.a, 0.14)], [0.7, c.a], [1, sh(c.a, -0.28)]]); ctx.fill();
    ctx.save(); ctx.clip(); fabricLines(ctx, -w / 2, -h, w, h, 'rgba(255,255,255,.06)', 5, true); fabricLines(ctx, -w / 2, -h, w, h, 'rgba(0,0,0,.05)', 5, false); ctx.restore();
    stitch(ctx, () => { ctx.beginPath(); ctx.moveTo(-w * 0.4, -h * 0.82); ctx.lineTo(w * 0.4, -h * 0.82); }, 'rgba(255,250,240,.85)', 2.6);
    ctx.fillStyle = sh(c.d, 0, 0.9); ctx.fillRect(-w * 0.4, -h * 0.855, w * 0.8, 2);
    ctx.fillStyle = sh(c.b, 0, 1); rr(ctx, w * 0.28, -h * 0.9, u * 0.08, u * 0.16, 3); ctx.fill();
    gloss(ctx, -w * 0.4, -h * 0.6, w * 0.05, h * 0.4, 0.15);
  };

  O.scarf = (ctx, u, c, o) => {
    const w = u * 0.7, h = u * 0.86;
    const stripes = o.stripes || [];
    ctx.save(); rr(ctx, -w / 2, -h, w, h, 6); ctx.fillStyle = c.a; ctx.fill(); ctx.clip();
    stripes.forEach(([y0, y1, col]) => { ctx.fillStyle = col === 'b' ? c.b : col === 'd' ? c.d : col; ctx.fillRect(-w / 2, -h + h * y0, w, h * (y1 - y0)); });
    fabricLines(ctx, -w / 2, -h, w, h, 'rgba(255,255,255,.08)', 4, true); fabricLines(ctx, -w / 2, -h, w, h, 'rgba(0,0,0,.05)', 4, false);
    [0.33, 0.66].forEach((t) => { ctx.fillStyle = lg(ctx, 0, -h * (1 - t) - 14, 0, -h * (1 - t) + 14, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,.22)'], [1, 'rgba(255,255,255,.1)']]); ctx.fillRect(-w / 2, -h * (1 - t) - 14, w, 28); });
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, 'rgba(255,255,255,.12)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.2)']]); ctx.fillRect(-w / 2, -h, w, h);
    ctx.restore();
    ctx.strokeStyle = sh(c.a, 0.1); ctx.lineWidth = 1.6; ctx.beginPath(); for (let x = -w / 2 + 3; x < w / 2; x += 5) { ctx.moveTo(x, 0); ctx.lineTo(x + ((x * 7) % 3) - 1, u * 0.07); } ctx.stroke();
  };

  O.sunglasses = (ctx, u, c) => {
    const lw = u * 0.34, lh = u * 0.3, gap = u * 0.06;
    ctx.save(); ctx.translate(0, -lh / 2 - u * 0.1);
    ctx.strokeStyle = sh(c.a, -0.3); ctx.lineWidth = u * 0.03; ctx.beginPath(); ctx.moveTo(-lw - gap / 2 - lw * 0.46, -lh * 0.1); ctx.lineTo(-lw * 1.22, lh / 2 + u * 0.1); ctx.moveTo(lw + gap / 2 + lw * 0.46, -lh * 0.1); ctx.lineTo(lw * 1.22, lh / 2 + u * 0.1); ctx.stroke();
    [-1, 1].forEach((s) => {
      const cx = s * (lw / 2 + gap / 2 + lw * 0.04);
      ctx.fillStyle = lg(ctx, cx - lw / 2, -lh / 2, cx + lw / 2, lh / 2, [[0, '#4a4640'], [0.5, '#1f1c1a'], [1, '#2c2825']]); ctx.beginPath(); ctx.ellipse(cx, 0, lw / 2, lh / 2, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(cx - lw * 0.15, -lh * 0.17, lw * 0.14, lh * 0.08, -0.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = cyl(ctx, cx - lw / 2, cx + lw / 2, c.a); ctx.lineWidth = u * 0.036; ctx.beginPath(); ctx.ellipse(cx, 0, lw / 2, lh / 2, 0, 0, TAU); ctx.stroke();
    });
    ctx.strokeStyle = sh(c.a, 0.05); ctx.lineWidth = u * 0.03; ctx.beginPath(); ctx.moveTo(-gap * 0.9, -lh * 0.12); ctx.quadraticCurveTo(0, -lh * 0.3, gap * 0.9, -lh * 0.12); ctx.stroke();
    ctx.restore();
  };

  const knitTexture = (ctx, x, y, w, h, c) => { ctx.save(); ctx.strokeStyle = sh(c, -0.12, 0.5); ctx.lineWidth = 1.1; ctx.beginPath(); for (let i = x; i < x + w; i += 4) { ctx.moveTo(i, y); ctx.lineTo(i, y + h); } ctx.stroke(); ctx.strokeStyle = sh(c, 0.18, 0.4); ctx.beginPath(); for (let i = x + 2; i < x + w; i += 4) { ctx.moveTo(i, y); ctx.lineTo(i, y + h); } ctx.stroke(); ctx.restore(); };
  O.knit = (ctx, u, c, o) => {
    const w = u * 0.8, h = u * 0.92, sw = u * 0.15;
    const outline = () => { ctx.beginPath(); ctx.moveTo(-w * 0.3, -h); ctx.quadraticCurveTo(0, -h * 0.9, w * 0.3, -h); ctx.lineTo(w * 0.52, -h * 0.9); ctx.lineTo(w * 0.62 + sw, -h * 0.25); ctx.lineTo(w * 0.5 + sw, -h * 0.2); ctx.lineTo(w * 0.42, -h * 0.58); ctx.lineTo(w * 0.4, 0); ctx.lineTo(-w * 0.4, 0); ctx.lineTo(-w * 0.42, -h * 0.58); ctx.lineTo(-w * 0.5 - sw, -h * 0.2); ctx.lineTo(-w * 0.62 - sw, -h * 0.25); ctx.lineTo(-w * 0.52, -h * 0.9); ctx.closePath(); };
    ctx.save(); outline(); ctx.fillStyle = lg(ctx, -w * 0.6, 0, w * 0.6, 0, [[0, sh(c.a, -0.06)], [0.3, sh(c.a, 0.1)], [0.7, c.a], [1, sh(c.a, -0.22)]]); ctx.fill(); ctx.clip();
    knitTexture(ctx, -w, -h, w * 2, h, c.a);
    ctx.fillStyle = sh(c.a, -0.1, 0.5); ctx.fillRect(-w * 0.41, -h * 0.07, w * 0.82, h * 0.07); ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(-w * 0.41, -h * 0.075, w * 0.82, 2);
    ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.beginPath(); ctx.moveTo(-w * 0.42, -h * 0.58); ctx.lineTo(-w * 0.5 - sw, -h * 0.2); ctx.lineTo(-w * 0.4, -h * 0.2); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(w * 0.42, -h * 0.58); ctx.lineTo(w * 0.5 + sw, -h * 0.2); ctx.lineTo(w * 0.4, -h * 0.2); ctx.closePath(); ctx.fill();
    if (o.cardigan) { ctx.beginPath(); ctx.moveTo(-w * 0.3, -h); ctx.lineTo(0, -h * 0.62); ctx.lineTo(w * 0.3, -h); ctx.fillStyle = sh(c.d, 0, 0.8); ctx.fill(); ctx.strokeStyle = sh(c.a, -0.25, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -h * 0.62); ctx.lineTo(0, 0); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.fillStyle = sh(c.b, 0, 1); ctx.beginPath(); ctx.arc(0, -h * 0.54 + i * h * 0.1, u * 0.017, 0, TAU); ctx.fill(); } }
    else { ctx.strokeStyle = sh(c.a, -0.2, 0.7); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, -h * 0.99, w * 0.2, h * 0.07, 0, 0, Math.PI); ctx.stroke(); ctx.fillStyle = sh(c.d, 0, 0.45); ctx.beginPath(); ctx.ellipse(0, -h * 0.99, w * 0.19, h * 0.055, 0, 0, Math.PI); ctx.fill(); }
    ctx.restore();
  };

  O.shirt = (ctx, u, c, o) => {
    const w = u * 0.74, h = u * 0.9;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-w * 0.28, -h); ctx.lineTo(w * 0.28, -h); ctx.lineTo(w * 0.56, -h * 0.9); ctx.lineTo(w * 0.78, -h * 0.28); ctx.lineTo(w * 0.62, -h * 0.22); ctx.lineTo(w * 0.42, -h * 0.6); ctx.lineTo(w * 0.4, 0); ctx.lineTo(-w * 0.4, 0); ctx.lineTo(-w * 0.42, -h * 0.6); ctx.lineTo(-w * 0.62, -h * 0.22); ctx.lineTo(-w * 0.78, -h * 0.28); ctx.lineTo(-w * 0.56, -h * 0.9); ctx.closePath();
    ctx.fillStyle = lg(ctx, -w * 0.7, 0, w * 0.7, 0, [[0, sh(c.a, -0.04)], [0.3, sh(c.a, 0.12)], [0.7, c.a], [1, sh(c.a, -0.2)]]); ctx.fill(); ctx.clip();
    if (o.stripes) { ctx.fillStyle = sh(c.b, 0, 0.5); for (let x = -w; x < w; x += 14) ctx.fillRect(x, -h, 3, h); }
    fabricLines(ctx, -w, -h, w * 2, h, 'rgba(0,0,0,.035)', 3, false); fabricLines(ctx, -w, -h, w * 2, h, 'rgba(255,255,255,.05)', 3, true);
    ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(-w * 0.01, -h * 0.9, w * 0.02, h * 0.9);
    ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.beginPath(); ctx.moveTo(-w * 0.42, -h * 0.6); ctx.lineTo(-w * 0.62, -h * 0.22); ctx.lineTo(-w * 0.4, -h * 0.2); ctx.fill(); ctx.beginPath(); ctx.moveTo(w * 0.42, -h * 0.6); ctx.lineTo(w * 0.62, -h * 0.22); ctx.lineTo(w * 0.4, -h * 0.2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = sh(c.a, 0.1); ctx.beginPath(); ctx.moveTo(-w * 0.28, -h); ctx.lineTo(0, -h * 0.82); ctx.lineTo(-w * 0.04, -h * 0.72); ctx.lineTo(-w * 0.3, -h * 0.9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.28, -h); ctx.lineTo(0, -h * 0.82); ctx.lineTo(w * 0.04, -h * 0.72); ctx.lineTo(w * 0.3, -h * 0.9); ctx.closePath(); ctx.fillStyle = sh(c.a, 0.04); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = sh(c.d, 0, 0.9); ctx.beginPath(); ctx.arc(0, -h * 0.66 + i * h * 0.13, u * 0.011, 0, TAU); ctx.fill(); }
    if (o.pockets) [-1, 1].forEach((s) => { ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1.6; ctx.strokeRect(s * w * 0.2 - w * 0.09, -h * 0.5, w * 0.18, h * 0.16); });
  };

  O.trouser = (ctx, u, c) => {
    const w = u * 0.5, h = u * 0.96;
    ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * 0.58, 0); ctx.lineTo(w * 0.05, 0); ctx.lineTo(0, -h * 0.42); ctx.lineTo(-w * 0.05, 0); ctx.lineTo(-w * 0.58, 0); ctx.closePath();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.04)], [0.3, sh(c.a, 0.12)], [0.75, c.a], [1, sh(c.a, -0.2)]]); ctx.fill(); ctx.clip();
    fabricLines(ctx, -w, -h, w * 2, h, 'rgba(0,0,0,.04)', 3, false);
    ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(-1, -h * 0.9, 2, h * 0.5); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(-w * 0.3, -h * 0.9, 3, h * 0.9); ctx.fillRect(w * 0.3, -h * 0.5, 3, h * 0.5);
    ctx.fillStyle = sh(c.a, -0.1); ctx.fillRect(-w / 2, -h, w, h * 0.07);
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -h * 0.93); ctx.lineTo(0, -h * 0.78); ctx.quadraticCurveTo(-w * 0.04, -h * 0.72, -w * 0.08, -h * 0.74); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w * 0.5, -h * 0.9); ctx.quadraticCurveTo(-w * 0.3, -h * 0.82, -w * 0.28, -h * 0.66); ctx.moveTo(w * 0.5, -h * 0.9); ctx.quadraticCurveTo(w * 0.3, -h * 0.82, w * 0.28, -h * 0.66); ctx.stroke();
    ctx.restore(); ctx.fillStyle = sh(c.d, 0, 1); ctx.beginPath(); ctx.arc(0, -h * 0.965, u * 0.012, 0, TAU); ctx.fill();
  };

  O.throw = (ctx, u, c, o) => {
    const layers = [[0.92, 0.24], [0.86, 0.22], [0.8, 0.2]];
    let y = 0;
    layers.forEach(([wf, hf], i) => {
      const w = u * wf, h = u * hf * 0.62; y -= h; const x0 = -w / 2 + (i % 2) * 6;
      ctx.save(); rr(ctx, x0, y, w, h + 1, h * 0.45); ctx.fillStyle = i % 2 ? sh(c.a, -0.05) : c.a; ctx.fill(); ctx.clip();
      (o.stripes || []).forEach(([a, b, col]) => { ctx.fillStyle = col === 'b' ? c.b : col === 'd' ? c.d : col; ctx.fillRect(x0 + w * (1 - b), y, w * (b - a), h); });
      fabricLines(ctx, x0, y, w, h, 'rgba(0,0,0,.04)', 3, false);
      ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, 'rgba(255,255,255,.2)'], [0.45, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.22)']]); ctx.fillRect(x0, y, w, h);
      ctx.fillStyle = lg(ctx, x0, 0, x0 + w * 0.12, 0, [[0, 'rgba(0,0,0,.18)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x0, y, w * 0.12, h);
      if (o.piping) { ctx.fillStyle = sh(c.b, 0, 0.9); ctx.fillRect(x0, y, w, 2.5); }
      ctx.restore();
      if (!o.piping) { ctx.strokeStyle = sh(c.a, 0.12, 0.95); ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = 0; k < 16; k++) { const fy = y + 3 + k * (h - 6) / 16; ctx.moveTo(x0 + w - 2, fy); ctx.lineTo(x0 + w + 6, fy + 1.5); } ctx.stroke(); }
    });
  };

  O.cushion = (ctx, u, c, o, r) => {
    const s = u * 0.5;
    ctx.save(); ctx.beginPath(); ctx.moveTo(-s, -s * 0.9); ctx.quadraticCurveTo(0, -s * 1.12, s, -s * 0.9); ctx.quadraticCurveTo(s * 1.06, 0, s, s * 0.9 - s * 0.9 + s * 0.0); ctx.quadraticCurveTo(s * 1.04, s * 0.5, s * 0.96, s * 0.96); ctx.quadraticCurveTo(0, s * 1.12, -s * 0.96, s * 0.96); ctx.quadraticCurveTo(-s * 1.04, s * 0.5, -s, 0); ctx.quadraticCurveTo(-s * 1.06, -s * 0.5, -s, -s * 0.9); ctx.closePath();
    ctx.translate(0, -s * 0.98); ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.restore();
    ctx.save(); ctx.translate(0, -s); ctx.beginPath(); ctx.moveTo(-s * 0.95, -s * 0.9); ctx.bezierCurveTo(-s * 0.3, -s * 1.05, s * 0.3, -s * 1.05, s * 0.95, -s * 0.9); ctx.bezierCurveTo(s * 1.08, -s * 0.3, s * 1.08, s * 0.3, s * 0.95, s * 0.95); ctx.bezierCurveTo(s * 0.3, s * 1.06, -s * 0.3, s * 1.06, -s * 0.95, s * 0.95); ctx.bezierCurveTo(-s * 1.08, s * 0.3, -s * 1.08, -s * 0.3, -s * 0.95, -s * 0.9); ctx.closePath();
    ctx.fillStyle = c.a; ctx.fill(); ctx.clip();
    const g = ctx.createRadialGradient(-s * 0.3, -s * 0.4, s * 0.1, 0, 0, s * 1.5); g.addColorStop(0, sh(c.a, 0.18)); g.addColorStop(0.5, c.a); g.addColorStop(1, sh(c.a, -0.3)); ctx.fillStyle = g; ctx.fillRect(-s * 1.2, -s * 1.2, s * 2.4, s * 2.4);
    if (o.boucle) for (let i = 0; i < 900; i++) { ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,.22)' : 'rgba(60,45,30,.16)'; ctx.beginPath(); ctx.arc((r() - 0.5) * s * 2.1, (r() - 0.5) * s * 2.1, 1 + r() * 2.2, 0, TAU); ctx.fill(); }
    else { fabricLines(ctx, -s, -s, s * 2, s * 2, 'rgba(0,0,0,.04)', 3, false); fabricLines(ctx, -s, -s, s * 2, s * 2, 'rgba(255,255,255,.05)', 3, true); }
    (o.stripes || []).forEach(([a, b, col]) => { ctx.fillStyle = col === 'b' ? c.b : col === 'd' ? c.d : col; ctx.fillRect(-s * 1.1 + s * 2.2 * a, -s * 1.1, s * 2.2 * (b - a), s * 2.2); });
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-s * 0.95, -s * 0.9); ctx.lineTo(-s * 0.55, -s * 0.5); ctx.moveTo(s * 0.95, -s * 0.9); ctx.lineTo(s * 0.55, -s * 0.5); ctx.moveTo(-s * 0.95, s * 0.95); ctx.lineTo(-s * 0.55, s * 0.55); ctx.moveTo(s * 0.95, s * 0.95); ctx.lineTo(s * 0.55, s * 0.55); ctx.stroke();
    ctx.restore();
  };

  O.basket = (ctx, u, c, o, r) => {
    const w = u * 0.86, h = u * 0.7, tw = w * 1.08;
    ctx.strokeStyle = sh(c.a, -0.3); ctx.lineWidth = u * 0.035; ctx.lineCap = 'round';
    [-1, 1].forEach((s) => { ctx.beginPath(); ctx.ellipse(s * tw * 0.5, -h * 0.82, u * 0.07, u * 0.1, 0, 0, TAU); ctx.stroke(); });
    ctx.save(); ctx.beginPath(); ctx.moveTo(-tw / 2, -h); ctx.lineTo(tw / 2, -h); ctx.lineTo(w * 0.42, 0); ctx.lineTo(-w * 0.42, 0); ctx.closePath();
    ctx.fillStyle = cyl(ctx, -tw / 2, tw / 2, c.a); ctx.fill(); ctx.clip();
    for (let j = 0; j < 16; j++) { const y = -h + (j * h) / 16; ctx.fillStyle = j % 2 ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'; ctx.fillRect(-tw, y, tw * 2, h / 16); for (let x = -tw / 2; x < tw / 2; x += u * 0.07) { ctx.fillStyle = 'rgba(40,25,10,.2)'; ctx.fillRect(x + (j % 2) * u * 0.035, y, 1.6, h / 16); } }
    ctx.restore();
    ctx.fillStyle = sh(c.a, -0.18); ctx.beginPath(); ctx.ellipse(0, -h, tw / 2, tw * 0.07, 0, 0, TAU); ctx.fill();
    if (o.liner) { ctx.fillStyle = c.b; ctx.beginPath(); ctx.ellipse(0, -h + 2, tw / 2 - 6, tw * 0.055, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = sh(c.a, 0.25, 0.9); ctx.lineWidth = u * 0.025; ctx.beginPath(); ctx.ellipse(0, -h, tw / 2, tw * 0.07, 0, Math.PI, TAU); ctx.stroke();
  };

  O.tray = (ctx, u, c) => {
    const w = u, h = u * 0.3, th = u * 0.06;
    ctx.fillStyle = sh(c.a, -0.34); rr(ctx, -w / 2 + 4, -th, w - 8, th, 6); ctx.fill();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.08)], [0.5, sh(c.a, -0.18)], [1, sh(c.a, -0.34)]]); rr(ctx, -w / 2, -th - h * 0.18, w, h * 0.3, 8); ctx.fill();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, 0.2)], [0.5, c.a], [1, sh(c.a, -0.1)]]); rr(ctx, -w / 2, -th - h, w, h * 0.92, h * 0.4); ctx.fill();
    ctx.fillStyle = lg(ctx, 0, -th - h, 0, -th, [[0, sh(c.a, -0.14)], [1, sh(c.a, 0.04)]]); rr(ctx, -w / 2 + u * 0.05, -th - h * 0.9, w - u * 0.1, h * 0.7, h * 0.3); ctx.fill();
    ctx.fillStyle = 'rgba(30,18,10,.5)'; rr(ctx, -w / 2 + 6, -th - h * 0.62, u * 0.07, h * 0.12, 4); ctx.fill(); rr(ctx, w / 2 - 6 - u * 0.07, -th - h * 0.62, u * 0.07, h * 0.12, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(40,22,10,.12)'; ctx.lineWidth = 1; for (let i = 0; i < 16; i++) { const y = -th - h * 0.85 + i * h * 0.04; ctx.beginPath(); ctx.moveTo(-w / 2 + u * 0.1, y); ctx.lineTo(w / 2 - u * 0.1, y + (i % 3 - 1)); ctx.stroke(); }
  };

  O.planter = (ctx, u, c, o, r) => {
    const w = u * 0.42, h = u * 0.4;
    const lc = o.leaf || '#6d7a55';
    for (let i = 0; i < 11; i++) { ctx.save(); ctx.translate((r() - 0.5) * w * 0.4, -h); ctx.rotate((i / 10 - 0.5) * 2.3 + (r() - 0.5) * 0.2); const len = u * (0.38 + r() * 0.28); ctx.strokeStyle = sh(lc, -0.25); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len * 0.6); ctx.stroke(); ctx.translate(0, -len * 0.5); leafShape(ctx, len * 0.55, len * 0.22, mixc(lc, '#3f4a30', r() * 0.5), 'rgba(255,255,255,.2)'); ctx.restore(); }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * 0.36, 0); ctx.lineTo(-w * 0.36, 0); ctx.closePath(); ctx.fillStyle = cyl(ctx, -w / 2, w / 2, c.a); ctx.fill();
    ctx.fillStyle = cyl(ctx, -w * 0.55, w * 0.55, sh(c.a, 0.04)); rr(ctx, -w * 0.55, -h * 1.12, w * 1.1, h * 0.26, 4); ctx.fill();
    ctx.fillStyle = 'rgba(40,24,12,.55)'; ctx.beginPath(); ctx.ellipse(0, -h * 1.12, w * 0.5, w * 0.06, 0, 0, TAU); ctx.fill();
    gloss(ctx, -w * 0.42, -h * 0.8, w * 0.05, h * 0.5, 0.2);
  };

  O.lamp = (ctx, u, c, o, r) => {
    const sw = u * 0.5, sh2 = u * 0.34, by = -u * 0.52;
    ctx.save(); ctx.translate(0, 0); O.vase(ctx, u * 0.56, { a: c.a, b: c.b, d: c.d }, { shape: 'round', speckle: o.speckle }, r); ctx.restore();
    ctx.fillStyle = cyl(ctx, -4, 4, c.d); ctx.fillRect(-3, -u * 0.74, 6, u * 0.2);
    blurDo(ctx, 24, () => { ctx.fillStyle = 'rgba(255,214,150,.55)'; ctx.beginPath(); ctx.ellipse(0, -u * 0.78, sw * 0.8, sh2 * 0.9, 0, 0, TAU); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-sw * 0.36, by - sh2 - u * 0.2 + 2); ctx.lineTo(sw * 0.36, by - sh2 - u * 0.2 + 2); ctx.lineTo(sw * 0.5, by - u * 0.2 + 2); ctx.lineTo(-sw * 0.5, by - u * 0.2 + 2); ctx.closePath();
    ctx.fillStyle = lg(ctx, -sw / 2, 0, sw / 2, 0, [[0, sh(c.b, 0.1)], [0.35, sh(c.b, 0.4)], [0.75, sh(c.b, 0.1)], [1, sh(c.b, -0.12)]]); ctx.fill();
    ctx.fillStyle = 'rgba(255,230,180,.18)'; ctx.fill();
  };

  O.stool = (ctx, u, c, o, r) => {
    const w = u * 0.62, h = u;
    const leg = (x0, y0, x1, y1, wd, sh_) => { ctx.strokeStyle = sh(c.a, sh_); ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); };
    leg(-w * 0.4, -h * 0.9, -w * 0.46, -h * 0.01, u * 0.075, -0.1); leg(w * 0.4, -h * 0.9, w * 0.46, -h * 0.01, u * 0.075, -0.2);
    leg(0, -h * 0.9, 0, -h * 0.02, u * 0.07, -0.25);
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.1)], [0.5, sh(c.a, -0.02)], [1, sh(c.a, -0.28)]]); rr(ctx, -w / 2, -h * 0.94, w, h * 0.1, 8); ctx.fill();
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, 0.22)], [0.45, sh(c.a, 0.1)], [1, sh(c.a, -0.08)]]); ctx.beginPath(); ctx.ellipse(0, -h * 0.94, w / 2, w * 0.11, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(60,35,15,.16)'; ctx.lineWidth = 1; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(0, -h * 0.94, w * (0.1 + i * 0.065), w * (0.02 + i * 0.012), 0, 0, TAU); ctx.stroke(); }
  };

  O.sidetable = (ctx, u, c, o, r) => {
    const w = u * 0.8, h = u * 0.62;
    if (o.tripod) { ctx.strokeStyle = sh(c.a, -0.25); ctx.lineWidth = u * 0.045; ctx.lineCap = 'round'; [[-0.3, -0.36], [0.3, 0.36], [0, 0.02]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a * w * 0.5, -h * 0.95); ctx.lineTo(b * w, 0); ctx.stroke(); }); }
    else { ctx.fillStyle = cyl(ctx, -w * 0.12, w * 0.12, c.b); ctx.fillRect(-w * 0.12, -h * 0.9, w * 0.24, h * 0.88); ctx.fillStyle = cyl(ctx, -w * 0.34, w * 0.34, c.b); ctx.beginPath(); ctx.ellipse(0, -h * 0.02, w * 0.34, w * 0.06, 0, 0, TAU); ctx.fill(); ctx.fillRect(-w * 0.34, -h * 0.06, w * 0.68, h * 0.06); }
    ctx.fillStyle = lg(ctx, -w / 2, 0, w / 2, 0, [[0, sh(c.a, -0.12)], [0.5, sh(c.a, -0.02)], [1, sh(c.a, -0.3)]]); rr(ctx, -w / 2, -h, w, h * 0.1, 6); ctx.fill();
    ctx.fillStyle = lg(ctx, -w / 2, -h, w / 2, -h * 0.85, [[0, sh(c.a, 0.25)], [0.5, sh(c.a, 0.12)], [1, sh(c.a, 0)]]); ctx.beginPath(); ctx.ellipse(0, -h, w / 2, w * 0.1, 0, 0, TAU); ctx.fill();
    if (o.stone) for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(120,95,70,${0.1 + r() * 0.14})`; ctx.fillRect((r() - 0.5) * w * 0.82, -h + (r() - 0.5) * w * 0.14, 6 + r() * 14, 1); }
  };

  O.mirror = (ctx, u, c, o, r) => {
    const R = u * 0.46;
    ctx.translate(0, -R - 1);
    blurDo(ctx, 18, () => { ctx.fillStyle = 'rgba(30,20,10,.18)'; ctx.beginPath(); ctx.ellipse(u * 0.04, u * 0.04, R, R, 0, 0, TAU); ctx.fill(); });
    ctx.fillStyle = lg(ctx, -R, -R, R, R, [[0, sh(c.a, 0.3)], [0.5, c.a], [1, sh(c.a, -0.35)]]); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R * 0.93, 0, TAU); ctx.clip();
    ctx.fillStyle = lg(ctx, -R, -R, R, R, [[0, '#f1ece2'], [0.45, '#d9d3c6'], [0.55, '#b9b2a4'], [1, '#8d8678']]); ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(-R * 0.9, -R * 0.1); ctx.lineTo(-R * 0.1, -R * 0.9); ctx.lineTo(R * 0.1, -R * 0.9); ctx.lineTo(-R * 0.8, R * 0.1); ctx.fill();
    blurDo(ctx, 14, () => { ctx.fillStyle = 'rgba(120,100,70,.5)'; ctx.fillRect(R * 0.1, R * 0.1, R * 0.7, R * 0.5); ctx.fillStyle = 'rgba(80,100,70,.4)'; ctx.beginPath(); ctx.arc(-R * 0.3, R * 0.4, R * 0.25, 0, TAU); ctx.fill(); });
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, R * 0.93, 0, TAU); ctx.stroke();
  };

  O.books = (ctx, u, c) => {
    const cols = [c.a, c.b, c.d, sh(c.a, 0.2)]; let y = 0;
    cols.forEach((col, i) => { const w = u * (0.9 - i * 0.07), h = u * 0.13, x = (i % 2 ? 1 : -1) * u * 0.02; ctx.fillStyle = vert(ctx, y - h, y, col); rr(ctx, x - w / 2, y - h, w, h, 2); ctx.fill(); ctx.fillStyle = 'rgba(250,244,230,.85)'; ctx.fillRect(x - w / 2 + w * 0.05, y - h * 0.82, w * 0.92, h * 0.64); ctx.fillStyle = vert(ctx, y - h, y, col); ctx.fillRect(x - w / 2, y - h * 0.9, w * 0.07, h * 0.8); y -= h; });
  };

  O.ledge = (ctx, u, c, o, r) => { // a horizontal stone slab seen from the front
    const h = u * (o.th ?? 0.09);
    ctx.fillStyle = lg(ctx, 0, -h, 0, 0, [[0, sh(c.a, 0.12)], [1, sh(c.a, -0.14)]]); ctx.fillRect(-u / 2, -h, u, h);
    ctx.fillStyle = sh(c.a, 0.22); ctx.fillRect(-u / 2, -h, u, 3);
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(110,90,70,${0.07 + r() * 0.12})`; ctx.fillRect((r() - 0.5) * u, -h + r() * h, 4 + r() * 18, 1); }
  };

  window.OBJECTS = O;
  window.ArtKit = { TAU, hex, rgba, sh, mixc, lg, rr, blurDo, leafShape };
})();
