/* Scene composer for MERIDIAN STORE artwork. Needs objects.js loaded first (Canvas 2D, Chromium).
   renderScene(canvas, spec) paints a lit studio/lifestyle backdrop and composes the procedural objects on it. */
(function () {
  const { TAU, sh, lg, blurDo, leafShape } = window.ArtKit;
  const O = window.OBJECTS;
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }

  function backdrop(ctx, w, h, bg, r) {
    const hz = (bg.horizon ?? 0.74) * h;
    ctx.fillStyle = lg(ctx, 0, 0, 0, hz, [[0, bg.wall[0]], [1, bg.wall[1]]]); ctx.fillRect(0, 0, w, hz + 2);
    ctx.fillStyle = lg(ctx, 0, hz, 0, h, [[0, bg.floor[0]], [1, bg.floor[1]]]); ctx.fillRect(0, hz, w, h - hz);
    blurDo(ctx, Math.max(6, h * 0.012), () => { ctx.fillStyle = 'rgba(60,44,28,.12)'; ctx.fillRect(0, hz - 3, w, 6); });
    const lx = (bg.lightX ?? 0.28) * w, ly = (bg.lightY ?? 0.22) * h;
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.85); g.addColorStop(0, 'rgba(255,248,230,.5)'); g.addColorStop(1, 'rgba(255,248,230,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (bg.window) { // soft window light cast on the wall
      const { x, y, ww, wh } = bg.window; ctx.save(); ctx.filter = `blur(${Math.max(3, h * 0.008)}px)`;
      ctx.fillStyle = 'rgba(255,246,222,.55)'; ctx.beginPath(); ctx.moveTo(x * w, y * h); ctx.lineTo((x + ww) * w, (y + 0.03) * h); ctx.lineTo((x + ww + 0.03) * w, (y + wh) * h); ctx.lineTo((x + 0.03) * w, (y + wh - 0.03) * h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = bg.wall[0]; ctx.globalAlpha = 0.6; ctx.fillRect((x + ww * 0.48) * w, y * h, w * 0.012, wh * h); ctx.fillRect(x * w, (y + wh * 0.5) * h, ww * w * 1.1, h * 0.012); ctx.restore();
    }
    if (bg.arch) { // arched niche
      const { x, y, ww, wh } = bg.arch; const ax = x * w, ay = y * h, aw = ww * w, ah = wh * h;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax, ay + aw / 2); ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, ay + ah); ctx.closePath();
      ctx.fillStyle = lg(ctx, ax, ay, ax + aw, ay + ah, [[0, sh(bg.wall[1], -0.1)], [1, sh(bg.wall[1], -0.28)]]); ctx.fill(); ctx.clip();
      blurDo(ctx, aw * 0.1, () => { ctx.fillStyle = 'rgba(255,240,210,.45)'; ctx.fillRect(ax + aw * 0.5, ay, aw, ah); }); ctx.restore();
    }
    if (bg.leaves) { // cast foliage shadows
      ctx.save(); ctx.filter = `blur(${Math.max(5, h * 0.008)}px)`; ctx.globalAlpha = bg.leaves.a ?? 0.22;
      for (let i = 0; i < (bg.leaves.n || 4); i++) { ctx.save(); ctx.translate(bg.leaves.x * w + (r() - 0.5) * w * 0.12, bg.leaves.y * h); ctx.rotate(bg.leaves.rot + (r() - 0.5) * 0.9); const len = h * (0.34 + r() * 0.22); ctx.strokeStyle = '#3a2f22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
        for (let k = 1; k < 8; k++) { ctx.save(); ctx.translate(0, -len * k / 8); ctx.rotate((k % 2 ? 1 : -1) * 0.9); leafShape(ctx, len * 0.3, len * 0.07, '#3a2f22'); ctx.restore(); } ctx.restore(); }
      ctx.restore();
    }
  }

  function post(ctx, w, h, r, grainAmt = 7, vig = 0.2) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.78); g.addColorStop(0, 'rgba(50,36,22,0)'); g.addColorStop(1, `rgba(50,36,22,${vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * grainAmt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(id, 0, 0);
  }

  function renderScene(canvas, spec) {
    const { w, h, seed = 1 } = spec; canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); const r = rng(seed);
    backdrop(ctx, w, h, spec.bg, r);
    for (const it of spec.items) {
      const u = it.u * h, x = it.x * w, y = (it.y ?? spec.bg.horizon + 0.1) * h;
      ctx.save(); ctx.translate(x, y);
      if (it.shadow !== false) {
        const sw = (it.sw ?? 0.5) * u, lean = (spec.bg.lightX ?? 0.3) < 0.5 ? 1 : -1;
        blurDo(ctx, Math.max(6, u * 0.04), () => { ctx.fillStyle = `rgba(52,36,22,${it.sa ?? 0.34})`; ctx.beginPath(); ctx.ellipse(lean * sw * 0.28, u * 0.005, sw, Math.max(4, sw * 0.17), 0, 0, TAU); ctx.fill(); });
        blurDo(ctx, 2, () => { ctx.fillStyle = 'rgba(30,20,12,.4)'; ctx.beginPath(); ctx.ellipse(0, 1, sw * 0.7, Math.max(2, sw * 0.045), 0, 0, TAU); ctx.fill(); });
      }
      if (it.rot) ctx.rotate(it.rot);
      O[it.t](ctx, u, it.c, it.o || {}, rng(seed * 31 + (it.k || 7)));
      ctx.restore();
    }
    post(ctx, w, h, r, spec.grain ?? 7, spec.vig ?? 0.2);
  }
  window.renderScene = renderScene;
})();
