'use client';

import { Portfolio } from '@/lib/types';
import PortfolioForm from '@/components/admin/PortfolioForm';

interface PortfolioFormWrapperProps {
    portfolio: Portfolio;
}

export default function PortfolioFormWrapper({ portfolio }: PortfolioFormWrapperProps) {
    return (
        <PortfolioForm
            initialData={{
                id: portfolio.id,
                title: portfolio.title,
                slug: portfolio.slug,
                description: portfolio.description || '',
                tech_stack: portfolio.tech_stack,
                featured_image: portfolio.featured_image,
                gallery_images: portfolio.gallery_images,
                live_url: portfolio.live_url || '',
                github_url: portfolio.github_url || '',
                status: portfolio.status,
            }}
            isEdit={true}
        />
    );
}
