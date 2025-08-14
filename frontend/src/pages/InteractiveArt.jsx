import React, { useRef, useEffect } from 'react';

const InteractiveArt = ({ theme }) => {
    const canvasRef = useRef(null);
    const isDark = theme === "dark";

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Particle and mouse setup
        let particlesArray = [];
        const numberOfParticles = 100;
        const mouse = { x: null, y: null, radius: 100 };

        canvas.addEventListener('mousemove', event => {
            mouse.x = event.x - canvas.getBoundingClientRect().left;
            mouse.y = event.y - canvas.getBoundingClientRect().top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }
// bg-[#222] text-white" : "bg-[#ced8ff] text-black
        function init() {
            particlesArray = [];
            const particleColor = isDark ? 'rgba(206, 216, 255, 1)' : 'rgba(34, 34, 34, 1)';
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2.5 + 1;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let directionX = (Math.random() - 0.5) * 0.5;
                let directionY = (Math.random() - 0.5) * 0.5;
                particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
            }
        }

        function connect() {
            let opacityValue = 1;
            const lineColor = isDark ? 'rgba(192, 132, 252, 0.15)' : 'rgba(0, 34, 102, 0.3)';
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                 ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = lineColor.replace('0.15', opacityValue);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }
        
        init();
        animate();

        // Cleanup function
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', () => {});
            canvas.removeEventListener('mouseleave', () => {});
        };
    }, [isDark]); // Re-initialize if the theme changes

    return (
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
    );
};

export default InteractiveArt;