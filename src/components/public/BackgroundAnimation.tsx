'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from './Scene';

function MovingOrbs() {
    const group = useRef<THREE.Group>(null);

    // Create static positions for the orbs to avoid re-rendering
    const orbs = useMemo(() => [
        { position: [-5, 2, -10], color: '#8b5cf6', size: 1.5, speed: 0.5 },
        { position: [5, -3, -8], color: '#6366f1', size: 2, speed: 0.3 },
        { position: [2, 4, -12], color: '#06b6d4', size: 1, speed: 0.7 },
    ], []);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = Math.sin(t * 0.1) * 0.2;
        group.current.rotation.x = Math.cos(t * 0.1) * 0.2;
    });

    return (
        <group ref={group}>
            {orbs.map((orb, i) => (
                <Float
                    key={i}
                    speed={orb.speed * 2}
                    rotationIntensity={0.5}
                    floatIntensity={1}
                >
                    <mesh position={orb.position as any}>
                        <sphereGeometry args={[orb.size, 32, 32]} />
                        <meshBasicMaterial
                            color={orb.color}
                            transparent
                            opacity={0.15}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export function BackgroundAnimation() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#0a0a0f]">
            <Scene className="opacity-40">
                <ambientLight intensity={0.5} />
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
                <MovingOrbs />
            </Scene>
            {/* Fallback & Overlay Gradients to blend Three.js with CSS */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0f] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
        </div>
    );
}
