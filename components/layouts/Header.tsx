"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/utils/hook";
import { cn } from "@/lib/utils";
import { logoutUser } from '@/features/auth/authThunk';
import { ASSET_URL } from "@/services/apiEndpoints";
import { getFollowing, getPendingFollowRequests, getSentRequests, getFollowers, acceptFollowRequest, rejectFollowRequest } from "@/features/follow/followThunk";
import { emitAcceptFollowRequest, emitRejectFollowRequest, emitFollowUser } from "@/services/socket";
import { getMe } from "@/features/users/userThunk";
import {
  GraduationCap,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Settings,
  LogOut,
  User,
  BookOpen,
  LayoutDashboard,
  Users,
  Briefcase,
  Menu,
  X,
  Home,
  Calendar,
  Rss,
  School,
  UserRound,
  Bookmark,
  User2Icon,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Messages", icon: MessageSquare },
  { href: "/events", label: "Events", icon: Calendar },
];

const MOBILE_NAV_LINKS = [
  ...NAV_LINKS,
  { href: "/feeds", label: "My Feed", icon: Rss },
  { href: "/university", label: "Universities", icon: School },
  { href: "/professors", label: "Professors", icon: UserRound },
  { href: "/saved", label: "Saved Events", icon: Bookmark },
];

const NOTIFICATIONS = [
  { id: 1, text: "New assignment posted in Web Dev", time: "2m ago", unread: true },
  { id: 2, text: "Riya Singh commented on your post", time: "1h ago", unread: true },
  { id: 3, text: "Your profile was viewed 12 times", time: "3h ago", unread: false },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { me } = useAppSelector((state) => state.user);
  const { pendingRequests, followers, following } = useAppSelector((state) => state.follow);

  // Compute users who follow the current user, but the current user does not follow back
  const followingIds = new Set(following?.map((f: any) => f.following?._id));
  const acceptedButNotFollowedBack = followers?.filter((f: any) => f.follower && !followingIds.has(f.follower._id)) || [];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    // Wipe persisted Redux state so it cannot rehydrate old session on next load
    localStorage.removeItem("persist:root");
    toast.success("Logged out successfully");
    router.push("/?mode=login");
  };

  const closeAll = () => {
    setNotifOpen(false);
    setProfileOpen(false);
    setRequestsOpen(false);
  };

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getMe());
      dispatch(getFollowing());
      dispatch(getPendingFollowRequests());
      dispatch(getSentRequests());
      dispatch(getFollowers());
    }
  }, [authUser?._id, dispatch]);

  return (
    <>
      {/* Backdrop for dropdowns */}
      {(notifOpen || profileOpen || requestsOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeAll}
        />
      )}

      <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 lg:px-6">

          {/* ── Logo ── */}
          {!mobileSearchActive && (
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <div className="flex items-center overflow-visible">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="
          w-[140px]
          h-[140px]

          sm:w-[240px]
          sm:h-[240px]

          object-contain
        "
                />
              </div>
            </Link>
          )}

          {/* ── Desktop Nav ── */}
          {!mobileSearchActive && (
            <nav className="ml-4 hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-[0.82rem] font-semibold transition-all ${active
                      ? "bg-secondary/10 text-secondary"
                      : "text-primary hover:bg-secondary/10 "
                      }`}
                  >
                    <Icon size={15} />
                    {label}
                    {active && (
                      <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Search Bar (Responsive) ── */}
          <div className={cn(
            "items-center transition-all duration-300",
            mobileSearchActive ? "flex flex-1" : "hidden lg:flex",
            searchOpen ? "w-full lg:w-[400px]" : "w-full lg:w-[320px]"
          )}>
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                placeholder="Search anything…"
                className="h-9 w-full rounded-xl border border-gray-200 bg-secondary/5 pl-8 pr-10 text-[0.85rem] text-gray-800 placeholder:text-gray-400 focus:border-secondary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all"
              />
              {mobileSearchActive && (
                <button
                  onClick={() => setMobileSearchActive(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ── Icon Group ── */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Search (mobile) */}
            {!mobileSearchActive && (
              <button
                onClick={() => setMobileSearchActive(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 lg:hidden"
              >
                <Search size={17} />
              </button>
            )}

            {/* Follow Requests */}
            <div className="relative">
              <button
                onClick={() => { setRequestsOpen((v) => !v); setNotifOpen(false); setProfileOpen(false); }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100"
              >
                <Users size={17} />
                {((pendingRequests?.length || 0) + acceptedButNotFollowedBack.length) > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[0.55rem] font-bold text-white ring-2 ring-white">
                    {(pendingRequests?.length || 0) + acceptedButNotFollowedBack.length}
                  </span>
                )}
              </button>

              {/* Requests Dropdown */}
              {requestsOpen && (
                <div className="fixed inset-x-4 top-16 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-11 w-auto sm:w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <p className="text-[0.82rem] font-bold text-gray-900">Follow Requests</p>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                    {(pendingRequests?.length === 0 && acceptedButNotFollowedBack.length === 0) ? (
                      <div className="px-4 py-5 text-center text-sm text-gray-500 italic">No pending requests</div>
                    ) : (
                      <>
                        {pendingRequests?.map((req: any) => (
                          <div key={req._id} className="flex gap-3 px-4 py-3 transition hover:bg-gray-50 items-center">
                            <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {req.follower?.avatar ? (
                                <img src={req.follower.avatar} alt="avatar" className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-sm uppercase">{req.follower?.firstName?.[0]}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-[0.78rem] font-bold text-gray-800">{req.follower?.firstName} {req.follower?.lastName}</p>
                              <p className="mt-0.5 text-[0.67rem] text-gray-400">Wants to follow you</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  emitAcceptFollowRequest(req._id);
                                }}
                                className="h-7 px-3 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  emitRejectFollowRequest(req._id);
                                }}
                                className="h-7 px-3 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                        {acceptedButNotFollowedBack.map((req: any) => (
                          <div key={req._id} className="flex gap-3 px-4 py-3 transition hover:bg-gray-50 items-center bg-indigo-50/30">
                            <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-100 bg-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold">
                              {req.follower?.avatar ? (
                                <img src={req.follower.avatar} alt="avatar" className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-sm uppercase">{req.follower?.firstName?.[0]}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-[0.78rem] font-bold text-gray-800">{req.follower?.firstName} {req.follower?.lastName}</p>
                              <p className="mt-0.5 text-[0.67rem] text-indigo-600 font-semibold">Started following you</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  emitFollowUser(req.follower._id);
                                  toast.success(`You started following ${req.follower.firstName}`);
                                }}
                                className="h-7 px-3 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition"
                              >
                                Follow back
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications (Removed as per user request to save space) */}

            {/* Profile Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); setRequestsOpen(false); }}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-2.5 py-1.5 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                {me?.avatar || authUser?.avatar ? (
                  <img src={me?.avatar || authUser?.avatar} className="h-7 w-7 rounded-lg object-cover" alt="Profile" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/60 to-primary/30 text-[0.7rem] font-bold text-white uppercase">
                    {me?.firstName?.[0] || authUser?.firstName?.[0] || "?"}
                  </div>
                )}
                <span className="hidden text-[0.78rem] font-semibold text-gray-800 sm:block">
                  {authUser?.firstName || "User"}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="fixed inset-x-4 top-16 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-11 w-auto sm:w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                  {/* User info */}
                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      {me?.avatar || authUser?.avatar ? (
                        <img src={me?.avatar || authUser?.avatar} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl object-cover" alt="Profile" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/60 to-primary/30 text-lg font-bold text-white uppercase">
                          {me?.firstName?.[0] || authUser?.firstName?.[0] || "?"}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-[0.82rem] font-bold text-gray-900 truncate">{me?.firstName || authUser?.firstName} {me?.lastName || authUser?.lastName}</p>
                        <p className="text-[0.68rem] text-gray-400 truncate capitalize">{me?.roleId?.name?.toLowerCase() || authUser?.roleId?.name?.toLowerCase() || "Student"} • {me?.universityId?.name || authUser?.universityId?.name || "University"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1.5">
                    {[
                      { icon: User, label: "My Profile", href: "/profile" },
                      { icon: Settings, label: "Settings", href: "/settings" },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[0.8rem] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Icon size={15} className="text-gray-400" />
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[0.8rem] font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            {!mobileSearchActive && (
              <button
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 lg:hidden"
                onClick={() => {
                  if (onMenuClick) {
                    onMenuClick();
                  } else {
                    setMobileOpen((v) => !v);
                  }
                }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Nav Drawer ── */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white/95 px-4 pb-4 pt-2 lg:hidden">
            <nav className="flex flex-col gap-1">
              {MOBILE_NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[0.85rem] font-semibold transition ${active
                      ? "bg-secondary/10 text-primary"
                      : "text-gray-600 hover:bg-secondary/5 hover:text-primary"
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            {/* Mobile Search */}
            <div className="relative mt-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything…"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-[0.82rem] placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/15"
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}