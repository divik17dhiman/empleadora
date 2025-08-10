import React, { useEffect, useRef } from 'react';
import { NeatConfig, NeatGradient } from "@firecms/neat";

interface NeatGradientBackgroundProps {
  config?: Partial<NeatConfig>;
  className?: string;
  id?: string;
}

const defaultConfig: NeatConfig = {
  colors: [
    {
      color: "#FF5772",
      enabled: true
    },
    {
      color: "#4CB4BB",
      enabled: true
    },
    {
      color: "#FFC600",
      enabled: true
    },
    {
      color: "#8B6AE6",
      enabled: true
    },
    {
      color: "#2E0EC7",
      enabled: true
    }
  ],
  speed: 4,
  horizontalPressure: 3,
  verticalPressure: 4,
  waveFrequencyX: 3,
  waveFrequencyY: 3,
  waveAmplitude: 8,
  shadows: 1,
  highlights: 5,
  colorBrightness: 1,
  colorSaturation: 7,
  wireframe: false,
  colorBlending: 8,
  backgroundColor: "#003FFF",
  backgroundAlpha: 1,
  grainScale: 3,
  grainIntensity: 0.3,
  grainSpeed: 1,
  resolution: 1
};

export function NeatGradientBackground({ 
  config = {}, 
  className = '', 
  id = 'neat-gradient' 
}: NeatGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const neatRef = useRef<NeatGradient | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the gradient element
    const gradientElement = document.createElement('div');
    gradientElement.id = id;
    gradientElement.style.width = '100%';
    gradientElement.style.height = '100%';
    gradientElement.style.position = 'absolute';
    gradientElement.style.top = '0';
    gradientElement.style.left = '0';
    gradientElement.style.zIndex = '-10';

    containerRef.current.appendChild(gradientElement);

    // Initialize NeatGradient
    try {
      neatRef.current = new NeatGradient({
        ref: gradientElement,
        ...finalConfig
      });

      // Optional: Adjust speed after initialization
      // neatRef.current.speed = 6;
    } catch (error) {
      console.error('Failed to initialize NeatGradient:', error);
    }

    // Cleanup function
    return () => {
      if (neatRef.current) {
        try {
          neatRef.current.destroy();
        } catch (error) {
          console.error('Failed to destroy NeatGradient:', error);
        }
        neatRef.current = null;
      }
      
      if (gradientElement && gradientElement.parentNode) {
        gradientElement.parentNode.removeChild(gradientElement);
      }
    };
  }, [finalConfig, id]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        background: finalConfig.backgroundColor,
      }}
    />
  );
}
