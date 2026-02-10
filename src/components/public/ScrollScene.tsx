'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useTransform, useSpring } from 'framer-motion';

function Crystal({ position, rotation, scale, color }: { position: [number, number, number], rotation: [number, number, number], scale: number, color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.002;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={position} rotation={rotation} scale={scale} ref={meshRef}>
                <octahedronGeometry args={[1, 0]} />
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={1}
                    chromaticAberration={0.025}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor={color}
                    color={color}
                />
            </mesh>
        </Float>
    );
}

function SceneContent() {
    const { scrollYProgress } = useScroll();
    const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        // Translate group based on scroll
        groupRef.current.position.y = smoothY.get() * 10;
        groupRef.current.rotation.z = smoothY.get() * Math.PI * 0.2;
    });

    const items = useMemo(() => [
        { position: [-6, 2, -2] as [number, number, number], color: "#8b5cf6", scale: 0.8 },
        { position: [7, -5, -3] as [number, number, number], color: "#6366f1", scale: 1.2 },
        { position: [-4, -12, -1] as [number, number, number], color: "#d946ef", scale: 0.5 },
        { position: [5, -18, -4] as [number, number, number], color: "#8b5cf6", scale: 0.9 },
        { position: [-8, -25, -2] as [number, number, number], color: "#6366f1", scale: 1.5 },
    ], []);

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />

            {items.map((item, i) => (
                <Crystal
                    key={i}
                    position={item.position}
                    rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
                    scale={item.scale}
                    color={item.color}
                />
            ))}
        </group>
    );
}

export function ScrollScene() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                <SceneContent />
            </Canvas>
        </div>
    );
}
