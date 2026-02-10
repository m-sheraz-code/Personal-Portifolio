'use client';

import { Scene } from './Scene';
import { LumosHero } from './LumosHero';

export function Hero3D() {
    return (
        <Scene className="absolute inset-0 z-0">
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <LumosHero />
        </Scene>
    );
}
