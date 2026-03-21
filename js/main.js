// Debounce utility
function debounce(fn, ms) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// Draw the zigzag dotted line connecting timeline dots
function drawTimelinePath() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Remove existing SVG
  const existing = timeline.querySelector('.timeline-svg');
  if (existing) existing.remove();

  // Don't draw on mobile
  if (window.innerWidth <= 768) return;

  const dots = timeline.querySelectorAll('.timeline-dot');
  if (dots.length < 2) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('timeline-svg');

  const timelineRect = timeline.getBoundingClientRect();

  // Set explicit dimensions
  svg.setAttribute('width', timelineRect.width);
  svg.setAttribute('height', timelineRect.height);

  // Dot X for horizontal position; content vertical center for Y on middle entries,
  // dot Y for first and last entries so the line fully spans
  const entries = timeline.querySelectorAll('.timeline-entry');
  const points = Array.from(dots).map((dot, i) => {
    const dotRect = dot.getBoundingClientRect();
    const isFirstOrLast = i === 0 || i === dots.length - 1;
    let y;
    if (isFirstOrLast) {
      y = dotRect.top + dotRect.height / 2 - timelineRect.top;
    } else {
      const contentRect = entries[i].querySelector('.timeline-content').getBoundingClientRect();
      y = contentRect.top + contentRect.height / 2 - timelineRect.top;
    }
    return {
      x: dotRect.left + dotRect.width / 2 - timelineRect.left,
      y
    };
  });

  // Build the zigzag path: from each dot, go down, across, then down to next dot
  let pathD = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    // Offset so text appears centered between horizontal segments
    const midY = (curr.y + next.y) / 2;

    pathD += ` L ${curr.x} ${midY}`;
    pathD += ` L ${next.x} ${midY}`;
    pathD += ` L ${next.x} ${next.y}`;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#444');
  path.setAttribute('stroke-width', '2');
  svg.appendChild(path);
  timeline.appendChild(svg);

  // Animate the line drawing in
  animatePathDraw(path);
}

// Animate the dotted line — marching ants flowing along the path
function animatePathDraw(path) {
  path.setAttribute('stroke-dasharray', '6 4');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Animate dash offset so the dots flow along the path continuously
  path.animate(
    [
      { strokeDashoffset: '0' },
      { strokeDashoffset: '-200' }
    ],
    {
      duration: 8000,
      iterations: Infinity,
      easing: 'linear'
    }
  );
}

// Star diffraction on first timeline dot
function createStarDiffraction() {
  const firstDot = document.querySelector('.timeline-entry:first-child .timeline-dot');
  if (!firstDot) return;

  // Remove old spikes on redraw
  firstDot.querySelectorAll('.spike').forEach(s => s.remove());

  const spikeCount = 8;
  for (let i = 0; i < spikeCount; i++) {
    const angle = (360 / spikeCount) * i;
    const length = 25 + Math.random() * 5; // 25–30px, tight range for even look
    const spike = document.createElement('div');
    spike.className = 'spike';
    Object.assign(spike.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: length + 'px',
      height: '6px',
      filter: 'blur(5px)',
      transformOrigin: '0 50%',
      transform: `translate(0, -50%) rotate(${angle}deg)`,
      background: `linear-gradient(90deg,
        rgba(255,255,255,0.9) 0%,
        rgba(247,67,182,0.5) 30%,
        rgba(252,192,67,0.15) 70%,
        transparent 100%)`,
      pointerEvents: 'none',
      borderRadius: '0',
    });

    // Pulsing animation with slight phase offset per spike
    spike.animate(
      [
        { opacity: 0.5, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(0.8)` },
        { opacity: 1, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(1.2)` },
        { opacity: 0.5, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(0.8)` }
      ],
      {
        duration: 3000 + Math.random() * 1000,
        iterations: Infinity,
        delay: Math.random() * 1500
      }
    );

    firstDot.appendChild(spike);
  }
}

// Hero name: character-by-character scramble reveal
function initHeroName() {
  const el = document.querySelector('.hero-name');
  if (!el || !el.dataset.text) return;

  el.textContent = '';
  const text = el.dataset.text;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create span for each character
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char' + (char === ' ' ? ' space' : '');
    span.textContent = char === ' ' ? '\u00A0' : char;

    if (reducedMotion) {
      span.style.opacity = '1';
      span.style.animationDelay = '0s';
    } else {
      // Stagger: each char gets a base delay + small random offset
      const delay = 0.1 + i * 0.07 + Math.random() * 0.03;
      span.style.animationDelay = `${delay}s, ${delay + 0.5}s`;

      // Scramble effect: rapidly change characters before resolving
      const finalChar = char;
      if (char !== ' ') {
        let scrambleCount = 0;
        const scrambleMax = 4 + Math.floor(Math.random() * 4);
        const startTime = delay * 1000;

        setTimeout(() => {
          const intervalId = setInterval(() => {
            if (!span.isConnected) {
              clearInterval(intervalId);
              return;
            }
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            scrambleCount++;
            if (scrambleCount >= scrambleMax) {
              clearInterval(intervalId);
              span.textContent = finalChar;
            }
          }, 50);
          span._scrambleId = intervalId;
        }, startTime);
      }
    }

    el.appendChild(span);
  });
}

// Proximity-based variable font breathing — reusable
function initBreathe(container, opts) {
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const defaults = {
    selector: '.char:not(.space)',
    radius: 200,
    maxCasl: 1,
    maxWeightDrop: 150,
    maxMonoDrop: 1,
    maxScale: 0.25,
    maxLift: 8,
    baseWeight: 900
  };
  const o = { ...defaults, ...opts };

  const chars = container.querySelectorAll(o.selector);

  let rafId;
  container.addEventListener('mousemove', (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      chars.forEach(char => {
        const rect = char.getBoundingClientRect();
        const dist = Math.sqrt(
          Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        );

        const eased = Math.pow(Math.max(0, 1 - dist / o.radius), 2);

        const casl = eased * o.maxCasl;
        const weight = o.baseWeight - eased * o.maxWeightDrop;
        const mono = 1 - eased * o.maxMonoDrop;
        const scale = 1 + eased * o.maxScale;
        const yShift = eased * -o.maxLift;

        char.style.fontVariationSettings = `'MONO' ${mono.toFixed(2)}, 'CASL' ${casl.toFixed(2)}, 'wght' ${weight.toFixed(0)}`;
        char.style.transform = `scale(${scale.toFixed(3)}) translateY(${yShift.toFixed(1)}px)`;
      });
    });
  });

  container.addEventListener('mouseleave', () => {
    chars.forEach(char => {
      char.style.fontVariationSettings = `'MONO' 1, 'CASL' 0, 'wght' ${o.baseWeight}`;
      char.style.transform = 'scale(1) translateY(0)';
    });
  });
}

function initHeroBreathe() {
  initBreathe(document.querySelector('.hero-name'));
}


// Draw on load, debounced on resize
window.addEventListener('DOMContentLoaded', () => {
  initHeroName();
  initHeroBreathe();
  drawTimelinePath();
  createStarDiffraction();
});
window.addEventListener('resize', debounce(drawTimelinePath, 150));
