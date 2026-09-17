import React, { useEffect, useRef } from "react";
import "./confetti.styles.scss";

const CONFETTI_COLORS = [
    "#e84545", // Red
    "#f8d838", // Yellow
    "#60c850", // Green
    "#f878a0", // Pink
    "#60b0f8", // Blue
    "#ffffff", // White
];

export const Confetti = ({ count = 50 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        // Initialize particles spread vertically across the screen
        const particles = Array.from({ length: count }, () => {
            const size = Math.floor(Math.random() * 6) + 7; // 7px - 12px
            return {
                x: Math.random() * width,
                y: Math.random() * (height + 100) - 50,
                width: size,
                height: Math.random() > 0.5 ? size : Math.round(size * 1.3),
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                speedY: Math.random() * 1.5 + 1.2,
                speedX: Math.random() * 0.6 - 0.3,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.05 + 0.02,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.06,
                isDiamond: Math.random() > 0.6,
            };
        });

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.y += p.speedY;
                p.wobble += p.wobbleSpeed;
                p.x += Math.sin(p.wobble) * 0.8 + p.speedX;
                p.rotation += p.rotationSpeed;

                // Wrap particles when they leave the visible area
                if (p.y > height + 20) {
                    p.y = -20 - Math.random() * 30;
                    p.x = Math.random() * width;
                    p.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
                }
                if (p.x > width + 20) p.x = -20;
                if (p.x < -20) p.x = width + 20;

                ctx.save();
                if (typeof ctx.translate === "function") ctx.translate(p.x, p.y);
                if (typeof ctx.rotate === "function") ctx.rotate(p.rotation);

                // Simulate 3D flutter
                const scaleX = Math.cos(p.wobble);
                if (typeof ctx.scale === "function") ctx.scale(scaleX, 1);

                ctx.fillStyle = p.color;

                if (p.isDiamond) {
                    if (typeof ctx.beginPath === "function") {
                        ctx.beginPath();
                        ctx.moveTo(0, -p.height / 2);
                        ctx.lineTo(p.width / 2, 0);
                        ctx.lineTo(0, p.height / 2);
                        ctx.lineTo(-p.width / 2, 0);
                        ctx.closePath();
                        ctx.fill();
                    }
                } else {
                    if (typeof ctx.fillRect === "function") {
                        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                    }
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [count]);

    return <canvas ref={canvasRef} className="confetti-canvas" data-testid="confetti-canvas" />;
};

export default Confetti;
