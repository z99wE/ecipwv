"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SunRays() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use parent dimensions instead of clientWidth/Height to avoid 0px issues
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const width = parent.clientWidth || window.innerWidth;
    const height = parent.clientHeight || 800;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color("#FF9933") }, // Saffron
        uColor2: { value: new THREE.Color("#000080") }, // Indigo
        uColor3: { value: new THREE.Color("#138808") }, // Green
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 a0 = x - floor(x + 0.5);
          vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
          vec3 l = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 gr = vec3(0.0);
          gr.x = g.x * l.x;
          gr.y = g.y * l.y;
          gr.z = g.z * l.z;
          return 130.0 * dot(m, gr);
        }

        void main() {
          vec2 uv = vUv;
          
          // Iridescent flow
          float noise1 = snoise(uv * 1.5 + uTime * 0.1);
          float noise2 = snoise(uv * 3.0 - uTime * 0.05);
          float combinedNoise = (noise1 + noise2) * 0.5;
          
          vec3 colorA = mix(uColor1, uColor2, sin(uTime * 0.3 + combinedNoise * 4.0) * 0.5 + 0.5);
          vec3 colorB = mix(uColor2, uColor3, cos(uTime * 0.2 - combinedNoise * 2.0) * 0.5 + 0.5);
          vec3 finalColor = mix(colorA, colorB, uv.y);
          
          // Vibrant rays
          vec2 rayCenter = vec2(0.5, -0.5);
          vec2 toRay = uv - rayCenter;
          float dist = length(toRay);
          float angle = atan(toRay.y, toRay.x);
          
          float ray = pow(sin(angle * 8.0 + uTime * 0.4), 2.0) * 0.5;
          ray += pow(sin(angle * 16.0 - uTime * 0.7), 3.0) * 0.3;
          
          finalColor += ray * uColor1;
          
          // Glow core
          float glow = exp(-dist * 1.5) * 0.6;
          finalColor += glow * vec3(1.0, 0.9, 0.5);

          // Alpha fade
          float alpha = clamp(ray + glow, 0.0, 0.8);
          alpha *= (1.2 - uv.y); // Fade at top

          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrame: number;
    const animate = (time: number) => {
      material.uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate(0);

    const handleResize = () => {
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none" 
      style={{ zIndex: 1 }}
    />
  );
}
