import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from './Scene';
import { useTheme } from 'next-themes';

function MovingOrbs() {
    const group = useRef<THREE.Group>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark' || !theme; // Default to dark if not set

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
                            opacity={isDark ? 0.15 : 0.08}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export function BackgroundAnimation() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
            <Scene className={cn("transition-opacity duration-1000", isDark ? "opacity-40" : "opacity-20")}>
                <ambientLight intensity={isDark ? 0.5 : 1} />
                {isDark && (
                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={1}
                    />
                )}
                <MovingOrbs />
            </Scene>
            {/* Fallback & Overlay Gradients to blend Three.js with CSS */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                isDark
                    ? "bg-gradient-to-tr from-background via-transparent to-transparent opacity-90"
                    : "bg-gradient-to-tr from-background via-white/20 to-transparent opacity-60"
            )} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.03),transparent_50%)]" />
        </div>
    );
}

import { cn } from '@/lib/utils';
