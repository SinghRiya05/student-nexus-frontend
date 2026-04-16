"use client";
import StudentProfileMain from '@/components/main/students/StudentProfileMain';
import { useParams } from 'next/navigation';


export default function StudentProfilePage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <StudentProfileMain id={id} />
        </div>
    );
}
