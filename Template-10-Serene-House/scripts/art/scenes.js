/* Original procedural artwork for SERENE HOUSE. Runs inside Chromium (canvas 2D).
   Everything here is generated from code; no third-party imagery is used. */
(function () {
  const P = {
    ivory: '#F6F0E4', cream: '#EFE6D3', sand: '#E1D1B3', dune: '#CDB48C', gold: '#C2A25F',
    sage: '#A3B093', sageDeep: '#7F8F6E', olive: '#5F6847', moss: '#434B33',
    wood: '#8A6A4B', walnut: '#5B4531', clay: '#C79E86', stone: '#B9B1A2', ink: '#2B2E24'
  };
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const c = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
    return `rgb(${c(16)},${c(8)},${c(0)})`;
  }
  function vgrad(ctx, w, h, stops) { const g = ctx.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  function glow(ctx, x, y, r, color, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function grain(ctx, w, h, amt, rand) {
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (rand() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(id, 0, 0);
  }
  function vignette(ctx, w, h, a) { const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.8); g.addColorStop(0, 'rgba(40,34,20,0)'); g.addColorStop(1, `rgba(40,34,20,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  function blob(ctx, x, y, rx, ry, color, blur) { ctx.save(); ctx.filter = `blur(${blur}px)`; ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore(); }
  function leaf(ctx, x, y, len, wid, ang, fill, vein) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(wid, -len * 0.25, wid * 0.9, -len * 0.75, 0, -len); ctx.bezierCurveTo(-wid * 0.9, -len * 0.75, -wid, -len * 0.25, 0, 0);
    ctx.fillStyle = fill; ctx.fill();
    if (vein) { ctx.strokeStyle = vein; ctx.lineWidth = Math.max(1, len * 0.006); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len * 0.95); ctx.stroke(); for (let i = 1; i < 7; i++) { const yy = -len * i / 7.5; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(wid * 0.55 * (1 - i / 9), yy - len * 0.07); ctx.moveTo(0, yy); ctx.lineTo(-wid * 0.55 * (1 - i / 9), yy - len * 0.07); ctx.stroke(); } }
    ctx.restore();
  }
  function plaster(ctx, w, h, c1, c2, rand) {
    vgrad(ctx, w, h, [[0, c1], [1, c2]]);
    for (let i = 0; i < 70; i++) blob(ctx, rand() * w, rand() * h, 80 + rand() * 260, 60 + rand() * 200, `rgba(${rand() > 0.5 ? '255,250,238' : '150,130,100'},${0.05 + rand() * 0.07})`, 50);
  }
  function sprig(ctx, x, y, len, ang, color, vein, rand, n = 9) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = vein; ctx.lineWidth = Math.max(2, len * 0.006);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.05, -len * 0.5, 0, -len); ctx.stroke();
    for (let i = 1; i <= n; i++) { const t = i / (n + 1); const s = (i % 2 ? 1 : -1); leaf(ctx, len * 0.04 * (1 - t) * s, -len * t, len * 0.28 * (1 - t * 0.5), len * 0.07, s * 0.9 + (rand() - 0.5) * 0.3, color, vein); }
    ctx.restore();
  }

  const scenes = {
    arch(ctx, w, h, r, o) {
      plaster(ctx, w, h, P.cream, o.dark ? P.dune : P.sand, r);
      const aw = w * 0.34, ax = w * (o.shift ?? 0.5) - aw / 2, ah = h * 0.78, top = h * 0.1;
      ctx.save(); ctx.beginPath(); ctx.moveTo(ax, top + ah); ctx.lineTo(ax, top + aw / 2); ctx.arc(ax + aw / 2, top + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, top + ah); ctx.closePath(); ctx.clip();
      vgrad(ctx, w, h, [[0, '#F8F2DF'], [0.5, '#DDE3C6'], [1, P.sage]]);
      for (let i = 0; i < 22; i++) blob(ctx, ax + r() * aw, top + aw * 0.5 + r() * ah * 0.8, 40 + r() * 120, 30 + r() * 100, mix(P.sage, P.olive, r()), 30);
      glow(ctx, ax + aw * 0.7, top + aw * 0.4, aw * 0.8, 'rgba(255,244,205,A)', 0.9);
      ctx.restore();
      ctx.lineWidth = w * 0.012; ctx.strokeStyle = 'rgba(255,252,242,.7)'; ctx.beginPath(); ctx.moveTo(ax, top + ah); ctx.lineTo(ax, top + aw / 2); ctx.arc(ax + aw / 2, top + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, top + ah); ctx.stroke();
      // floor + cast light
      const fy = top + ah; vgrad(ctx.canvas.getContext('2d'), 0, 0, []);
      ctx.fillStyle = mix(P.sand, P.dune, 0.5); ctx.fillRect(0, fy, w, h - fy);
      ctx.save(); ctx.filter = 'blur(14px)'; ctx.fillStyle = 'rgba(255,246,214,.55)'; ctx.beginPath(); ctx.moveTo(ax, fy); ctx.lineTo(ax + aw, fy); ctx.lineTo(ax + aw * 1.5, h); ctx.lineTo(ax - aw * 0.3, h); ctx.fill(); ctx.restore();
      sprig(ctx, ax + aw * 1.15, fy + 10, h * 0.5, -0.12, 'rgba(60,66,44,.22)', 'rgba(60,66,44,.22)', r, 8);
      sprig(ctx, w * 0.1, fy + 20, h * 0.42, 0.25, mix(P.olive, P.sage, 0.4), P.moss, r, 8);
      ctx.fillStyle = 'rgba(70,52,34,.18)'; ctx.fillRect(0, fy, w, 4);
    },
    stones(ctx, w, h, r, o) {
      plaster(ctx, w, h, o.dark ? P.dune : P.cream, o.dark ? P.wood : P.sand, r);
      ctx.fillStyle = mix(P.sand, P.dune, 0.6); ctx.fillRect(0, h * 0.68, w, h);
      vgrad(ctx, w, h * 0.32, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(80,60,30,0.12)']]);
      glow(ctx, w * 0.75, h * 0.2, w * 0.6, 'rgba(255,243,210,A)', 0.8);
      const cx = w * (o.shift ?? 0.5); let y = h * 0.78; const sizes = [0.2, 0.16, 0.125, 0.09, 0.06]; const cols = [P.stone, P.sage, P.sand, P.clay, P.stone];
      blob(ctx, cx + w * 0.08, y + 8, w * 0.22, 30, 'rgba(60,45,25,.35)', 22);
      sizes.forEach((s, i) => {
        const rx = w * s, ry = rx * 0.5; y -= ry * (i ? 1.45 : 0.9); const x = cx + (r() - 0.5) * w * 0.02;
        const g = ctx.createRadialGradient(x - rx * 0.4, y - ry * 0.6, 4, x, y, rx * 1.1); g.addColorStop(0, mix(cols[i], '#FFFFFF', 0.35)); g.addColorStop(0.6, cols[i]); g.addColorStop(1, mix(cols[i], '#2b2519', 0.45));
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
      });
      sprig(ctx, w * 0.12, h * 0.82, h * 0.45, 0.2, mix(P.olive, P.sage, 0.3), P.moss, r, 8);
    },
    leaves(ctx, w, h, r, o) {
      plaster(ctx, w, h, o.dark ? P.sage : P.ivory, o.dark ? P.sageDeep : P.sand, r);
      ctx.save(); ctx.filter = 'blur(10px)';
      for (let i = 0; i < 9; i++) sprig(ctx, w * (0.1 + r() * 0.9), h * 1.05, h * (0.7 + r() * 0.4), -0.5 + r() * 1.0, 'rgba(50,56,36,.18)', 'rgba(50,56,36,.18)', r, 10);
      ctx.restore();
      for (let i = 0; i < 3; i++) sprig(ctx, w * (0.2 + i * 0.3 + r() * 0.1), h * 1.02, h * (0.75 + r() * 0.2), -0.35 + i * 0.3, mix(P.olive, P.sage, 0.35 + r() * 0.3), 'rgba(246,240,228,.5)', r, 10);
      glow(ctx, w * 0.8, h * 0.15, w * 0.7, 'rgba(255,245,215,A)', 0.55);
    },
    ripples(ctx, w, h, r, o) {
      vgrad(ctx, w, h, [[0, mix(P.sage, '#DDE6D2', 0.5)], [1, o.dark ? P.olive : P.sageDeep]]);
      for (let i = 0; i < 40; i++) blob(ctx, r() * w, r() * h, 60 + r() * 200, 30 + r() * 80, `rgba(255,255,240,${0.04 + r() * 0.06})`, 40);
      const cx = w * (o.shift ?? 0.5), cy = h * 0.55;
      for (let i = 1; i < 14; i++) { ctx.strokeStyle = `rgba(250,248,235,${0.55 - i * 0.035})`; ctx.lineWidth = 2 + (14 - i) * 0.35; ctx.beginPath(); ctx.ellipse(cx, cy, i * w * 0.045, i * w * 0.045 * 0.38, 0, 0, 7); ctx.stroke(); }
      for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; ctx.save(); ctx.translate(cx + Math.cos(a) * w * 0.06, cy + Math.sin(a) * w * 0.022); ctx.rotate(a); ctx.scale(1, 0.4); leaf(ctx, 0, 0, w * 0.075, w * 0.028, 0, mix('#FFF6F0', P.clay, 0.3), null); ctx.restore(); }
      blob(ctx, cx, cy, w * 0.03, w * 0.012, P.gold, 2);
      glow(ctx, w * 0.2, h * 0.1, w * 0.6, 'rgba(255,250,225,A)', 0.4);
    },
    bowl(ctx, w, h, r, o) {
      vgrad(ctx, w, h, [[0, mix(P.walnut, P.moss, 0.5)], [1, '#201B13']]);
      for (let i = 0; i < 30; i++) blob(ctx, r() * w, r() * h * 0.8, 20 + r() * 60, 20 + r() * 60, `rgba(255,214,140,${0.05 + r() * 0.12})`, 14);
      ctx.fillStyle = mix(P.wood, P.walnut, 0.5); ctx.fillRect(0, h * 0.7, w, h);
      for (let i = 0; i < 40; i++) { ctx.strokeStyle = `rgba(30,20,10,${0.08 + r() * 0.1})`; ctx.lineWidth = 1 + r() * 2; ctx.beginPath(); const y = h * 0.7 + r() * h * 0.3; ctx.moveTo(0, y); ctx.bezierCurveTo(w * 0.3, y + r() * 12, w * 0.6, y - r() * 12, w, y + r() * 8); ctx.stroke(); }
      const cx = w * (o.shift ?? 0.5), by = h * 0.72, bw = w * 0.26;
      blob(ctx, cx, by + 14, bw * 1.05, 24, 'rgba(0,0,0,.5)', 16);
      const g = ctx.createLinearGradient(cx - bw, 0, cx + bw, 0); g.addColorStop(0, '#CFC3AE'); g.addColorStop(0.5, '#F2EAD8'); g.addColorStop(1, '#B9AC93');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, by - 4, bw, bw * 0.16, 0, 0, Math.PI); ctx.bezierCurveTo(cx + bw * 0.7, by + bw * 0.55, cx - bw * 0.7, by + bw * 0.55, cx - bw, by - 4); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, by - 4, bw, bw * 0.16, 0, 0, 7); ctx.fillStyle = '#E8DFCB'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, by - 2, bw * 0.9, bw * 0.12, 0, 0, 7); ctx.fillStyle = mix(P.gold, P.walnut, 0.35); ctx.fill();
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; ctx.save(); ctx.translate(cx + Math.cos(a) * bw * 0.4, by - 2 + Math.sin(a) * bw * 0.05); ctx.rotate(a); leaf(ctx, 0, 0, bw * 0.35, bw * 0.12, 0, 'rgba(250,240,235,.92)', null); ctx.restore(); }
      [[0.3, 0.1], [0.72, 0.62]].forEach(([fx], i) => { const x = w * fx, y = h * (i ? 0.66 : 0.62); ctx.fillStyle = '#E9DFC8'; ctx.fillRect(x - 28, y - 70, 56, 70); glow(ctx, x, y - 96, 170, 'rgba(255,200,110,A)', 0.55); ctx.fillStyle = '#FFE9A8'; ctx.beginPath(); ctx.ellipse(x, y - 86, 8, 22, 0, 0, 7); ctx.fill(); });
      vignette(ctx, w, h, 0.5);
    },
    linen(ctx, w, h, r, o) {
      vgrad(ctx, w, h, [[0, P.ivory], [1, P.sand]]);
      for (let i = 0; i < 9; i++) {
        const y0 = h * (0.1 + i * 0.11); ctx.beginPath(); ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) ctx.lineTo(x, y0 + Math.sin(x / w * 5 + i * 1.3 + (o.phase || 0)) * h * 0.05 + Math.sin(x / w * 11 + i) * h * 0.012);
        ctx.lineTo(w, h); const g = ctx.createLinearGradient(0, y0 - 40, 0, y0 + h * 0.2); g.addColorStop(0, mix(P.ivory, '#ffffff', 0.4)); g.addColorStop(0.35, mix(P.cream, P.sand, i / 12)); g.addColorStop(1, mix(P.sand, P.dune, i / 10)); ctx.fillStyle = g; ctx.fill();
      }
      sprig(ctx, w * 0.82, h * 0.98, h * 0.55, -0.25, mix(P.olive, P.sage, 0.5), P.moss, r, 8);
      glow(ctx, w * 0.15, h * 0.1, w * 0.6, 'rgba(255,248,226,A)', 0.5);
    },
    dunes(ctx, w, h, r, o) {
      vgrad(ctx, w, h, [[0, '#F6E9CF'], [0.5, '#EBD4A8'], [1, P.dune]]);
      const sx = w * (o.shift ?? 0.7); glow(ctx, sx, h * 0.3, w * 0.5, 'rgba(255,240,200,A)', 0.9);
      ctx.fillStyle = 'rgba(255,248,225,.95)'; ctx.beginPath(); ctx.arc(sx, h * 0.3, w * 0.07, 0, 7); ctx.fill();
      for (let i = 0; i < 6; i++) { const y0 = h * (0.5 + i * 0.09); ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w; x += 6) ctx.lineTo(x, y0 - Math.sin(x / w * 3.2 + i * 1.7) * h * 0.07 - Math.sin(x / w * 7 + i) * h * 0.012); ctx.lineTo(w, h); ctx.fillStyle = mix(P.sand, P.wood, 0.1 + i * 0.12); ctx.fill(); }
    },
    mist(ctx, w, h, _r, _o) {
      vgrad(ctx, w, h, [[0, '#F3EBD5'], [1, '#DCE0C6']]);
      glow(ctx, w * 0.3, h * 0.28, w * 0.45, 'rgba(255,244,205,A)', 0.9);
      for (let i = 0; i < 6; i++) {
        const y0 = h * (0.38 + i * 0.1); ctx.beginPath(); ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 6) ctx.lineTo(x, y0 - (Math.sin(x / w * 2.4 + i * 2.1) * 0.5 + 0.5) * h * 0.14 - Math.sin(x / w * 9 + i) * h * 0.006);
        ctx.lineTo(w, h); ctx.fillStyle = mix('#C9D2B6', P.moss, i / 6.5); ctx.fill();
        const g = ctx.createLinearGradient(0, y0 - h * 0.15, 0, y0 + h * 0.1); g.addColorStop(0, 'rgba(246,240,228,0)'); g.addColorStop(0.6, `rgba(246,240,228,${0.55 - i * 0.05})`); g.addColorStop(1, 'rgba(246,240,228,0)'); ctx.fillStyle = g; ctx.fillRect(0, y0 - h * 0.15, w, h * 0.3);
      }
    },
    bloom(ctx, w, h, r, o) {
      plaster(ctx, w, h, o.dark ? P.sage : P.cream, o.dark ? P.olive : P.sand, r);
      const cx = w * (o.shift ?? 0.5), cy = h * 0.5, R = Math.min(w, h) * 0.34;
      blob(ctx, cx + 20, cy + R * 0.9, R, R * 0.2, 'rgba(50,40,20,.25)', 30);
      for (let ring = 3; ring >= 0; ring--) { const n = 8 + ring * 2; for (let k = 0; k < n; k++) { const a = k / n * 6.283 + ring * 0.3; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); const len = R * (0.45 + ring * 0.2), wid = R * 0.17; const g = ctx.createLinearGradient(0, 0, 0, -len); g.addColorStop(0, mix(P.gold, '#FFF', 0.1)); g.addColorStop(0.35, mix('#FBF4EA', P.clay, ring * 0.12)); g.addColorStop(1, mix('#FFFFFF', P.clay, 0.25 + ring * 0.08)); leaf(ctx, 0, 0, len, wid, 0, g, null); ctx.restore(); } }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.18); g.addColorStop(0, '#E7C874'); g.addColorStop(1, P.gold); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.16, 0, 7); ctx.fill();
      sprig(ctx, w * 0.12, h * 1.02, h * 0.5, 0.3, mix(P.olive, P.sage, 0.4), P.moss, r, 8);
    },
    wood(ctx, w, h, r, _o) {
      vgrad(ctx, w, h, [[0, mix(P.wood, P.sand, 0.15)], [1, P.walnut]]);
      for (let i = 0; i < 90; i++) { ctx.strokeStyle = `rgba(${r() > 0.5 ? '40,25,12' : '210,170,120'},${0.05 + r() * 0.1})`; ctx.lineWidth = 1 + r() * 3; ctx.beginPath(); const y = r() * h; ctx.moveTo(0, y); ctx.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 40, w * 0.6, y + (r() - 0.5) * 40, w, y + (r() - 0.5) * 30); ctx.stroke(); }
      const bx = w * 0.18, bw = w * 0.64;
      blob(ctx, w / 2, h * 0.76, bw * 0.55, 30, 'rgba(0,0,0,.4)', 24);
      for (let i = 0; i < 4; i++) { const y = h * 0.74 - i * h * 0.1, hh = h * 0.095; const g = ctx.createLinearGradient(0, y - hh, 0, y); g.addColorStop(0, i % 2 ? '#F4EEE0' : '#E9E0CC'); g.addColorStop(1, i % 2 ? '#D9CFB8' : '#CBBFA3'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx + i * 6, y - hh, bw - i * 12, hh, hh * 0.35); ctx.fill(); ctx.strokeStyle = 'rgba(140,120,90,.3)'; ctx.stroke(); }
      sprig(ctx, w * 0.5, h * 0.43, h * 0.28, 0.1, mix(P.olive, P.sage, 0.4), P.moss, r, 6);
      glow(ctx, w * 0.9, h * 0.1, w * 0.5, 'rgba(255,230,180,A)', 0.4);
    },
    bottles(ctx, w, h, r, _o) {
      plaster(ctx, w, h, P.ivory, P.sand, r); ctx.fillStyle = mix(P.sand, P.dune, 0.5); ctx.fillRect(0, h * 0.72, w, h);
      glow(ctx, w * 0.2, h * 0.1, w * 0.7, 'rgba(255,248,226,A)', 0.6);
      const items = [[0.3, 0.3, 0.2, P.sage, 'jar'], [0.5, 0.2, 0.34, P.clay, 'bottle'], [0.68, 0.22, 0.26, P.stone, 'bottle']];
      items.forEach(([fx, fw, fh, col, kind]) => {
        const bw = w * fw * 0.5, bh = h * fh * 1.5, x = w * fx - bw / 2, y = h * 0.74 - bh;
        blob(ctx, w * fx + bw * 0.3, h * 0.745, bw * 0.9, 12, 'rgba(60,45,25,.35)', 12);
        const g = ctx.createLinearGradient(x, 0, x + bw, 0); g.addColorStop(0, mix(col, '#2b2519', 0.2)); g.addColorStop(0.35, mix(col, '#FFFFFF', 0.35)); g.addColorStop(1, mix(col, '#2b2519', 0.35));
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, kind === 'jar' ? bw * 0.15 : [bw * 0.3, bw * 0.3, bw * 0.12, bw * 0.12]); ctx.fill();
        ctx.fillStyle = mix('#F6F0E4', col, 0.1); ctx.fillRect(x + bw * 0.12, y + bh * 0.4, bw * 0.76, bh * 0.28); ctx.fillStyle = P.gold; ctx.fillRect(x + bw * 0.3, y + bh * 0.5, bw * 0.4, 3);
        ctx.fillStyle = kind === 'jar' ? P.walnut : P.gold; ctx.fillRect(x + bw * 0.22, y - bh * 0.1, bw * 0.56, bh * 0.1);
      });
      sprig(ctx, w * 0.86, h * 0.76, h * 0.42, -0.1, mix(P.olive, P.sage, 0.4), P.moss, r, 8);
    },
    portrait(ctx, w, h, r, o) {
      const bgs = [[P.sage, P.sageDeep], [P.sand, P.dune], [P.cream, P.clay], [P.sageDeep, P.olive], [P.dune, P.wood], [P.ivory, P.sage]];
      const [c1, c2] = bgs[(o.tone || 0) % bgs.length]; plaster(ctx, w, h, c1, c2, r);
      glow(ctx, w * 0.3, h * 0.15, w * 0.8, 'rgba(255,248,226,A)', 0.55);
      const skins = ['#D9B598', '#B98562', '#8D5E42', '#E8C9AE', '#A8714F', '#6F4A35']; const hairs = ['#2E2118', '#1E1612', '#4A3426', '#7B5A3D', '#17110D', '#3A2A1F'];
      const skin = skins[(o.skin ?? 0) % 6], hair = hairs[(o.hair ?? 0) % 6], cx = w / 2;
      blob(ctx, cx, h * 0.98, w * 0.45, h * 0.06, 'rgba(0,0,0,.25)', 20);
      ctx.fillStyle = [P.ivory, P.olive, P.clay, P.moss, P.cream, P.sageDeep][(o.tone || 0) % 6];
      ctx.beginPath(); ctx.moveTo(w * 0.04, h); ctx.bezierCurveTo(w * 0.05, h * 0.74, w * 0.25, h * 0.7, cx, h * 0.7); ctx.bezierCurveTo(w * 0.75, h * 0.7, w * 0.95, h * 0.74, w * 0.96, h); ctx.fill();
      ctx.fillStyle = skin; ctx.fillRect(cx - w * 0.06, h * 0.55, w * 0.12, h * 0.17);
      if (o.long) { ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(cx, h * 0.42, w * 0.2, h * 0.27, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(cx, h * 0.42, w * 0.145, h * 0.17, 0, 0, 7); ctx.fill();
      ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(cx, h * 0.32, w * 0.16, h * 0.115, 0, Math.PI, 0); ctx.fill();
      if (o.bun) { ctx.beginPath(); ctx.arc(cx, h * 0.19, w * 0.07, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(40,30,20,.55)'; ctx.beginPath(); ctx.arc(cx - w * 0.055, h * 0.43, 4, 0, 7); ctx.arc(cx + w * 0.055, h * 0.43, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(120,60,50,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, h * 0.47, w * 0.04, 0.25, Math.PI - 0.25); ctx.stroke();
      vignette(ctx, w, h, 0.25);
    }
  };

  window.renderScene = function (canvas, spec) {
    const { scene, w, h, seed, opts } = spec; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); const r = rng(seed);
    scenes[scene](ctx, w, h, r, opts || {});
    if (scene !== 'bowl') vignette(ctx, w, h, 0.18);
    grain(ctx, w, h, spec.grain ?? 9, rng(seed + 7));
  };
})();
