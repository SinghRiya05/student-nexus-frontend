import React from 'react';
import ProfessorProfileMain from '@/components/main/professors/ProfessorProfileMain';

export default function Page({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen">
            <ProfessorProfileMain />
        </div>
    );
}
