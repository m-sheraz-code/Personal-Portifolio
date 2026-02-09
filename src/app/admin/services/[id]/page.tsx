import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ServiceFormWrapper from './ServiceFormWrapper';

interface EditServicePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !service) {
        notFound();
    }

    return <ServiceFormWrapper service={service} />;
}
