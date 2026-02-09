'use client';

import { Suspense, ReactNode, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { cn } from '@/lib/utils';

interface SceneProps {
    children: ReactNode;
    className?: string;
    camera?: any;
}

export function Scene({ children, className, camera }: SceneProps) {
    const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const supported = !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            setIsWebGLAvailable(supported);
        } catch (e) {
            setIsWebGLAvailable(false);
        }
    }, []);

    if (isWebGLAvailable === false) {
        return null; // Graceful fallback to CSS gradients defined in parent
    }

    return (
        <div className={cn('absolute inset-0 pointer-events-none', className)}>
            {isWebGLAvailable !== null && (
                <Canvas
                    camera={camera || { position: [0, 0, 5], fov: 75 }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance'
                    }}
                    dpr={[1, 1.5]} // Capped for performance
                >
                    <Suspense fallback={null}>
                        {children}
                        <Preload all />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
