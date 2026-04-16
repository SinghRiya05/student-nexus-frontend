"use client";
import AlumniProfileMain from '@/components/main/alumni/AlumniProfileMain';
import { useParams } from 'next/navigation';

export default function AlumniProfilePage() {
    const params = useParams();
    const id = params.id as string;

    if (!id) return null;

    return (
        <div className="container mx-auto px-4  max-w-7xl min-h-screen">
            <AlumniProfileMain id={id} />
        </div>
    );
}
