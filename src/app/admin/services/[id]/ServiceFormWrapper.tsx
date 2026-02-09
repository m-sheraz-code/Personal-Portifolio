'use client';

import { Service } from '@/lib/types';
import ServiceForm from '@/components/admin/ServiceForm';

interface ServiceFormWrapperProps {
    service: Service;
}

export default function ServiceFormWrapper({ service }: ServiceFormWrapperProps) {
    return (
        <ServiceForm
            initialData={{
                id: service.id,
                title: service.title,
                short_description: service.short_description || '',
                description: service.description || '',
                icon: service.icon || '',
                status: service.status,
            }}
            isEdit={true}
        />
    );
}
