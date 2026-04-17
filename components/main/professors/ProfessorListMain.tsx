"use client"
import React, { useEffect } from "react";
import ProfessorSearch from "./ProfessorSearch";
import { useRouter } from "next/navigation";
import ProfessorCard from "./ProfessorCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getTeacherFromOtherUniversity, getTeachersFromSameUniversity } from "@/features/teacher/teacherThunk";
import { ITeacher } from "@/features/teacher/teacherModel";

export default function ProfessorListMain() {
  const dispatch = useAppDispatch();
  const { sameUniversityTeachers, otherUniversityTeachers, loading } = useAppSelector(state => state.teacher);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        await Promise.all([
          dispatch(getTeachersFromSameUniversity()).unwrap(),
          dispatch(getTeacherFromOtherUniversity()).unwrap()
        ]);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };
    fetchTeachers();
  }, [dispatch]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const allTeachers = [...sameUniversityTeachers, ...otherUniversityTeachers];
  const totalPages = Math.ceil(allTeachers.length / itemsPerPage);
  const currentTeachers = allTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll to directory section
  };

  const mapTeacherToDirectory = (prof: ITeacher) => ({
    id: prof._id,
    name: `${prof.firstName} ${prof.lastName}`,
    title: prof.teacherProfile?.designation || "Faculty",
    department: prof.teacherProfile?.department || "Academic Dept",
    universityName: prof.universityId?.name,
    tags: prof.courseIds?.map(c => c.course_short_name) || ["Faculty"],
    rating: prof.trustScore !== undefined ? (prof.trustScore / 20).toFixed(1) : "4.5",
    reviews: prof.followersCount || 0,
    isOnline: prof.verificationStatus,
    image: prof.avatar || prof.profilePicture,
  });

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 pb-20 animate-fade-in-up">
      {/* Main Content (Left/Center) */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Page Header */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Academic Directory
          </h1>
          <p className=" text-gray-700 text-base max-w-2xl font-medium leading-relaxed">
            Find and connect with mentors, researchers, and faculty members driving the future of innovation.
          </p>
        </section>

        {/* Search & Filters */}
        <ProfessorSearch />

        {loading && sameUniversityTeachers.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-primary">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-bold">Loading Academic Directory...</p>
          </div>
        )}


        {/* Directory Grid */}
        <section id="faculty-directory" className="space-y-8 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Browse All Faculty</h2>
            <div className="flex gap-2 text-on-surface-variant text-sm font-medium">
              <span>Showing {currentTeachers.length} of {allTeachers.length} results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
            {currentTeachers.map((prof) => (
              <ProfessorCard key={prof._id} {...mapTeacherToDirectory(prof)} />
            ))}
          </div>

          {!loading && allTeachers.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-bold italic">No faculty members discovered yet.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-xl border-none bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all shadow-none disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className={`h-10 w-10 rounded-xl font-bold transition-all shadow-none border-none ${page === currentPage
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                    }`}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-xl border-none bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all shadow-none disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </section>
      </div>

    </div>
  );
}

