import React, { useEffect, useRef } from 'react';

interface WaveConfig {
  colors: Array<{ color: string; enabled: boolean }>;
  speed: number;
  horizontalPressure: number;
  verticalPressure: number;
  waveFrequencyX: number;
  waveFrequencyY: number;
  waveAmplitude: number;
  shadows: number;
  highlights: number;
  colorBrightness: number;
  colorSaturation: number;
  wireframe: boolean;
  colorBlending: number;
  backgroundColor: string;
  backgroundAlpha: number;
  grainScale: number;
  grainSparsity: number;
  grainIntensity: number;
  grainSpeed: number;
  resolution: number;
  yOffset: number;
}

interface WaveBackgroundProps {
  config?: Partial<WaveConfig>;
  className?: string;
}

const defaultConfig: WaveConfig = {
  colors: [
    { color: '#2A4235', enabled: true },
    { color: '#769E7A', enabled: true },
    { color: '#B2C9AB', enabled: true },
    { color: '#E5E5E5', enabled: true },
    { color: '#C4DDC5', enabled: false },
  ],
  speed: 2,
  horizontalPressure: 5,
  verticalPressure: 5,
  waveFrequencyX: 3,
  waveFrequencyY: 3,
  waveAmplitude: 4,
  shadows: 4,
  highlights: 6,
  colorBrightness: 1,
  colorSaturation: 5,
  wireframe: false,
  colorBlending: 8,
  backgroundColor: '#3B7D1E',
  backgroundAlpha: 1,
  grainScale: 2,
  grainSparsity: 0,
  grainIntensity: 0.2,
  grainSpeed: 0.8,
  resolution: 1.2,
  yOffset: 0,
};

export function WaveBackground({ config = {}, className = '' }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * finalConfig.resolution;
      canvas.height = rect.height * finalConfig.resolution;
      ctx.scale(finalConfig.resolution, finalConfig.resolution);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001 * finalConfig.speed;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.fillStyle = finalConfig.backgroundColor;
      ctx.globalAlpha = finalConfig.backgroundAlpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      const enabledColors = finalConfig.colors.filter(c => c.enabled);
      if (enabledColors.length === 0) return;

      const width = canvas.width / finalConfig.resolution;
      const height = canvas.height / finalConfig.resolution;
      
      enabledColors.forEach((colorConfig, index) => {
        const waveCount = Math.floor(finalConfig.waveFrequencyX * (index + 1));
        const amplitude = finalConfig.waveAmplitude * (index + 1) * 20;
        const frequency = finalConfig.waveFrequencyY * (index + 1);
        const speed = finalConfig.speed * (index + 1) * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 2) {
          let y = height / 2;
          
          // Add multiple wave components
          for (let i = 0; i < waveCount; i++) {
            const waveX = (x / width) * Math.PI * 2 * frequency * (i + 1);
            const waveY = Math.sin(waveX + timeRef.current * speed * (i + 1));
            y += waveY * amplitude / (i + 1);
          }
          
          // Add pressure effects
          y += Math.sin(x * finalConfig.horizontalPressure * 0.01) * 10;
          y += Math.sin(timeRef.current * finalConfig.verticalPressure) * 15;
          
          // Add yOffset
          y += finalConfig.yOffset;
          
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        const baseColor = colorConfig.color;
        
        // Add highlights and shadows
        const highlightColor = adjustColor(baseColor, finalConfig.highlights);
        const shadowColor = adjustColor(baseColor, -finalConfig.shadows);
        
        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, shadowColor);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3 + (index * 0.1);
        ctx.fill();
        
        // Add wireframe if enabled
        if (finalConfig.wireframe) {
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      
      // Add grain effect
      if (finalConfig.grainIntensity > 0) {
        addGrain(ctx, width, height, finalConfig);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalConfig]);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, adjustment: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + adjustment));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + adjustment));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + adjustment));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Helper function to add grain effect
  const addGrain = (ctx: CanvasRenderingContext2D, width: number, height: number, config: WaveConfig) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < config.grainSparsity) continue;
      
      const noise = (Math.random() - 0.5) * config.grainIntensity * 255;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full -z-10 ${className}`}
      style={{
        background: finalConfig.backgroundColor,
      }}
    />
  );
}
