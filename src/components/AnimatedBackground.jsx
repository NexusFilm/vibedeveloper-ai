import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Blob positions and properties - Dark Blue and Indigo theme
    const blobs = [
      { x: 0.2, y: 0.3, size: 400, color: [79, 70, 229], speedX: 0.0003, speedY: 0.0002 },
      { x: 0.7, y: 0.5, size: 450, color: [30, 64, 175], speedX: 0.0002, speedY: 0.0003 },
      { x: 0.5, y: 0.7, size: 380, color: [20, 30, 60], speedX: 0.00025, speedY: 0.00015 },
      { x: 0.3, y: 0.8, size: 350, color: [37, 99, 235], speedX: 0.00015, speedY: 0.00025 },
      { x: 0.8, y: 0.2, size: 420, color: [99, 102, 241], speedX: 0.0002, speedY: 0.0002 }
    ];

    const animate = () => {
      time += 1;
      
      // Create gradient background - Dark Blue and Black
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(0.5, '#1e293b');
      bgGradient.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated blobs
      blobs.forEach((blob, index) => {
        const offsetX = Math.sin(time * blob.speedX + index) * 80;
        const offsetY = Math.cos(time * blob.speedY + index * 1.5) * 80;
        
        const x = blob.x * canvas.width + offsetX;
        const y = blob.y * canvas.height + offsetY;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.size);
        gradient.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.6)`);
        gradient.addColorStop(0.5, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.3)`);
        gradient.addColorStop(1, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.filter = 'blur(60px)';
        ctx.fillRect(x - blob.size, y - blob.size, blob.size * 2, blob.size * 2);
      });

      // Add grain texture
      ctx.filter = 'none';
      if (canvas.width > 0 && canvas.height > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
      
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.97) {
            const noise = (Math.random() - 0.5) * 30;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}