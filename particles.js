/**
 * UGAHacks Wrapped — Particle layer
 * Language-weighted particles that float, then form the Georgia Bulldogs G as you scroll.
 */
(function () {
    'use strict';

    const PARTICLE_COUNT = 500;
    const FLOAT_AMOUNT = 25;
    const FLOAT_SPEED = 0.0008;
    const LERP_EASE = 0.25;        // snappy follow so G formation is obvious on scroll
    const MIN_RADIUS = 1.2;
    const MAX_RADIUS = 3.5;
    const G_SCALE = 0.65;          // G logo size — big and unmistakable
    const G_SAMPLES = PARTICLE_COUNT;

    let canvas, ctx, gPoints = [];
    let particles = [];
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let rafId = 0;
    let logicalWidth = 0;
    let logicalHeight = 0;
    let startTime = null;

    function clamp(x, a, b) {
        return Math.max(a, Math.min(b, x));
    }

    function easeInOutCubic(t) {
        return t <= 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /** Georgia G: circle (0–100) with opening at bottom-right, plus horizontal bar + stem. */
    function buildGShapePoints(count) {
        const cx = 50, cy = 50, r = 40;
        const dense = [];
        const gapStart = 0.4;   // opening start (radians from positive x-axis)
        const gapEnd = 1.2;     // opening end
        const step = 0.05;
        for (let a = 0; a < Math.PI * 2 - 0.001; a += step) {
            if (a >= gapStart && a <= gapEnd) continue;
            dense.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        const xAt = (rad) => cx + r * Math.cos(rad);
        const yAt = (rad) => cy + r * Math.sin(rad);
        const barY = 62;
        const barRight = 88;
        const seg = 0.02;
        for (let s = 0; s <= 1; s += seg) {
            dense.push({ x: xAt(gapEnd) + (50 - xAt(gapEnd)) * s, y: yAt(gapEnd) + (barY - yAt(gapEnd)) * s });
        }
        for (let s = 0; s <= 1; s += seg) {
            dense.push({ x: 50 + (barRight - 50) * s, y: barY });
        }
        for (let s = 0; s <= 1; s += seg) {
            dense.push({ x: barRight, y: barY - (barY - 50) * s });
        }
        for (let s = 0; s <= 1; s += seg) {
            dense.push({ x: barRight + (xAt(gapStart) - barRight) * s, y: 50 + (yAt(gapStart) - 50) * s });
        }
        const total = dense.length;
        const out = [];
        for (let i = 0; i < count; i++) {
            const idx = Math.min(Math.floor((i / count) * total), total - 1);
            out.push({ x: dense[idx].x, y: dense[idx].y });
        }
        return out;
    }

    function getScrollProgress() {
        const scrollTop = typeof window.scrollY === 'number'
            ? window.scrollY
            : (document.documentElement.scrollTop || document.body.scrollTop || 0);
        const scrollHeight = Math.max(
            document.documentElement.scrollHeight || 0,
            document.body.scrollHeight || 0,
            document.documentElement.clientHeight || 0
        );
        const clientHeight = window.innerHeight;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        if (maxScroll <= 0) return 0;
        return clamp(scrollTop / maxScroll, 0, 1);
    }

    function loadLanguageData(cb) {
        fetch('data.json')
            .then(r => r.json())
            .then(data => {
                if (data.languages && Array.isArray(data.languages)) {
                    cb(data.languages);
                    return;
                }
                cb(null);
            })
            .catch(() => cb(null));
    }

    function buildParticlePool(languages) {
        const fallback = [
            { name: 'JavaScript', percentage: 32, color: '#f7df1e' },
            { name: 'Python', percentage: 22, color: '#3776ab' },
            { name: 'TypeScript', percentage: 18, color: '#3178c6' },
            { name: 'Java', percentage: 15, color: '#007396' },
            { name: 'Other', percentage: 13, color: '#9b59b6' }
        ];
        const list = (languages && languages.length) ? languages : fallback;
        const totalPct = list.reduce((s, l) => s + (l.percentage || 0), 0) || 100;
        const counts = list.map(l => Math.round((PARTICLE_COUNT * (l.percentage || 0)) / totalPct));
        let n = counts.reduce((a, b) => a + b, 0);
        while (n < PARTICLE_COUNT) {
            counts[0]++;
            n++;
        }
        const pool = [];
        list.forEach((lang, i) => {
            const color = lang.color || '#9b59b6';
            for (let j = 0; j < counts[i]; j++) {
                pool.push({ color, name: lang.name });
            }
        });
        return pool.sort(() => Math.random() - 0.5);
    }

    function initGPoints() {
        gPoints = buildGShapePoints(G_SAMPLES);
    }

    function toScreenCoords(x, y) {
        const w = logicalWidth || window.innerWidth;
        const h = logicalHeight || window.innerHeight;
        const cx = w / 2;
        const cy = h / 2;
        const size = Math.min(w, h) * G_SCALE;
        const scale = size / 100;
        return {
            x: cx + (x - 50) * scale,
            y: cy + (y - 50) * scale
        };
    }

    function initParticles() {
        const pool = buildParticlePool(window.__wrappedLanguages || null);
        const vw = logicalWidth || window.innerWidth;
        const vh = logicalHeight || window.innerHeight;
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const { color, name } = pool[i] || { color: '#9b59b6', name: 'Other' };
            const pt = gPoints[i % gPoints.length];
            const target = toScreenCoords(pt.x, pt.y);
            const baseX = Math.random() * vw;
            const baseY = Math.random() * vh;
            particles.push({
                x: baseX,
                y: baseY,
                baseX,
                baseY,
                targetX: target.x,
                targetY: target.y,
                color,
                size: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
                phase: Math.random() * Math.PI * 2,
                vx: 0,
                vy: 0
            });
        }
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        logicalWidth = w;
        logicalHeight = h;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
        initParticles();
    }

    function tick(time) {
        if (startTime == null) startTime = time;
        const elapsed = (time - startTime) * 0.001;
        targetScrollProgress = getScrollProgress();
        scrollProgress += (targetScrollProgress - scrollProgress) * LERP_EASE;
        // Time-based fallback: G also forms after ~2.5s so you always see it (scroll still drives it sooner)
        const timeMorph = elapsed < 2 ? 0 : Math.min(1, (elapsed - 2) / 2);
        const effectiveProgress = Math.max(targetScrollProgress, timeMorph);
        const t = easeInOutCubic(effectiveProgress);

        const drawW = logicalWidth || window.innerWidth;
        const drawH = logicalHeight || window.innerHeight;
        ctx.clearRect(0, 0, drawW, drawH);

        const timeSec = time * 0.001;
        particles.forEach(p => {
            const floatX = Math.sin(timeSec * FLOAT_SPEED * 1000 + p.phase) * FLOAT_AMOUNT;
            const floatY = Math.cos(timeSec * FLOAT_SPEED * 800 + p.phase * 1.3) * FLOAT_AMOUNT;
            const baseX = p.baseX + floatX;
            const baseY = p.baseY + floatY;
            const x = baseX + (p.targetX - baseX) * t;
            const y = baseY + (p.targetY - baseY) * t;

            p.x = x;
            p.y = y;

            const radius = p.size;
            const opacity = 0.85 + 0.15 * Math.sin(timeSec * 1.5 + p.phase * 0.7);
            ctx.globalAlpha = opacity;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(0.35, p.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        rafId = requestAnimationFrame(tick);
    }

    function start() {
        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        initGPoints();
        if (!gPoints || gPoints.length === 0) return;
        resize();
        window.addEventListener('resize', resize);
        rafId = requestAnimationFrame(tick);
    }

    loadLanguageData(languages => {
        if (languages) window.__wrappedLanguages = languages;
        start();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!canvas) loadLanguageData(() => {}); // start already runs after load
        });
    }
})();
