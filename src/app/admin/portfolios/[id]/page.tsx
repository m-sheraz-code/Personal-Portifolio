import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PortfolioFormWrapper from './PortfolioFormWrapper';

interface EditPortfolioPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !portfolio) {
        notFound();
    }

    return <PortfolioFormWrapper portfolio={portfolio} />;
}
