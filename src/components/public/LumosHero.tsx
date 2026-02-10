'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

export function LumosHero() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const { clock } = state;
        meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.2}>
                    <MeshDistortMaterial
                        color="#6366f1"
                        speed={3}
                        distort={0.4}
                        radius={1}
                        emissive="#4338ca"
                        emissiveIntensity={0.2}
                        roughness={0}
                        metalness={0.1}
                    />
                </Sphere>
            </Float>

            {/* Background Glow */}
            <Sphere args={[2.5, 32, 32]} scale={1}>
                <meshBasicMaterial color="#6366f1" transparent opacity={0.05} side={THREE.BackSide} />
            </Sphere>

            {/* Floating Particles around the blob */}
            <Particles count={50} />
        </group>
    );
}

function Particles({ count }: { count: number }) {
    const mesh = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 10;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.y += 0.001;
        mesh.current.rotation.x += 0.001;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.4} sizeAttenuation={true} />
        </points>
    );
}
