"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function AudioVisualizer({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 40 / 40, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(40, 40);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x635bff, 
      emissive: 0x635bff, 
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const cubes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (i - 1) * 1.5;
      scene.add(cube);
      cubes.push(cube);
    }

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      cubes.forEach((cube, i) => {
        if (active) {
          const s = 1 + Math.sin(Date.now() * 0.01 + i) * 1.5;
          cube.scale.y = s;
          cube.rotation.y += 0.05;
        } else {
          cube.scale.y = THREE.MathUtils.lerp(cube.scale.y, 0.2, 0.1);
          cube.rotation.y = THREE.MathUtils.lerp(cube.rotation.y, 0, 0.1);
        }
      });
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [active]);

  return <div ref={containerRef} className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20" />;
}
