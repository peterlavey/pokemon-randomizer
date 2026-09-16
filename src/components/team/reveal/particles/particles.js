import React, { useEffect, useRef } from "react";
import "./particles.styles.scss";

// Palette definitions for each Pokémon type
const TYPE_PALETTES = {
  fire: ["#FF3B04", "#FF7A00", "#FFAE00", "#FF4500", "#FFE600"],
  water: ["#0196F2", "#38BDF8", "#67E8F9", "#BAE6FD", "#FFFFFF"],
  flying: ["#91A6F7", "#C7D2FE", "#E0E7FF", "#FFFFFF", "#A5B4FC"],
  electric: ["#FEBD01", "#FDE047", "#FEF08A", "#FFFFFF", "#38BDF8"],
  grass: ["#28C925", "#4ADE80", "#86EFAC", "#15803D", "#A3E635"],
  poison: ["#A64592", "#C084FC", "#9333EA", "#7E22CE", "#E879F9"],
  ice: ["#87EAFF", "#BAE6FD", "#E0F2FE", "#FFFFFF", "#38BDF8"],
  ground: ["#DDAC4D", "#CA8A04", "#A16207", "#D97706", "#FEF3C7"],
  rock: ["#C3A656", "#78716C", "#A8A29E", "#9A3412", "#D6D3D1"],
  bug: ["#A2BC05", "#84CC16", "#BEF264", "#FACC15", "#4D7C0F"],
  ghost: ["#5D5DB7", "#818CF8", "#4338CA", "#C4B5FD", "#312E81"],
  dragon: ["#8061E2", "#6366F1", "#A855F7", "#EC4899", "#3B82F6"],
  psychic: ["#FF4284", "#F43F5E", "#FB7185", "#E879F9", "#DDD6FE"],
  fairy: ["#FDB3F2", "#F472B6", "#FBCFE8", "#FFF1F2", "#FDE047"],
  fighting: ["#972B07", "#DC2626", "#F97316", "#EA580C", "#FEF08A"],
  steel: ["#B7B5C2", "#CBD5E1", "#94A3B8", "#E2E8F0", "#FFFFFF"],
  dark: ["#4B5563", "#1F2937", "#374151", "#6B7280", "#111827"],
  normal: ["#C5C1B6", "#E2E8F0", "#F1F5F9", "#CBD5E1", "#FEF08A"],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => min + Math.random() * (max - min);

// Drawing helpers
const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawLeaf = (ctx, x, y, size, rotation, color, alpha) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.8, -size * 0.3, size * 0.4, size);
  ctx.quadraticCurveTo(0, size * 1.3, -size * 0.4, size);
  ctx.quadraticCurveTo(-size * 0.8, -size * 0.3, 0, -size);
  ctx.closePath();
  ctx.fill();

  // Leaf vein
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.7);
  ctx.lineTo(0, size * 0.8);
  ctx.stroke();

  ctx.restore();
};

const drawSnowflake = (ctx, x, y, size, rotation, color, alpha) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    // Crossbars
    ctx.moveTo(-size * 0.3, -size * 0.6);
    ctx.lineTo(0, -size * 0.8);
    ctx.lineTo(size * 0.3, -size * 0.6);
    ctx.stroke();
    ctx.rotate(Math.PI / 3);
  }
  ctx.restore();
};

const drawBubble = (ctx, x, y, radius, color, alpha) => {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Bubble highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.arc(x - radius * 0.35, y - radius * 0.35, Math.max(1, radius * 0.25), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawGlint = (ctx, x, y, size, color, alpha) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Horizontal diamond flare
  ctx.beginPath();
  ctx.moveTo(-size * 2, 0);
  ctx.lineTo(0, size * 0.4);
  ctx.lineTo(size * 2, 0);
  ctx.lineTo(0, -size * 0.4);
  ctx.closePath();
  ctx.fill();

  // Vertical diamond flare
  ctx.beginPath();
  ctx.moveTo(0, -size * 2);
  ctx.lineTo(size * 0.4, 0);
  ctx.lineTo(0, size * 2);
  ctx.lineTo(-size * 0.4, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

const drawRock = (ctx, x, y, size, points, rotation, color, alpha) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 1;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  ctx.beginPath();
  if (points && points.length > 0) {
    ctx.moveTo(points[0].x * size, points[0].y * size);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * size, points[i].y * size);
    }
  } else {
    ctx.arc(0, 0, size, 0, Math.PI * 2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

const drawWisp = (ctx, x, y, size, rotation, color, alpha) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Wisp tail
  ctx.beginPath();
  ctx.moveTo(-size * 0.7, 0);
  ctx.quadraticCurveTo(0, size * 2.2, size * 0.7, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

export const Particles = ({ types = [], isAnimationFinished = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let particles = [];
    let width = (canvas.width = canvas.offsetWidth || 300);
    let height = (canvas.height = canvas.offsetHeight || 400);

    // Normalize types
    const rawTypes = Array.isArray(types)
      ? types
      : typeof types === "string"
      ? [types]
      : [];
    const activeTypes = rawTypes.length > 0
      ? rawTypes.map((t) => (t ? t.toLowerCase() : "normal"))
      : ["normal"];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 300;
      height = canvas.height = canvas.offsetHeight || 400;
    };

    window.addEventListener("resize", handleResize);

    // Particle Factory
    const createParticle = (typeOverride) => {
      const type = typeOverride || getRandom(activeTypes);
      const palette = TYPE_PALETTES[type] || TYPE_PALETTES.normal;
      const color = getRandom(palette);
      const centerX = width / 2;
      const centerY = height * 0.45;

      const p = {
        type,
        color,
        x: centerX + randomRange(-width * 0.35, width * 0.35),
        y: centerY + randomRange(-height * 0.25, height * 0.25),
        vx: randomRange(-1.5, 1.5),
        vy: randomRange(-1.5, 1.5),
        size: randomRange(4, 12),
        alpha: randomRange(0.7, 1),
        maxLife: randomRange(40, 90),
        life: 0,
        rotation: randomRange(0, Math.PI * 2),
        vRot: randomRange(-0.08, 0.08),
        subtype: "default",
      };

      // Type-specific customization
      switch (type) {
        case "fire":
          p.x = centerX + randomRange(-width * 0.3, width * 0.3);
          p.y = centerY + randomRange(0, height * 0.3);
          p.vx = randomRange(-0.8, 0.8);
          p.vy = randomRange(-2.5, -5.5);
          p.size = randomRange(6, 18);
          p.maxLife = randomRange(30, 60);
          p.subtype = Math.random() > 0.3 ? "ember" : "flame";
          break;

        case "water":
          p.subtype = Math.random() > 0.4 ? "bubble" : "splash";
          if (p.subtype === "bubble") {
            p.y = centerY + randomRange(height * 0.1, height * 0.35);
            p.vy = randomRange(-1.2, -3.2);
            p.vx = randomRange(-0.5, 0.5);
            p.wobbleSpeed = randomRange(0.04, 0.1);
            p.wobbleAmp = randomRange(1, 3);
            p.size = randomRange(5, 14);
            p.maxLife = randomRange(60, 110);
          } else {
            const angle = randomRange(0, Math.PI * 2);
            const speed = randomRange(2, 5);
            p.x = centerX;
            p.y = centerY;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed - 1.5;
            p.gravity = 0.15;
            p.size = randomRange(4, 9);
            p.maxLife = randomRange(30, 55);
          }
          break;

        case "flying":
          p.subtype = Math.random() > 0.3 ? "streak" : "wisp";
          p.x = randomRange(-50, 0);
          p.y = randomRange(20, height - 20);
          p.vx = randomRange(5, 11);
          p.vy = randomRange(-1.5, 1.5);
          p.length = randomRange(30, 80);
          p.curve = randomRange(-20, 20);
          p.size = randomRange(2, 5);
          p.maxLife = randomRange(35, 70);
          break;

        case "electric":
          p.subtype = Math.random() > 0.4 ? "lightning" : "spark";
          p.x = centerX + randomRange(-width * 0.35, width * 0.35);
          p.y = centerY + randomRange(-height * 0.25, height * 0.25);
          p.vx = randomRange(-0.5, 0.5);
          p.vy = randomRange(-0.5, 0.5);
          p.size = randomRange(5, 14);
          p.maxLife = randomRange(15, 35);
          if (p.subtype === "lightning") {
            const segments = 4;
            const points = [{ x: 0, y: 0 }];
            let curX = 0;
            let curY = 0;
            for (let i = 0; i < segments; i++) {
              curX += randomRange(-15, 15);
              curY += randomRange(-15, 15);
              points.push({ x: curX, y: curY });
            }
            p.points = points;
          }
          break;

        case "grass":
          p.subtype = Math.random() > 0.3 ? "leaf" : "spore";
          p.x = centerX + randomRange(-width * 0.4, width * 0.4);
          p.y = randomRange(-20, height * 0.4);
          p.vy = randomRange(1, 2.5);
          p.vx = randomRange(-1, 1);
          p.swaySpeed = randomRange(0.03, 0.08);
          p.swayAmp = randomRange(1.5, 3.5);
          p.size = randomRange(5, 13);
          p.maxLife = randomRange(60, 110);
          break;

        case "ice":
          p.subtype = Math.random() > 0.4 ? "snowflake" : "crystal";
          p.x = centerX + randomRange(-width * 0.4, width * 0.4);
          p.y = randomRange(-10, height * 0.3);
          p.vy = randomRange(0.8, 2.2);
          p.vx = randomRange(-0.6, 0.6);
          p.size = randomRange(6, 14);
          p.maxLife = randomRange(50, 100);
          break;

        case "poison":
          p.subtype = Math.random() > 0.4 ? "bubble" : "gas";
          p.x = centerX + randomRange(-width * 0.3, width * 0.3);
          p.y = centerY + randomRange(height * 0.05, height * 0.3);
          p.vy = randomRange(-0.8, -2.4);
          p.vx = randomRange(-0.8, 0.8);
          p.size = randomRange(6, 16);
          p.maxLife = randomRange(45, 90);
          break;

        case "psychic":
          p.subtype = Math.random() > 0.5 ? "ring" : "star";
          p.x = centerX + randomRange(-width * 0.15, width * 0.15);
          p.y = centerY + randomRange(-height * 0.15, height * 0.15);
          p.vx = randomRange(-0.5, 0.5);
          p.vy = randomRange(-0.5, 0.5);
          p.radius = randomRange(8, 20);
          p.growth = randomRange(0.8, 2.2);
          p.size = randomRange(5, 14);
          p.maxLife = randomRange(35, 75);
          break;

        case "ghost":
          p.subtype = "wisp";
          p.x = centerX + randomRange(-width * 0.3, width * 0.3);
          p.y = centerY + randomRange(height * 0.05, height * 0.3);
          p.vy = randomRange(-1, -3);
          p.vx = randomRange(-0.5, 0.5);
          p.wobbleSpeed = randomRange(0.04, 0.09);
          p.size = randomRange(8, 18);
          p.maxLife = randomRange(50, 95);
          break;

        case "dragon":
          p.subtype = Math.random() > 0.4 ? "flame" : "star";
          const dAngle = randomRange(0, Math.PI * 2);
          const dSpeed = randomRange(2, 4.5);
          p.x = centerX;
          p.y = centerY;
          p.vx = Math.cos(dAngle) * dSpeed;
          p.vy = Math.sin(dAngle) * dSpeed;
          p.size = randomRange(6, 16);
          p.maxLife = randomRange(40, 80);
          break;

        case "rock":
        case "ground":
          p.subtype = type === "rock" ? "rock" : "dust";
          p.x = centerX + randomRange(-width * 0.35, width * 0.35);
          p.y = centerY + randomRange(-height * 0.2, height * 0.2);
          p.vx = randomRange(-1.5, 1.5);
          p.vy = randomRange(0.5, 3);
          p.size = randomRange(4, 12);
          p.maxLife = randomRange(40, 80);
          if (type === "rock") {
            const vertCount = Math.floor(randomRange(4, 7));
            const poly = [];
            for (let i = 0; i < vertCount; i++) {
              const a = (i / vertCount) * Math.PI * 2;
              const r = randomRange(0.6, 1.3);
              poly.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
            }
            p.rockPoints = poly;
          }
          break;

        case "bug":
          p.subtype = "spore";
          p.vx = randomRange(-2, 2);
          p.vy = randomRange(-2, 2);
          p.size = randomRange(3, 8);
          p.maxLife = randomRange(35, 75);
          break;

        case "fairy":
          p.subtype = "star";
          p.size = randomRange(5, 14);
          p.vy = randomRange(-0.8, -2);
          p.vx = randomRange(-1, 1);
          p.maxLife = randomRange(45, 85);
          break;

        case "fighting":
          p.subtype = "spark";
          const fAngle = randomRange(0, Math.PI * 2);
          const fSpeed = randomRange(3, 6.5);
          p.x = centerX;
          p.y = centerY;
          p.vx = Math.cos(fAngle) * fSpeed;
          p.vy = Math.sin(fAngle) * fSpeed;
          p.size = randomRange(4, 10);
          p.maxLife = randomRange(20, 45);
          break;

        case "steel":
          p.subtype = "glint";
          p.size = randomRange(6, 15);
          p.vx = randomRange(-0.4, 0.4);
          p.vy = randomRange(-0.4, 0.4);
          p.maxLife = randomRange(30, 65);
          break;

        case "dark":
          p.subtype = "gas";
          p.size = randomRange(8, 20);
          p.vy = randomRange(-0.8, -2.5);
          p.vx = randomRange(-0.8, 0.8);
          p.maxLife = randomRange(45, 90);
          break;

        default:
          p.subtype = "star";
          p.size = randomRange(4, 10);
          p.maxLife = randomRange(40, 75);
          break;
      }

      return p;
    };

    // Seed initial batch of particles
    const initialCount = 28;
    for (let i = 0; i < initialCount; i++) {
      const p = createParticle();
      p.life = Math.floor(randomRange(0, p.maxLife * 0.7));
      particles.push(p);
    }

    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    const SPAWN_DURATION = 2100; // ms: 60% of 3.5s sequence (stops spawning when pokemon transitions to full color)
    const FADE_END = 2625; // ms: 75% of 3.5s sequence (completely clears before ascent and stats display)

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const elapsed = now - startTime;

      // Spawn new particles only during the guessing/silhouette phase
      const canSpawn = !isAnimationFinished && elapsed < SPAWN_DURATION;

      if (canSpawn && particles.length < 55) {
        // Spawn 1-2 particles per frame
        particles.push(createParticle());
        if (Math.random() > 0.4) {
          particles.push(createParticle());
        }
      }

      // If animation finished or past fade end point and all particles are gone, stop loop
      if ((isAnimationFinished || elapsed >= FADE_END) && particles.length === 0) {
        return;
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Calculate fade in and fade out alpha
        const progress = p.life / p.maxLife;
        let currentAlpha = p.alpha;
        if (progress < 0.2) {
          currentAlpha = p.alpha * (progress / 0.2);
        } else if (progress > 0.7) {
          currentAlpha = p.alpha * (1 - (progress - 0.7) / 0.3);
        }

        // Accelerate fade out if animation is finished or transitioning past reveal point
        if (isAnimationFinished) {
          currentAlpha *= 0.7;
          p.life += 3;
        } else if (elapsed > SPAWN_DURATION) {
          const fadeProgress = (elapsed - SPAWN_DURATION) / (FADE_END - SPAWN_DURATION);
          currentAlpha *= Math.max(0, 1 - fadeProgress);
          p.life += 1;
        }

        if (currentAlpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        // Apply physics
        if (p.gravity) {
          p.vy += p.gravity;
        }
        if (p.wobbleSpeed) {
          p.x += Math.sin(p.life * p.wobbleSpeed) * (p.wobbleAmp || 1);
        }
        if (p.swaySpeed) {
          p.x += Math.sin(p.life * p.swaySpeed) * (p.swayAmp || 2);
        }
        if (p.growth) {
          p.radius = (p.radius || 10) + p.growth;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Render based on type & subtype
        switch (p.type) {
          case "fire":
            if (p.subtype === "ember") {
              drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.4, p.color, currentAlpha);
            } else {
              // Flame circle with radial glow
              ctx.save();
              ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(1, p.size * (1 - progress * 0.6)), 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            break;

          case "water":
            if (p.subtype === "bubble") {
              drawBubble(ctx, p.x, p.y, p.size, p.color, currentAlpha);
            } else {
              // Droplet splash
              ctx.save();
              ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            break;

          case "flying":
            // Wind gust line / arc
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.lineCap = "round";
            ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha * 0.75));
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.quadraticCurveTo(
              p.x + p.length * 0.5,
              p.y + p.curve,
              p.x + p.length,
              p.y
            );
            ctx.stroke();
            ctx.restore();
            break;

          case "electric":
            if (p.subtype === "lightning" && p.points) {
              ctx.save();
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 2;
              ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              p.points.forEach((pt) => {
                ctx.lineTo(p.x + pt.x, p.y + pt.y);
              });
              ctx.stroke();
              ctx.restore();
            } else {
              drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.25, p.color, currentAlpha);
            }
            break;

          case "grass":
            if (p.subtype === "leaf") {
              drawLeaf(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
            } else {
              drawStar(ctx, p.x, p.y, 4, p.size * 0.6, p.size * 0.3, p.color, currentAlpha);
            }
            break;

          case "ice":
            if (p.subtype === "snowflake") {
              drawSnowflake(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
            } else {
              drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.4, p.color, currentAlpha);
            }
            break;

          case "poison":
            if (p.subtype === "bubble") {
              drawBubble(ctx, p.x, p.y, p.size, p.color, currentAlpha);
            } else {
              ctx.save();
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha * 0.4));
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * (1 + progress), 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            break;

          case "psychic":
            if (p.subtype === "ring") {
              ctx.save();
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 2;
              ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha * 0.7));
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            } else {
              drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.3, p.color, currentAlpha);
            }
            break;

          case "ghost":
            drawWisp(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
            break;

          case "steel":
            drawGlint(ctx, p.x, p.y, p.size, p.color, currentAlpha);
            break;

          case "rock":
            drawRock(ctx, p.x, p.y, p.size, p.rockPoints, p.rotation, p.color, currentAlpha);
            break;

          default:
            drawStar(ctx, p.x, p.y, 5, p.size, p.size * 0.4, p.color, currentAlpha);
            break;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [types, isAnimationFinished]);

  return (
    <canvas
      ref={canvasRef}
      className="type-particles-canvas"
      data-testid="type-particles"
      aria-hidden="true"
    />
  );
};

export default Particles;
