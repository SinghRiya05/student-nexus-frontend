import { ITeacher } from "@/features/teacher/teacherModel";
import { ASSET_URL } from "@/services/apiEndpoints";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Send,
  AlertCircle,
  Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { accessChat } from "@/features/chat/chatThunk";
import { setSelectedChatId } from "@/features/chat/chatSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { emitFollowUser, emitUnfollowUser } from "@/services/socket";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface ProfessorHeroProps {
  member: ITeacher | null;
}

export default function ProfessorHero({
  member
}: ProfessorHeroProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [isUnfollowDialogOpen, setIsUnfollowDialogOpen] = useState(false);
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  const { following, sentRequests, loading: followLoading } = useAppSelector(state => state.follow);
  const { user: authUser } = useAppSelector(state => state.auth);

  const id = member?._id;
  const isFollowingObj = following.find((f: any) =>
    (typeof f.following === 'string' ? f.following === id : f.following?._id === id)
  );
  const isFollowing = !!isFollowingObj;

  const isRequestedObj = sentRequests.find((r: any) =>
    (typeof r.following === 'string' ? r.following === id : r.following?._id === id)
  );
  const isRequested = !!isRequestedObj;

  const handleFollowAction = async () => {
    const userId = String(id);
    if (!userId || userId === "undefined") return;
    if (isFollowing) {
      setIsUnfollowDialogOpen(true);
    } else if (!isRequested) {
      emitFollowUser(userId);
    }
  };

  const handleUnfollow = async () => {
    if (!id) return;
    setIsUnfollowing(true);
    try {
      emitUnfollowUser(id);
      setIsUnfollowDialogOpen(false);
    } catch (error) {
      console.error("Failed to unfollow:", error);
    } finally {
      setIsUnfollowing(false);
    }
  };

  const handleMessageAction = async () => {
    if (!id) return;
    try {
      const result = await dispatch(accessChat({ userId: String(id) })).unwrap();
      if (result.data?._id) {
        dispatch(setSelectedChatId(result.data._id));
        router.push("/chat");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to start conversation");
    }
  };

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
            src={member.coverImage}
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
                  src={member.avatar}
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
              {authUser?._id !== String(id) && id && (
                <>
                  {isFollowing && (
                    <Button
                      variant="outline"
                      onClick={handleMessageAction}
                      className="h-12 px-6 rounded-2xl border-2 border-primary/20 font-black text-sm text-primary hover:bg-primary/5 flex gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Message
                    </Button>
                  )}
                  <Button
                    onClick={handleFollowAction}
                    disabled={(isRequested && !isFollowing) || followLoading || isUnfollowing}
                    className={cn(
                      "h-12 px-8 rounded-2xl font-black text-sm flex gap-2 shadow-lg transition-all hover:scale-105 active:scale-95",
                      isFollowing
                        ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white"
                        : isRequested
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                          : "bg-primary text-white shadow-primary/20 hover:bg-primary/80"
                    )}
                  >
                    {isFollowing ? (
                      <><AlertCircle className="w-4 h-4" /> Unfollow</>
                    ) : isRequested ? (
                      "Requested"
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Connect</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Unfollow Confirmation Dialog */}
      <Dialog open={isUnfollowDialogOpen} onOpenChange={setIsUnfollowDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-slate-900">
              Unfollow {member?.firstName}?
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 font-bold leading-relaxed">
              Are you sure you want to stop following this professor? You'll miss their updates and shared resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsUnfollowDialogOpen(false)}
              className="flex-1 rounded-2xl h-12 font-black border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnfollow}
              disabled={isUnfollowing}
              variant="destructive"
              className="flex-1 rounded-2xl h-12 font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              {isUnfollowing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Unfollow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
