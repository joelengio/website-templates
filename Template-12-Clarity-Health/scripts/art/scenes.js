/* Original procedural artwork for CLARITY HEALTH. Runs inside Chromium (canvas 2D).
   Everything is generated from code: no photographs, stock images, logos or third-party artwork are used. */
(function () {
  const P = {
    white: '#ffffff', ivory: '#fbf9f4', mist: '#eef4f8', mist2: '#dfeaf1', sky: '#cfe4ef', sky2: '#a9cfe0',
    navy: '#0e2a47', navy2: '#1d3f63', navy3: '#2c5680', teal: '#2f8a91', teal2: '#5db4b8', aqua: '#a9dde0', tealSoft: '#d6ebec',
    sand: '#f1e9db', sand2: '#e2d3ba', blush: '#f3d9cf', coral: '#d9735e', gold: '#e3b66b', leaf: '#4f9a8a', leaf2: '#2f6f66'
  };
  const SKIN = ['#f2cfb3', '#e0b08a', '#c68e66', '#a56c47', '#7d4e33', '#5b3825'];
  const HAIR = ['#2a1c14', '#4a3222', '#1b1411', '#7a5a3d', '#8d8d93', '#0f0b09'];

  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; }
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const c = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
    return `rgb(${c(16)},${c(8)},${c(0)})`;
  }
  function vgrad(ctx, x, y, w, h, stops) { const g = ctx.createLinearGradient(0, y, 0, y + h); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
  function lgrad(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  function glow(ctx, x, y, r, rgb, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function blob(ctx, x, y, rx, ry, color, blur) { ctx.save(); ctx.filter = `blur(${blur}px)`; ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore(); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function grain(ctx, w, h, amt, rand) { const id = ctx.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (rand() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; } ctx.putImageData(id, 0, 0); }
  function vignette(ctx, w, h, a) { const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.5, w / 2, h / 2, Math.max(w, h) * 0.85); g.addColorStop(0, 'rgba(14,42,71,0)'); g.addColorStop(1, `rgba(14,42,71,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  function shadow(ctx, x, y, rx, ry, a = 0.22) { blob(ctx, x, y, rx, ry, `rgba(14,42,71,${a})`, Math.max(6, ry * 0.7)); }
  function archPath(ctx, x, y, w, h) { ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); }
  function leaf(ctx, x, y, len, wid, ang, fill) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(wid, -len * 0.25, wid * 0.9, -len * 0.75, 0, -len); ctx.bezierCurveTo(-wid * 0.9, -len * 0.75, -wid, -len * 0.25, 0, 0);
    ctx.fillStyle = fill; ctx.fill(); ctx.restore();
  }
  function plant(ctx, x, y, s, rand, pot = P.sand2) {
    // y = base of pot
    const pw = s * 0.34, ph = s * 0.3;
    ctx.fillStyle = lgrad(ctx, x - pw, 0, x + pw, 0, [[0, mix(pot, '#ffffff', 0.25)], [1, mix(pot, P.navy, 0.18)]]);
    ctx.beginPath(); ctx.moveTo(x - pw * 0.8, y - ph); ctx.lineTo(x + pw * 0.8, y - ph); ctx.lineTo(x + pw * 0.6, y); ctx.lineTo(x - pw * 0.6, y); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 11; i++) { const a = -1.2 + (i / 10) * 2.4 + (rand() - 0.5) * 0.2; leaf(ctx, x, y - ph, s * (0.6 + rand() * 0.4), s * 0.1, a, mix(P.leaf, P.leaf2, rand())); }
  }
  function pendant(ctx, x, top, len, r) {
    ctx.strokeStyle = 'rgba(14,42,71,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, top + len); ctx.stroke();
    glow(ctx, x, top + len + r * 0.4, r * 3.4, '255,236,190', 0.45);
    ctx.fillStyle = lgrad(ctx, x - r, 0, x + r, 0, [[0, P.navy2], [1, P.navy]]); ctx.beginPath(); ctx.arc(x, top + len + r * 0.1, r, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff3cf'; ctx.beginPath(); ctx.ellipse(x, top + len + r * 0.1, r * 0.8, r * 0.18, 0, 0, 7); ctx.fill();
  }

  /* ---------------- interiors ---------------- */
  function room(ctx, w, h, r, o) {
    const floorY = h * 0.72;
    vgrad(ctx, 0, 0, w, floorY, [[0, mix(P.mist, '#ffffff', 0.5)], [1, P.ivory]]);
    for (let i = 0; i < 16; i++) blob(ctx, r() * w, r() * floorY, 90 + r() * 240, 60 + r() * 150, `rgba(${r() > 0.5 ? '207,228,239' : '241,233,219'},${0.12 + r() * 0.12})`, 50);
    // floor
    vgrad(ctx, 0, floorY, w, h - floorY, [[0, mix(P.sand, P.sand2, 0.35)], [1, mix(P.sand, '#ffffff', 0.3)]]);
    ctx.strokeStyle = 'rgba(14,42,71,.06)'; ctx.lineWidth = 2;
    for (let i = 1; i < 9; i++) { ctx.beginPath(); ctx.moveTo(0, floorY + (h - floorY) * (i / 9) ** 1.6); ctx.lineTo(w, floorY + (h - floorY) * (i / 9) ** 1.6); ctx.stroke(); }
    ctx.fillStyle = 'rgba(14,42,71,.10)'; ctx.fillRect(0, floorY - 6, w, 8);
    // arched windows
    const n = o.windows ?? 1, aw = w * (o.winW ?? 0.2), ah = floorY * (o.winH ?? 0.78), gap = (w - n * aw) / (n + 1);
    for (let i = 0; i < n; i++) {
      const ax = gap + i * (aw + gap) + (o.winShift ?? 0) * w, ay = floorY * 0.07;
      ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip();
      vgrad(ctx, ax, ay, aw, ah, [[0, '#f6fbff'], [0.6, P.sky], [1, mix(P.sky2, P.teal2, 0.3)]]);
      glow(ctx, ax + aw * 0.7, ay + aw * 0.5, aw, '255,245,215', 0.9);
      for (let k = 0; k < 6; k++) blob(ctx, ax + r() * aw, ay + ah * (0.2 + r() * 0.7), aw * 0.3, aw * 0.1, 'rgba(255,255,255,.7)', 12);
      blob(ctx, ax + aw * 0.5, ay + ah * 0.95, aw * 0.8, ah * 0.12, 'rgba(79,154,138,.55)', 18);
      ctx.restore();
      ctx.lineWidth = Math.max(6, w * 0.006); ctx.strokeStyle = '#ffffff'; archPath(ctx, ax, ay, aw, ah); ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(14,42,71,.15)'; ctx.beginPath(); ctx.moveTo(ax + aw / 2, ay); ctx.lineTo(ax + aw / 2, ay + ah); ctx.moveTo(ax, ay + ah * 0.55); ctx.lineTo(ax + aw, ay + ah * 0.55); ctx.stroke();
      // light cast on floor
      ctx.save(); ctx.filter = 'blur(16px)'; ctx.fillStyle = 'rgba(255,248,225,.55)'; ctx.beginPath(); ctx.moveTo(ax, floorY); ctx.lineTo(ax + aw, floorY); ctx.lineTo(ax + aw * 1.5, h); ctx.lineTo(ax - aw * 0.3, h); ctx.fill(); ctx.restore();
    }
    return { floorY };
  }
  function desk(ctx, x, y, w, h, color = P.navy2) {
    shadow(ctx, x + w / 2, y + h, w * 0.55, h * 0.12);
    ctx.fillStyle = lgrad(ctx, x, 0, x + w, 0, [[0, mix(color, '#ffffff', 0.12)], [1, mix(color, P.navy, 0.35)]]); rr(ctx, x, y, w, h, h * 0.12); ctx.fill();
    ctx.fillStyle = '#ffffff'; rr(ctx, x - w * 0.02, y - h * 0.1, w * 1.04, h * 0.14, h * 0.07); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x + w * 0.06, y + h * 0.2, w * 0.02, h * 0.7);
  }
  function chair(ctx, x, y, s, color = P.teal) {
    shadow(ctx, x, y, s * 0.5, s * 0.07, 0.18);
    ctx.fillStyle = color; rr(ctx, x - s * 0.36, y - s * 0.95, s * 0.72, s * 0.62, s * 0.2); ctx.fill();
    ctx.fillStyle = mix(color, '#ffffff', 0.18); rr(ctx, x - s * 0.42, y - s * 0.46, s * 0.84, s * 0.2, s * 0.1); ctx.fill();
    ctx.strokeStyle = P.navy; ctx.lineWidth = Math.max(3, s * 0.04); ctx.beginPath(); ctx.moveTo(x - s * 0.3, y - s * 0.28); ctx.lineTo(x - s * 0.36, y); ctx.moveTo(x + s * 0.3, y - s * 0.28); ctx.lineTo(x + s * 0.36, y); ctx.stroke();
  }
  function sofa(ctx, x, y, w, color) {
    shadow(ctx, x + w / 2, y, w * 0.55, w * 0.04, 0.2);
    const h = w * 0.32;
    ctx.fillStyle = mix(color, P.navy, 0.1); rr(ctx, x, y - h, w, h, h * 0.35); ctx.fill();
    ctx.fillStyle = mix(color, '#ffffff', 0.12); rr(ctx, x + w * 0.04, y - h * 0.62, w * 0.44, h * 0.5, h * 0.2); ctx.fill(); rr(ctx, x + w * 0.52, y - h * 0.62, w * 0.44, h * 0.5, h * 0.2); ctx.fill();
    ctx.fillStyle = mix(color, '#ffffff', 0.3); rr(ctx, x - w * 0.02, y - h * 0.85, w * 0.12, h * 0.85, h * 0.2); ctx.fill(); rr(ctx, x + w * 0.9, y - h * 0.85, w * 0.12, h * 0.85, h * 0.2); ctx.fill();
  }

  const interiors = {
    reception(ctx, w, h, r, _o) {
      const { floorY } = room(ctx, w, h, r, { windows: 2, winW: 0.17, winH: 0.74 });
      [0.32, 0.5, 0.68].forEach((f) => pendant(ctx, w * f, 0, h * 0.14 + (f === 0.5 ? 20 : 0), w * 0.028));
      desk(ctx, w * 0.3, floorY - h * 0.02, w * 0.4, h * 0.2);
      ctx.fillStyle = P.teal; rr(ctx, w * 0.45, floorY - h * 0.08, w * 0.1, h * 0.05, 6); ctx.fill();
      plant(ctx, w * 0.12, floorY + h * 0.12, h * 0.4, r);
      plant(ctx, w * 0.88, floorY + h * 0.11, h * 0.34, r, P.blush);
      chair(ctx, w * 0.8, floorY + h * 0.2, h * 0.2, P.teal2);
    },
    consult(ctx, w, h, r) {
      const { floorY } = room(ctx, w, h, r, { windows: 1, winW: 0.22, winH: 0.74, winShift: -0.28 });
      // couch
      const cx = w * 0.62, cy = floorY + h * 0.08;
      shadow(ctx, cx + w * 0.16, cy + h * 0.1, w * 0.22, h * 0.03);
      ctx.fillStyle = lgrad(ctx, cx, 0, cx + w * 0.32, 0, [[0, P.mist2], [1, P.sky2]]); rr(ctx, cx, cy - h * 0.06, w * 0.34, h * 0.09, 16); ctx.fill();
      ctx.fillStyle = '#fff'; rr(ctx, cx + w * 0.02, cy - h * 0.1, w * 0.07, h * 0.045, 12); ctx.fill();
      ctx.strokeStyle = P.navy2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + w * 0.03, cy + h * 0.03); ctx.lineTo(cx + w * 0.03, cy + h * 0.12); ctx.moveTo(cx + w * 0.31, cy + h * 0.03); ctx.lineTo(cx + w * 0.31, cy + h * 0.12); ctx.stroke();
      desk(ctx, w * 0.08, floorY - h * 0.01, w * 0.3, h * 0.18);
      chair(ctx, w * 0.2, floorY + h * 0.22, h * 0.22, P.teal);
      chair(ctx, w * 0.34, floorY + h * 0.24, h * 0.2, P.coral);
      ctx.fillStyle = '#fff'; rr(ctx, w * 0.8, h * 0.12, w * 0.12, h * 0.22, 8); ctx.fill(); ctx.fillStyle = P.tealSoft; rr(ctx, w * 0.815, h * 0.14, w * 0.09, h * 0.18, 5); ctx.fill();
      plant(ctx, w * 0.92, floorY + h * 0.1, h * 0.3, r);
    },
    diagnostics(ctx, w, h, r) {
      const { floorY } = room(ctx, w, h, r, { windows: 1, winW: 0.16, winH: 0.7, winShift: 0.3 });
      const cx = w * 0.42, cy = floorY - h * 0.14, R = h * 0.28;
      shadow(ctx, cx, floorY + h * 0.1, R * 1.3, h * 0.035);
      ctx.fillStyle = lgrad(ctx, cx - R, 0, cx + R, 0, [[0, '#ffffff'], [1, P.mist2]]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(14,42,71,.12)'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = lgrad(ctx, cx, cy - R * 0.6, cx, cy + R * 0.6, [[0, P.navy2], [1, P.navy]]); ctx.beginPath(); ctx.arc(cx, cy, R * 0.62, 0, 7); ctx.fill();
      glow(ctx, cx, cy, R * 0.6, '93,180,184', 0.75);
      ctx.fillStyle = '#ffffff'; rr(ctx, cx - R * 1.5, cy + R * 0.12, R * 3.0, R * 0.18, 12); ctx.fill();
      ctx.fillStyle = P.sky2; rr(ctx, cx - R * 1.4, cy + R * 0.22, R * 2.8, R * 0.12, 8); ctx.fill();
      ctx.fillStyle = P.navy2; rr(ctx, cx - R * 0.15, cy + R * 0.3, R * 0.3, R * 0.7, 8); ctx.fill();
      // monitor
      const mx = w * 0.76, my = floorY - h * 0.28;
      ctx.fillStyle = P.navy; rr(ctx, mx, my, w * 0.16, h * 0.15, 14); ctx.fill(); ctx.fillStyle = '#0b3a46'; rr(ctx, mx + 8, my + 8, w * 0.16 - 16, h * 0.15 - 16, 8); ctx.fill();
      ctx.strokeStyle = P.aqua; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = mx + 18 + (i / 40) * (w * 0.16 - 36); const y = my + h * 0.075 + Math.sin(i * 0.9) * (i % 9 === 4 ? h * 0.05 : h * 0.008); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.fillStyle = P.navy2; ctx.fillRect(mx + w * 0.07, my + h * 0.15, w * 0.02, h * 0.11); rr(ctx, mx + w * 0.05, my + h * 0.255, w * 0.06, h * 0.015, 6); ctx.fill();
      plant(ctx, w * 0.08, floorY + h * 0.12, h * 0.34, r);
    },
    rehab(ctx, w, h, r) {
      const { floorY } = room(ctx, w, h, r, { windows: 3, winW: 0.13, winH: 0.72 });
      // mirror
      ctx.fillStyle = 'rgba(255,255,255,.55)'; rr(ctx, w * 0.62, h * 0.1, w * 0.3, floorY * 0.62, 12); ctx.fill(); ctx.strokeStyle = 'rgba(14,42,71,.18)'; ctx.lineWidth = 3; ctx.stroke();
      // mat
      ctx.fillStyle = P.teal; ctx.save(); ctx.transform(1, 0, -0.5, 1, 0, 0); rr(ctx, w * 0.2 + h * 0.2 * 0.5, floorY + h * 0.1, w * 0.36, h * 0.1, 10); ctx.fill(); ctx.restore();
      // ball
      const bx = w * 0.72, by = floorY + h * 0.07, R = h * 0.16;
      shadow(ctx, bx, by + R, R * 1.1, R * 0.16, 0.25);
      const g = ctx.createRadialGradient(bx - R * 0.4, by - R * 0.4, R * 0.1, bx, by, R); g.addColorStop(0, '#ffe3da'); g.addColorStop(0.6, P.coral); g.addColorStop(1, mix(P.coral, P.navy, 0.35)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, R, 0, 7); ctx.fill();
      // bars
      ctx.strokeStyle = P.navy2; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(w * 0.08, floorY - h * 0.02); ctx.lineTo(w * 0.08, floorY + h * 0.2); ctx.moveTo(w * 0.3, floorY - h * 0.02); ctx.lineTo(w * 0.3, floorY + h * 0.2); ctx.moveTo(w * 0.08, floorY - h * 0.02); ctx.lineTo(w * 0.3, floorY - h * 0.02); ctx.stroke(); ctx.lineCap = 'butt';
      plant(ctx, w * 0.93, floorY + h * 0.1, h * 0.3, r);
    },
    lounge(ctx, w, h, r) {
      const { floorY } = room(ctx, w, h, r, { windows: 2, winW: 0.2, winH: 0.74 });
      pendant(ctx, w * 0.5, 0, h * 0.18, w * 0.035);
      ctx.fillStyle = 'rgba(47,138,145,.18)'; ctx.beginPath(); ctx.ellipse(w * 0.5, floorY + h * 0.2, w * 0.36, h * 0.07, 0, 0, 7); ctx.fill();
      sofa(ctx, w * 0.1, floorY + h * 0.17, w * 0.34, P.teal);
      sofa(ctx, w * 0.58, floorY + h * 0.17, w * 0.3, P.navy3);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(w * 0.5, floorY + h * 0.2, w * 0.06, h * 0.025, 0, 0, 7); ctx.fill(); ctx.fillStyle = P.blush; ctx.fillRect(w * 0.488, floorY + h * 0.19, w * 0.024, h * 0.018);
      plant(ctx, w * 0.05, floorY + h * 0.1, h * 0.36, r);
      plant(ctx, w * 0.95, floorY + h * 0.1, h * 0.32, r, P.blush);
    },
    family(ctx, w, h, r) {
      const { floorY } = room(ctx, w, h, r, { windows: 2, winW: 0.16, winH: 0.66 });
      ctx.fillStyle = 'rgba(217,115,94,.2)'; ctx.beginPath(); ctx.ellipse(w * 0.5, floorY + h * 0.17, w * 0.3, h * 0.08, 0, 0, 7); ctx.fill();
      const blocks = [[0.34, P.coral, 0.1], [0.46, P.gold, 0.09], [0.57, P.teal, 0.1], [0.4, P.navy3, 0.08]];
      blocks.forEach(([f, c, s], i) => { const s2 = w * s, x = w * f, y = floorY + h * 0.2 - (i === 3 ? s2 : 0); shadow(ctx, x + s2 / 2, y + s2 * (i === 3 ? 1 : 0), s2 * 0.7, s2 * 0.1, 0.2); ctx.fillStyle = c; rr(ctx, x, i === 3 ? y - s2 * 0.0 : y - s2, s2, s2, s2 * 0.2); ctx.fill(); });
      [[0.18, P.coral], [0.22, P.gold], [0.78, P.teal2], [0.83, P.blush]].forEach(([f, c], i) => { const x = w * f, y = h * (0.26 + (i % 2) * 0.08); ctx.strokeStyle = 'rgba(14,42,71,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + h * 0.1); ctx.lineTo(x + (i % 2 ? 10 : -10), floorY + h * 0.1); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, h * 0.065, h * 0.08, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(x - h * 0.02, y - h * 0.03, h * 0.015, h * 0.025, 0.4, 0, 7); ctx.fill(); });
      plant(ctx, w * 0.93, floorY + h * 0.12, h * 0.3, r);
    },
    corridor(ctx, w, h, r) {
      vgrad(ctx, 0, 0, w, h, [[0, P.ivory], [1, P.sand]]);
      const cx = w / 2;
      for (let i = 5; i >= 0; i--) {
        const s = 1 - i * 0.14, aw = w * 0.5 * s, ah = h * 0.78 * s, ax = cx - aw / 2, ay = h * 0.9 - ah;
        ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip();
        vgrad(ctx, ax, ay, aw, ah, [[0, i === 5 ? '#fff6dc' : mix('#f2f8fb', P.sky, i / 6)], [1, mix(P.mist, P.sky2, i / 6)]]); ctx.restore();
        ctx.lineWidth = 10 * s + 2; ctx.strokeStyle = mix('#ffffff', P.sand2, i / 7); archPath(ctx, ax, ay, aw, ah); ctx.stroke();
      }
      glow(ctx, cx, h * 0.42, w * 0.3, '255,246,215', 0.7);
      vgrad(ctx, 0, h * 0.9, w, h * 0.1, [[0, mix(P.sand, P.sand2, 0.5)], [1, P.sand2]]);
      plant(ctx, w * 0.1, h * 0.96, h * 0.42, r); plant(ctx, w * 0.9, h * 0.96, h * 0.38, r, P.blush);
      shadow(ctx, cx, h * 0.95, w * 0.2, h * 0.02, 0.1);
    },
    hero(ctx, w, h, r) {
      vgrad(ctx, 0, 0, w, h, [[0, P.mist], [1, mix(P.mist2, P.sky, 0.5)]]);
      for (let i = 0; i < 18; i++) blob(ctx, r() * w, r() * h, 80 + r() * 260, 60 + r() * 200, `rgba(255,255,255,${0.1 + r() * 0.2})`, 50);
      const aw = w * 0.62, ax = (w - aw) / 2, ay = h * 0.1, ah = h * 0.7;
      ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip();
      vgrad(ctx, ax, ay, aw, ah, [[0, '#fbfdff'], [0.55, P.sky], [1, mix(P.sky2, P.teal2, 0.4)]]);
      glow(ctx, ax + aw * 0.72, ay + aw * 0.4, aw * 0.9, '255,244,210', 0.95);
      for (let k = 0; k < 9; k++) blob(ctx, ax + r() * aw, ay + ah * (0.15 + r() * 0.75), aw * 0.22, aw * 0.07, 'rgba(255,255,255,.75)', 10);
      for (let k = 0; k < 5; k++) { ctx.fillStyle = mix(P.leaf, P.leaf2, k / 5); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(ax - 20, ay + ah); for (let x = ax; x <= ax + aw; x += 20) ctx.lineTo(x, ay + ah * (0.78 + k * 0.04) - Math.sin(x * 0.01 + k) * 20); ctx.lineTo(ax + aw + 20, ay + ah); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.restore();
      ctx.lineWidth = w * 0.022; ctx.strokeStyle = '#fff'; archPath(ctx, ax, ay, aw, ah); ctx.stroke();
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(14,42,71,.13)'; ctx.beginPath(); ctx.moveTo(ax + aw / 2, ay); ctx.lineTo(ax + aw / 2, ay + ah); ctx.moveTo(ax, ay + ah * 0.6); ctx.lineTo(ax + aw, ay + ah * 0.6); ctx.stroke();
      const fy = ay + ah; vgrad(ctx, 0, fy, w, h - fy, [[0, mix(P.sand, P.sand2, 0.4)], [1, P.sand]]);
      ctx.save(); ctx.filter = 'blur(18px)'; ctx.fillStyle = 'rgba(255,248,225,.6)'; ctx.beginPath(); ctx.moveTo(ax, fy); ctx.lineTo(ax + aw, fy); ctx.lineTo(ax + aw * 1.2, h); ctx.lineTo(ax - aw * 0.2, h); ctx.fill(); ctx.restore();
      // console + vase
      shadow(ctx, w * 0.5, fy + 8, aw * 0.5, 14, 0.2);
      ctx.fillStyle = '#fff'; rr(ctx, w * 0.22, fy - h * 0.045, w * 0.56, h * 0.045, 12); ctx.fill();
      ctx.fillStyle = P.navy2; rr(ctx, w * 0.24, fy, w * 0.52, h * 0.08, 10); ctx.fill();
      for (let i = 0; i < 7; i++) leaf(ctx, w * 0.3, fy - h * 0.045, h * (0.18 + r() * 0.1), h * 0.026, -0.7 + i * 0.22, mix(P.leaf, P.leaf2, r()));
      ctx.fillStyle = lgrad(ctx, w * 0.27, 0, w * 0.33, 0, [[0, '#fff'], [1, P.sky2]]); rr(ctx, w * 0.28, fy - h * 0.1, w * 0.04, h * 0.055, 14); ctx.fill();
      plant(ctx, w * 0.12, h * 0.98, h * 0.4, r); plant(ctx, w * 0.9, h * 0.98, h * 0.36, r, P.blush);
    }
  };

  /* ---------------- specialty motifs ---------------- */
  const motifs = {
    stethoscope(ctx, cx, cy, s) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.05;
      ctx.beginPath(); ctx.moveTo(cx - s * 0.32, cy - s * 0.46); ctx.lineTo(cx - s * 0.32, cy - s * 0.12); ctx.arc(cx - s * 0.18, cy - s * 0.12, s * 0.14, Math.PI, 0, true); ctx.lineTo(cx - s * 0.04, cy - s * 0.46); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + s * 0.04, cy - s * 0.46); ctx.lineTo(cx + s * 0.04, cy - s * 0.12); ctx.arc(cx + s * 0.18, cy - s * 0.12, s * 0.14, Math.PI, 0, true); ctx.lineTo(cx + s * 0.32, cy - s * 0.46); ctx.stroke();
      ctx.strokeStyle = P.navy2; ctx.beginPath(); ctx.moveTo(cx - s * 0.04, cy - s * 0.12); ctx.bezierCurveTo(cx - s * 0.04, cy + s * 0.3, cx + s * 0.34, cy + s * 0.34, cx + s * 0.34, cy + s * 0.14); ctx.stroke();
      [cx - s * 0.32, cx - s * 0.04, cx + s * 0.04, cx + s * 0.32].forEach((x) => { ctx.fillStyle = P.teal2; ctx.beginPath(); ctx.arc(x, cy - s * 0.48, s * 0.032, 0, 7); ctx.fill(); });
      ctx.fillStyle = lgrad(ctx, cx + s * 0.22, 0, cx + s * 0.46, 0, [[0, '#ffffff'], [1, P.aqua]]); ctx.beginPath(); ctx.arc(cx + s * 0.34, cy + s * 0.2, s * 0.13, 0, 7); ctx.fill();
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.03; ctx.stroke(); ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(cx + s * 0.34, cy + s * 0.2, s * 0.06, 0, 7); ctx.fill(); ctx.lineCap = 'butt';
    },
    heart(ctx, cx, cy, s) {
      const g = ctx.createLinearGradient(cx - s * 0.4, cy - s * 0.4, cx + s * 0.4, cy + s * 0.4); g.addColorStop(0, '#ffb4a3'); g.addColorStop(1, P.coral);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy + s * 0.42);
      ctx.bezierCurveTo(cx - s * 0.62, cy - s * 0.02, cx - s * 0.4, cy - s * 0.5, cx, cy - s * 0.2); ctx.bezierCurveTo(cx + s * 0.4, cy - s * 0.5, cx + s * 0.62, cy - s * 0.02, cx, cy + s * 0.42); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(cx - s * 0.2, cy - s * 0.18, s * 0.08, s * 0.14, -0.6, 0, 7); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(cx - s * 0.7, cy + s * 0.02); ctx.lineTo(cx - s * 0.2, cy + s * 0.02); ctx.lineTo(cx - s * 0.08, cy - s * 0.2); ctx.lineTo(cx + s * 0.08, cy + s * 0.26); ctx.lineTo(cx + s * 0.2, cy + s * 0.02); ctx.lineTo(cx + s * 0.7, cy + s * 0.02); ctx.stroke(); ctx.lineCap = 'butt';
    },
    droplet(ctx, cx, cy, s) {
      const drop = (x, y, k, c1, c2) => { const g = ctx.createLinearGradient(x, y - k, x, y + k); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - k); ctx.bezierCurveTo(x + k * 0.9, y - k * 0.1, x + k * 0.8, y + k * 0.9, x, y + k * 0.9); ctx.bezierCurveTo(x - k * 0.8, y + k * 0.9, x - k * 0.9, y - k * 0.1, x, y - k); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(x - k * 0.3, y + k * 0.15, k * 0.1, k * 0.25, 0.3, 0, 7); ctx.fill(); };
      drop(cx, cy - s * 0.05, s * 0.4, '#d8f3f4', P.teal2); drop(cx - s * 0.42, cy + s * 0.2, s * 0.2, '#ffffff', P.sky2); drop(cx + s * 0.4, cy + s * 0.12, s * 0.24, '#ffffff', P.aqua);
      leaf(ctx, cx + s * 0.2, cy + s * 0.5, s * 0.55, s * 0.17, 0.5, P.leaf); leaf(ctx, cx + s * 0.2, cy + s * 0.5, s * 0.42, s * 0.14, -0.2, P.leaf2);
    },
    bone(ctx, cx, cy, s) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.6);
      const L = s * 0.5, t = s * 0.1, k = s * 0.13;
      const g = ctx.createLinearGradient(0, -k, 0, k); g.addColorStop(0, '#ffffff'); g.addColorStop(1, P.sand2);
      ctx.fillStyle = g; rr(ctx, -L, -t, L * 2, t * 2, t); ctx.fill();
      [[-L, -1], [-L, 1], [L, -1], [L, 1]].forEach(([x, sy]) => { ctx.beginPath(); ctx.arc(x + (x < 0 ? k * 0.2 : -k * 0.2), sy * k * 0.75, k, 0, 7); ctx.fill(); });
      ctx.restore();
      ctx.strokeStyle = P.teal; ctx.lineWidth = s * 0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx + s * 0.28, cy + s * 0.3, s * 0.2, Math.PI * 1.05, Math.PI * 1.8); ctx.stroke(); ctx.beginPath(); ctx.arc(cx + s * 0.28, cy + s * 0.3, s * 0.3, Math.PI * 1.05, Math.PI * 1.8); ctx.stroke(); ctx.lineCap = 'butt';
    },
    blocks(ctx, cx, cy, s) {
      const b = (x, y, k, c) => { ctx.fillStyle = c; rr(ctx, x, y, k, k, k * 0.2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; rr(ctx, x + k * 0.12, y + k * 0.12, k * 0.3, k * 0.1, 6); ctx.fill(); };
      const k = s * 0.3; b(cx - k * 1.55, cy + s * 0.12, k, P.coral); b(cx - k * 0.45, cy + s * 0.12, k, P.gold); b(cx + k * 0.65, cy + s * 0.12, k, P.teal); b(cx - k * 1.0, cy + s * 0.12 - k * 1.1, k, P.navy3); b(cx + k * 0.1, cy + s * 0.12 - k * 1.1, k, '#ffffff');
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.015; ctx.beginPath(); ctx.moveTo(cx + k * 1.55, cy - s * 0.08); ctx.bezierCurveTo(cx + k * 1.4, cy - s * 0.2, cx + k * 1.7, cy - s * 0.26, cx + k * 1.55, cy - s * 0.34); ctx.stroke();
      ctx.fillStyle = P.aqua; ctx.beginPath(); ctx.ellipse(cx + k * 1.55, cy - s * 0.52, s * 0.14, s * 0.17, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(cx + k * 1.5, cy - s * 0.58, s * 0.03, s * 0.06, 0.4, 0, 7); ctx.fill();
    },
    tooth(ctx, cx, cy, s) {
      const g = ctx.createLinearGradient(cx - s * 0.4, cy - s * 0.4, cx + s * 0.4, cy + s * 0.5); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d7e6ef');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(cx - s * 0.36, cy - s * 0.3); ctx.bezierCurveTo(cx - s * 0.36, cy - s * 0.55, cx - s * 0.08, cy - s * 0.52, cx, cy - s * 0.4);
      ctx.bezierCurveTo(cx + s * 0.08, cy - s * 0.52, cx + s * 0.36, cy - s * 0.55, cx + s * 0.36, cy - s * 0.3);
      ctx.bezierCurveTo(cx + s * 0.36, cy + s * 0.05, cx + s * 0.22, cy + s * 0.18, cx + s * 0.2, cy + s * 0.5);
      ctx.bezierCurveTo(cx + s * 0.18, cy + s * 0.62, cx + s * 0.06, cy + s * 0.6, cx + s * 0.04, cy + s * 0.46);
      ctx.bezierCurveTo(cx + s * 0.02, cy + s * 0.3, cx - s * 0.02, cy + s * 0.3, cx - s * 0.04, cy + s * 0.46);
      ctx.bezierCurveTo(cx - s * 0.06, cy + s * 0.6, cx - s * 0.18, cy + s * 0.62, cx - s * 0.2, cy + s * 0.5);
      ctx.bezierCurveTo(cx - s * 0.22, cy + s * 0.18, cx - s * 0.36, cy + s * 0.05, cx - s * 0.36, cy - s * 0.3); ctx.fill();
      ctx.strokeStyle = P.sky2; ctx.lineWidth = s * 0.02; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.ellipse(cx - s * 0.2, cy - s * 0.25, s * 0.05, s * 0.13, 0.2, 0, 7); ctx.fill();
      [[0.5, -0.4], [0.58, -0.22], [-0.52, -0.1]].forEach(([x, y], i) => { ctx.fillStyle = P.aqua; ctx.beginPath(); const px = cx + x * s, py = cy + y * s, k = s * (i ? 0.03 : 0.045); ctx.moveTo(px, py - k * 2); ctx.lineTo(px + k, py - k); ctx.lineTo(px + k * 2, py); ctx.lineTo(px + k, py + k); ctx.lineTo(px, py + k * 2); ctx.lineTo(px - k, py + k); ctx.lineTo(px - k * 2, py); ctx.lineTo(px - k, py - k); ctx.fill(); });
    },
    figure(ctx, cx, cy, s) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.07;
      const hx = cx, hy = cy - s * 0.34;
      ctx.beginPath(); ctx.moveTo(hx, hy + s * 0.1); ctx.lineTo(cx + s * 0.02, cy + s * 0.12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - s * 0.34, cy - s * 0.46); ctx.lineTo(cx - s * 0.02, cy - s * 0.18); ctx.lineTo(cx + s * 0.36, cy - s * 0.4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + s * 0.02, cy + s * 0.12); ctx.lineTo(cx - s * 0.26, cy + s * 0.36); ctx.lineTo(cx - s * 0.18, cy + s * 0.56); ctx.moveTo(cx + s * 0.02, cy + s * 0.12); ctx.lineTo(cx + s * 0.3, cy + s * 0.3); ctx.lineTo(cx + s * 0.46, cy + s * 0.54); ctx.stroke();
      ctx.fillStyle = P.coral; ctx.beginPath(); ctx.arc(hx, hy - s * 0.04, s * 0.09, 0, 7); ctx.fill();
      ctx.strokeStyle = P.teal; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.moveTo(cx - s * 0.62, cy + s * 0.62); ctx.lineTo(cx + s * 0.7, cy + s * 0.62); ctx.stroke();
      ctx.strokeStyle = P.teal2; ctx.lineWidth = s * 0.02; ctx.setLineDash([s * 0.02, s * 0.05]); ctx.beginPath(); ctx.arc(cx, cy - s * 0.1, s * 0.55, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.setLineDash([]); ctx.lineCap = 'butt';
    },
    flower(ctx, cx, cy, s) {
      for (let ring = 1; ring >= 0; ring--) {
        const n = ring ? 8 : 6;
        for (let k = 0; k < n; k++) { const a = (k / n) * 6.283 + ring * 0.4; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); const g = ctx.createLinearGradient(0, 0, 0, -s * 0.5); g.addColorStop(0, ring ? '#ffd9cc' : '#ffffff'); g.addColorStop(1, ring ? P.coral : P.blush); leaf(ctx, 0, 0, s * (ring ? 0.5 : 0.36), s * (ring ? 0.17 : 0.13), 0, g); ctx.restore(); }
      }
      ctx.fillStyle = P.gold; ctx.beginPath(); ctx.arc(cx, cy, s * 0.07, 0, 7); ctx.fill();
      leaf(ctx, cx + s * 0.08, cy + s * 0.9, s * 0.45, s * 0.14, 0.9, P.leaf); leaf(ctx, cx - s * 0.08, cy + s * 0.9, s * 0.38, s * 0.12, -0.9, P.leaf2);
    },
    moon(ctx, cx, cy, s) {
      ctx.fillStyle = lgrad(ctx, cx - s * 0.3, cy - s * 0.4, cx + s * 0.3, cy + s * 0.4, [[0, '#fff8de'], [1, P.gold]]); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, s * 0.4, 0, 7); ctx.clip();
      ctx.beginPath(); ctx.rect(cx - s, cy - s, s * 2, s * 2); ctx.arc(cx + s * 0.2, cy - s * 0.1, s * 0.34, 0, 7); ctx.fill('evenodd'); ctx.restore();
      [[0.35, -0.3, 0.05], [0.5, 0.05, 0.035], [0.22, 0.34, 0.04], [-0.5, -0.4, 0.03]].forEach(([x, y, k]) => { ctx.fillStyle = '#fff'; const px = cx + x * s, py = cy + y * s, q = s * k; ctx.beginPath(); ctx.moveTo(px, py - q * 2); ctx.lineTo(px + q * 0.6, py - q * 0.6); ctx.lineTo(px + q * 2, py); ctx.lineTo(px + q * 0.6, py + q * 0.6); ctx.lineTo(px, py + q * 2); ctx.lineTo(px - q * 0.6, py + q * 0.6); ctx.lineTo(px - q * 2, py); ctx.lineTo(px - q * 0.6, py - q * 0.6); ctx.fill(); });
    },
    sun(ctx, cx, cy, s) {
      glow(ctx, cx, cy, s * 0.8, '255,236,180', 0.8);
      ctx.strokeStyle = P.gold; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round';
      for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * s * 0.34, cy + Math.sin(a) * s * 0.34); ctx.lineTo(cx + Math.cos(a) * s * (k % 2 ? 0.42 : 0.5), cy + Math.sin(a) * s * (k % 2 ? 0.42 : 0.5)); ctx.stroke(); }
      ctx.lineCap = 'butt'; ctx.fillStyle = lgrad(ctx, cx - s * 0.25, cy - s * 0.25, cx + s * 0.25, cy + s * 0.25, [[0, '#fff3c4'], [1, P.gold]]); ctx.beginPath(); ctx.arc(cx, cy, s * 0.26, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)'; rr(ctx, cx - s * 0.5, cy + s * 0.46, s * 1.0, s * 0.1, s * 0.05); ctx.fill();
    },
    chairdesk(ctx, cx, cy, s) {
      ctx.fillStyle = P.teal; rr(ctx, cx - s * 0.2, cy - s * 0.5, s * 0.34, s * 0.5, s * 0.1); ctx.fill();
      ctx.fillStyle = P.teal2; rr(ctx, cx - s * 0.26, cy - s * 0.02, s * 0.46, s * 0.12, s * 0.06); ctx.fill();
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - s * 0.03, cy + s * 0.1); ctx.lineTo(cx - s * 0.03, cy + s * 0.36); ctx.moveTo(cx - s * 0.2, cy + s * 0.4); ctx.lineTo(cx + s * 0.14, cy + s * 0.4); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.fillStyle = '#fff'; rr(ctx, cx + s * 0.28, cy - s * 0.18, s * 0.34, s * 0.07, 8); ctx.fill(); ctx.fillStyle = P.navy2; ctx.fillRect(cx + s * 0.3, cy - s * 0.11, s * 0.03, s * 0.5); ctx.fillRect(cx + s * 0.57, cy - s * 0.11, s * 0.03, s * 0.5);
      plantMini(ctx, cx - s * 0.46, cy + s * 0.4, s);
    },
    calendar(ctx, cx, cy, s) {
      ctx.fillStyle = '#fff'; rr(ctx, cx - s * 0.42, cy - s * 0.4, s * 0.84, s * 0.8, s * 0.1); ctx.fill();
      ctx.fillStyle = P.teal; ctx.beginPath(); ctx.roundRect(cx - s * 0.42, cy - s * 0.4, s * 0.84, s * 0.22, [s * 0.1, s * 0.1, 0, 0]); ctx.fill();
      ctx.fillStyle = P.navy; [-0.22, 0.22].forEach((x) => { rr(ctx, cx + x * s - s * 0.025, cy - s * 0.48, s * 0.05, s * 0.14, 6); ctx.fill(); });
      for (let i = 0; i < 12; i++) { const x = cx - s * 0.3 + (i % 4) * s * 0.2, y = cy - s * 0.08 + Math.floor(i / 4) * s * 0.16; ctx.fillStyle = i === 6 ? P.coral : P.mist2; rr(ctx, x, y, s * 0.13, s * 0.1, 5); ctx.fill(); }
    },
    magnifier(ctx, cx, cy, s) {
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + s * 0.22, cy + s * 0.22); ctx.lineTo(cx + s * 0.46, cy + s * 0.46); ctx.stroke();
      ctx.fillStyle = 'rgba(214,235,236,.85)'; ctx.beginPath(); ctx.arc(cx - s * 0.06, cy - s * 0.06, s * 0.3, 0, 7); ctx.fill(); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.strokeStyle = P.teal; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(cx - s * 0.2, cy - s * 0.04); ctx.lineTo(cx - s * 0.12, cy - s * 0.04); ctx.lineTo(cx - s * 0.06, cy - s * 0.16); ctx.lineTo(cx + s * 0.02, cy + s * 0.08); ctx.lineTo(cx + s * 0.06, cy - s * 0.04); ctx.lineTo(cx + s * 0.12, cy - s * 0.04); ctx.stroke(); ctx.lineCap = 'butt';
    },
    glass(ctx, cx, cy, s) {
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(cx - s * 0.26, cy - s * 0.4); ctx.lineTo(cx + s * 0.26, cy - s * 0.4); ctx.lineTo(cx + s * 0.2, cy + s * 0.42); ctx.quadraticCurveTo(cx, cy + s * 0.5, cx - s * 0.2, cy + s * 0.42); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lgrad(ctx, 0, cy - s * 0.1, 0, cy + s * 0.45, [[0, P.aqua], [1, P.teal2]]); ctx.beginPath(); ctx.moveTo(cx - s * 0.235, cy - s * 0.12); ctx.lineTo(cx + s * 0.235, cy - s * 0.12); ctx.lineTo(cx + s * 0.2, cy + s * 0.42); ctx.quadraticCurveTo(cx, cy + s * 0.5, cx - s * 0.2, cy + s * 0.42); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.02; ctx.beginPath(); ctx.moveTo(cx - s * 0.26, cy - s * 0.4); ctx.lineTo(cx + s * 0.26, cy - s * 0.4); ctx.stroke();
      [[-0.5, 0.3, 0.1], [0.5, 0.1, 0.13], [0.46, 0.5, 0.07]].forEach(([x, y, k]) => { ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.moveTo(cx + x * s, cy + (y - k) * s); ctx.bezierCurveTo(cx + (x + k) * s, cy + y * s, cx + (x + k * 0.7) * s, cy + (y + k) * s, cx + x * s, cy + (y + k) * s); ctx.bezierCurveTo(cx + (x - k * 0.7) * s, cy + (y + k) * s, cx + (x - k) * s, cy + y * s, cx + x * s, cy + (y - k) * s); ctx.fill(); });
    },
    shield(ctx, cx, cy, s) {
      ctx.fillStyle = lgrad(ctx, cx - s * 0.4, cy - s * 0.5, cx + s * 0.4, cy + s * 0.5, [[0, '#ffffff'], [1, P.aqua]]); ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.5); ctx.lineTo(cx + s * 0.4, cy - s * 0.34); ctx.lineTo(cx + s * 0.4, cy + s * 0.04); ctx.quadraticCurveTo(cx + s * 0.38, cy + s * 0.34, cx, cy + s * 0.52); ctx.quadraticCurveTo(cx - s * 0.38, cy + s * 0.34, cx - s * 0.4, cy + s * 0.04); ctx.lineTo(cx - s * 0.4, cy - s * 0.34); ctx.closePath(); ctx.fill(); ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.025; ctx.stroke();
      leaf(ctx, cx, cy + s * 0.28, s * 0.5, s * 0.17, 0.5, P.leaf); leaf(ctx, cx, cy + s * 0.28, s * 0.4, s * 0.14, -0.5, P.leaf2);
    },
    archplus(ctx, cx, cy, s) {
      ctx.fillStyle = lgrad(ctx, cx - s * 0.4, cy - s * 0.5, cx + s * 0.4, cy + s * 0.5, [[0, '#ffffff'], [1, P.mist2]]); archPath(ctx, cx - s * 0.38, cy - s * 0.52, s * 0.76, s * 1.0); ctx.fill(); ctx.strokeStyle = P.navy; ctx.lineWidth = s * 0.025; ctx.stroke();
      ctx.fillStyle = P.teal; rr(ctx, cx - s * 0.05, cy - s * 0.26, s * 0.1, s * 0.4, 8); ctx.fill(); rr(ctx, cx - s * 0.2, cy - s * 0.11, s * 0.4, s * 0.1, 8); ctx.fill();
    },
    clipboard(ctx, cx, cy, s) {
      ctx.fillStyle = P.navy2; rr(ctx, cx - s * 0.34, cy - s * 0.46, s * 0.68, s * 0.92, s * 0.08); ctx.fill();
      ctx.fillStyle = '#fff'; rr(ctx, cx - s * 0.28, cy - s * 0.36, s * 0.56, s * 0.8, s * 0.04); ctx.fill();
      ctx.fillStyle = P.tealSoft; rr(ctx, cx - s * 0.12, cy - s * 0.52, s * 0.24, s * 0.12, 8); ctx.fill();
      for (let i = 0; i < 3; i++) { const y = cy - s * 0.2 + i * s * 0.22; ctx.strokeStyle = P.teal; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(cx - s * 0.2, y); ctx.lineTo(cx - s * 0.15, y + s * 0.05); ctx.lineTo(cx - s * 0.07, y - s * 0.05); ctx.stroke(); ctx.strokeStyle = P.mist2; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + s * 0.2, y); ctx.stroke(); }
      ctx.lineCap = 'butt';
    }
  };
  function plantMini(ctx, x, y, s) { for (let i = 0; i < 5; i++) leaf(ctx, x, y, s * 0.3, s * 0.06, -0.8 + i * 0.4, i % 2 ? P.leaf : P.leaf2); ctx.fillStyle = P.sand2; rr(ctx, x - s * 0.06, y, s * 0.12, s * 0.1, 5); ctx.fill(); }

  /* ---------------- scene dispatch ---------------- */
  const BG = {
    mist: [P.mist, P.sky], teal: [P.tealSoft, P.aqua], sand: [P.ivory, P.sand], navy: [P.navy2, P.navy], blush: ['#fbefe9', P.blush], sky: ['#f4faff', P.sky2]
  };
  const scenes = {
    room(ctx, w, h, r, o) { interiors[o.kind](ctx, w, h, r, o); },
    emblem(ctx, w, h, r, o) {
      const [c1, c2] = BG[o.bg || 'mist'];
      vgrad(ctx, 0, 0, w, h, [[0, c1], [1, c2]]);
      for (let i = 0; i < 12; i++) blob(ctx, r() * w, r() * h, 60 + r() * 200, 50 + r() * 140, `rgba(255,255,255,${o.bg === 'navy' ? 0.05 : 0.22})`, 40);
      const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.38;
      ctx.fillStyle = o.bg === 'navy' ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = o.bg === 'navy' ? 'rgba(169,221,224,.35)' : 'rgba(47,138,145,.22)'; ctx.lineWidth = 3;
      for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(cx, cy, R * (1 + k * 0.2), 0, 7); ctx.stroke(); }
      for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = R * (1.1 + r() * 0.9); ctx.fillStyle = o.bg === 'navy' ? 'rgba(169,221,224,.5)' : 'rgba(47,138,145,.3)'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 2 + r() * 4, 0, 7); ctx.fill(); }
      shadow(ctx, cx, cy + R * 0.95, R * 0.8, R * 0.08, 0.18);
      motifs[o.motif](ctx, cx, cy, R * 1.5 * (o.scale || 1));
    },
    portrait(ctx, w, h, r, o) {
      const bgs = [[P.mist, P.sky2], [P.tealSoft, P.teal2], [P.sand, P.blush], [P.mist2, P.navy3], [P.ivory, P.aqua], [P.blush, P.sky]];
      const [c1, c2] = bgs[o.bg % bgs.length];
      vgrad(ctx, 0, 0, w, h, [[0, c1], [1, c2]]);
      const aw = w * 0.82, ax = (w - aw) / 2; ctx.fillStyle = 'rgba(255,255,255,.35)'; archPath(ctx, ax, h * 0.06, aw, h * 0.94); ctx.fill();
      glow(ctx, w * 0.3, h * 0.2, w * 0.7, '255,248,226', 0.5);
      const skin = SKIN[o.skin], hair = HAIR[o.hair], cx = w / 2;
      shadow(ctx, cx, h * 0.99, w * 0.4, h * 0.03, 0.25);
      // coat / shoulders
      const coat = o.scrub ? P.teal : '#ffffff';
      ctx.fillStyle = lgrad(ctx, 0, h * 0.7, 0, h, [[0, coat], [1, o.scrub ? P.leaf2 : P.mist2]]);
      ctx.beginPath(); ctx.moveTo(w * 0.05, h); ctx.bezierCurveTo(w * 0.05, h * 0.78, w * 0.2, h * 0.7, cx - w * 0.14, h * 0.69); ctx.lineTo(cx + w * 0.14, h * 0.69); ctx.bezierCurveTo(w * 0.8, h * 0.7, w * 0.95, h * 0.78, w * 0.95, h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(14,42,71,.12)'; ctx.lineWidth = 3; ctx.stroke();
      // inner shirt + V
      ctx.fillStyle = o.scrub ? P.navy2 : (o.shirt || P.teal); ctx.beginPath(); ctx.moveTo(cx - w * 0.14, h * 0.69); ctx.lineTo(cx, h * 0.86); ctx.lineTo(cx + w * 0.14, h * 0.69); ctx.closePath(); ctx.fill();
      // neck
      ctx.fillStyle = mix(skin, '#000000', 0.08); ctx.fillRect(cx - w * 0.075, h * 0.55, w * 0.15, h * 0.16);
      ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(cx - w * 0.14, h * 0.69); ctx.lineTo(cx, h * 0.84); ctx.lineTo(cx + w * 0.14, h * 0.69); ctx.lineTo(cx + w * 0.075, h * 0.62); ctx.lineTo(cx - w * 0.075, h * 0.62); ctx.fill();
      // lapels
      if (!o.scrub) { ctx.fillStyle = '#ffffff'; ctx.strokeStyle = 'rgba(14,42,71,.14)'; ctx.lineWidth = 3; [[-1, 1]].forEach(() => { [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.moveTo(cx + sg * w * 0.14, h * 0.69); ctx.lineTo(cx + sg * w * 0.01, h * 0.85); ctx.lineTo(cx + sg * w * 0.2, h * 0.9); ctx.lineTo(cx + sg * w * 0.24, h * 0.72); ctx.closePath(); ctx.fill(); ctx.stroke(); }); }); }
      // stethoscope
      ctx.strokeStyle = P.navy; ctx.lineWidth = w * 0.014; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - w * 0.13, h * 0.68); ctx.bezierCurveTo(cx - w * 0.2, h * 0.92, cx + w * 0.2, h * 0.92, cx + w * 0.13, h * 0.68); ctx.stroke();
      ctx.fillStyle = P.teal2; ctx.beginPath(); ctx.arc(cx + w * 0.05, h * 0.9, w * 0.03, 0, 7); ctx.fill(); ctx.strokeStyle = P.navy; ctx.lineWidth = 3; ctx.stroke(); ctx.lineCap = 'butt';
      // hair back
      const hy = h * 0.4, hw = w * 0.15, hh = h * 0.165;
      if (o.style === 'long') { ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(cx - hw * 1.35, hy); ctx.bezierCurveTo(cx - hw * 1.5, h * 0.7, cx - hw * 1.2, h * 0.76, cx - hw * 0.5, h * 0.74); ctx.lineTo(cx + hw * 0.5, h * 0.74); ctx.bezierCurveTo(cx + hw * 1.2, h * 0.76, cx + hw * 1.5, h * 0.7, cx + hw * 1.35, hy); ctx.bezierCurveTo(cx + hw * 1.3, h * 0.2, cx - hw * 1.3, h * 0.2, cx - hw * 1.35, hy); ctx.fill(); }
      if (o.style === 'curly') { ctx.fillStyle = hair; for (let i = 0; i < 26; i++) { const a = Math.PI + (i / 25) * Math.PI; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * hw * 1.25, hy - hh * 0.2 + Math.sin(a) * hh * 1.2, w * 0.045, 0, 7); ctx.fill(); } ctx.beginPath(); ctx.ellipse(cx, hy - hh * 0.1, hw * 1.25, hh * 0.9, 0, 0, 7); ctx.fill(); }
      if (o.style === 'scarf') { ctx.fillStyle = o.scarf || P.navy3; ctx.beginPath(); ctx.moveTo(cx - hw * 1.3, hy + hh * 0.3); ctx.bezierCurveTo(cx - hw * 1.4, hy - hh * 1.5, cx + hw * 1.4, hy - hh * 1.5, cx + hw * 1.3, hy + hh * 0.3); ctx.bezierCurveTo(cx + hw * 1.4, hy + hh * 1.3, cx + hw * 1.0, h * 0.72, cx, h * 0.72); ctx.bezierCurveTo(cx - hw * 1.0, h * 0.72, cx - hw * 1.4, hy + hh * 1.3, cx - hw * 1.3, hy + hh * 0.3); ctx.fill(); }
      // ears
      ctx.fillStyle = mix(skin, '#000000', 0.05); [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.ellipse(cx + sg * hw * 0.98, hy + hh * 0.1, w * 0.02, w * 0.035, 0, 0, 7); ctx.fill(); });
      // face
      ctx.fillStyle = lgrad(ctx, cx - hw, hy - hh, cx + hw, hy + hh, [[0, mix(skin, '#ffffff', 0.12)], [1, mix(skin, '#000000', 0.08)]]);
      ctx.beginPath(); ctx.ellipse(cx, hy, hw, hh, 0, 0, 7); ctx.fill();
      // hair front
      ctx.fillStyle = hair;
      if (o.style === 'short') { ctx.beginPath(); ctx.moveTo(cx - hw * 1.02, hy - hh * 0.05); ctx.bezierCurveTo(cx - hw * 1.2, hy - hh * 1.35, cx + hw * 1.2, hy - hh * 1.35, cx + hw * 1.02, hy - hh * 0.05); ctx.bezierCurveTo(cx + hw * 0.7, hy - hh * 0.6, cx - hw * 0.2, hy - hh * 0.62, cx - hw * 1.02, hy - hh * 0.05); ctx.fill(); }
      if (o.style === 'long') { ctx.beginPath(); ctx.moveTo(cx - hw * 1.05, hy + hh * 0.1); ctx.bezierCurveTo(cx - hw * 1.2, hy - hh * 1.4, cx + hw * 1.2, hy - hh * 1.4, cx + hw * 1.05, hy + hh * 0.1); ctx.bezierCurveTo(cx + hw * 0.8, hy - hh * 0.7, cx + hw * 0.1, hy - hh * 0.9, cx - hw * 0.5, hy - hh * 0.3); ctx.bezierCurveTo(cx - hw * 0.8, hy - hh * 0.1, cx - hw * 0.95, hy + hh * 0.1, cx - hw * 1.05, hy + hh * 0.1); ctx.fill(); }
      if (o.style === 'bun') { ctx.beginPath(); ctx.arc(cx, hy - hh * 1.2, w * 0.07, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx - hw * 1.04, hy); ctx.bezierCurveTo(cx - hw * 1.2, hy - hh * 1.45, cx + hw * 1.2, hy - hh * 1.45, cx + hw * 1.04, hy); ctx.bezierCurveTo(cx + hw * 0.7, hy - hh * 0.62, cx - hw * 0.5, hy - hh * 0.62, cx - hw * 1.04, hy); ctx.fill(); }
      if (o.style === 'curly') { ctx.beginPath(); ctx.ellipse(cx, hy - hh * 0.85, hw * 1.05, hh * 0.38, 0, 0, 7); ctx.fill(); }
      if (o.style === 'bald') { ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(cx - hw * 0.3, hy - hh * 0.65, hw * 0.28, hh * 0.18, -0.4, 0, 7); ctx.fill(); }
      if (o.style === 'scarf') { ctx.fillStyle = o.scarf || P.navy3; ctx.beginPath(); ctx.moveTo(cx - hw * 1.02, hy - hh * 0.05); ctx.bezierCurveTo(cx - hw * 1.1, hy - hh * 1.0, cx + hw * 1.1, hy - hh * 1.0, cx + hw * 1.02, hy - hh * 0.05); ctx.bezierCurveTo(cx + hw * 0.7, hy - hh * 0.55, cx - hw * 0.7, hy - hh * 0.55, cx - hw * 1.02, hy - hh * 0.05); ctx.fill(); }
      if (o.beard) { ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(cx - hw * 0.98, hy + hh * 0.1); ctx.bezierCurveTo(cx - hw * 1.0, hy + hh * 1.15, cx + hw * 1.0, hy + hh * 1.15, cx + hw * 0.98, hy + hh * 0.1); ctx.bezierCurveTo(cx + hw * 0.7, hy + hh * 0.5, cx + hw * 0.4, hy + hh * 0.55, cx, hy + hh * 0.5); ctx.bezierCurveTo(cx - hw * 0.4, hy + hh * 0.55, cx - hw * 0.7, hy + hh * 0.5, cx - hw * 0.98, hy + hh * 0.1); ctx.fill(); }
      // features
      ctx.fillStyle = '#2a1c14'; [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.ellipse(cx + sg * hw * 0.42, hy + hh * 0.05, w * 0.012, w * 0.014, 0, 0, 7); ctx.fill(); });
      ctx.strokeStyle = mix(hair, skin, 0.15); ctx.lineWidth = w * 0.009; ctx.lineCap = 'round'; [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.moveTo(cx + sg * hw * 0.2, hy - hh * 0.16); ctx.quadraticCurveTo(cx + sg * hw * 0.42, hy - hh * 0.26, cx + sg * hw * 0.64, hy - hh * 0.14); ctx.stroke(); });
      if (o.glasses) { ctx.strokeStyle = P.navy; ctx.lineWidth = w * 0.007; [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.roundRect(cx + sg * hw * 0.42 - hw * 0.3, hy - hh * 0.12, hw * 0.6, hh * 0.3, hw * 0.1); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(cx - hw * 0.12, hy); ctx.lineTo(cx + hw * 0.12, hy); ctx.stroke(); }
      ctx.strokeStyle = mix(skin, '#000000', 0.18); ctx.lineWidth = w * 0.007; ctx.beginPath(); ctx.moveTo(cx, hy + hh * 0.08); ctx.quadraticCurveTo(cx - hw * 0.08, hy + hh * 0.3, cx + hw * 0.04, hy + hh * 0.34); ctx.stroke();
      ctx.strokeStyle = o.beard ? '#f2cfb3' : '#a65a4a'; ctx.lineWidth = w * 0.01; ctx.beginPath(); ctx.arc(cx, hy + hh * 0.4, hw * 0.3, 0.25, Math.PI - 0.25); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.fillStyle = 'rgba(217,115,94,.14)'; [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.ellipse(cx + sg * hw * 0.62, hy + hh * 0.32, hw * 0.2, hh * 0.12, 0, 0, 7); ctx.fill(); });
      // badge
      ctx.fillStyle = P.teal; ctx.beginPath(); ctx.roundRect(cx + w * 0.17, h * 0.8, w * 0.12, h * 0.035, 6); ctx.fill();
    },
    map(ctx, w, h, r, o) {
      vgrad(ctx, 0, 0, w, h, [[0, '#e8f0f5'], [1, '#dde8ef']]);
      // blocks
      for (let i = 0; i < 46; i++) { ctx.fillStyle = `rgba(255,255,255,${0.5 + r() * 0.4})`; rr(ctx, r() * w, r() * h, 60 + r() * 150, 40 + r() * 110, 10); ctx.fill(); }
      // parks
      [[0.12, 0.2, 0.2, 0.18], [0.7, 0.68, 0.22, 0.2]].forEach(([x, y, a, b]) => { ctx.fillStyle = 'rgba(93,170,150,.35)'; rr(ctx, w * x, h * y, w * a, h * b, 40); ctx.fill(); for (let k = 0; k < 8; k++) { ctx.fillStyle = 'rgba(47,111,102,.35)'; ctx.beginPath(); ctx.arc(w * x + r() * w * a, h * y + r() * h * b, 10 + r() * 14, 0, 7); ctx.fill(); } });
      // river
      ctx.strokeStyle = '#bfdcea'; ctx.lineWidth = h * 0.09; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, h * 0.82); ctx.bezierCurveTo(w * 0.3, h * 0.65, w * 0.6, h * 1.0, w + 40, h * 0.7); ctx.stroke();
      // roads
      const road = (pts, lw) => { ctx.lineJoin = 'round'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(w * x, h * y) : ctx.moveTo(w * x, h * y))); ctx.stroke(); ctx.strokeStyle = 'rgba(14,42,71,.07)'; ctx.lineWidth = 2; ctx.stroke(); };
      road([[0, 0.3], [0.4, 0.34], [1, 0.22]], 34); road([[0.28, 0], [0.34, 0.5], [0.3, 1]], 28); road([[0.7, 0], [0.64, 0.45], [0.78, 1]], 24); road([[0, 0.58], [0.5, 0.52], [1, 0.58]], 20); road([[0.05, 0.95], [0.5, 0.78], [0.95, 0.9]], 14);
      ctx.lineCap = 'butt';
      // pin
      const px = w * (o.pinX || 0.5), py = h * (o.pinY || 0.45), k = h * 0.1;
      shadow(ctx, px, py + k * 0.2, k * 0.8, k * 0.2, 0.3);
      ctx.fillStyle = P.navy; ctx.beginPath(); ctx.moveTo(px, py + k * 0.2); ctx.bezierCurveTo(px - k * 1.4, py - k * 1.1, px - k * 0.9, py - k * 2.3, px, py - k * 2.3); ctx.bezierCurveTo(px + k * 0.9, py - k * 2.3, px + k * 1.4, py - k * 1.1, px, py + k * 0.2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py - k * 1.4, k * 0.55, 0, 7); ctx.fill();
      ctx.fillStyle = P.teal; rr(ctx, px - k * 0.08, py - k * 1.75, k * 0.16, k * 0.7, 3); ctx.fill(); rr(ctx, px - k * 0.35, py - k * 1.48, k * 0.7, k * 0.16, 3); ctx.fill();
      glow(ctx, px, py - k, k * 4, '47,138,145', 0.15);
    },
    og(ctx, w, h, r) {
      interiors.hero(ctx, w, h * 1.6, r, {});
      ctx.fillStyle = 'rgba(14,42,71,.9)'; ctx.fillRect(0, 0, w * 0.52, h);
      vgrad(ctx, w * 0.52, 0, w * 0.1, h, [[0, 'rgba(14,42,71,0)'], [1, 'rgba(14,42,71,0)']]);
      ctx.fillStyle = '#ffffff'; ctx.font = '600 70px Georgia, serif'; ctx.textBaseline = 'alphabetic'; ctx.fillText('CLARITY', 60, 260); ctx.fillText('HEALTH', 60, 340);
      ctx.font = '28px Helvetica, Arial, sans-serif'; ctx.fillStyle = '#a9dde0'; ctx.fillText('Premium medical clinic website template', 60, 410);
      ctx.fillStyle = '#d5e3f0'; ctx.font = '22px Helvetica, Arial, sans-serif'; ctx.fillText('Demonstration clinic · Fictional · Not real care', 60, 470);
      ctx.fillStyle = P.teal2; rr(ctx, 60, 520, 140, 5, 3); ctx.fill();
    },
    cta(ctx, w, h, r) {
      vgrad(ctx, 0, 0, w, h, [[0, P.navy], [1, P.navy3]]);
      for (let i = 0; i < 5; i++) { const aw = w * 0.17, ax = w * (0.48 + i * 0.1) - aw / 2, ay = h * (0.12 + (i % 2) * 0.08), ah = h * (0.9 - (i % 2) * 0.08); ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip(); vgrad(ctx, ax, ay, aw, ah, [[0, mix(P.sky, '#ffffff', 0.3)], [1, mix(P.teal2, P.navy3, 0.3)]]); glow(ctx, ax + aw * 0.7, ay + aw * 0.5, aw, '255,244,210', 0.7); ctx.restore(); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,255,255,.6)'; archPath(ctx, ax, ay, aw, ah); ctx.stroke(); }
      glow(ctx, w * 0.8, h * 0.3, w * 0.4, '169,221,224', 0.25);
      for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,255,255,${r() * 0.2})`; ctx.beginPath(); ctx.arc(r() * w, r() * h, 1 + r() * 3, 0, 7); ctx.fill(); }
    }
  };

  window.renderScene = function (canvas, spec) {
    const { scene, w, h, seed, opts } = spec; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); const r = rng(seed);
    scenes[scene](ctx, w, h, r, opts || {});
    if (scene === 'room') vignette(ctx, w, h, 0.14);
    grain(ctx, w, h, spec.grain ?? 6, rng(seed + 7));
  };
})();
