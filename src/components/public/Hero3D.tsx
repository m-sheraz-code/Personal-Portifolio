'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from './Scene';

function Shape() {
    const mesh = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();

        // Rotate naturally
        mesh.current.rotation.x = Math.cos(t / 4) / 2;
        mesh.current.rotation.y = Math.sin(t / 4) / 2;

        // React to mouse movement
        mesh.current.rotation.x += mouse.y * 0.2;
        mesh.current.rotation.y += mouse.x * 0.2;

        // Float effect
        mesh.current.position.y = Math.sin(t / 1.5) / 5;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={mesh}>
                <octahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color="#8b5cf6"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    wireframe
                />
            </mesh>
        </Float>
    );
}

export function Hero3D() {
    return (
        <div className="w-full h-full">
            <Scene camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
                <Shape />
            </Scene>
        </div>
    );
}
