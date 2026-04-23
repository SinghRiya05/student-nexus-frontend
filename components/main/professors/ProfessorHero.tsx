import { ITeacher } from "@/features/teacher/teacherModel";
import { ASSET_URL } from "@/services/apiEndpoints";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Send
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface ProfessorHeroProps {
  member: ITeacher | null;
}

export default function ProfessorHero({
  member
}: ProfessorHeroProps) {
  const name = member ? `${member.firstName} ${member.lastName}` : "Professor";
  const designation = member?.teacherProfile?.designation || "Faculty";
  const department = member?.teacherProfile?.department || "Academic Dept";
  const university = member?.universityId?.name || "Nexus University";
  const course = member?.courseIds?.[0]?.courseName || "Academic Program";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
      {/* Cover Photo */}
      <div className="h-24 md:h-36 relative overflow-hidden bg-slate-50 border-b border-gray-100">
        {member?.coverImage ? (
          <img
            src={member.coverImage.startsWith('http') ? member.coverImage : `${ASSET_URL}${member.coverImage}`}
            className="w-full h-full object-cover"
            alt="Cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary/10" />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Profile Info Section */}
      <div className="px-6 md:px-8 py-6 relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-20">
          {/* Avatar */}
          <div className="relative group shrink-0 -mt-20 md:-mt-24">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-[6px] border-white overflow-hidden bg-white ring-2 ring-primary/50 flex items-center justify-center font-black text-3xl  text-primary">
              {member?.avatar ? (
                <img
                  src={member.avatar.startsWith('http')
                    ? member.avatar
                    : `${ASSET_URL}${member.avatar}`}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <span className="uppercase">{member?.firstName?.[0] || 'P'}</span>
              )}
            </div>
          </div>

          {/* Text Info + Action Buttons */}
          <div className="flex-1 flex flex-col lg:flex-row items-center md:items-start lg:items-center justify-between gap-6 w-full pt-2">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-[#1a1a3b] leading-tight tracking-tight">
                  {name}
                </h2>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Verified Academic
                </span>
              </div>

              <div className="flex text-left flex-wrap justify-start md:justify-start items-center gap-4 text-gray-500 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="truncate max-w-[200px]">{university.toUpperCase()}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>{designation} • {department}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>{course}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-sm flex gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Connect
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

